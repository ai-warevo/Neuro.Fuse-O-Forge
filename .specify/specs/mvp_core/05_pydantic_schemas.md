### Pydantic Schemas
Create detailed Pydantic models for audio generation tasks with validation logic based on `config.yaml`.

```python
from pydantic import BaseModel, Field, validator
import datetime
import json

class ImageParams(BaseModel):
    width: int = Field(..., ge=128, le=4096)
    height: int = Field(..., ge=128, le=4096)

class SoundParams(BaseModel):
    duration: int = Field(..., ge=5, le=300)  # in seconds

class TextParams(BaseModel):
    max_tokens: int = Field(..., ge=1, le=2048)
    temperature: float = Field(..., gt=0.0, le=1.0)

class TaskPayload(BaseModel):
    task_id: str
    type: str = "SOUND"
    model_alias: str
    prompt: str
    params: dict
    created_at: float

    @validator('params')
    def validate_params(cls, v, values):
        if values['type'] == 'IMAGE':
            ImageParams(**v)
        elif values['type'] == 'SOUND':
            SoundParams(**v)
        elif values['type'] == 'TEXT':
            TextParams(**v)
        return v

    @validator('created_at')
    def validate_created_at(cls, v):
        try:
            datetime.datetime.fromtimestamp(v)
        except ValueError:
            raise ValueError("Invalid timestamp")
        return v
```