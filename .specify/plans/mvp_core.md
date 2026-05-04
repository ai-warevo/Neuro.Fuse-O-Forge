# Neuro.Fuse-O-Forge Final Technical Execution Plan

## Overview
This comprehensive final technical execution plan outlines the step-by-step development process for the Neuro.Fuse-O-Forge project, adhering to the updated specifications and ensuring compliance with the "No Human Code" rule.

## Phase: Final Technical Implementation Planning

### 1. Directory & File Structure
#### Backend Shared Directory (`/backend/shared/`)
```plaintext
/backend/shared/
├── config.py            # Config singleton
└── pydantic_models.py   # Pydantic schemas (Task, Params)
```

#### Backend API Directory (`/backend/api/`)
```plaintext
/backend/api/
├── main.py              # FastAPI application entry point
├── models/
│   └── task.py          # SQLAlchemy model for tasks
├── schemas/
│   ├── config.py        # Pydantic schema for configuration
│   └── tasks.py         # Pydantic schema for tasks
├── services/
│   ├── database.py      # Database connection setup and migration
│   └── redis.py         # Redis producer
└── routes/
    └── tasks.py         # Task-related routes
```

#### Backend Worker Directory (`/backend/worker/`)
```plaintext
/backend/worker/
├── main.py              # Universal worker entry point
├── pipelines/
│   ├── audio.py         # Audio generation pipeline (Audiocraft)
│   ├── image.py         # Image generation pipeline (Diffusers)
│   └── text.py          # Text generation pipeline (Transformers)
└── utils/
    └── config_loader.py # Config loader
```

#### Frontend Directory (`/frontend/`)
```plaintext
/frontend/
├── app/
│   ├── api.js           # API calls for frontend
│   └── page.js          # Main page
├── styles/
│   └── globals.css      # Global styles
├── public/
│   └── favicon.ico
└── Dockerfile           # Docker build file
```

#### Volumes Directory (`/volumes/`)
```plaintext
/volumes/
├── models               # Model weights and checkpoints
├── output               # Generated outputs (images, audio, text)
├── redis                # Redis data persistence
└── db                   # SQLite database files
```

### 2. Implementation Roadmap

#### 1. Shared Layer (Config Loader & Pydantic Models)
- **Config Loader (`backend/shared/config.py`):**
  - Load configuration from `backend/config.yaml`.
  - Provide a singleton access to the configuration.

- **Pydantic Models (`backend/shared/pydantic_models.py`):**
  - Define Pydantic schemas for tasks and configuration.
  - Ensure all services import these models.

#### 2. Data Layer (Database/Schemas)
- **SQLAlchemy Model (`backend/api/models/task.py`):**
  - Define the SQLAlchemy model for task management in SQLite.

- **Pydantic Schema (`backend/shared/pydantic_models.py`):**
  - Define Pydantic schemas for tasks and configuration validation.

- **Database Service (`backend/api/services/database.py`):**
  - Set up asynchronous SQLAlchemy connection.
  - Handle database migrations on API startup.

#### 3. API Core (FastAPI)
- **Main Application (`backend/api/main.py`):**
  - Initialize FastAPI application.
  - Import and register routes from `backend/api/routes/tasks.py`.
  - Ensure the application interacts with the database using services defined in `backend/api/services/database.py`.

- **Task Router (`backend/api/routes/tasks.py`):**
  - Define routes for creating, retrieving, updating, and deleting tasks.
  - Validate requests using Pydantic schemas.

#### 4. Universal Worker Logic (Worker)
- **Worker Entry Point (`backend/worker/main.py`):**
  - Implement worker logic to process tasks from Redis.
  - Use the configuration loader to fetch global settings.

- **Pipeline Modules (`backend/worker/pipelines/`):**
  - Define specific pipeline modules for audio, image, and text generation.
  - Each module should use the appropriate model specified in `config.yaml`.

#### 5. Bootstrap Procedure
- **API Startup:**
  - Verify or create Redis Consumer Groups on startup.
  - Run database migrations to set up the SQLite schema.

### 3. Operational Flow

#### API to Worker Communication
- **Task Creation:** The API creates tasks and pushes them to Redis streams.
- **Worker Processing:** Workers consume tasks from Redis, process them using appropriate pipelines, and save outputs in the `/volumes/output/` directory through docker volume (`/app/output/` to `/volumes/output/`  ref: /docker-compose.yml).

#### Database Management
- **SQLite Migrations:** Ensure that SQLite database migrations are handled at API startup. This includes creating tables if they do not exist and applying any schema changes.

#### Hot-Swap Logic (Model Switching)
- **Hot-Swap Mechanism:**
  - Use the aliases defined in `backend/config.yaml` to switch between different models.
  - After processing each task, clear VRAM by calling `torch.cuda.empty_cache()` to handle out-of-memory (OOM) situations.

#### Out-of-Memory Handling
- **VRAM Management:**
  - Implement memory management within each pipeline module to ensure that models do not consume excessive VRAM.
  - Use `torch.cuda.empty_cache()` after processing tasks to free up GPU memory.

### 4. Internal Dependencies

- **API and Workers Sharing Pydantic Models:**
  - Both API and Worker services will import Pydantic models from `/backend/shared/pydantic_models.py` to ensure DRY (Don't Repeat Yourself).

- **Global Configuration Sharing:**
  - The worker services will load the global configuration (`backend/config.yaml`) using `config_loader.py` in `/backend/worker/utils/config_loader.py`, ensuring all components use consistent settings.

### 5. Tooling & Environment

**API Service Requirements (`requirements.txt`):**
```plaintext
fastapi==0.110.0
sqlalchemy[asyncio]==2.0.23
aiosqlite==0.21.0
redis==5.0.0
python-dotenv==1.1.0
pyyaml==6.3
uvicorn==0.25.3
```

**Worker Service Requirements (`requirements.txt`):**
```plaintext
torch==2.3.0
audiocraft==0.3.1
transformers==4.34.0
redis==5.0.0
python-dotenv==1.1.0
pyyaml==6.3
diffusers==0.20.0
accelerate==0.22.0
```

**Frontend Service Requirements (`package.json`):**
```JSON
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

### 6. Validation Checkpoints

1. **Data Layer Validation:**
   - Ensure SQLAlchemy models are correctly defined and interact with the SQLite database.
   - Verify Pydantic schemas validate input data as expected.

2. **API Core Validation:**
   - Test FastAPI endpoints for creating, retrieving, updating, and deleting tasks.
   - Ensure API responses align with defined schemas and return correct HTTP status codes.

3. **Universal Worker Validation:**
   - Verify worker processes tasks correctly from Redis.
   - Confirm generated outputs are saved in the expected directories: `/volumes/output/{type}/{date}/` through docker volume (`/app/output/` to `/volumes/output/` ref: /docker-compose.yml).
   - Validate that task statuses are updated appropriately in the SQLite database.

4. **Hot-Swap and OOM Handling:**
   - Test switching between different models using aliases defined in `backend/config.yaml`.
   - Ensure `torch.cuda.empty_cache()` is called after processing tasks to free up GPU memory.

### Conclusion
This final technical execution plan provides a detailed roadmap for implementing the Neuro.Fuse-O-Forge project. By following this plan, we ensure each module is developed efficiently and seamlessly integrated with other components, adhering to the project's strict guidelines. This plan incorporates all necessary elements, including root context builds, shared configuration, and operational flow, ensuring a robust and scalable system.