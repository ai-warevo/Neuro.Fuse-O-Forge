from contextlib import asynccontextmanager
import redis.asyncio as redis
from backend.shared.constants import ForgeType, TaskStatus
from backend.shared.config import settings
from backend.shared.log import get_logger

class RedisManager:
    def __init__(self, consumer_name: str):
        self.logger = get_logger(self.__class__.__name__)
        self.consumer_name = consumer_name
        self.client = redis.Redis(
            host=settings.REDIS_HOST, 
            port=settings.REDIS_PORT,
            decode_responses=True
        )

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        self.logger.info("Closing Redis connection...")
        await self.client.aclose()

    async def acknowledge(self, stream_name: str, group_name: str, message_id: str):
        """Подтверждение выполнения."""
        return await self.client.xack(stream_name, group_name, message_id)
    
    async def heartbeat(self):
        """Отметка о том, что слушатель жив."""
        key = f"forge:health:{self.consumer_name}"
        await self.client.set(key, "online", ex=30)
    
    async def fetch_tasks(self, stream_name: str, group_name: str, count=1, block=5000):
        """Получение задач из стрима."""
        return await self.client.xreadgroup(
            groupname=group_name,
            consumername=self.consumer_name,
            streams={stream_name: ">"},
            count=count,
            block=block
        )
    
    async def xadd(self, stream_name: str, params: dict):
        try:
            print(stream_name, params)
            msg_id = await self.client.xadd(stream_name, params)
            self.logger.info(f"MsgID: {msg_id} pushed to {stream_name}.")
        except Exception as e:
            self.logger.error(f"Failed to push to {stream_name}: {e}")
            raise

    async def push_task_to_stream(self, task_id: str, task_type: str, prompt: str, params: str):
        """Adds a new generation task to the specific stream."""
        return await self.xadd(
            f"forge:tasks:{task_type}", 
            {"task_id": task_id, "task_type": task_type, "prompt": prompt, "params": params}
        )

    async def publish_result_to_stream(self, task_id: str, task_type: ForgeType, status: TaskStatus, output_path: str = "", error_message: str = ""):
        """Publishes task completion or failure results."""
        return await self.xadd(
            f"forge:results:{task_type}", 
            {
                "task_id": task_id,
                "task_type": str(task_type),
                "status": str(status),
                "output_path": output_path or "",
                "error_message": error_message or ""
            }
        )

    async def _consumer_group_exists(self, stream_name: str, group_name: str) -> bool:
        """Checks if a consumer group already exists for a stream."""
        try:
            groups = await self.client.xinfo_groups(stream_name)
            return any(g['name'] == group_name for g in groups)
        except redis.ResponseError as e:
            self.logger.warning(f"Error checking groups for {stream_name}: {e}")
            return False

    async def create_stream_and_group(self, stream_name: str, group_name: str):
        """Initializes stream and group if they don't exist."""
        if not await self._consumer_group_exists(stream_name, group_name):
            await self.client.xgroup_create(
                stream_name, 
                group_name, 
                id="0", 
                mkstream=True
            )
            self.logger.info(f"Created group '{group_name}' on stream '{stream_name}'")
        else:
            self.logger.info(f"Consumer group {group_name} on {stream_name} already exists.")
