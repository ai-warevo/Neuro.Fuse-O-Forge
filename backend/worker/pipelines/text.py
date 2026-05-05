import torch
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from .base import BaseGenerator

class TextGenerator(BaseGenerator):
    def load_model(self):
        name = "gpt2"
        self.tokenizer = GPT2Tokenizer.from_pretrained(name)
        self.model = GPT2LMHeadModel.from_pretrained(name).to("cuda")

    def run_generation(self, prompt: str, params: dict):
        inputs = self.tokenizer.encode(prompt, return_tensors="pt").to("cuda")
        with torch.no_grad():
            outputs = self.model.generate(inputs, max_length=params.get("length", 50))
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)

    def save_result(self, result, path):
        path.write_text(result, encoding="utf-8")
        return str(path)
