import asyncio
from fastapi import FastAPI
from contextlib import asynccontextmanager
from backend.api.listeners.task_results import ResultListener
from backend.api.models.task import Base
from backend.api.services.database import engine_async
from backend.api.utils.log import get_api_logger
from backend.shared.services.redis import RedisManager

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine_async.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with RedisManager("api") as broker:
        app.state.broker = broker
        
        logger = get_api_logger("api")
        listener = ResultListener(broker, logger)
        bg_task = asyncio.create_task(listener.start())
        
        yield
        
        logger.info("🛑 Завершение работы: остановка фоновых задач...")
        bg_task.cancel()
        
        try:
            await asyncio.wait_for(bg_task, timeout=5.0)
        except (asyncio.CancelledError, asyncio.TimeoutError):
            logger.debug("⏳ Фоновая задача listen_to_results остановлена.")
        
        logger.info("👋 API полностью остановлен.")
        await asyncio.gather(bg_task, return_exceptions=True)
