from enum import Enum

class TaskStatus(Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCESS = "success"
    ERROR = "error"
    TIMEOUT = "timeout"

class ForgeType(Enum):
    SOUND = "sound"
    IMAGE = "image"
    TEXT = "text"
    UI = "ui"

TASK_TIMEOUT = 300