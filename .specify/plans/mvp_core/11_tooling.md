# 11. Tooling & Environment

## API Service Requirements (`backend/api/requirements.txt`)
```plaintext
fastapi==0.110.0
sqlalchemy[asyncio]==2.0.23
aiosqlite==0.21.0
redis==5.0.0
python-dotenv==1.1.0
pyyaml==6.3
uvicorn==0.25.3
alembic==1.13.1
```

## Worker Service Requirements (`backend/worker/requirements.txt`)
```plaintext
torch==2.3.0
audiocraft==0.3.1
transformers==4.34.0
redis==5.0.0
python-dotenv==1.1.0
pyyaml==6.3
diffusers==0.20.0
accelerate==0.22.0
numpy==1.24.3
scipy==1.10.1
```

## Frontend Service Requirements (`frontend/package.json`)
```json
{
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.1",
    "react-dom": "19.0.1",
    "zustand": "5.0.4",
    "tailwindcss": "4.0.7"
  },
  "devDependencies": {
    "bun": "1.2.0",
    "autoprefixer": "10.6.0",
    "postcss": "8.6.5",
    "eslint": "9.10.0",
    "eslint-config-next": "15.0.3",
    "typescript": "6.0.2"
  }
}
```

## Docker Configuration
**Key Files:**
* `docker-compose.yml` — orchestration of all services.
* `Dockerfile` (frontend) — frontend build instructions.
* Service‑specific Dockerfiles for API and Worker.

**Volumes Configuration:**
* `/volumes/models` → `/app/models` (model weights).
* `/volumes/output` → `/app/output` (generated outputs).
* `/volumes/redis` → Redis data persistence.
* `/volumes/db` → SQLite database files.

## Development Tools
**Testing:**
* `pytest` with coverage reporting.
* Integration tests for API endpoints.
* Worker pipeline unit tests.

**Code Quality:**
* `black` — code formatting.
* `isort` — import sorting.
* `mypy` — type checking.
* `flake8` — linting.

**CI/CD Pipeline:**
* GitHub Actions or GitLab CI.
* Automated testing on push/PR.
* Docker image building and pushing.
* Deployment to staging/production.

## Environment Variables
**Required `.env` Files:**
* `API_HOST`, `API_PORT` — API service configuration.
* `REDIS_HOST`, `REDIS_PORT` — Redis connection.
* `DATABASE_URL` — SQLite path.
* `GPU_ENABLED` — GPU usage flag.
* `LOG_LEVEL` — logging verbosity.

**Success Criteria:**
* All services build successfully with Docker.
* Dependencies are properly installed.
* Environment variables are correctly loaded.
* Development tools are set up and functional.
* CI/CD pipeline runs tests and builds images.