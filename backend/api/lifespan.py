import asyncio
from contextlib import asynccontextmanager
from backend.api.utils.log import get_api_logger
from backend.shared.utils import setup_graceful_exit
from fastapi import FastAPI
from backend.api.models.task import Base
from backend.api.services.database import engine_async
from backend.shared.services.redis import RedisManager
from backend.api.listeners.task_results import listen_to_results

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine_async.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with RedisManager("api") as broker:
        app.state.broker = broker
        
        logger = get_api_logger("api")
        bg_task = asyncio.create_task(listen_to_results(broker, logger))
        
        yield
        
        logger.info("👋 api остановлен.")
        bg_task.cancel()
        await asyncio.gather(bg_task, return_exceptions=True)
