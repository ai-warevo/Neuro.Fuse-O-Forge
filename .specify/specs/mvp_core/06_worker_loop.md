### Worker Consumer Loop
Implement a consumer loop in `main.py` that processes audio generation tasks using the Audiocraft library.

```python
import time
from redis import Redis
from backend.api.schemas import TaskPayload, SoundParams
import json

redis_client = Redis(host='redis', port=6379, db=0)
GROUP_NAME = "forge-customer-group"
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
