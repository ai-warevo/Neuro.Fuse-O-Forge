# 10. Internal Dependencies

## Shared Pydantic Models
**Location:** `/backend/shared/pydantic_models.py`

**Components Sharing:**
* API Service (`/backend/api/`).
* Worker Service (`/backend/worker/`).

**Benefits:**
* Ensures data consistency across services.
* Prevents schema duplication.
* Enables DRY (Don't Repeat Yourself) principle.
* Simplifies schema updates (change in one place).

**Usage:**
* Both services import models from shared location.
* Validation uses the same schemas.
* Serialization/deserialization uses identical structures.

## Global Configuration Sharing
**Location:** `backend/config.yaml`

**Access Mechanism:**
* Worker services use `config_loader.py` (`/backend/worker/utils/config_loader.py`).
* Loader implements singleton pattern.
* Provides consistent settings across components.

**Shared Configuration Items:**
* Redis connection details.
* Database connection string.
* Model aliases and paths.
* Processing timeouts (`max_gen_time`).
* VRAM management policies.
* Pipeline‑specific parameters.

## Dependency Management Strategy
**Python Packages:**
* Separate `requirements.txt` for API and Worker services.
* Pin versions for stability.
* Regular updates with testing.

**Frontend Dependencies:**
* Managed via `package.json`.
* Separated dev and production dependencies.

**Docker Integration:**
* Dependencies installed during Docker image build.
* Cached layers for faster rebuilds.
* Version pinning prevents unexpected changes.

**Success Criteria:**
* All components use consistent configuration.
* Schema changes propagate to all services.
* Dependency conflicts are minimized.
* Updates are manageable and predictable.
