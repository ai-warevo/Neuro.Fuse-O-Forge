### State Machine
Define task statuses (PENDING -> PROCESSING -> SUCCESS/ERROR) and which service is responsible for updating each status in SQLite.

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