import os
import redis
from fastapi import FastAPI
from contextlib import asynccontextmanager

DB_DIR = "/app/db"
DB_PATH = os.path.join(DB_DIR, "history.db")

@asynccontextmanager
async def lifespan(app: FastAPI):
    if not os.path.exists(DB_DIR):
        os.makedirs(DB_DIR, exist_ok=True)
        print(f"--- [INIT] Created directory: {DB_DIR} ---")
    
    # Здесь в будущем будет инициализация таблиц БД (SQLAlchemy)
    yield

app = FastAPI(title="Neuro.Fuse-O-Forge API", lifespan=lifespan)

# Подключение к Redis
r = redis.Redis(
    host=os.getenv('REDIS_HOST', 'redis'), 
    port=os.getenv('REDIS_HOST', 6379), 
    decode_responses=True
)

@app.get("/")
def read_root():
    try:
        r.ping()
        redis_status = "Connected"
    except:
        redis_status = "Disconnected"
        
    return {
        "status": "Forge API Online",
        "redis": redis_status,
        "database": "Ready" if os.path.exists(DB_PATH) else "Initializing..."
    }
