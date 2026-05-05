import torch
from abc import ABC, abstractmethod
from pathlib import Path
from backend.shared.utils import bench

class BaseGenerator(ABC):
    _instances = {}

    def __new__(cls):
        # Реализация Singleton для всех наследников по отдельности
        if cls not in cls._instances:
            cls._instances[cls] = super(BaseGenerator, cls).__new__(cls)
        return cls._instances[cls]

    def __init__(self):
        self.model = None

    @abstractmethod
    def load_model(self):
        """Метод для загрузки конкретной модели."""
        pass

    @abstractmethod
    def run_generation(self, prompt: str, **params):
        """Метод с логикой генерации конкретной нейронки."""
        pass

    def generate(self, prompt: str, output_path: str, **params):
        if self.model is None:
            with bench("Loading Model"):
                self.load_model()
        
        try:
            # Создаем директорию, если её нет
            path = Path(output_path)
            path.parent.mkdir(parents=True, exist_ok=True)

            with bench("Generating Content"):
              result = self.run_generation(prompt, **params)
            
            # Сохранение (логика сохранения у всех разная, поэтому вернем путь)
            return self.save(result, path)
        finally:
            if torch.cuda.is_available():
                torch.cuda.empty_cache()

    def save(self, result, path: Path):
        with bench("Saving Result"):
          return self.save_result(result, path)
    
    def save_result(self, result, path: Path):
        # По умолчанию просто возвращаем путь, если сохранение внутри run_generation
        return str(path)
