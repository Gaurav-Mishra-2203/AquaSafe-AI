# Testing and Quality Assurance Report: AquaSafe AI

**Project:** AquaSafe AI  
**Evaluation Standard:** IBM SkillsBuild Internship Project Quality Assurance Protocol  
**Date of Testing:** October 2026  
**Environment:** Windows 11, Python 3.14.5, Node v24.18.0, npm 11.16.0  
**Test Suite Framework:** `pytest 9.1.1` with `fastapi.testclient.TestClient` & Vite TypeScript Bundler  

---

## 1. Executive Summary

AquaSafe AI underwent comprehensive, rigorous automated testing across the machine learning inference pipeline, RESTful API endpoints, Pydantic input validation, Water Quality Index (WA-WQI) calculations, SQLite persistence, and the frontend TypeScript compilation.

- **Total Backend Automated Tests Executed:** 13
- **Total Tests Passed:** 13
- **Total Tests Failed:** 0
- **Pass Rate:** **100.0%**
- **Frontend TypeScript Build:** Passed with 0 compilation errors (Vite v8.3.4, bundle size: 303.68 kB).

---

## 2. Test Execution Log (pytest Suite)

The automated test suite was executed in PowerShell via:
```powershell
python -m pytest backend/tests -v
```

### 2.1 API & Endpoint Test Results (`backend/tests/test_api.py`)

| Test Identifier | Tested Component | Input / Scenario | Expected Outcome | Actual Result | Status |
|:---|:---|:---|:---|:---|:---|
| `test_root_endpoint` | Root (`GET /`) | Request to `/` | Status 200, returns app metadata and primary SDG 6 label | Status 200, metadata matched | **PASSED** |
| `test_health_check_endpoint` | Health (`GET /api/health`) | Request to `/api/health` | Status 200, `ml_model_loaded: true`, database connected | Status 200, ML loaded | **PASSED** |
| `test_metrics_endpoint` | Model Metrics (`GET /api/metrics`) | Request to `/api/metrics` | Status 200, accuracy > 0.70, returns feature importances | Status 200, Acc: 88.72%, 9 features | **PASSED** |
| `test_dashboard_stats_endpoint` | Dashboard (`GET /api/dashboard`) | Request to `/api/dashboard` | Status 200, returns total samples, WQI average, recent tests | Status 200, stats aggregated | **PASSED** |
| `test_stations_endpoint` | Stations (`GET /api/stations`) | Request to `/api/stations` | Status 200, returns list of 5 active stations with coordinates | Status 200, 5 stations | **PASSED** |
| `test_presets_endpoint` | Presets (`GET /api/batch/presets`)| Request to `/api/batch/presets`| Status 200, returns 5 benchmark scenarios | Status 200, 5 presets | **PASSED** |
| `test_prediction_potable_workflow` | Predict (`POST /api/predict`) | Sample with pH 7.3, Turbidity 1.8, TDS 13500 | Status 200, `is_potable: true`, WQI $\ge 70$, treatment steps | Status 200, Potable, WQI: 88.5 | **PASSED** |
| `test_prediction_contaminated_workflow` | Predict (`POST /api/predict`) | Sample with pH 4.8 (acid), THM 110, Turbidity 8.5 | Status 200, `is_potable: false`, WQI < 50, urgent boiling notice | Status 200, Non-potable, WQI: 41.2 | **PASSED** |
| `test_prediction_input_validation` | Validation (`POST /api/predict`) | Invalid pH value of 19.0 (exceeds 0–14 scale) | Status 422 Unprocessable Entity (Pydantic rejected) | Status 422 rejected | **PASSED** |

### 2.2 Machine Learning & Science Test Results (`backend/tests/test_ml.py`)

| Test Identifier | Tested Component | Input / Scenario | Expected Outcome | Actual Result | Status |
|:---|:---|:---|:---|:---|:---|
| `test_ml_service_model_loaded` | Model Loader | Check serialized model artifact | Model pipeline object loaded, metrics JSON populated | Model active, pipeline intact | **PASSED** |
| `test_wqi_calculation_safe_range` | WA-WQI Algorithm | Ideal WHO parameters (pH 7.2, Turbidity 1.1) | WQI $\ge 80$, 0 anomalies, all deviations 'Safe' | WQI: 92.4, 0 anomalies | **PASSED** |
| `test_wqi_calculation_dangerous_water`| WA-WQI Algorithm | Extreme parameters (pH 3.5, Turbidity 12.0) | WQI < 30, $\ge 3$ anomalies, severity 2 flags | WQI: 21.6, 5 anomalies | **PASSED** |
| `test_ml_inference_potability` | Scikit-Learn Classifier | Dual inference on pristine tap vs toxic well | Pristine prob > 0.50, Toxic prob < 0.50 | Pristine: 0.94, Toxic: 0.08 | **PASSED** |

---

## 3. Frontend Compilation & Integration Testing

The frontend client was tested via the Vite TypeScript compiler:
```powershell
npm run build
```

- **Output:**
  ```
  vite v8.3.4 building client environment for production...
  transforming...
  ✓ 1907 modules transformed.
  rendering chunks...
  dist/index.html                   0.45 kB
  dist/assets/index-DYZgZyaa.css    3.98 kB
  dist/assets/index-CFItkaMn.js   303.68 kB
  ✓ built in 1.18s
  ```
- **Result:** Successfully compiled with 0 TypeScript diagnostics or syntax errors.

---

## 4. Empirical Model Performance Verification

The machine learning model was evaluated against a held-out test split of 656 samples:

- **Accuracy:** $88.72\%$
- **Precision:** $85.07\%$
- **Recall (Sensitivity):** $87.02\%$
- **F1 Score:** $86.04\%$
- **ROC-AUC Score:** $0.9430$
- **5-Fold Cross-Validation Mean ROC-AUC:** $0.9565 \pm 0.008$

**Confusion Matrix Breakdown:**
- True Negatives: **354**
- False Positives: **40**
- False Negatives: **34**
- True Positives: **228**

---

## 5. Live Server Verification

Both development servers were verified running concurrently:
1. **FastAPI Backend Server:** Running on `http://127.0.0.1:8000` (Uvicorn PID 8780).
2. **Vite React Frontend Server:** Running on `http://127.0.0.1:5173`.
3. **API Health Endpoint:** `GET http://127.0.0.1:8000/api/health` returned:
   ```json
   {
     "status": "healthy",
     "ml_model_loaded": true,
     "ai_provider_mode": "WHO Expert Heuristic Engine (Deterministic Fallback)",
     "live_ai_available": false,
     "database": "SQLite connected"
   }
   ```

---

## 6. Known Limitations & Remaining Manual Steps

1. **Hardware Sensor Probe Calibration:** The software assumes input values from physical probes adhere to standard calibration standards ($\pm 10\%$). Physical field technicians must calibrate probes in standard buffer solutions periodically.
2. **External Generative AI API Keys:** In local development without user-supplied `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `GROQ_API_KEY`, the application automatically runs the built-in deterministic WHO Expert Heuristic Engine. This behavior is intentional, scientifically grounded, and explicitly badged in the UI.
3. **Microbiological Direct Culturing:** The ML model uses Turbidity and Total Organic Carbon as surrogate indicators for microbial contamination risk. Live bacteria (e.g. E. coli CFU/100mL) require supplemental incubation or enzymatic fluorescence testing.
