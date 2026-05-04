from datetime import datetime
from pydantic import BaseModel

class TaskCreate(BaseModel):
    id: str
    type: str
    prompt: str
    params: dict | None = None
    created_at: datetime