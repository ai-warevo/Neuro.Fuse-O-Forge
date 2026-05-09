import json
from backend.shared.constants import ForgeType, TaskStatus
from backend.shared.services.redis import RedisManager
from backend.shared.utils import bench
from backend.worker.router import route_to_pipeline
from backend.worker.utils.log import get_worker_logger

class TaskProcessor:
    def __init__(self, broker: RedisManager):
        self.broker = broker
        self.logger = get_worker_logger(self.__class__.__name__)

    async def _run_pipeline(self, task_id: str, task_type: ForgeType, prompt: str, params: dict):
        """Запуск нейронки и публикация успеха."""
        with bench(f"Task {task_id} [{task_type}]", self.logger):
            return route_to_pipeline(task_id, task_type, prompt, params)

    async def execute(self, message_id: str, fields: dict):
        """Основной метод обработки задачи."""
        try:
            task_id = fields.get("task_id")
            task_type = ForgeType(fields.get("task_type"))
            prompt = fields.get("prompt")
            params = json.loads(fields.get("params"))
        except Exception as e:
            return self.logger.error(f"❌ Ошибка парсинга {message_id}: {e}")

        try:
            result = await self._run_pipeline(task_id, task_type, prompt, params)
            await self.broker.publish_result_to_stream(task_id, task_type, TaskStatus.SUCCESS, result)
            self.logger.info(f"✅ Готово: {task_id}")
        except Exception as e:
            self.logger.error(f"❌ Ошибка пайплайна {task_id}: {str(e)}")
            await self.broker.publish_result_to_stream(task_id, task_type, TaskStatus.ERROR, None, str(e))