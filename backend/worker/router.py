from datetime import datetime
from backend.shared.constants import ForgeType
from backend.shared.utils import get_output_path
from backend.worker.pipelines.image import ImageGenerator
from backend.worker.pipelines.sound import SoundGenerator
from backend.worker.pipelines.text import TextGenerator
from backend.worker.pipelines.ui import LayoutGenerator

def route_to_pipeline(task_id: str, task_type: ForgeType, prompt: str, params: dict):
    """Маппинг типов задач на конкретные пайплайны."""
    handlers = {
        ForgeType.IMAGE: ImageGenerator().generate,
        ForgeType.SOUND: SoundGenerator().generate,
        ForgeType.TEXT: TextGenerator().generate,
        ForgeType.UI: LayoutGenerator().generate,
    }
    handler = handlers.get(task_type)
    if not handler:
        raise ValueError(f"Unsupported task type: {task_type}")
    
    output_path = get_output_path(task_id, task_type, datetime.now())
    return handler(prompt, output_path, params)
