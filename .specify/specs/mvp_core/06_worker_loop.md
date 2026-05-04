## Worker Consumer Loop (task consumption)
The worker services consume tasks from Redis Streams `forge:tasks:{type}` and process them accordingly.

1. **Task Consumption**:
   - Connects to Redis Stream `forge:tasks:{type}`.
   - Reads messages from the stream using a consumer group for reliable message processing.

2. **Idempotency Check**:
   - Checks if the task has already been processed by verifying the existence of the output file in `/app/output/{task_type}/{date}/{task_id}.ext`.
   - If the file exists, the worker acknowledges the message and skips further processing.

3. **Task Processing**:
   - Based on the task type (e.g., `SOUND`), the worker uses the appropriate pipeline to generate the desired output.
   - For example, for a `SOUND` task, it generates audio using Audiocraft with parameters from the task payload.

4. **Push Completion Message**:
   - After processing the task successfully, the worker pushes a completion message to Redis Stream `forge:results`.
   - The message includes details such as `task_id`, `status`, `file_path`, and any additional metadata.

```python
import redis
import json

redis_client = Redis(host='redis', port=6379, db=0)
STREAM_KEY = "forge:tasks:{type}"
RESULT_STREAM_KEY = "forge:results"

def consume_task(task_type):
    stream_key = STREAM_KEY.format(type=task_type)
    while True:
        try:
            response = redis_client.xread({stream_key: '>'}, block=10000)
            for _, messages in response:
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
                    process_task(task, message_id)
        except Exception as e:
            print(f"Error processing message: {e}")

def process_task(task, message_id):
    try:
        if is_task_successfully_completed(task.task_id):
            redis_client.xack(STREAM_KEY.format(type=task.type), 'forge-customer-group', message_id)
            return

        update_task_status(task.task_id, TaskStatus.PROCESSING)
        # Processing logic here
        generate_audio(task.prompt, task.params['duration'])

        if is_task_successfully_completed(task.task_id):
            update_task_status(task.task_id, TaskStatus.SUCCESS)
            push_completion_message(task)
        else:
            update_task_status(task.task_id, TaskStatus.ERROR)

    except Exception as e:
        print(f"Error processing task {task.task_id}: {e}")
        update_task_status(task.task_id, TaskStatus.ERROR)

def push_completion_message(task):
    redis_client.xadd(RESULT_STREAM_KEY, {
        "task_id": task.task_id,
        "status": TaskStatus.SUCCESS.value,
        "file_path": get_output_path(task.task_id, task.type),
        "metadata": json.dumps({"duration": task.params['duration']})
    })
```