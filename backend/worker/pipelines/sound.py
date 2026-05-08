import torch
import scipy.io.wavfile
from diffusers import AudioLDM2Pipeline
from transformers import GPT2LMHeadModel
from .base import BaseGenerator

class SoundGenerator(BaseGenerator):
    def load_model(self, model_id):
        language_model = GPT2LMHeadModel.from_pretrained(
            model_id, 
            subfolder="language_model", 
            torch_dtype=torch.float16
        )

        self.model = AudioLDM2Pipeline.from_pretrained(
            model_id, 
            language_model=language_model, 
            torch_dtype=torch.float16
        )
        self.model.to("cuda")

    def run_generation(self, prompt: str, params: dict):
        seed = params.get("seed")
        generator = torch.Generator("cuda").manual_seed(seed) if seed is not None else None

        with torch.autocast("cuda"):
            outputs = self.model(
                prompt=prompt,
                negative_prompt=params.get("negative_prompt", "low quality, noise, distortion"),
                num_inference_steps=params.get("num_inference_steps", 200),
                audio_length_in_s=params.get("audio_length_in_s", 10.0),
                guidance_scale=params.get("guidance_scale", 3.5),
                num_waveforms_per_prompt=params.get("num_waveforms_per_prompt", 1),
                generator=generator,
                output_type="np"
            )
        
        return outputs.audios[0]

    def save_result(self, result, path, params: dict):
        scipy.io.wavfile.write(str(path), rate=params.get("rate", 16000), data=result)
        return str(path)
