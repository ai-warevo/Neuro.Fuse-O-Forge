from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from backend.api.routes.health import router as health_router
from backend.api.routes.tasks import router as tasks_router
from backend.api.routes.ws import router as ws_router
from backend.api.lifespan import lifespan

app = FastAPI(
    title="Neuro.Fuse-O-Forge API",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем роуты
app.include_router(health_router, tags=["System"])
app.include_router(tasks_router, prefix="/tasks", tags=["Tasks"])
app.include_router(ws_router)