from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from backend.api.models.task import Task, get_task_by_id
from backend.shared.constants import TaskStatus
from backend.api.schemas.tasks import TaskCreate
from backend.api.services.database import get_db

router = APIRouter()

@router.post("/")
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    # Create task in the database
    new_task = Task(**task.dict(), status=TaskStatus.PENDING.value)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    
    # Publish task to Redis stream
    import redis
    redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)
    redis_client.xadd(f"forge:tasks:{new_task.type}", {
        "task_id": new_task.id,
        "prompt": new_task.prompt,
        "params": new_task.params or {}
    })
    
    return new_task

@router.get("/{task_id}")
async def get_task(task_id: str, db: Session = Depends(get_db)):
    task = get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task