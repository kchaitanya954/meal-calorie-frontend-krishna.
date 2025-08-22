import os
import pytest
from fastapi.testclient import TestClient

os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"
os.environ["SECRET_KEY"] = "test_key"
os.environ["USDA_API_KEY"] = "fake"

from app.main import create_app  # noqa: E402


def test_invalid_servings():
    app = create_app()
    client = TestClient(app)

    r = client.post("/get-calories", json={"dish_name": "macaroni and cheese", "servings": 0})
    assert r.status_code == 400


@pytest.mark.skip("Integration test - requires real USDA API key")
def test_calories_live():
    app = create_app()
    client = TestClient(app)
    r = client.post("/get-calories", json={"dish_name": "grilled salmon", "servings": 2})
    assert r.status_code in (200, 404, 502)

