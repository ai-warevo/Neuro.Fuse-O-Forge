import asyncio
from backend.api.services.database import AsyncSessionLocal
from backend.api.models.task import get_task_by_id
from backend.api.services.websocket_manager import websocket_manager
from backend.shared.constants import TaskStatus
from backend.shared.services.redis import RedisManager

async def update_task_in_db(fields: dict):
    """Обновляет состояние задачи в базе данных."""
    task_id = fields.get('task_id')
    async with AsyncSessionLocal() as db:
        task = await get_task_by_id(db, task_id)
        if task:
            task.status = TaskStatus(fields.get('status'))
            task.output_path = fields.get('output_path')
            task.error_message = fields.get('error_message')
            await db.commit()
            return True
    return False

async def notify_clients(fields: dict):
    """Отправляет результат через WebSocket."""
    task_id = fields.get('task_id')
    await websocket_manager.broadcast(task_id, fields)

async def process_message(broker, msg_id, fields, stream_name, group_name):
    """Логика обработки одного сообщения."""
    await update_task_in_db(fields)
    await notify_clients(fields)
    await broker.acknowledge(stream_name, group_name, msg_id)

async def listen_to_results(broker: RedisManager, logger):
    """Основной цикл прослушивания стрима."""
    stream_name = "forge:results"
    group_name = "api"
    
    await broker.create_stream_and_group(stream_name, group_name)
    
    while True:
        try:
            response = await broker.fetch_tasks(stream_name, group_name)
            if not response:
                continue

            for _, messages in response:
                for msg_id, fields in messages:
                    await process_message(broker, msg_id, fields, stream_name, group_name)
                    
        except Exception as e:
            logger.error(f"Worker Error: {e}")
            await asyncio.sleep(2)
