# --- ЭТАП 1: Сборка и скачивание ---
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04 AS builder

# Добавляем pkg-config и либы для сборки PyAV (они нужны только на этапе builder)
RUN apt-get update && apt-get install -y \
    python3 python3-pip pkg-config libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libswresample-dev libavfilter-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV HUGGINGFACE_HUB_CACHE=/app/models
RUN mkdir -p /app/deps

RUN start_time=$(date +%s) && \
    # 1. Сначала ставим Torch
    pip install --no-cache-dir --target=/app/deps \
        torch torchaudio --index-url https://download.pytorch.org/whl/cu121 && \
    # 2. Ставим бинарную версию PyAV отдельно, чтобы она не пыталась собираться
    pip install --no-cache-dir --target=/app/deps av && \
    # 3. Ставим остальное
    PYTHONPATH=/app/deps pip install --no-cache-dir --target=/app/deps \
        audiocraft xformers && \
    end_time=$(date +%s) && \
    echo "TIME_LIBS_INSTALL: $((end_time - start_time))s" > /app/build_perf.log

# Дальше без изменений...
RUN start_time=$(date +%s) && \
    PYTHONPATH=/app/deps python3 -c "from audiocraft.models import AudioGen; AudioGen.get_pretrained('facebook/audiogen-medium')" && \
    end_time=$(date +%s) && \
    echo "TIME_MODEL_DOWNLOAD: $((end_time - start_time))s" >> /app/build_perf.log

# --- ЭТАП 2: Финальный образ ---
FROM nvidia/cuda:12.1.0-runtime-ubuntu22.04

RUN apt-get update && apt-get install -y python3 ffmpeg && rm -rf /var/lib/apt/lists/*
RUN ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /app

COPY --from=builder /app/deps /usr/local/lib/python3.10/dist-packages
COPY --from=builder /app/models /app/models
COPY --from=builder /app/build_perf.log /app/build_perf.log

ENV HUGGINGFACE_HUB_CACHE=/app/models
ENV PYTHONUNBUFFERED=1
ENV HF_HUB_OFFLINE=1

RUN echo "=== BUILD PERFORMANCE REPORT ===" && cat /app/build_perf.log && echo "==============================="

COPY . .
CMD ["python", "generate_sounds.py"]
