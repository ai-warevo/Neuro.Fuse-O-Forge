import os
import json
import time
import torch
from contextlib import contextmanager
from audiocraft.models import AudioGen
from audiocraft.data.audio import audio_write

class Beep:
    def __init__(self, config_path='presets.json', model_cache='/app/models', output_dir='tmp'):
        self.config_path = config_path
        self.model_cache = model_cache
        self.output_dir = output_dir
        self.model = None
        self.presets = {}

        # Настройки окружения для работы внутри Docker
        os.environ['HF_HUB_OFFLINE'] = '1'
        os.environ['HUGGINGFACE_HUB_CACHE'] = self.model_cache

    @contextmanager
    def bench(self, name):
        """Инструмент для замера времени выполнения этапов."""
        start = time.perf_counter()
        yield
        print(f"   [TIME] {name}: {time.perf_counter() - start:.2f} сек.")

    def _check_env(self):
        """Внутренняя проверка GPU и наличия модели."""
        print("--- Валидация окружения ---")
        if not torch.cuda.is_available():
            raise RuntimeError("CUDA не доступна. Проверьте проброс GPU.")
        
        if not os.path.exists(self.model_cache) or not os.listdir(self.model_cache):
            raise FileNotFoundError(f"Кэш модели пуст: {self.model_cache}")

        if not os.path.exists(self.config_path):
            raise FileNotFoundError(f"Конфиг {self.config_path} не найден")
            
        print(f"--- [OK] GPU: {torch.cuda.get_device_name(0)}")

    def _load_data(self):
        """Загрузка JSON с пресетами."""
        with open(self.config_path, 'r', encoding='utf-8') as f:
            self.presets = json.load(f)

    def _load_model(self):
        """Инициализация нейросети."""
        with self.bench("Загрузка модели AudioGen"):
            self.model = AudioGen.get_pretrained('facebook/audiogen-medium')

    def _process_sound(self, name, description, dirpath):
        """Генерация и сохранение одного файла."""
        duration = 1 if name == "COUNTDOWN" else 4
        self.model.set_generation_params(duration=duration)
        filepath = os.path.join(dirpath, name)

        print(f"      {name} ({duration}s)...", end="", flush=True)
        with self.bench("генерация"):
            wav = self.model.generate([description])
            # Индекс [0] убирает batch dimension для корректной записи
            audio_write(filepath, wav[0].cpu(), self.model.sample_rate, strategy="loudness")

    def generate_all(self):
        """Запуск полного цикла генерации по всем пресетам."""
        self._check_env()
        self._load_data()
        self._load_model()

        with self.bench("ПОЛНЫЙ ЦИКЛ РАБОТЫ"):
            for preset_name, sounds in self.presets.items():
                print(f"\n>>> ПРЕСЕТ: {preset_name}")
                dirpath = os.path.join(self.output_dir, preset_name)
                os.makedirs(dirpath, exist_ok=True)

                with self.bench(f"Пакет '{preset_name}'"):
                    for name, description in sounds.items():
                        self._process_sound(name, description, dirpath)

def print_build_report():
    """Вывод данных о времени сборки из Dockerfile."""
    log_path = "/app/build_perf.log"
    if os.path.exists(log_path):
        print("\n=== PERFORMANCE REPORT (BUILD) ===")
        with open(log_path, "r") as f:
            print(f.read().strip())
        print("="*34)

if __name__ == "__main__":
    try:
        # Создаем экземпляр и погнали
        app = Beep()
        app.generate_all()
        
        print("\n--- ВСЕ ЗВУКИ УСПЕШНО СГЕНЕРИРОВАНЫ ---")
        print_build_report()
        
    except Exception as e:
        print(f"\n[КРИТИЧЕСКАЯ ОШИБКА]: {e}")
        raise
