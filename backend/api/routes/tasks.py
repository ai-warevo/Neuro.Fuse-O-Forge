import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.api.deps import get_broker
from backend.api.models.task import Task, get_task_by_id
from backend.api.schemas.tasks import TaskCreate
from backend.api.services.database import get_async_session
from backend.shared.services.redis import RedisManager

router = APIRouter()

@router.post("/")
async def create_task(task: TaskCreate, redis: RedisManager = Depends(get_broker), db: AsyncSession = Depends(get_async_session)):
    new_task = Task(
        type=task.type,
        prompt=task.prompt,
        params=task.params
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    
    params = json.dumps(new_task.params or {})
    await redis.push_task_to_stream(new_task.id, task.type, task.prompt, params)
    
    return new_task

@router.get("/{task_id}")
async def get_task(task_id: str, db: AsyncSession = Depends(get_async_session)):
    task = await get_task_by_id(db, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task