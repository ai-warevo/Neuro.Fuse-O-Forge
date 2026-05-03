FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

# Ставим питон и либы для аудио/картинок
RUN apt-get update && apt-get install -y \
    python3.10 python3-pip ffmpeg libgl1-mesa-glx libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

# Сначала копируем и ставим зависимости (кэширование)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код воркера
COPY . ./backend/worker

ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

CMD ["python", "backend/worker/main.py"]
