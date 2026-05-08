import torch
from diffusers import AutoPipelineForText2Image
from .base import BaseGenerator
from PIL import Image
from pathlib import Path

class ImageGenerator(BaseGenerator):
    def load_model(self, model_id):
        self.model = AutoPipelineForText2Image.from_pretrained(
            model_id, 
            torch_dtype=torch.float16
        )
        self.model.to("cuda")

    def run_generation(self, prompt: str, params: dict):
        seed = params.get("seed")
        generator = torch.Generator("cuda").manual_seed(seed) if seed is not None else None
        
        with torch.inference_mode(), torch.autocast("cuda"):
            output = self.model(
                prompt=prompt,
                negative_prompt=params.get("negative_prompt", ""),
                num_inference_steps=int(params.get("num_inference_steps", 10)),
                guidance_scale=float(params.get("guidance_scale", 7.0)),
                width=int(params.get("width", 512)),
                height=int(params.get("height", 512)),
                generator=generator
            )
            
        return output.images[0]

    def save_result(self, result: Image.Image, path: Path, params: dict):
        ext = params.get("format", "png").lower()
        result.save(str(path), format=ext.upper() if ext != 'jpg' else 'JPEG')
        return str(path)
