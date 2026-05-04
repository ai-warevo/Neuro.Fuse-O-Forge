FROM python:3.10-slim

WORKDIR /app

# Установка системных зависимостей для мониторинга
RUN apt-get update && \
    apt-get install -y procps && \
    pip install --upgrade pip && \
    rm -rf /var/lib/apt/lists/*

# Копируем зависимости из директории API
COPY backend/api/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем структуру проекта, необходимую для работы API
COPY backend/api/ ./backend/api/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml

# Переменная окружения для корректных импортов из корня /app
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1

# Запуск FastAPI через uvicorn
CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
