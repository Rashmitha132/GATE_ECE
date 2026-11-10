from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert "GSSS Institute of Engineering and Technology for Women" in response.json()["institution"]

def test_login_student():
    response = client.post("/api/auth/login", json={
        "email": "student@gsssietw.ac.in",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["full_name"] == "ECE Student"

def test_get_subjects():
    response = client.get("/api/subjects")
    assert response.status_code == 200
    subjects = response.json()
    assert len(subjects) >= 8
    subject_names = [s["name"] for s in subjects]
    assert "Network Theory" in subject_names
    assert "Analog Circuits" in subject_names
