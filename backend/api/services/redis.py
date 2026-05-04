import redis
from backend.shared.config import settings

# Initialize Redis client
redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

def push_task_to_stream(task_id: str, task_type: str, prompt: str, params: dict):
    redis_client.xadd(f"forge:tasks:{task_type}", {
        "task_id": task_id,
        "prompt": prompt,
        "params": params
    })

def publish_result_to_stream(task_id: str, status: str, output_path: str | None = None, error_message: str | None = None):
    redis_client.xadd("forge:results", {
        "task_id": task_id,
        "status": status,
        "output_path": output_path,
        "error_message": error_message
    })