import pytest
from backend.api.main import app
from fastapi.testclient import TestClient
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

def test_create_task(client):
    response = client.post("/tasks/", json={"task_id": "1", "task_type": "generation"})
    assert response.status_code == 200
    assert response.json() == {"task_id": "1", "task_type": "generation"}

def test_get_task(client):
    client.post("/tasks/", json={"task_id": "2", "task_type": "segmentation"})
    response = client.get("/tasks/2")
    assert response.status_code == 200
    assert response.json() == {"task_id": "2", "task_type": "segmentation"}

def test_task_in_redis(client):
    client.post("/tasks/", json={"task_id": "3", "task_type": "classification"})
    # Assuming a function to check Redis is implemented in shared.utils
    from backend.shared.utils import task_exists_in_redis
    assert task_exists_in_redis("3") is True