import asyncio
import logging
import redis.asyncio as redis
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
from backend.api.models.task import Base, get_task_by_id
from backend.api.routes.tasks import router as tasks_router
from backend.api.routes.ws import router as ws_router
from backend.api.services.websocket_manager import websocket_manager
from backend.api.services.database import engine_async, get_async_session
from backend.shared.services.redis import redis_client
from backend.shared.constants import TaskStatus

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

async def consumer_group_exists(stream, group):
    try:
        await redis_client.xinfo_groups(stream)
        return True
    except redis.ResponseError:
        return False

async def create_stream_and_group():
    stream = 'forge:results'
    group = 'forge-group'

    if not await consumer_group_exists(stream, group):
        await redis_client.xgroup_create(
            stream,
            group,
            mkstream=True
        )
    else:
        logging.info(f"Consumer group {group} already exists.")

class ResultMessage(BaseModel):
    task_id: str
    status: str
    output_path: str = None
    error_message: str = None

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
                    status = TaskStatus(fields.get('status'))
                    output_path = fields.get('output_path')
                    error_message = fields.get('error_message')

                    async with get_async_session() as db:
                        task = get_task_by_id(db, task_id)
                        
                        if task:
                            task.status = status
                            task.output_path = output_path
                            task.error_message = error_message
                            await db.commit()

                    message = ResultMessage(
                        task_id=task_id,
                        status=status,
                        output_path=output_path,
                        error_message=error_message).json()
                    await websocket_manager.broadcast(task_id, message)
                    await redis_client.xack('forge:results', 'forge-group', fields['message_id'])


@app.on_event("startup")
async def startup():
    async with engine_async.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    await create_stream_and_group()
    asyncio.create_task(listen_to_results())

app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
app.include_router(ws_router)