from datetime import datetime
from pydantic import BaseModel

class TaskCreate(BaseModel):
    type: str
    prompt: str
    params: dict | None = None