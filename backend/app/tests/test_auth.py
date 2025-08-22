import os
import pytest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_key"
os.environ["USDA_API_KEY"] = "fake"

from app.main import create_app  # noqa: E402
from app.db.database import Base, engine  # noqa: E402


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_and_login():
    app = create_app()
    client = TestClient(app)

    r = client.post(
        "/auth/register",
        json={
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "password": "StrongPass123",
        },
    )
    assert r.status_code == 200
    user = r.json()
    assert user["email"] == "john@example.com"

    r = client.post(
        "/auth/login",
        data={"username": "john@example.com", "password": "StrongPass123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert r.status_code == 200
    assert r.json()["access_token"]

