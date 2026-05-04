# 3. Data Layer (Database/Schemas)

## SQLAlchemy Model (`backend/api/models/task.py`)
**Purpose:** Define the SQLAlchemy model for task management in SQLite.

**Fields:**
* `task_id` (UUID) — unique identifier.
* `status` (Enum) — PENDING, PROCESSING, SUCCESS, ERROR, TIMEOUT.
* `created_at` (DateTime) — task creation timestamp.
* `updated_at` (DateTime) — last update timestamp.
* `type` (String) — FORGE_TYPE (SOUND, IMAGE, TEXT, etc.).
* `output_path` (String) — path to generated output.
* `error_message` (Text) — error details if applicable.

**Success Criteria:**
* Model is correctly defined and interacts with the database.
* Migrations work properly.
* Indexes are created for frequently queried fields.

## Database Service (`backend/api/services/database.py`)
**Purpose:** Set up asynchronous SQLAlchemy connection and handle migrations.

**Features:**
* Async SQLAlchemy session management.
* Automatic migration on API startup.
* Connection pooling.
* Error handling for database operations.

**Success Criteria:**
* Database is connected and migrated on startup.
* Transactions are properly handled.
* Connection errors are gracefully managed.