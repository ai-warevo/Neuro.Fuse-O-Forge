import torch
import scipy.io.wavfile
from diffusers import AudioLDM2Pipeline
from .base import BaseGenerator

class AudioGenerator(BaseGenerator):
    def load_model(self):
        self.pipe = AudioLDM2Pipeline.from_pretrained(
            "cvssp/audioldm2-music", 
            torch_dtype=torch.float16
        )
        self.pipe.to("cuda")

    def run_generation(self, prompt: str, **params):
        outputs = self.pipe(
            prompt,
            num_inference_steps=params.get("steps", 200),
            audio_length_in_s=params.get("duration", 30),
            guidance_scale=params.get("guidance_scale", 3.5)
        )
        return outputs.audios[0]

    def save_result(self, result, path):
        scipy.io.wavfile.write(str(path), rate=16000, data=result)
        return str(path)
