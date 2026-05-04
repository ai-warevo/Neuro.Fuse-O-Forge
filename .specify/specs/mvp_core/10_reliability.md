# Reliability Layer

## 1. Transactional Outbox (API)
Use a "Database-First" atomic approach.

```python
from sqlalchemy.exc import SQLAlchemyError
import redis

def create_task(task_payload):
    try:
        # Start DB transaction
        db = SessionLocal()
        task = Task(
            task_id=task_payload.task_id,
            status=TaskStatus.PENDING
        )
        db.add(task)
        db.commit()
        db.refresh(task)

        # Emit to Redis Stream
        redis_client.xadd("forge:tasks:SOUND", {
            "task_id": task_payload.task_id,
            "type": task_payload.type,
            "model_alias": task_payload.model_alias,
            "prompt": task_payload.prompt,
            "params": json.dumps(task_payload.params),
            "created_at": task_payload.created_at
        })

    except (SQLAlchemyError, redis.RedisError) as e:
        # Rollback DB transaction if Redis fails
        db.rollback()
        print(f"Error creating task: {e}")
```

**Database‑First atomic approach:**

1. Start DB transaction.
2. Create Task record (status: PENDING).
3. Emit to Redis Stream.
4. Commit DB.
5. If Redis fails → roll back DB transaction.

## 2. Transactional Inbox (Worker)
Leverage Redis Streams **PEL (Pending Entries List)**.

```python
import time
from redis import Redis
from backend.api.schemas import TaskPayload, SoundParams
import json

redis_client = Redis(host='redis', port=6379, db=0)
GROUP_NAME = "forge-customer-group"
STREAM_KEY = "forge:tasks:SOUND"

def consume_task():
    while True:
        try:
            # Check for pending entries first
            response = redis_client.xreadgroup(GROUP_NAME, GROUP_NAME, {STREAM_KEY: '0-0'}, count=1)
            if not response:
                # No pending entries, read from '>' stream
                response = redis_client.xreadgroup(GROUP_NAME, GROUP_NAME, {STREAM_KEY: '>'}, block=10000)

            for stream_name, messages in response:
                for message_id, message_data in messages:
                    task_data = {
                        "task_id": message_data[b'task_id'].decode(),
                        "type": message_data[b"type"].decode(),
                        "model_alias": message_data[b"model_alias"].decode(),
                        "prompt": message_data[b"prompt"].decode(),
                        "params": json.loads(message_data[b"params"]),
                        "created_at": float(message_data[b"created_at"])
                    }
                    task = TaskPayload(**task_data)
                    process_task(task)
                    redis_client.xack(STREAM_KEY, GROUP_NAME, message_id)
        except Exception as e:
            print(f"Error processing message: {e}")

def process_task(task):
    # Placeholder for Audiocraft task processing logic
    if task.type == "SOUND":
        sound_params = SoundParams(**task.params)
        generate_audio(task.prompt, sound_params.duration)
    else:
        print("Unsupported task type")
```

**Using Redis Streams PEL (Pending Entries List):**

1. Read with `XREADGROUP` (claim task).
2. Process task.
3. `XACK` to confirm completion.

**Recovery on startup:**
* Worker checks for pending tasks in its PEL.
* Processes/acks them before taking new tasks from the `>` stream.

## 3. Idempotency Logic (Update)
Refine the check to ensure idempotency.
Ensure that the system can handle duplicate tasks without causing unintended side effects. This can be achieved by checking if a task with the same `task_id` already exists before processing it.

```python
def is_task_successfully_completed(task_id):
    output_dir = f"/app/output/SOUND/{datetime.datetime.now().strftime('%Y-%m-%d')}"
    file_path = f"{output_dir}/{task_id}.wav"
    return os.path.exists(file_path)

def process_task(task):
    try:
        if is_task_exists(task.task_id):
            print(f"Task {task.task_id} already exists, skipping.")
            return

        update_task_status(task.task_id, TaskStatus.PROCESSING)
        # Processing logic here
        generate_audio(task.prompt, task.params['duration'])

        if is_task_successfully_completed(task.task_id):
            update_task_status(task.task_id, TaskStatus.SUCCESS)
        else:
            update_task_status(task.task_id, TaskStatus.ERROR)

    except Exception as e:
        print(f"Error processing task {task.task_id}: {e}")
        update_task_status(task.task_id, TaskStatus.ERROR)
```

**Enhanced check:**
* Instead of just checking the DB, the worker checks for the physical file in `/app/output/...`.
* If file exists → 100 % SUCCESS, just `XACK` and update DB.
* Prevents duplicate processing and ensures consistency.
