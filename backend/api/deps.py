from fastapi import Request
from backend.shared.services.redis import RedisManager

def get_broker(request: Request) -> RedisManager:
    """Достает уже созданный в lifespan брокер Redis."""
    return request.app.state.broker
