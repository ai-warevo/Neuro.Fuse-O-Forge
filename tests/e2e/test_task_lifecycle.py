import pytest
from fastapi.testclient import TestClient
from backend.api.main import app
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.shared.database import Base

# In-memory SQLite for testing
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="function")
def client():
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

def test_task_lifecycle(client):
    # Create task
    response = client.post("/tasks/", json={"task_id": "10", "task_type": "generation"})
    assert response.status_code == 200
    assert response.json() == {"task_id": "10", "task_type": "generation"}

    # Check task in Redis (assuming a function to check Redis is implemented in shared.utils)
    from backend.shared.utils import task_exists_in_redis
    assert task_exists_in_redis("10") is True

    # Simulate task completion by adding a log entry (for example purposes)
    response = client.post("/logs/", json={"task_id": "10", "message": "Task completed"})
    assert response.status_code == 200

    # Get task logs
    response = client.get("/logs/10")
    assert response.status_code == 200
    assert "Task completed" in response.json()

    # Check task status (assuming a function to check task status is implemented in shared.utils)
    from backend.shared.utils import get_task_status
    assert get_task_status("10") == "completed"

def test_error_scenario(client):
    # Attempt to create a task with invalid data
    response = client.post("/tasks/", json={"task_id": "11", "task_type": "invalid"})
    assert response.status_code == 422

    # Check that the invalid task is not in Redis
    from backend.shared.utils import task_exists_in_redis
    assert task_exists_in_redis("11") is False

    # Attempt to get logs for a non-existent task
    response = client.get("/logs/99")
    assert response.status_code == 404