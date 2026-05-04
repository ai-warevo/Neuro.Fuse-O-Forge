### Universal Worker Strategy
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
