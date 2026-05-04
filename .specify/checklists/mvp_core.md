# MVP Core Implementation Checklist

## 1. Backend Shared Directory (`/backend/shared/`)

- [ ] **Config Loader (`config.py`)**
  - [ ] Implement singleton pattern for global config access
  - [ ] Load configuration from `backend/config.yaml`
  - [ ] Provide type hints for configuration properties
  - [ ] Ensure config reloads on restart
  - **Success Criteria:** Configuration is loaded and accessible as a singleton

- [ ] **Constants (`constants.py`)**
  - [ ] Define shared constants and configuration
  - [ ] Set task statuses (PENDING, PROCESSING, SUCCESS, ERROR, TIMEOUT)
  - [ ] Configure default timeouts
  - **Success Criteria:** Shared constants are defined and accessible across services

- [ ] **Pydantic Models (`pydantic_models.py`)**
  - [ ] Define `TaskSchema` for task creation and validation
  - [ ] Define `ConfigSchema` for configuration validation
  - [ ] Define `ParamsSchema` for pipeline parameters
  - [ ] Ensure all services import these models
  - **Success Criteria:** Schemas are defined and used across services, validation errors are properly handled

- [ ] **Utility Functions (`utils.py`)**
  - [ ] Implement shared utility functions
  - [ ] Add file path helpers
  - [ ] Include data formatting utilities
  - **Success Criteria:** Shared utility functions are implemented and reusable

## 3. Backend API Directory (`/backend/api/`)

- [ ] **FastAPI Application Entry Point (`main.py`)**
  - [ ] Initialize FastAPI instance with proper metadata
  - [ ] Add CORS and logging middleware
  - [ ] Register routes from `routes/tasks.py`
  - [ ] Initialize database connection
  - [ ] Set up Redis client
  - **Success Criteria:** API is initialized, routes registered, Swagger docs available at `/docs`

- [ ] **SQLAlchemy Model for Tasks (`models/task.py`)**
  - [ ] Define fields: `task_id`, `status`, `created_at`, `updated_at`, `type`, `output_path`, `error_message`
  - [ ] Create indexes for frequently queried fields
  - **Success Criteria:** Model is correctly defined, interacts with database, migrations work properly

- [ ] **Pydantic Schema for Configuration (`schemas/config.py`)**
  - [ ] Validate configuration structure
  - [ ] Include type hints
  - **Success Criteria:** Schema is defined and used for config validation

- [ ] **Pydantic Schema for Tasks (`schemas/tasks.py`)**
  - [ ] Define task creation schema
  - [ ] Include validation for required fields
  - **Success Criteria:** Schema is defined and used for task validation

- [ ] **Database Service (`services/database.py`)**
  - [ ] Set up async SQLAlchemy session management
  - [ ] Handle automatic migrations on startup
  - [ ] Implement connection pooling
  - [ ] Add error handling for database operations
  - **Success Criteria:** Database connected and migrated on startup, transactions properly handled

- [ ] **Redis Producer (`services/redis.py`)**
  - [ ] Connect to Redis server
  - [ ] Push tasks to `forge:tasks:{type}` streams
  - [ ] Publish results to `forge:results` stream
  - **Success Criteria:** Redis producer logic is implemented and reliable

## 4. Backend Worker Directory (`/backend/worker/`)

- [ ] **Universal Worker Entry Point (`main.py`)**
  - [ ] Connect to Redis and join consumer group
  - [ ] Read tasks from stream using `XREADGROUP`
  - [ ] Load appropriate pipeline based on task type
  - [ ] Update task status in database
  - [ ] Acknowledge task in Redis (`XACK`)
  - **Success Criteria:** Worker processes tasks from Redis, selects correct pipeline, saves outputs properly

- [ ] **Pipeline Modules (`pipelines/audio.py`, `pipelines/image.py`, `pipelines/text.py`)**
  - [ ] **Audio Pipeline:** Use Audiocraft, handle audio params, save `.wav` files
  - [ ] **Image Pipeline:** Use Diffusers, support various models, save `.png/.jpg` files
  - [ ] **Text Pipeline:** Use Transformers, handle text params, save `.txt` files
  - **Success Criteria:** Pipelines defined, use models correctly, VRAM managed properly

## 5. Frontend Directory (`/frontend/`)

- [ ] **Next.js Application Setup with Bun Runtime**
  - [ ] Run `npx create-next-app@latest --typescript`
  - [ ] Switch runtime to Bun
  - **Success Criteria:** Fresh Next.js project initialized and configured with Bun

- [ ] **Tailwind CSS Configuration (Dark Theme)**
  - [ ] Install Tailwind CSS: `npm install -D tailwindcss postcss autoprefixer`
  - [ ] Initialize Tailwind: `npx tailwindcss init`
  - [ ] Configure dark mode in `tailwind.config.js`
  - [ ] Create base styles in `/styles/globals.css`
  - **Success Criteria:** Tailwind configured with dark "Forge" theme

- [ ] **Zustand Store for Task Lifecycle (`useForgeStore`)**
  - [ ] Install Zustand: `npm install zustand`
  - [ ] Create `/app/store/forgeStore.ts` with slices for task ID, status, logs
  - **Success Criteria:** `useForgeStore` manages task state effectively

- [ ] **Zustand Store for Global Monitoring (`useStatsStore`)**
  - [ ] Create store for GPU load and worker availability
  - [ ] Either add to `forgeStore.ts` or create `statsStore.ts`
  - **Success Criteria:** `useStatsStore` monitors global statistics

- [ ] **WebSocket Service Hook (`useWebSocket.ts`)**
  - [ ] Create `/app/hooks/useWebSocket.ts`
  - [ ] Establish connection to `/api/ws/task/{task_id}`
  - [ ] Route `log`, `progress`, `success` events to Zustand stores
  - **Success Criteria:** WebSocket service implemented, connected to API, events routed correctly

- [ ] **UI Components**
  - [ ] **Forge Terminal (`/app/components/ForgeTerminal.tsx`)**: Display live logs in CLI style
  - [ ] **Control Panel (`/app/components/ControlPanel.tsx`)**: Dynamic forms for AudioGen parameters
  - [ ] **Stats Dashboard (`/app/components/StatsDashboard.tsx`)**: Visual widgets for GPU/VRAM monitoring
  - **Success Criteria:** All UI components implemented, styled with Tailwind, connected to stores

## 6. Hardware & Environment

- [ ] **NVIDIA/CUDA Availability Check**
  - [ ] Verify GPU availability: `nvidia-smi`
  - [ ] Check CUDA version compatibility
  - [ ] Test PyTorch GPU access: `torch.cuda.is_available()`
  - **Success Criteria:** NVIDIA GPU with CUDA available, accessible to PyTorch

- [ ] **Docker Environment Setup**
  - [ ] Verify Docker installation
  - [ ] Check Docker Compose version
  - [ ] Test volume mounting
  - **Success Criteria:** Docker environment ready for service orchestration

## 7. Validation & Testing

- [ ] **Unit Tests**
  - [ ] Write tests for shared models and utils
  - [ ] Cover API endpoints and database models
  - [ ] Test worker pipeline modules
  - **Success Criteria:** ≥ 80 % code coverage, all tests pass

- [ ] **Integration Tests**
  - [ ] Test API ↔ Redis ↔ Worker communication
  - [ ] Verify task lifecycle (PENDING → PROCESSING → SUCCESS/ERROR)
  - **Success Criteria:** Services interact correctly, data flows properly

- [ ] **End‑to‑End Tests**
  - [ ] Submit tasks via frontend
  - [ ] Verify processing and output generation
  - [ ] Test error scenarios and recovery
  - **Success Criteria:** Full task lifecycle works, error handling functional

