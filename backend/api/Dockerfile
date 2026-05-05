FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
# RUN apt-get update && apt-get install -y \
#     gcc \
#     python3-dev \
#     && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/api/requirements.txt .
RUN uv pip install --no-cache --system --prefix=/install -r requirements.txt

###

FROM python:3.12-slim AS runtime
WORKDIR /app
RUN apt-get update && \
    apt-get install -y procps && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /install /usr/local
COPY backend/api/ ./backend/api/
COPY backend/shared/ ./backend/shared/
COPY backend/config.yaml ./backend/config.yaml
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
EXPOSE 8000

CMD ["uvicorn", "backend.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
