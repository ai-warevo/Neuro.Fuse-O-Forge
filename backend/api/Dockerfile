# --- ЭТАП 1: Builder ---
FROM python:3.10-slim AS builder

# Устанавливаем инструменты сборки (если каким-то пакетам нужна компиляция)
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    && pip install --upgrade pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Устанавливаем зависимости в локальную папку
COPY backend/api/requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt


# --- ЭТАП 2: Final ---
FROM python:3.10-slim

WORKDIR /app

# Устанавливаем только необходимые runtime-утилиты (например, procps для мониторинга)
RUN apt-get update && \
    apt-get install -y procps && \
    pip install --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

# Копируем только установленные пакеты из builder
COPY --from=builder /install /usr/local

# Копируем код и конфигурации
COPY backend/api/ ./backend/api/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml

# Настройки окружения
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Открываем порт для документации
EXPOSE 8000

# Запуск через модуль uvicorn
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
