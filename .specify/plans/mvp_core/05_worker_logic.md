# 5. Universal Worker Logic (Worker)

## Worker Entry Point (`backend/worker/main.py`)
**Purpose:** Process tasks from Redis and manage pipeline execution.

**Workflow:**
1. Connect to Redis and join consumer group.
2. Read tasks from stream using `XREADGROUP`.
3. Load appropriate pipeline based on task type.
4. Process task and save output.
5. Update task status in database.
6. Acknowledge task in Redis (`XACK`).

**Configuration:**
* Uses `config_loader.py` to fetch global settings.
* Reads `max_gen_time` for timeout handling.
* Applies VRAM management policies.

**Success Criteria:**
* Worker processes tasks from Redis successfully.
* Correct pipeline is selected for each task type.
* Output files are saved in proper locations.

## Pipeline Modules (`backend/worker/pipelines/`)
**Audio Pipeline (`audio.py`):**
* Uses Audiocraft for audio generation.
* Handles audio-specific parameters.
* Saves `.wav` files.

**Image Pipeline (`image.py`):**
* Uses Diffusers for image generation.
* Supports various image models.
* Saves `.png` or `.jpg` files.

**Text Pipeline (`text.py`):**
* Uses Transformers for text generation.
* Handles text-specific parameters.
* Saves `.txt` files.

**Success Criteria:**
* Pipelines are defined and use models correctly.
* Model switching works via aliases.
* VRAM is properly managed.