import torch
from abc import ABC, abstractmethod
from pathlib import Path
from backend.shared.utils import bench
from backend.worker.utils.log import get_worker_logger

class BaseGenerator(ABC):
    _instances = {}

    def __new__(cls):
        if cls not in cls._instances:
            cls._instances[cls] = super(BaseGenerator, cls).__new__(cls)
        return cls._instances[cls]

    def __init__(self):
        self.model = None
        self.logger = get_worker_logger(self.__class__.__name__)

    @abstractmethod
    def load_model(self, model_id: str):
        """Метод для загрузки конкретной модели."""
        pass
    
    def unload_model(self):
        """Метод для выгрузки модели из памяти"""
        self.logger.info("Unloading model and clearing VRAM...")
        if self.model is not None:
            # self.model.to("cpu")
            del self.model
            self.model = None

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
            torch.cuda.synchronize()

    @abstractmethod
    def run_generation(self, prompt: str, params):
        """Метод с логикой генерации конкретной нейронки."""
        pass

    def generate(self, prompt: str, output_path: str, params):
        if self.model is None:
            model_id = params.get("model_id") 
            with bench(f"Loading Model {model_id}"):
                self.load_model(model_id)
        
        try:
            # Создаем директорию, если её нет
            path = Path(output_path)
            path.parent.mkdir(parents=True, exist_ok=True)

            with bench("Generating Content"):
              result = self.run_generation(prompt, params)
            
            # Сохранение (логика сохранения у всех разная, поэтому вернем путь)
            return self.save(result, path, params)
        finally:
            self.unload_model()

    def save(self, result, path: Path, params: dict):
        with bench("Saving Result"):
          return self.save_result(result, path, params)
    
    def save_result(self, result, path: Path, params: dict):
        # По умолчанию просто возвращаем путь, если сохранение внутри run_generation
        return str(path)
