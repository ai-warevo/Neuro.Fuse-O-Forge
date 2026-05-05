from backend.shared.log import get_logger
from backend.worker.utils.const import WORKER_TYPE

def get_worker_logger(name: str):
  return get_logger(f"worker_{WORKER_TYPE}:{name}")