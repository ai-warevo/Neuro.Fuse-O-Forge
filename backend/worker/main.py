from backend.shared.services.redis import redis_client, publish_result_to_stream
from backend.shared.constants import ForgeType, TaskStatus
from backend.worker.pipelines.audio import generate_audio
from backend.worker.pipelines.image import generate_image
from backend.worker.pipelines.text import generate_text

def process_task(task_type: str, prompt: str, params: dict):
    if task_type == ForgeType.SOUND.value:
        return generate_audio(prompt, params)
    elif task_type == ForgeType.IMAGE.value:
        return generate_image(prompt, params)
    elif task_type == ForgeType.TEXT.value:
        return generate_text(prompt, params)
    else:
        raise ValueError(f"Unsupported task type: {task_type}")

def main():
    while True:
        response = redis_client.xreadgroup(
            groupname="workers",
            consumername="worker1",
            streams={f"forge:tasks:*": ">"}
        )
        
        for _, messages in response:
            for message in messages:
                task_id, fields = message[0].decode("utf-8"), message[1]
                task_type = fields["task_type"].decode("utf-8")
                prompt = fields["prompt"].decode("utf-8")
                params = eval(fields["params"].decode("utf-8"))
                
                try:
                    output_path = process_task(task_id, task_type, prompt, params)
                    publish_result_to_stream(task_id, TaskStatus.SUCCESS, output_path)
                except Exception as e:
                    print(f"Error processing task {task_id}: {e}")
                    publish_result_to_stream(task_id, TaskStatus.ERROR, None, e)

                redis_client.xack(f"forge:tasks:{task_type}", "workers", task_id)

if __name__ == "__main__":
    main()