# MVP Core Summary

## Architecture Overview
* **API Service**: Receives tasks, stores in DB, sends to Redis.
* **Redis**: Task queueing with Streams and consumer groups.
* **Worker Services**: Process tasks using appropriate pipelines (Audiocraft, etc.).
* **SQLite**: Task status tracking.
* **Docker Compose**: Orchestration of all services.

## Key Features Implemented
* Task lifecycle management (PENDING → PROCESSING → SUCCESS/ERROR).
* Reliable task delivery (transactional outbox/inbox).
* Idempotent processing (file‑based completion checks).
* Multi‑pipeline support via `FORGE_TYPE`.
* Dockerized deployment with GPU support.

## Navigation: Where to Find What
Use this section to quickly locate the relevant file for each component:

### Core Components
* **Overview & Purpose** → [`01_overview.md`](01_overview.md)
* **Key Components List** → [`02_key_components.md`](02_key_components.md)

### Configuration
* **Redis Settings** → [`03_redis_config.md`](03_redis_config.md)
* **Docker Services & Orchestration** → [`04_docker_compose.md`](04_docker_compose.md)

### Data Models & Validation
* **Pydantic Schemas & Validation Logic** → [`05_pydantic_schemas.md`](05_pydantic_schemas.md)

### Processing Logic
* **Worker Consumer Loop (task consumption)** → [`06_worker_loop.md`](06_worker_loop.md)
* **Universal Worker Strategy (pipeline loading)** → [`07_universal_worker.md`](07_universal_worker.md)
* **Task State Machine & Status Tracking** → [`08_state_machine.md`](08_state_machine.md)
* **I/O Operations & File Handling** → [`09_io_operations.md`](09_io_operations.md)
* **Reliability Layer (transactional patterns, idempotency)** → [`10_reliability.md`](10_reliability.md)
* **Bootstrap & Initialization (Redis groups, DB setup)** → [`11_bootstrap.md`](11_bootstrap.md)

## Next Steps
1. Implement full pipeline loading for all `FORGE_TYPE`s.
2. Add monitoring and logging.
3. Extend API to support all task types (IMAGE, TEXT, UI).
4. Add rate limiting and authentication.
5. Optimize file storage with cleanup policies.

---

## Quick Reference: File Purpose Summary

| File | Purpose |
|------|---------|
| [`01_overview.md`](01_overview.md) | Project purpose, scope, and success criteria. |
| [`02_key_components.md`](02_key_components.md) | High‑level list of components and responsibilities. |
| [`03_redis_config.md`](03_redis_config.md) | Redis host, port, timeout, and path correction rules. |
| [`04_docker_compose.md`](04_docker_compose.md) | Full `docker-compose.yml` with all services and GPU support. |
| [`05_pydantic_schemas.md`](05_pydantic_schemas.md) | Pydantic models for task payloads and validation logic. |
| [`06_worker_loop.md`](06_worker_loop.md) | Worker loop that consumes tasks from Redis Streams. |
| [`07_universal_worker.md`](07_universal_worker.md) | Logic for loading different ML pipelines based on `FORGE_TYPE`. |
| [`08_state_machine.md`](08_state_machine.md) | Task status enum, SQLAlchemy model, and status update functions. |
| [`09_io_operations.md`](09_io_operations.md) | Functions for saving audio files and checking output paths. |
| [`10_reliability.md`](10_reliability.md) | Transactional outbox/inbox, idempotency, and error handling. |
| [`11_bootstrap.md`](11_bootstrap.md) | System bootstrap: Redis consumer group setup and DB initialization. |
