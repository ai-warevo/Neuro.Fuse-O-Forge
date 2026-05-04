from pydantic import BaseModel, AnyUrl
from datetime import datetime

class TaskPayload(BaseModel):
    task_id: str
    type: str
    prompt: str
    params: dict | None = None
    created_at: datetime

class ResultPayload(BaseModel):
    task_id: str
    status: str
    file_url: AnyUrl | None = None
    metadata: dict | None = None
    error: str | None = None

class ConfigSchema(BaseModel):
    REDIS_HOST: str
    REDIS_PORT: int
    DATABASE_URL: str
    OUTPUT_DIR: str
    MODEL_UNLOAD_TIMEOUT: int

class ParamsSchema(BaseModel):
    # Example for Sound params
    sample_rate: int | None = None
    duration: float | None = None
    
    # Example for Image params
    width: int | None = None
    height: int | None = None
    
    # Example for Text params
    length: int | None = None