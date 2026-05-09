import asyncio
import time
import torch
from backend.shared.services.redis import RedisManager
from backend.shared.utils import setup_graceful_exit
from backend.worker.utils.log import get_worker_logger
from backend.worker.processor import TaskProcessor
from backend.worker.utils.const import WORKER_TYPE

stream_name = f"forge:tasks:{WORKER_TYPE}"
group_name = "workers"
logger = get_worker_logger("main")

async def run_iteration(broker: RedisManager):
    """Один цикл опроса брокера и запуска задач."""
    response = await broker.fetch_tasks({stream_name: ">"}, group_name)
    if not response:
        return

    processor = TaskProcessor(broker)
    for _, messages in response:
        for m_id, m_fields in messages:
            await processor.execute(m_id, m_fields)
            await broker.acknowledge(stream_name, group_name, m_id)

async def main():
    async with RedisManager(WORKER_TYPE) as broker:
      keep_running = setup_graceful_exit(WORKER_TYPE)
      logger.info(f"🚀 Forge Worker [{WORKER_TYPE}] запущен.")
      await broker.create_stream_and_group(stream_name, group_name)
      while keep_running[WORKER_TYPE]:
          try:
              await broker.heartbeat()
              await run_iteration(broker)
          except Exception as e:
              logger.critical(f"💥 Ошибка: {e}")
              time.sleep(5)

    logger.info("👋 Воркер остановлен.")

if __name__ == "__main__":
    if not torch.cuda.is_available():
        raise RuntimeError("CUDA недоступна. Проверьте проброс GPU.")
    asyncio.run(main())
