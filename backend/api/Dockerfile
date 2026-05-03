FROM python:3.10-slim

WORKDIR /app

# Установка системных либ для мониторинга (опционально)
RUN apt-get update && apt-get install -y procps && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем только код API
COPY . ./backend/api

# Переменная для корректных импортов
ENV PYTHONPATH=/app

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
