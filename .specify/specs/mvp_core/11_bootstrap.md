# Bootstrap Responsibility

Ensure that the system is bootstrapped correctly, including setting up Redis consumer groups and initializing necessary databases.

## Bootstrap Steps

1. **Create Redis Consumer Group** — if it doesn’t exist, create the group for task consumption.
2. **Initialize SQLite Database** — create all necessary tables for task tracking.
3. **Verify Dependencies** — check Redis and DB connectivity before starting the worker loop.

## System Initialization
1. **Redis Configuration**:
   - Creates the necessary Redis streams (`forge:tasks:{type}` and `forge:results`).
   - Sets up consumer groups for reliable task consumption.
     - `forge-customer-group` for `forge:tasks:{type}`
     - `api_result_group` for `forge:results`

2. **Database Setup**:
   - Initializes the SQLite database with the necessary tables and schema.
   - Creates initial records with status `PENDING`.

3. **Worker Services**:
   - Connects to Redis Streams and starts consuming tasks from `forge:tasks:{type}`.
   - Acknowledges messages once processing is complete.

4. **API Service**:
   - Listens to the `forge:results` stream for task completion notifications using consumer group (`api_result_group`).
   - Updates the SQLite database with final status updates (`SUCCESS`, `ERROR (TIMEOUT)`).
   - Notifies the frontend via WebSocket of the task status update.

## Example Implementation

```python
def bootstrap_system():
    redis_client = Redis(host='redis', port=6379, db=0)
    GROUP_NAME = "forge-customer-group"
    STREAM_KEY = "forge:tasks:SOUND"

    # Create Redis consumer group if it doesn't exist
    try:
        redis_client.xgroup_create(STREAM_KEY, GROUP_NAME, mkstream=True)
    except Exception as e:
        print(f"Error creating consumer group: {e}")

    # Initialize SQLite database
    engine = create_engine('sqlite+aiosqlite:////app/db/history.db')
    Base.metadata.create_all(engine)

if __name__ == "__main__":
    bootstrap_system()
    consume_task()
