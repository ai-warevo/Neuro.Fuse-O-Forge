# 9. Operational Flow

## API to Worker Communication

**Task Creation Flow:**
1. API receives task request via `POST /tasks/`.
2. Validates input using Pydantic schemas.
3. Creates task record in SQLite with status `PENDING`.
4. Pushes task data to Redis stream `forge:tasks:{type}`.
5. Returns task_id to client.

**Worker Processing Flow:**
1. Worker consumes task from Redis stream using `XREADGROUP`.
2. Updates task status to `PROCESSING` in database.
3. Loads appropriate pipeline based on task type.
4. Processes task (generates audio/image/text).
5. Saves output to `/volumes/output/{type}/{date}/`.
6. Updates task status to `SUCCESS` and sets `output_path`.
7. Pushes result to `forge:results` Redis stream.
8. Acknowledges task in Redis (`XACK`).

## Database Management
**SQLite Migrations:**
* Run automatically at API startup.
* Create tables if they don't exist.
* Apply schema changes incrementally.
* Use Alembic or similar migration tool.

## Hot‑Swap Logic (Model Switching)
**Mechanism:**
* Configuration file (`backend/config.yaml`) defines model aliases.
* Pipelines load models by alias, not direct paths.
* Changing alias in config switches underlying model.

**Process:**
1. Worker loads config on startup and when model is needed.
2. Pipeline requests model by alias (e.g., "default-audio").
3. Config loader resolves alias to actual model path/name.
4. Model is loaded and used for processing.
5. After processing, `torch.cuda.empty_cache()` is called.

## Out‑of‑Memory Handling
**VRAM Management Strategy:**
* Each pipeline module implements memory management.
* After each task processing:
  * Unload model from GPU (if not in use).
  * Call `torch.cuda.empty_cache()`.
  * Monitor VRAM usage before loading new models.

**Fallback Mechanism:**
* If GPU is unavailable or OOM occurs:
  * Worker falls back to CPU mode.
  * Logs warning about GPU unavailability.
  * Continues processing on CPU.

**Success Criteria:**
* Tasks flow smoothly from API to worker and back.
* Database schema evolves with migrations.
* Model switching works without restarting services.
* OOM situations are handled gracefully with fallbacks.
