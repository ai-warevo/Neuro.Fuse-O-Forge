from audiocraft.models import MusicGenXL
from .base import BaseGenerator

class AudioGenerator(BaseGenerator):
    def load_model(self):
        self.model = MusicGenXL.get_pretrained('facebook/musicgen-large')

    def run_generation(self, prompt: str, **params):
        self.model.set_generation_params(
            duration=params.get("duration", 30),
            top_k=params.get("top_k", 250)
        )
        outputs = self.model.generate([prompt], progress=True)
        return outputs

    def save_result(self, result, path):
        result.export(str(path))
        return str(path)
