# 2. Shared Layer (Config Loader & Pydantic Models)

## Config Loader (`backend/shared/config.py`)
**Purpose:** Load configuration from `backend/config.yaml` and provide singleton access.

**Implementation:**
* Use singleton pattern for global config access.
* Load YAML configuration on startup.
* Provide type hints for configuration properties.

**Success Criteria:**
* Configuration is loaded and accessible as a singleton.
* Changes to `config.yaml` are reflected after restart.

## Pydantic Models (`backend/shared/pydantic_models.py`)
**Purpose:** Define Pydantic schemas for tasks and configuration validation.

**Requirements:**
* All services must import these models.
* Include validation for all required fields.
* Support nested configuration structures.

**Key Schemas:**
* `TaskSchema` — for task creation and validation.
* `ConfigSchema` — for configuration validation.
* `ParamsSchema` — for pipeline parameters.

**Success Criteria:**
* Schemas are defined and used across services.
* Validation errors are properly handled.
* Schema changes are backward compatible.