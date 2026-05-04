# --- ЭТАП 1: Builder (Сборка зависимостей) ---
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04 AS builder

# Устанавливаем системные пакеты, необходимые для сборки некоторых библиотек
RUN apt-get update && apt-get install -y \
    python3.10 python3-pip pkg-config \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копируем только requirements для установки зависимостей
COPY backend/worker/requirements.txt .

# Устанавливаем зависимости в отдельную директорию /app/deps
# Это позволит избежать копирования лишних системных библиотек
RUN pip install --no-cache-dir --target=/app/deps -r requirements.txt


# --- ЭТАП 2: Final (Легкий образ для работы) ---
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Устанавливаем только runtime-зависимости (ffmpeg, glib для opencv и т.д.)
RUN apt-get update && apt-get install -y \
    python3.10 \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

# Создаем симлинк для удобства
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Копируем установленные пакеты из builder-а в стандартную директорию python
COPY --from=builder /app/deps /usr/local/lib/python3.10/dist-packages

# Копируем исходный код проекта
COPY backend/worker/ ./backend/worker/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml

# Настройки окружения
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV CUDA_VISIBLE_DEVICES=0

# Запуск
CMD ["python", "backend/worker/main.py"]
