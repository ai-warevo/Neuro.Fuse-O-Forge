## Key Components List

### API Service
1. **Functionality**: Receives tasks via HTTP requests.
2. **Process**:
   - Validates incoming task data using Pydantic schemas.
   - Creates a new record in the SQLite database with status `PENDING`.
   - Pushes the task to the Redis Stream `forge:tasks:{type}`.

### Worker Services
1. **Functionality**: Consumes tasks from Redis Streams, processes them, and pushes results back to another Redis Stream.
2. **Process**:
   - Listens to Redis Stream `forge:tasks:{type}`.
   - Processes the task (e.g., generating audio for "SOUND" tasks).
   - Pushes a completion message to Redis Stream `forge:results` with details such as `task_id`, `status`, `file_path`, and `metadata`.

### Database
1. **Functionality**: Manages task statuses.
2. **Process**:
   - Stores initial records with status `PENDING`.
   - Updates records based on messages from the `forge:results` stream.

### Redis Streams
1. **Functionality**: Acts as a message queue for tasks and results.
2. **Streams**:
   - `forge:tasks:{type}`: For task submission.
   - `forge:results`: For task completion notifications.

### Frontend (WebSocket)
1. **Functionality**: Notifies users of task status updates via WebSocket.
2. **Process**:
   - Listens to the API for status updates.
   - Displays the current status and any generated outputs to the user.