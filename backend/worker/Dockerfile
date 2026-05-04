FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Установка Python 3.10 и необходимых библиотек для обработки аудио/видео
RUN apt-get update && apt-get install -y \
    python3.10 python3-pip ffmpeg libgl1-mesa-glx libglib2.0-0 \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Создаем симлинк, чтобы 'python' вел на python3
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Копируем зависимости воркера
COPY backend/worker/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код воркера, общую логику и конфиг
COPY backend/worker/ ./backend/worker/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml

# Настройка переменных окружения
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
# Гарантируем, что PyTorch увидит GPU
ENV CUDA_VISIBLE_DEVICES=0

# Запуск основного скрипта воркера
CMD ["python", "backend/worker/main.py"]
