from enum import Enum

class TaskStatus(Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"
    TIMEOUT = "TIMEOUT"

class ForgeType(Enum):
    SOUND = "SOUND"
    IMAGE = "IMAGE"
    TEXT = "TEXT"
    UI = "UI"

TASK_TIMEOUT = 300