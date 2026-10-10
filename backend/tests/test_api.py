import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["project"] == "AquaSafe AI"
    assert "SDG 6" in data["primary_sdg"]

def test_health_check_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["ml_model_loaded"] is True
    assert "database" in data

def test_metrics_endpoint():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "Loaded"
    assert "metrics" in data
    assert data["metrics"]["metrics"]["accuracy"] > 0.70
    assert "ph" in data["metrics"]["feature_importances"]

def test_dashboard_stats_endpoint():
    response = client.get("/api/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "total_samples_analyzed" in data
    assert data["total_samples_analyzed"] >= 1
    assert "average_wqi" in data
    assert "recent_assessments" in data

def test_stations_endpoint():
    response = client.get("/api/stations")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert "station_id" in data[0]

def test_presets_endpoint():
    response = client.get("/api/batch/presets")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5
    assert data[0]["name"] == "Pristine Municipal Tap Water"

def test_prediction_potable_workflow():
    payload = {
        "ph": 7.3,
        "hardness": 180.0,
        "solids": 13500.0,
        "chloramines": 2.2,
        "sulfate": 220.0,
        "conductivity": 370.0,
        "organic_carbon": 6.5,
        "trihalomethanes": 35.0,
        "turbidity": 1.8,
        "location_name": "Test Borehole Alpha",
        "source_type": "Borehole / Well"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "prediction" in data
    assert "remediation" in data
    assert data["prediction"]["is_potable"] is True
    assert data["prediction"]["wqi_score"] >= 70.0
    assert len(data["remediation"]["treatment_steps"]) >= 1

def test_prediction_contaminated_workflow():
    payload = {
        "ph": 4.8, # highly acidic
        "hardness": 290.0,
        "solids": 34000.0,
        "chloramines": 6.8,
        "sulfate": 420.0,
        "conductivity": 720.0,
        "organic_carbon": 22.0,
        "trihalomethanes": 110.0, # carcinogenic
        "turbidity": 8.5, # very turbid
        "location_name": "Test Contaminated Well",
        "source_type": "Borehole / Well"
    }
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["prediction"]["is_potable"] is False
    assert data["prediction"]["wqi_score"] < 50.0
    assert data["remediation"]["urgency"] in ("Urgent Intervention", "Immediate Boil/Halt Notice")
    assert len(data["remediation"]["emergency_household_actions"]) >= 1

def test_prediction_input_validation():
    # Test invalid pH (e.g. 19.0, valid is 0-14)
    invalid_payload = {
        "ph": 19.0,
        "hardness": 200.0,
        "solids": 10000.0,
        "chloramines": 2.0,
        "sulfate": 200.0,
        "conductivity": 300.0,
        "organic_carbon": 5.0,
        "trihalomethanes": 30.0,
        "turbidity": 2.0
    }
    response = client.post("/api/predict", json=invalid_payload)
    assert response.status_code == 422 # Pydantic validation error
