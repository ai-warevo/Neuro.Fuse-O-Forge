import asyncio
from backend.api.services.database import AsyncSessionLocal
from backend.api.models.task import get_task_by_id
from backend.api.services.websocket_manager import websocket_manager
from backend.shared.config import settings
from backend.shared.constants import ForgeType, TaskStatus
from backend.shared.services.redis import RedisManager

class ResultListener:
    def __init__(self, broker: RedisManager, logger):
        self.broker = broker
        self.logger = logger
        self.streams = {f"forge:results:{t.value}": ">" for t in ForgeType}
        self.group_name = "api"

    async def start(self):
        """Запуск основного цикла прослушивания."""
        self.logger.info(f"🚀 ResultListener запущен: {list(self.streams.keys())}")
        for stream_name in self.streams:
            await self.broker.create_stream_and_group(stream_name, self.group_name)
        
        while True:
            try:
                response = await self.broker.fetch_tasks(self.streams, self.group_name)
                if not response:
                    continue

                for stream_name, messages in response:
                    for msg_id, fields in messages:
                        await self._process_message(stream_name, msg_id, fields)
            except Exception as e:
                self.logger.error(f"🔥 Ошибка слушателя: {e}", exc_info=True)
                await asyncio.sleep(2)

    async def _process_message(self, stream_name: str, msg_id: str, fields: dict):
        """Внутренняя логика обработки сообщения."""
        task_id = fields.get('task_id', 'unknown')
        self.logger.debug(f"📥 Сообщение {msg_id} для задачи {task_id}")

        await self._update_db(fields)
        await self._notify_ws(fields)
        await self.broker.acknowledge(stream_name, self.group_name, msg_id)

    async def _update_db(self, fields: dict):
        task_id = fields.get('task_id')
        async with AsyncSessionLocal() as db:
            task = await get_task_by_id(db, task_id)
            if task:
                task.status = TaskStatus(fields.get('status'))
                task.result = fields.get('result')
                task.error_message = fields.get('error_message')
                await db.commit()
                self.logger.info(f"💾 БД: Задача {task_id} -> {task.status}")
            else:
                self.logger.warning(f"⚠️ БД: Задача {task_id} не найдена")

    async def _notify_ws(self, fields: dict):
        task_id = fields.get('task_id')
        task_type = fields.get('task_type', '')
        status = fields.get('status', '')

        if status == TaskStatus.SUCCESS.value and task_type != ForgeType.TEXT.value:
            result_path = fields.get('result')
            output_path = '/app/output'
            if result_path and result_path.startswith(output_path):
                base_url = settings.API_BASE_URL.rstrip('/')
                fields['result'] = result_path.replace(output_path, f"{base_url}/media")

        await websocket_manager.broadcast(task_id, fields)

        if status in [TaskStatus.SUCCESS.value, TaskStatus.ERROR.value, TaskStatus.TIMEOUT.value]:
            self.logger.info(f"🔌 WS: Задача {task_id} завершена ({status}).")
            await websocket_manager.disconnect_by_task(task_id)