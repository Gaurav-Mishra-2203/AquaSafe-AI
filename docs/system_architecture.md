# System Architecture & Technical Specification: AquaSafe AI

**Project:** AquaSafe AI (Intelligent Community Water Potability Assessment & Remediation System)  
**UN SDGs:** SDG 6 (Clean Water and Sanitation) & SDG 3 (Good Health and Well-Being)  
**Author:** IBM SkillsBuild Internship Project Team  
**Date:** October 2026  

---

## 1. High-Level Architecture Overview

AquaSafe AI utilizes a decoupled, resilient client-server architecture engineered to function in both high-bandwidth municipal headquarters and intermittent-connectivity rural field environments.

```
+-----------------------------------------------------------------------------------------+
|                                    USER INTERFACES                                      |
|  +---------------------------+  +---------------------------+  +---------------------+  |
|  | Water Diagnostic Tester   |  | Executive Dashboard       |  | Batch CSV Screener  |  |
|  | (Sliders / Presets)       |  | (WQI Telemetry & Maps)    |  | (High-Throughput)   |  |
|  +---------------------------+  +---------------------------+  +---------------------+  |
|                                React 18 + TypeScript + Vite                             |
+--------------------------------------------+--------------------------------------------+
                                             | REST / JSON (HTTP)
                                             v
+-----------------------------------------------------------------------------------------+
|                               FASTAPI APPLICATION BACKEND                               |
|                                                                                         |
|  +-------------------+  +--------------------+  +------------------+  +---------------+ |
|  | /predict Router   |  | /dashboard Router  |  | /batch Router    |  | /metrics      | |
|  +-------------------+  +--------------------+  +------------------+  +---------------+ |
|                                                                                         |
|  +---------------------------------------+  +-----------------------------------------+ |
|  |      WQI CALCULATION ENGINE           |  |      MACHINE LEARNING SERVICE           | |
|  |  - Weighted Arithmetic Method (WA-WQI)|  |  - Random Forest Classifier (150 trees) | |
|  |  - Parameter deviations against WHO   |  |  - Joblib Serialized Pipeline           | |
|  |  - 9 Physicochemical indicators       |  |  - Accuracy: 88.72%, ROC-AUC: 0.9430    | |
|  +---------------------------------------+  +-----------------------------------------+ |
|                                                                                         |
|  +------------------------------------------------------------------------------------+ |
|  |                           AI REMEDIATION SERVICE LAYER                             | |
|  |                                                                                    | |
|  |    +-----------------------------+          +----------------------------------+   | |
|  |    | Live Generative AI Adapter  |          | WHO Deterministic Expert Engine  |   | |
|  |    | (Gemini / OpenAI / Groq)    |          | (Offline / No API Key Fallback)  |   | |
|  |    +-----------------------------+          +----------------------------------+   | |
|  +------------------------------------------------------------------------------------+ |
|                                                                                         |
|  +------------------------------------------------------------------------------------+ |
|  |                             PERSISTENCE & DATA LAYER                               | |
|  |  - SQLite Database (`aquasafe.db`) with `assessments` and `stations` tables        | |
|  |  - Full JSON audit trail persistence & continuous telemetry logging                | |
|  +------------------------------------------------------------------------------------+ |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Component Specifications

### 2.1 Frontend Client (Presentation Layer)
- **Framework:** React 18 with TypeScript and Vite bundler.
- **Styling Architecture:** Custom modern CSS design system in `src/index.css` tailored with UN SDG 6 (#26BDE2) and SDG 3 (#4C9F38) visual tokens, glassmorphism cards, and high-contrast accessible typography (Plus Jakarta Sans).
- **Iconography:** Lucide React icons.
- **Key Modules:**
  - `LandingPage.tsx`: Mission overview, live validation KPIs, and problem illustration.
  - `TesterView.tsx`: Interactive 9-parameter slider workspace, 1-click preset scenarios, real-time WQI scorecard, and AI remediation plan renderer.
  - `DashboardView.tsx`: Aggregate metrics (Pass Rate %, Mean WQI, Critical Alerts), station telemetry cards, and assessment audit drawer.
  - `BatchView.tsx`: Municipal high-throughput CSV ingestion, demo dataset launcher, and filtered data export.
  - `MethodologyView.tsx`: Confusion matrix visualization, Gini feature importance rankings, and AI ethics statement.

### 2.2 FastAPI Backend (Application & Logic Layer)
- **Framework:** Python 3.14 with FastAPI and Uvicorn ASGI server.
- **Validation:** Pydantic v2 schemas (`WaterSampleInput`, `PredictionResult`, `RemediationPlan`).
- **Endpoints:**
  - `POST /api/predict`: End-to-end sample assessment, WQI calculation, and AI remediation plan generation.
  - `GET /api/dashboard`: Aggregated municipal telemetry and recent field audits.
  - `GET /api/stations`: Registered geographic monitoring stations with live health statuses.
  - `POST /api/batch/upload`: Multi-sample CSV classification and WQI enrichment.
  - `GET /api/batch/presets`: 5 representative benchmark scenarios (Pristine Tap, Acidic Well, Turbid Flood, High THM, Saline Borehole).
  - `GET /api/metrics`: Serialized Random Forest model parameters, confusion matrix, and feature importances.
  - `GET /api/health`: Real-time health check returning model status and active AI provider mode.

### 2.3 Machine Learning Pipeline (Inference Layer)
- **Model:** `RandomForestClassifier(n_estimators=150, max_depth=12, random_state=42)`
- **Preprocessing Pipeline:** `SimpleImputer(strategy='median')` followed by `StandardScaler()`.
- **Target:** Binary potability ($0 = \text{Non-Potable}, 1 = \text{Potable}$).
- **Inference Speed:** $< 12$ milliseconds per sample.
- **Serialization:** Saved to `backend/models/water_potability_model.joblib`.

### 2.4 Cognitive Remediation Layer (AI Engine)
- **Dual-Tier Strategy:**
  1. **Live Tier:** Calls Gemini 1.5 Flash, OpenAI GPT-4o-mini, or Groq Llama-3.1 via structured JSON schema when environment variables are supplied.
  2. **Deterministic Offline Tier:** Executes rule-based WHO Expert Heuristic Engine when external networks are unreachable or API keys are not supplied.
- **Zero Hallucination Guarantee:** The system explicitly states the provider in the UI (`is_live_ai` boolean flag), ensuring reviewers and operators know exactly where recommendations originate.

### 2.5 Data Persistence Layer (Database)
- **Engine:** SQLite 3 (zero external daemon dependency, highly portable).
- **Tables:**
  - `assessments`: Full record of every diagnostic execution, timestamp, 9 input parameters, potability probability, WQI score, urgency, and JSON payload.
  - `stations`: Regional monitoring stations (coordinates, source type, operational status, last tested WQI).

---

## 3. Data Flow Diagram

```
[Field Operator / Sensor Probe]
             |
             v
 [9 Physicochemical Inputs]
             |
             +---------------------------------------+
             |                                       |
             v                                       v
[WHO WA-WQI Calculator]                 [Random Forest Pipeline]
(Unit weights, sub-indices)             (Imputer -> Scaler -> RF)
             |                                       |
             v                                       v
     [WQI Score: 0-100]                      [Potability: 0 / 1]
     [Parameter Deviations]                  [Probability: 0.0 - 1.0]
             |                                       |
             +-------------------+-------------------+
                                 |
                                 v
                 [AI Remediation Service Layer]
              Check: GEMINI / OPENAI / GROQ Key Available?
                     /                         \
                   YES                          NO
                   /                             \
        [Live Generative LLM]          [WHO Heuristic Rule Matrix]
        (Structured JSON prompt)       (Chemical dosing & containment)
                   \                             /
                    +-------------+-------------+
                                  |
                                  v
                      [Comprehensive Response]
                      - Potability Verdict
                      - WQI Score & Compliance Scorecard
                      - Step-by-Step Remediation Actions
                      - Emergency Household Protocols
                                  |
                   +--------------+--------------+
                   |                             |
                   v                             v
           [SQLite Storage]             [React UI Dashboard]
         (Persistent Audit Log)        (Interactive Visual Report)
```
