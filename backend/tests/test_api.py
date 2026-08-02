from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["UP", "DEGRADED"]

def test_get_settings_endpoint():
    response = client.get("/api/settings")
    assert response.status_code == 200
    data = response.json()
    assert "gesture_sensitivity" in data

def test_control_iot_endpoint():
    response = client.post("/api/control/iot", json={"device": "light", "action": "ON"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["action"] == "ON"
