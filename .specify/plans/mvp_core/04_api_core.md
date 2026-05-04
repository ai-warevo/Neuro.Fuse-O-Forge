# 4. API Core (FastAPI)

## Main Application (`backend/api/main.py`)
**Purpose:** Initialize FastAPI application and register routes.

**Implementation:**
* Create FastAPI instance with proper metadata.
* Add middleware (CORS, logging, etc.).
* Import and register routes from `routes/tasks.py`.
* Initialize database connection.
* Set up Redis client.

**Success Criteria:**
* API is initialized and routes are registered.
* Health check endpoint returns 200 OK.
* Documentation (Swagger) is accessible at `/docs`.

## Task Router (`backend/api/routes/tasks.py`)
**Endpoints:**
* `POST /tasks/` — create new task.
* `GET /tasks/{task_id}` — retrieve task status.
* `DELETE /tasks/{task_id}` — cancel task.

**Validation:**
* Request body validated using Pydantic schemas.
* Response models defined for all endpoints.
* Proper HTTP status codes returned.

**Success Criteria:**
* Routes are defined and validation works as expected.
* All endpoints return correct responses.
* Error cases are properly handled and documented.