from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, AsyncSession, async_sessionmaker
from backend.shared.config import settings

# Async Engine for FastAPI
DATABASE_URL_ASYNC = settings.DATABASE_URL
print(DATABASE_URL_ASYNC)
engine_async: AsyncEngine = create_async_engine(
    DATABASE_URL_ASYNC,
    echo=True,
    connect_args={"check_same_thread": False}
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine_async,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_async_session() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session
