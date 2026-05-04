import redis
from backend.shared.config import settings
from backend.api.services.database import SessionLocal, get_db
from backend.api.models.task import Task, get_task_by_id
from backend.shared.constants import TaskStatus, ForgeType
from backend.worker.pipelines.audio import generate_audio
from backend.worker.pipelines.image import generate_image
from backend.worker.pipelines.text import generate_text

# Initialize Redis client
redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

def process_task(task_id: str, task_type: str, prompt: str, params: dict):
    # Load appropriate pipeline based on task type
    if task_type == ForgeType.SOUND.value:
        output_path = generate_audio(prompt, params)
    elif task_type == ForgeType.IMAGE.value:
        output_path = generate_image(prompt, params)
    elif task_type == ForgeType.TEXT.value:
        output_path = generate_text(prompt, params)
    else:
        raise ValueError(f"Unsupported task type: {task_type}")

    # Update task status in database
    db = SessionLocal()
    task = get_task_by_id(db, task_id)
    if not task:
        raise ValueError("Task not found")
    
    task.status = TaskStatus.SUCCESS.value
    task.output_path = output_path
    db.commit()

    # Acknowledge task in Redis
    redis_client.xack(f"forge:tasks:{task_type}", "workers", task_id)

if __name__ == "__main__":
    while True:
        response = redis_client.xreadgroup(
            groupname="workers",
            consumername="worker1",
            streams={f"forge:tasks:*": ">"}
        )
        
        for _, messages in response:
            for message in messages:
                task_id, fields = message[0].decode("utf-8"), message[1]
                task_type = fields["task_type"].decode("utf-8")
                prompt = fields["prompt"].decode("utf-8")
                params = eval(fields["params"].decode("utf-8"))
                
                try:
                    process_task(task_id, task_type, prompt, params)
                except Exception as e:
                    print(f"Error processing task {task_id}: {e}")