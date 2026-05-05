FROM nvidia/cuda:13.2.1-devel-ubuntu24.04 AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN sed -i 's/archive.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list && \
    sed -i 's/security.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list && \
    sed -i 's/archive.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's/security.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list.d/ubuntu.sources && \
    apt-get update && apt-get install -y --no-install-recommends \
    python3.12 python3-pip python3-dev pkg-config git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/worker/requirements.txt .

RUN --mount=type=cache,target=/root/.cache/uv \
    uv pip install \
    # --no-cache \
    --target /app/deps \
    --system \
    --index-url https://download.pytorch.org/whl/cu124 \
    --extra-index-url https://pypi.org/simple \
    -r requirements.txt

###

FROM nvidia/cuda:13.2.1-runtime-ubuntu24.04 AS runtime

RUN sed -i 's/archive.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list && \
    sed -i 's/security.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list && \
    sed -i 's/archive.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's/security.ubuntu.com/mirror.yandex.ru/g' /etc/apt/sources.list.d/ubuntu.sources

RUN apt-get update && apt-get install -y \
    python3.12 \
    ffmpeg \
    libgl1 \
    libglx-mesa0 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/python3 /usr/bin/python
WORKDIR /app
COPY --from=builder /app/deps /usr/local/lib/python3.12/dist-packages
COPY backend/api/ ./backend/api/
COPY backend/worker/ ./backend/worker/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV CUDA_VISIBLE_DEVICES=0

CMD ["python", "backend/worker/main.py"]
