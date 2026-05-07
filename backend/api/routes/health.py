from fastapi import APIRouter, Depends, Response, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from backend.api.services.database import get_async_session
from backend.shared.services.redis import RedisManager
from backend.api.deps import get_broker

router = APIRouter()

@router.get("/health")
async def health_check(
    response: Response,
    db: AsyncSession = Depends(get_async_session),
    redis: RedisManager = Depends(get_broker)
):
    health_status = {
        "status": "healthy",
        "services": {
            "database": "unhealthy",
            "redis": "unhealthy"
        }
    }
    
    try:
        await db.execute(text("SELECT 1"))
        health_status["services"]["database"] = "healthy"
    except Exception as e:
        print(f"DB Health Error: {e}")

    try:
        await redis.client.ping()
        health_status["services"]["redis"] = "healthy"
    except Exception as e:
        print(f"Redis Health Error: {e}")

    if any(s == "unhealthy" for s in health_status["services"].values()):
        health_status["status"] = "unhealthy"
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return health_status
