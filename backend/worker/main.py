import os
import time
import json
from backend.shared.services.redis import redis_client, publish_result_to_stream
from backend.shared.constants import ForgeType, TaskStatus
from backend.shared.log import get_logger
from backend.worker.pipelines.audio import generate_audio
from backend.worker.pipelines.image import generate_image
from backend.worker.pipelines.text import generate_text

logger = get_logger(f"worker_{os.getenv('FORGE_TYPE', 'SOUND')}:main")

def route_to_pipeline(task_type: str, prompt: str, params: dict):
    """Вызывает конкретный пайплайн в зависимости от типа задачи."""
    handlers = {
        ForgeType.SOUND.value: generate_audio,
        ForgeType.IMAGE.value: generate_image,
        ForgeType.TEXT.value: generate_text,
    }
    
    handler = handlers.get(task_type)
    if not handler:
        raise ValueError(f"Unsupported task type: {task_type}")
    
    return handler(prompt, params)

def parse_message(fields: dict) -> tuple:
    """Извлекает и валидирует данные из сообщения Redis."""
    task_type = fields.get(b"task_type", b"").decode("utf-8")
    prompt = fields.get(b"prompt", b"").decode("utf-8")
    params_raw = fields.get(b"params", b"{}").decode("utf-8")
    params = json.loads(params_raw)
    return task_type, prompt, params

def execute_task(stream_name: str, task_id: str, fields: dict):
    """Полный цикл обработки одной задачи: от старта до XACK."""
    try:
        task_type, prompt, params = parse_message(fields)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        logger.error(f"❌ Failed to parse task {task_id}: {e}")
        return

    start_time = time.time()
    logger.info(f"🚀 Processing {task_type} task: {task_id}")

    try:
        output_path = route_to_pipeline(task_type, prompt, params)
        duration = round(time.time() - start_time, 2)
        
        logger.info(f"✅ Success: {task_id} in {duration}s")
        publish_result_to_stream(task_id, TaskStatus.SUCCESS, output_path)
    except Exception as e:
        logger.error(f"❌ Error in task {task_id}: {str(e)}")
        publish_result_to_stream(task_id, TaskStatus.ERROR, None, str(e))
    finally:
        redis_client.xack(stream_name, "workers", task_id)

def fetch_messages():
    """Интерфейс получения сообщений из Redis."""
    return redis_client.xreadgroup(
        groupname="workers",
        consumername="worker1",
        streams={"forge:tasks": ">"},
        count=1,
        block=5000
    )

def process_response(response):
    """Разбор ответа Redis и запуск обработки каждой задачи."""
    for stream_name, messages in response:
        for message_data in messages:
            task_id = message_data[0].decode("utf-8")
            fields = message_data[1]
            
            execute_task(stream_name.decode("utf-8"), task_id, fields)

def main():
    logger.info("Worker started. Waiting for tasks...")
    
    while True:
        try:
            response = fetch_messages()
            if response:
                process_response(response)
                
        except Exception as e:
            logger.critical(f"Main loop error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    main()
