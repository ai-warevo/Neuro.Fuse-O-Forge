import torch
from diffusers import StableDiffusionPipeline, DDIMScheduler
from .base import BaseGenerator

class ImageGenerator(BaseGenerator):
    def load_model(self):
        model_id = "CompVis/stable-diffusion-v1-4"
        self.model = StableDiffusionPipeline.from_pretrained(
            model_id, scheduler=DDIMScheduler(), torch_dtype=torch.float16
        ).to("cuda")

    def run_generation(self, prompt: str, **params):
        with torch.autocast("cuda"):
            image = self.model(prompt=prompt).images[0]
        return image

    def save_result(self, result, path):
        result.save(path)
        return str(path)
