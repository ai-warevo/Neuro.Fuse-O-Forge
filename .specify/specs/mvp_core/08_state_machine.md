# State Machine

## Task States
- **PENDING**: Task has been submitted but not yet processed.
- **PROCESSING**: Task is currently being generated.
- **SUCCESS**: Task has been successfully generated.
- **ERROR (TIMEOUT)**: Task exceeded its maximum generation time.
- **ERROR (UNKNOWN ID)**: Result message received with an unknown `task_id`.

## Transition Logic

1. When a task is submitted, it transitions from **PENDING** to **PROCESSING**.
2. Upon successful completion, the Worker sends a result message to `forge:results`, transitioning the task to **SUCCESS**.
3. If a task remains in **PROCESSING** longer than its `max_gen_time`, it transitions to **ERROR (TIMEOUT)**.
4. If the API receives a result message with an unknown `task_id`, it waits 500ms and retries before declaring it a **Ghost Task**.

## Timeout Watchdog

- Any task in **PROCESSING** state for longer than its `max_gen_time` is automatically marked as **ERROR (TIMEOUT)**.

## API code snippet

```python
from sqlalchemy import create_engine, Column, String, Integer, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import enum

Base = declarative_base()

class TaskStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    task_id = Column(String, unique=True, nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)

engine = create_engine('sqlite+aiosqlite:////app/db/history.db')
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def update_task_status(task_id, new_status):
    db = SessionLocal()
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if task:
        task.status = new_status
        db.commit()
        db.refresh(task)
    else:
        raise ValueError("Task not found")

# Example usage in worker.py
def process_task(task):
    try:
        update_task_status(task.task_id, TaskStatus.PROCESSING)
        # Processing logic here
        update_task_status(task.task_id, TaskStatus.SUCCESS)
    except Exception as e:
        print(f"Error processing task {task.task_id}: {e}")
        update_task_status(task.task_id, TaskStatus.ERROR)
```