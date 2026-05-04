# Neuro.Fuse-O-Forge MVP Core Overview

**Purpose:** This file serves as the central navigation hub for the entire project specification. It directs you to the relevant files for each component and provides a high‑level understanding of the system architecture.


## High‑Level Architecture


### System Components
1. **API Service** (`/backend/api/`):
   * Receives task requests via FastAPI.
   * Stores tasks in SQLite database.
   * Pushes tasks to Redis streams.
   * Listens for results from workers.
   * File: [`mvp_core/04_api_core.md`](mvp_core/04_api_core.md).

2. **Worker Service** (`/backend/worker/`):
   * Consumes tasks from Redis streams.
   * Processes tasks using appropriate pipelines (Audio, Image, Text).
   * Saves outputs to `/volumes/output/`.
   * Updates task status in database.
   * File: [`mvp_core/05_worker_logic.md`](mvp_core/05_worker_logic.md).

3. **Shared Components** (`/backend/shared/`):
   * Configuration loader (singleton pattern).
   * Pydantic schemas for data validation.
   * File: [`mvp_core/02_shared_layer.md`](mvp_core/02_shared_layer.md).

4. **Data Storage**:
   * **SQLite**: Task status tracking and metadata.
   * **Redis**: Task queueing and result communication.
   * **Volumes**: Persistent storage for models and outputs.
   * Files: [`mvp_core/03_data_layer.md`](mvp_core/03_data_layer.md), [`mvp_core/11_tooling.md`](mvp_core/11_tooling.md).

5. **Frontend** (`/frontend/`):
   * User interface for task management.
   * Real‑time updates via API.
   * Files: [`mvp_core/01_directory_structure.md`](mvp_core/01_directory_structure.md), [`mvp_core/13_front.md`](mvp_core/13_front.md).

## Key Features

* **Task Lifecycle Management**: PENDING → PROCESSING → SUCCESS/ERROR/TIMEOUT.
* **Reliable Task Delivery**: Transactional outbox pattern with Redis Streams.
* **Idempotent Processing**: File‑based completion checks.
* **Multi‑Pipeline Support**: Dynamic model loading based on `FORGE_TYPE`.
* **Hot‑Swap Logic**: Model switching via aliases in `config.yaml`.
* **OOM Handling**: VRAM management with `torch.cuda.empty_cache()`.
* **Zombie Task Detection**: Timeout watchdog for stuck tasks.

## Quick Reference: File Purpose Summary

| File | Purpose |
|------|---------|
| [`mvp_core/01_directory_structure.md`](mvp_core/01_directory_structure.md) | Project directory layout and organization. |
| [`mvp_core/02_shared_layer.md`](mvp_core/02_shared_layer.md) | Shared configuration and data models. |
| [`mvp_core/03_data_layer.md`](mvp_core/03_data_layer.md) | Database models and services. |
| [`mvp_core/04_api_core.md`](mvp_core/04_api_core.md) | FastAPI implementation and routing. |
| [`mvp_core/05_worker_logic.md`](mvp_core/05_worker_logic.md) | Worker processing and pipeline management. |
| [`mvp_core/06_bootstrap.md`](mvp_core/06_bootstrap.md) | System initialization procedures. |
| [`mvp_core/07_result_listener.md`](mvp_core/07_result_listener.md) | Result processing and event handling. |
| [`mvp_core/08_zombie_detection.md`](mvp_core/08_zombie_detection.md) | Task timeout monitoring. |
| [`mvp_core/09_operational_flow.md`](mvp_core/09_operational_flow.md) | Communication patterns between components. |
| [`mvp_core/10_dependencies.md`](mvp_core/10_dependencies.md) | Shared dependencies and configuration. |
| [`mvp_core/11_tooling.md`](mvp_core/11_tooling.md) | Development tools and environment setup. |
| [`mvp_core/12_validation.md`](mvp_core/12_validation.md) | Quality assurance and testing checkpoints. |
| [`mvp_core/13_front.md`](mvp_core/13_front.md) | Frontend setup, state management with Zustand, WebSocket integration, and UI component development. |

---

**Note:** This file should be kept up‑to‑date as the project evolves. When adding new components or modifying existing ones, ensure the navigation table and references are updated accordingly.

For detailed implementation steps, refer to the specific files linked above.
