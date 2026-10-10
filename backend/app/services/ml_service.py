"""
AquaSafe AI - Machine Learning Prediction Service
Loads the trained Random Forest model and executes inference with confidence scoring.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from typing import Dict, Any, Tuple
from ..config import settings
from ..models.schemas import PredictionResult, WaterSampleInput
from .wqi_service import analyze_parameters

class MLService:
    def __init__(self):
        self.model = None
        self.metrics = {}
        self.load_model()

    def load_model(self):
        if os.path.exists(settings.MODEL_PATH):
            try:
                self.model = joblib.load(settings.MODEL_PATH)
                print(f"[+] Loaded ML model from {settings.MODEL_PATH}")
            except Exception as e:
                print(f"[-] Error loading model: {e}")
                self.model = None
        else:
            print(f"[-] Model file not found at {settings.MODEL_PATH}")

        if os.path.exists(settings.METRICS_PATH):
            try:
                with open(settings.METRICS_PATH, "r") as f:
                    self.metrics = json.load(f)
                print(f"[+] Loaded model metrics from {settings.METRICS_PATH}")
            except Exception as e:
                print(f"[-] Error loading model metrics: {e}")

    def predict(self, sample: WaterSampleInput) -> PredictionResult:
        sample_dict = {
            "ph": sample.ph,
            "Hardness": sample.hardness,
            "Solids": sample.solids,
            "Chloramines": sample.chloramines,
            "Sulfate": sample.sulfate,
            "Conductivity": sample.conductivity,
            "Organic_carbon": sample.organic_carbon,
            "Trihalomethanes": sample.trihalomethanes,
            "Turbidity": sample.turbidity
        }

        # Calculate WQI and WHO parameter deviations
        sample_lower = {k.lower(): v for k, v in sample_dict.items()}
        wqi_score, wqi_category, deviations, anomalies = analyze_parameters(sample_lower)

        # ML Model Inference
        feature_order = [
            'ph', 'Hardness', 'Solids', 'Chloramines', 'Sulfate',
            'Conductivity', 'Organic_carbon', 'Trihalomethanes', 'Turbidity'
        ]
        
        if self.model is not None:
            df_in = pd.DataFrame([[sample_dict[f] for f in feature_order]], columns=feature_order)
            prob_potable = float(self.model.predict_proba(df_in)[0][1])
            is_potable_bool = bool(prob_potable >= 0.50)
            potability_class = 1 if is_potable_bool else 0
        else:
            # Fallback heuristic if model binary is missing
            is_potable_bool = (wqi_score >= 65.0) and len(anomalies) == 0
            prob_potable = min(1.0, max(0.0, wqi_score / 100.0))
            potability_class = 1 if is_potable_bool else 0

        # Determine Risk Level Category
        if not is_potable_bool:
            if wqi_score < 40.0 or any(d.severity == 2 for d in deviations):
                risk_level = "Critical Health Hazard"
            elif wqi_score < 60.0:
                risk_level = "High Risk / Contaminated"
            else:
                risk_level = "Moderate Risk / Marginal"
        else:
            if wqi_score >= 85.0:
                risk_level = "Low Risk / Safe"
            else:
                risk_level = "Acceptable / Routine Monitoring"

        return PredictionResult(
            potability=potability_class,
            is_potable=is_potable_bool,
            potability_probability=round(prob_potable, 4),
            risk_level=risk_level,
            wqi_score=wqi_score,
            wqi_category=wqi_category,
            parameter_deviations=deviations,
            key_anomalies=anomalies
        )

    def get_model_info(self) -> Dict[str, Any]:
        return {
            "status": "Loaded" if self.model is not None else "Not Loaded",
            "model_path": settings.MODEL_PATH,
            "metrics": self.metrics
        }

ml_service = MLService()
