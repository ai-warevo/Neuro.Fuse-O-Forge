### Corrected Task List

#### 1. Backend Shared Directory (`/backend/shared/`)

- **Task 1:** Create `backend/shared/config.py`
  - Action: Implement singleton pattern for global config access.
  - File Path: `/backend/shared/config.py`

- **Task 2:** Update `backend/api/requirements.txt`
  - Action: Add necessary packages for configuration management and type hinting (e.g., Pydantic, Singleton).
  - File Path: `/backend/api/requirements.txt`

- **Task 3:** Create `backend/shared/pydantic_models.py`
  - Action: Define `TaskSchema`, `ConfigSchema`, and `ParamsSchema`.
  - File Path: `/backend/shared/pydantic_models.py`

- **Task 4:** Update `backend/shared/requirements.txt`
  - Action: Add necessary packages for utility functions (e.g., os, pathlib).
  - File Path: `/backend/shared/requirements.txt`

- **Task 5:** Create `backend/shared/utils.py`
  - Action: Implement shared utility functions, file path helpers, and data formatting utilities.
  - File Path: `/backend/shared/utils.py`

- **Task 6:** Create `backend/shared/constants.py`
  - Action: Define shared constants and configuration, including task statuses and default timeouts.
  - File Path: `/backend/shared/constants.py`

#### 2. Backend API Directory (`/backend/api/`)

- **Task 7:** Update `backend/api/requirements.txt`
  - Action: Add FastAPI and other necessary packages (e.g., SQLAlchemy, Redis).
  - File Path: `/backend/api/requirements.txt`

- **Task 8:** Create `backend/api/main.py`
  - Action: Initialize FastAPI instance with proper metadata, add CORS and logging middleware, register routes from `routes/tasks.py`, initialize database connection, and set up Redis client.
  - File Path: `/backend/api/main.py`

- **Task 9:** Create `backend/api/routes/tasks.py`
  - Action: Define API endpoints for task creation, status checks, and results retrieval.
  - File Path: `/backend/api/routes/tasks.py`

- **Task 10:** Update `backend/api/models/task.py`
  - Action: Define fields for the task model (`task_id`, `status`, `created_at`, `updated_at`, `type`, `output_path`, `error_message`) and create indexes.
  - File Path: `/backend/api/models/task.py`

- **Task 11:** Create `backend/api/schemas/config.py`
  - Action: Validate configuration structure with type hints.
  - File Path: `/backend/api/schemas/config.py`

- **Task 12:** Create `backend/api/schemas/tasks.py`
  - Action: Define task creation schema and include validation for required fields.
  - File Path: `/backend/api/schemas/tasks.py`

- **Task 13:** Update `backend/api/services/database.py` to Provide Both AsyncSession and SyncSession
  - Action: Implement both an AsyncSession (for FastAPI) and a scoped_session or standard Session (for the synchronous Worker).
  - File Path: `/backend/api/services/database.py`

- **Task 14:** Create `backend/api/services/redis.py`
  - Action: Connect to Redis server, push tasks to `forge:tasks:{type}` streams, and publish results to `forge:results` stream.
  - File Path: `/backend/api/services/redis.py`

#### 3. Backend Worker Directory (`/backend/worker/`)

- **Task 15:** Update `backend/worker/requirements.txt`
  - Action: Add necessary packages for worker logic (e.g., Redis, PyTorch).
  - File Path: `/backend/worker/requirements.txt`

- **Task 16:** Create `backend/worker/main.py`
  - Action: Connect to Redis and join consumer group, read tasks from stream using `XREADGROUP`, load appropriate pipeline based on task type, update task status in database, and acknowledge task in Redis (`XACK`).
  - File Path: `/backend/worker/main.py`

- **Task 17:** Create `backend/worker/pipelines/audio.py`
  - Action: Use Audiocraft to handle audio params and save `.wav` files. Include a "Model Unload / GPU Cache Clear" step after generation.
  - File Path: `/backend/worker/pipelines/audio.py`

- **Task 18:** Create `backend/worker/pipelines/image.py`
  - Action: Use Diffusers to support various models and save `.png/.jpg` files. Include a "Model Unload / GPU Cache Clear" step after generation.
  - File Path: `/backend/worker/pipelines/image.py`

- **Task 19:** Create `backend/worker/pipelines/text.py`
  - Action: Use Transformers to handle text params and save `.txt` files. Include a "Model Unload / GPU Cache Clear" step after generation.
  - File Path: `/backend/worker/pipelines/text.py`

#### 4. Frontend Directory (`/frontend/`)

- **Task 20:** Initialize Next.js Project
  - Action: Run `npx create-next-app@latest --typescript`.
  - File Path: `/frontend/`

- **Task 21:** Switch Runtime to Bun
  - Action: Modify the project setup to use Bun runtime.
  - File Path: `/frontend/package.json`

- **Task 22:** Update `package.json`
  - Action: Add necessary dependencies for Tailwind CSS and Zustand.
  - File Path: `/frontend/package.json`

- **Task 23:** Install Tailwind CSS
  - Action: Run `npm install -D tailwindcss postcss autoprefixer`.
  - File Path: `/frontend/`

- **Task 24:** Initialize Tailwind
  - Action: Run `npx tailwindcss init`.
  - File Path: `/frontend/`

- **Task 25:** Configure Dark Theme in `tailwind.config.js`
  - Action: Set up dark mode in Tailwind configuration.
  - File Path: `/frontend/tailwind.config.js`

- **Task 26:** Create Base Styles in `globals.css`
  - Action: Define base styles for the application.
  - File Path: `/frontend/styles/globals.css`

- **Task 27:** Install Zustand
  - Action: Run `npm install zustand`.
  - File Path: `/frontend/package.json`

- **Task 28:** Create `forgeStore.ts`
  - Action: Create Zustand store for task ID, status, and logs.
  - File Path: `/frontend/app/store/forgeStore.ts`

- **Task 29:** Create `statsStore.ts`
  - Action: Create Zustand store for GPU load and worker availability.
  - File Path: `/frontend/app/store/statsStore.ts`

- **Task 30:** Create `useWebSocket.ts`
  - Action: Establish WebSocket connection to `/api/ws/task/{task_id}` and route events to Zustand stores.
  - File Path: `/frontend/app/hooks/useWebSocket.ts`

- **Task 31:** Create UI Components
  - Action: Implement Forge Terminal, Control Panel, and Stats Dashboard components.
  - File Path: 
    - `/frontend/app/components/ForgeTerminal.tsx`
    - `/frontend/app/components/ControlPanel.tsx`
    - `/frontend/app/components/StatsDashboard.tsx`

#### 5. Hardware & Environment

- **Task 32:** Verify NVIDIA/CUDA Availability
  - Action: Run `nvidia-smi` and check CUDA version compatibility.
  - File Path: N/A (Environment Check)

- **Task 33:** Test PyTorch GPU Access
  - Action: Run `torch.cuda.is_available()` to ensure PyTorch has access to the GPU.
  - File Path: N/A (Environment Check)

- **Task 34:** Verify Docker Installation
  - Action: Ensure Docker is installed and running.
  - File Path: N/A (Environment Check)

- **Task 35:** Check Docker Compose Version
  - Action: Ensure Docker Compose is installed and up to date.
  - File Path: N/A (Environment Check)

- **Task 36:** Test Volume Mounting
  - Action: Verify that volume mounting works correctly in Docker.
  - File Path: N/A (Environment Check)

#### 6. Validation & Testing

- **Task 37:** Write Unit Tests for Shared Models and Utils
  - Action: Cover shared models and utility functions with tests.
  - File Path: `/tests/unit/`

- **Task 38:** Write Integration Tests for API, DB, and Redis Communication
  - Action: Test the interaction between API, database, and Redis services.
  - File Path: `/tests/integration/`

- **Task 39:** Write End-to-End Tests
  - Action: Test the full task lifecycle from submission to completion, including error scenarios.
  - File Path: `/tests/e2e/`
