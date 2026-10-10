import pytest
from backend.app.models.schemas import WaterSampleInput
from backend.app.services.ml_service import ml_service
from backend.app.services.wqi_service import analyze_parameters

def test_ml_service_model_loaded():
    assert ml_service.model is not None
    info = ml_service.get_model_info()
    assert info["status"] == "Loaded"
    assert "accuracy" in info["metrics"]["metrics"]

def test_wqi_calculation_safe_range():
    sample = {
        "ph": 7.2,
        "hardness": 150.0,
        "solids": 400.0,
        "chloramines": 1.2,
        "sulfate": 120.0,
        "conductivity": 280.0,
        "organic_carbon": 3.0,
        "trihalomethanes": 20.0,
        "turbidity": 1.1
    }
    wqi, category, deviations, anomalies = analyze_parameters(sample)
    assert wqi >= 80.0
    assert len(anomalies) == 0
    assert all(d.status == "Safe" for d in deviations)

def test_wqi_calculation_dangerous_water():
    sample = {
        "ph": 3.5, # severe acid
        "hardness": 450.0,
        "solids": 35000.0,
        "chloramines": 8.0,
        "sulfate": 480.0,
        "conductivity": 950.0,
        "organic_carbon": 28.0,
        "trihalomethanes": 130.0,
        "turbidity": 12.0
    }
    wqi, category, deviations, anomalies = analyze_parameters(sample)
    assert wqi < 30.0
    assert len(anomalies) >= 3
    assert any(d.severity == 2 for d in deviations)

def test_ml_inference_potability():
    sample_safe = WaterSampleInput(
        ph=7.2,
        hardness=180.0,
        solids=12000.0,
        chloramines=2.0,
        sulfate=200.0,
        conductivity=350.0,
        organic_carbon=6.0,
        trihalomethanes=30.0,
        turbidity=1.5
    )
    res_safe = ml_service.predict(sample_safe)
    assert res_safe.is_potable is True
    assert res_safe.potability_probability > 0.50

    sample_toxic = WaterSampleInput(
        ph=4.5,
        hardness=320.0,
        solids=40000.0,
        chloramines=7.5,
        sulfate=450.0,
        conductivity=780.0,
        organic_carbon=24.0,
        trihalomethanes=120.0,
        turbidity=7.8
    )
    res_toxic = ml_service.predict(sample_toxic)
    assert res_toxic.is_potable is False
    assert res_toxic.potability_probability < 0.50
