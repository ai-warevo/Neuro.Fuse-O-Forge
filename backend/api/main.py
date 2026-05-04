import asyncio
import logging
from backend.api.models.task import Task
from backend.shared.constants import TaskStatus
import redis.asyncio as redis
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from backend.api.routes.tasks import router as tasks_router
from backend.api.routes.ws import router as ws_router
from backend.api.services.database import engine_sync, get_db, SessionLocal
from backend.api.services.websocket_manager import websocket_manager
from backend.shared.config import settings

app = FastAPI(
    title="Neuro.Fuse-O-Forge API",
    version="0.1.0",
    description="An event-driven API for managing tasks in the Neuro.Fuse-O-Forge project."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)

engine_sync.connect()
SessionLocal()

redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

class ResultMessage(BaseModel):
    task_id: str
    status: str
    result_url: str = None

async def listen_to_results():
    while True:
        response = await redis_client.xreadgroup(
            groupname='forge-group',
            consumername='forge-consumer',
            streams={'forge:results': '>'},
            block=5000
        )
        
        if response:
            for _, messages in response:
                for _, fields in messages:
                    task_id = fields.get('task_id')
                    status = fields.get('status')
                    result_url = fields.get('result_url')

                    async with get_db() as db:
                        query = select(Task).where(Task.task_id == task_id)
                        result = await db.execute(query)
                        task = result.scalars().first()
                        
                        if task:
                            task.status = TaskStatus.SUCCESS if status == 'SUCCESS' else TaskStatus.ERROR
                            task.result_url = result_url
                            await db.commit()

                    message = ResultMessage(task_id=task_id, status=status, result_url=result_url).json()
                    await websocket_manager.broadcast(task_id, message)
                    await redis_client.xack('forge:results', 'forge-group', fields['message_id'])


@app.on_event("startup")
async def startup():
    asyncio.create_task(listen_to_results())

app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
app.include_router(ws_router)