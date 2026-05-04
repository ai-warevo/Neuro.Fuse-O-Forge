# MVP Core Specification for Neuro.Fuse-O-Forge

## Overview
The Minimum Viable Product (MVP) core of Neuro.Fuse-O-Forge will focus on implementing the Sonic-Forge module, which handles audio generation tasks using the AudioGen model. This module will be integrated with Redis for task management and a Python worker that processes these tasks.

## Key Components
1. **Redis Configuration**: Configure Redis to handle task queues for Sonic-Forge.
2. **Docker Compose Setup**: Define services for Redis, Python worker, and NVIDIA runtime support.
3. **Pydantic Schemas**: Create detailed Pydantic models for audio generation tasks with validation logic based on `config.yaml`.
4. **Worker Consumer Loop**: Implement a consumer loop that uses the Audiocraft library to process tasks.
5. **Universal Worker Strategy**: Detailed logic of how a single worker code uses `FORGE_TYPE` to load different pipelines (Audiocraft, Diffusers, or Transformers).
6. **State Machine**: Define task statuses and responsibilities for updating each status in SQLite.
7. **I/O Operations**: Specific paths for saving files: `/app/output/{type}/{date}/{task_id}.ext`.

## Detailed Plan

### 1. Redis Configuration
Ensure Redis is configured to handle task queues with the following settings:
- Host: `redis`
- Port: `6379`
- Database: `0`
- Ack Timeout: `300` seconds
- Heartbeat Interval: `10` seconds

### 2. Docker Compose Setup
Create a `docker-compose.yml` file with services for Redis and the Python worker, including NVIDIA runtime support.

```yaml
version: '3.8'

x-worker-base: &worker-base
  build:
    context: .
    dockerfile: ./backend/worker/Dockerfile
  volumes:
    - ./volumes/models:/app/models
    - ./volumes/output:/app/output
    - ./backend/config.yml:/app/config.yml
  environment:
    - REDIS_HOST=redis
    - REDIS_PORT=6379
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
  depends_on:
    redis:
      condition: service_healthy

services:
  redis:
    image: redis:7-alpine
    container_name: forge-redis
    command: redis-server --appendonly yes
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
    volumes:
      - ./volumes/redis:/data

  api:
    build:
      context: .
      dockerfile: ./backend/api/Dockerfile
    container_name: forge-api
    ports:
      - "8000:8000"
    environment:
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - DATABASE_URL=sqlite+aiosqlite:////app/db/history.db
    volumes:
      - ./volumes/output:/app/output
      - ./volumes/db:/app/db
      - ./backend/config.yml:/app/config.yml
    depends_on:
      redis:
        condition: service_healthy

  worker-image:
    <<: *worker-base
    container_name: forge-worker-image
    environment:
      - FORGE_TYPE=IMAGE
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  worker-sound:
    <<: *worker-base
    container_name: forge-worker-sound
    environment:
      - FORGE_TYPE=SOUND
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  worker-text:
    <<: *worker-base
    container_name: forge-worker-text
    environment:
      - FORGE_TYPE=TEXT
      - REDIS_HOST=redis
      - REDIS_PORT=6379

  frontend:
    build:
      context: .
      dockerfile: ./frontend/Dockerfile
    container_name: forge-ui
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - api

networks:
  default:
    name: forge-network
```

### 3. Pydantic Schemas
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

### 4. Worker Consumer Loop
Implement a consumer loop in `worker.py` that processes audio generation tasks using the Audiocraft library.

```python
import time
from redis import Redis
from backend.api.schemas import TaskPayload, SoundParams
import json

redis_client = Redis(host='redis', port=6379, db=0)
GROUP_NAME = "sonic-forge-group"
STREAM_KEY = "forge:tasks:SOUND"

def consume_task():
    while True:
        try:
            response = redis_client.xreadgroup(GROUP_NAME, GROUP_NAME, {STREAM_KEY: '>'}, block=10000)
            for stream_name, messages in response:
                for message_id, message_data in messages:
                    task_data = {
                        "task_id": message_data[b'task_id'].decode(),
                        "type": message_data[b"type"].decode(),
                        "model_alias": message_data[b"model_alias"].decode(),
                        "prompt": message_data[b"prompt"].decode(),
                        "params": json.loads(message_data[b"params"]),
                        "created_at": float(message_data[b"created_at"])
                    }
                    task = TaskPayload(**task_data)
                    process_task(task)
                    redis_client.xack(STREAM_KEY, GROUP_NAME, message_id)
        except Exception as e:
            print(f"Error processing message: {e}")

def process_task(task):
    # Placeholder for Audiocraft task processing logic
    if task.type == "SOUND":
        sound_params = SoundParams(**task.params)
        generate_audio(task.prompt, sound_params.duration)
    else:
        print("Unsupported task type")

if __name__ == "__main__":
    consume_task()
```

### 5. Universal Worker Strategy
Detailed logic of how a single worker code uses `FORGE_TYPE` to load different pipelines (Audiocraft, Diffusers, or Transformers).

```python
import os
from audiocraft import AudioGen

def load_pipeline(model_alias):
    if model_alias == "audiogen":
        return AudioGen.from_pretrained("facebook/audiogen-medium")
    elif model_alias == "diffusers":
        # Implement Diffusers pipeline loading
        pass
    elif model_alias == "transformers":
        # Implement Transformers pipeline loading
        pass
    else:
        raise ValueError("Unsupported model alias")

def generate_audio(prompt, duration):
    pipeline = load_pipeline(os.getenv('FORGE_TYPE'))
    audio_output = pipeline.generate(prompt=prompt, duration=duration)
    save_audio(audio_output)

def save_audio(audio_output, task_id):
    output_dir = f"/app/output/SOUND/{datetime.datetime.now().strftime('%Y-%m-%d')}"
    os.makedirs(output_dir, exist_ok=True)
    file_path = f"{output_dir}/{task_id}.wav"
    audio_output.save(file_path)
```

### 6. State Machine
Define task statuses (PENDING -> PROCESSING -> SUCCESS/ERROR) and which service is responsible for updating each status in SQLite.

```python
from sqlalchemy import create_engine, Column, String, Integer, Float, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import enum

Base = declarative_base()

class TaskStatus(enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SUCCESS = "SUCCESS"
    ERROR = "ERROR"

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True)
    task_id = Column(String, unique=True, nullable=False)
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)

engine = create_engine('sqlite+aiosqlite:////app/db/history.db')
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def update_task_status(task_id, new_status):
    db = SessionLocal()
    task = db.query(Task).filter(Task.task_id == task_id).first()
    if task:
        task.status = new_status
        db.commit()
        db.refresh(task)
    else:
        raise ValueError("Task not found")

# Example usage in worker.py
def process_task(task):
    try:
        update_task_status(task.task_id, TaskStatus.PROCESSING)
        # Processing logic here
        update_task_status(task.task_id, TaskStatus.SUCCESS)
    except Exception as e:
        print(f"Error processing task {task.task_id}: {e}")
        update_task_status(task.task_id, TaskStatus.ERROR)
```

### 7. I/O Operations
Specific paths for saving files: `/app/output/{type}/{date}/{task_id}.ext`.

```python
import datetime

def save_audio(audio_output, task_id):
    output_dir = f"/app/output/SOUND/{datetime.datetime.now().strftime('%Y-%m-%d')}"
    os.makedirs(output_dir, exist_ok=True)
    file_path = f"{output_dir}/{task_id}.wav"
    audio_output.save(file_path)
```

## Conclusion
This plan outlines the steps to implement the Sonic-Forge module in Neuro.Fuse-O-Forge. The updated specification ensures that all components are aligned with the project's goals and technical requirements, adhering to the 'No Human Code' rule.