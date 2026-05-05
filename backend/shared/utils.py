import uuid
import time
from contextlib import contextmanager
from datetime import datetime
from pathlib import Path
from backend.shared.constants import ForgeType
from .config import settings

def get_output_path(task_id: str, task_type: ForgeType, timestamp: datetime) -> Path:
    year = timestamp.strftime("%Y")
    month = timestamp.strftime("%m")
    day = timestamp.strftime("%d")
    
    output_dir = Path(settings.OUTPUT_DIR)
    task_dir = output_dir / task_type.value / year / month / day
    
    if task_type == ForgeType.SOUND:
        file_extension = ".wav"
    elif task_type == ForgeType.IMAGE:
        file_extension = ".png"
    elif task_type == ForgeType.TEXT:
        file_extension = ".txt"
    else:
        file_extension = ".bin"
    
    task_file = task_dir / f"{task_id}{file_extension}"
    
    return task_file

def generate_unique_task_id() -> str:
    return str(uuid.uuid4())

@contextmanager
def bench(name):
    start = time.time()
    yield
    end = time.time()
    print(f"{name}: {end - start:.4f} seconds")