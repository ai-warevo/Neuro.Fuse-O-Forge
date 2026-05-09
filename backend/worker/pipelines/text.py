import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from .base import BaseGenerator

class TextGenerator(BaseGenerator):
    def load_model(self, model_id):
        self.tokenizer = AutoTokenizer.from_pretrained(model_id)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_id, 
            torch_dtype=torch.float16,
            device_map="auto"
        )

    def run_generation(self, prompt: str, params: dict):
        seed = params.get("seed")
        if seed is not None:
            torch.manual_seed(seed)

        inputs = self.tokenizer(prompt, return_tensors="pt").to("cuda")
        
        with torch.no_grad():
            output_tokens = self.model.generate(
                **inputs,
                max_new_tokens=params.get("max_new_tokens", 128),
                temperature=params.get("temperature", 0.7),
                top_p=params.get("top_p", 0.9),
                repetition_penalty=params.get("repetition_penalty", 1.1),
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id
            )
        
        new_tokens = output_tokens[0][inputs['input_ids'].shape[-1]:]
        return self.tokenizer.decode(new_tokens, skip_special_tokens=True)

    def save_result(self, result, path, params):
        with open(path, "w", encoding="utf-8") as f:
            f.write(result)
        return str(path)
