from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from backend.api.models.task import Base
from backend.shared.config import settings

# Async Engine for FastAPI
DATABASE_URL_ASYNC = f"sqlite+aiosqlite:///{settings.DATABASE_URL.replace('///', '/')}"
engine_async: AsyncEngine = create_async_engine(DATABASE_URL_ASYNC, echo=True)

async def get_async_session() -> AsyncSession:
    async with AsyncSession(engine_async) as session:
        yield session

# Sync Engine for Workers
DATABASE_URL_SYNC = settings.DATABASE_URL
engine_sync = create_engine(DATABASE_URL_SYNC, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_sync)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()