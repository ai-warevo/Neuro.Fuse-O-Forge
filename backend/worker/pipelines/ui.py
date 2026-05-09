import torch
from diffusers import (
    DiffusionPipeline, 
    EulerAncestralDiscreteScheduler, 
    DPMSolverMultistepScheduler, 
    DDIMScheduler
)
from .base import BaseGenerator

class LayoutGenerator(BaseGenerator):
    def load_model(self, model_id):
        self.pipe = DiffusionPipeline.from_pretrained(
            model_id, 
            torch_dtype=torch.float16, 
            variant="fp16"
        ).to("cuda")

    def _set_sampler(self, sampler_name: str):
        schedulers = {
            'euler_a': EulerAncestralDiscreteScheduler,
            'dpmpp_2m': lambda: DPMSolverMultistepScheduler.from_config(self.pipe.scheduler.config, use_karras_sigmas=True),
            'ddim': DDIMScheduler
        }
        
        scheduler_class = schedulers.get(sampler_name, EulerAncestralDiscreteScheduler)
        
        if callable(scheduler_class) and not isinstance(scheduler_class, type):
            self.pipe.scheduler = scheduler_class()
        else:
            self.pipe.scheduler = scheduler_class.from_config(self.pipe.scheduler.config)

    def run_generation(self, prompt: str, params: dict):
        self._set_sampler(params.get("sampler", "euler_a"))
        
        seed = params.get("seed")
        generator = torch.Generator("cuda").manual_seed(seed) if seed is not None else None
        
        common = {
            "prompt": f"UI UX design, {prompt}, high fidelity",
            "negative_prompt": params.get("negative_prompt", ""),
            "num_inference_steps": params.get("num_inference_steps", 30),
            "guidance_scale": params.get("guidance_scale", 7.5),
            "generator": generator
        }

        # Desktop
        desktop = self.pipe(**common, width=1024, height=768).images[0]
        # Mobile
        mobile = self.pipe(**common, width=512, height=1024).images[0]
        
        return {"desktop": desktop, "mobile": mobile}

    def save_result(self, result, path, params: dict):
        d_path = str(path).replace(".png", "_desktop.png")
        m_path = str(path).replace(".png", "_mobile.png")
        result["desktop"].save(d_path)
        result["mobile"].save(m_path)
        return str(path)
