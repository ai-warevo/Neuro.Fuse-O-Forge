from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import logging
from backend.api.routes.tasks import router as tasks_router
from backend.api.services.database import engine, SessionLocal
from backend.shared.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="Neuro.Fuse-O-Forge API",
    version="0.1.0",
    description="An event-driven API for managing tasks in the Neuro.Fuse-O-Forge project."
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO)

# Database initialization
engine.connect()
SessionLocal()

# Redis initialization
import redis
redis_client = redis.Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT)

# Include task routes
app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])