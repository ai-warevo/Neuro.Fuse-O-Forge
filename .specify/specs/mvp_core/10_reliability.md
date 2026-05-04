# Reliability Layer

## Event-Driven Flow
The Neuro.Fuse-O-Forge project now uses an event-driven architecture with Redis Streams for reliable messaging.

### Retry Logic
- **Retry Delay**: 500ms
- **Max Retries**: 3
- **Behavior**:
  - Wait 500ms between retries.
  - If the `task_id` remains unknown after 3 retries, log a warning and perform an `XACK` to clear the message.

### Timeout Watchdog
- Any task remaining in the `PROCESSING` state longer than its `max_gen_time` must be automatically marked as **ERROR (TIMEOUT)**.

### API (Task Submission)
1. **Functionality**: Receives tasks via HTTP requests.
2. **Process**:
   - Validates incoming task data using Pydantic schemas.
   - Creates a new record in the SQLite database with status `PENDING`.
   - Pushes the task to the Redis Stream `forge:tasks:{type}`.

### Worker (Task Processing)
1. **Functionality**: Consumes tasks from Redis Streams, processes them, and pushes results back to another Redis Stream.
2. **Process**:
   - Connects to Redis Stream `forge:tasks:{type}`.
   - Reads messages from the stream using a consumer group for reliable message processing.
   - Checks if the task has already been processed by verifying the existence of the output file in `/app/output/{task_type}/{date}/{task_id}.ext`.
   - If the file exists, the worker acknowledges the message and skips further processing.
   - Based on the task type (e.g., `SOUND`), the worker uses the appropriate pipeline to generate the desired output.
   - After processing the task successfully, the worker pushes a completion message to Redis Stream `forge:results`.
   - The message includes details such as `task_id`, `status`, `file_path`, and any additional metadata.

### API (Result Processing)
1. **Functionality**: Listens to the `forge:results` stream for task completion notifications.
2. **Process**:
   - Connects to Redis Stream `forge:results`.
   - Reads messages from the stream using a consumer group (`api_result_group`) for reliable message processing.
   - If a `task_id` is not found in the SQLite DB after retries, logs a warning and clears the message.
   - Reads messages from the stream and updates the SQLite record to `SUCCESS`.
   - Notifies the frontend via WebSocket of the task status update.

### Message Structure in `forge:results`
- **`task_id`**: Unique identifier for the task.
- **`status`**: Status of the task (e.g., `SUCCESS`, `ERROR`).
- **`file_path`**: Path to the generated output file.
- **`metadata`**: Additional information about the task (e.g., duration, size).

### Idempotency
The worker checks for the existence of the output file before starting generation to ensure that duplicate tasks are not processed multiple times.

```python
def is_task_successfully_completed(task_id):
    output_dir = f"/app/output/SOUND/{datetime.datetime.now().strftime('%Y-%m-%d')}"
    file_path = f"{output_dir}/{task_id}.wav"
    return os.path.exists(file_path)
```

### State Machine
The API is responsible for the final status update based on the message from the `results` stream. The state machine ensures that tasks transition correctly between states (`PENDING`, `PROCESSING`, `SUCCESS`, `ERROR`).

```python
def update_task_status(task_id, status):
    db = SessionLocal()
    task = db.query(Task).filter_by(task_id=task_id).first()
    if task:
        task.status = status
        db.commit()
```

### Summary
The Event-Driven flow using Redis Streams simplifies the communication architecture by removing complex transactional logic and focusing on direct messaging between components. This ensures reliable task processing and robust system behavior.