# AquaSafe AI: Intelligent Community Water Potability & Remediation System

> **Democratizing WHO-grade water potability diagnostics and AI-driven community remediation for global water security.**

[![UN SDG 6: Clean Water and Sanitation](https://img.shields.io/badge/UN%20SDG-6%3A%20Clean%20Water-00A8E8.svg)](https://sdgs.un.org/goals/goal6)
[![UN SDG 3: Good Health and Well-Being](https://img.shields.io/badge/UN%20SDG-3%3A%20Good%20Health-4C9F38.svg)](https://sdgs.un.org/goals/goal3)
[![Model Accuracy](https://img.shields.io/badge/ML%20Accuracy-88.72%25-brightgreen.svg)]()
[![ROC-AUC](https://img.shields.io/badge/ROC--AUC-0.9430-blue.svg)]()
[![Tests](https://img.shields.io/badge/Tests-13%2F13%20Passed-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-gray.svg)]()

---

## 1. Project Overview

AquaSafe AI is an end-to-end, full-stack artificial intelligence application developed for the **IBM SkillsBuild Internship**. It tackles the acute global challenge of inaccessible drinking water diagnostics, which leaves over **2.2 billion people** without safely managed drinking water and causes over **505,000 diarrheal deaths annually**.

By replacing slow 72-hour laboratory testing with a calibrated 9-parameter **Random Forest Machine Learning model** and a **dual-tier AI engineering remediation engine**, AquaSafe AI classifies water potability, calculates the World Health Organization (WHO) Weighted Arithmetic Water Quality Index (WA-WQI), and generates localized, step-by-step chemical and physical treatment plans in under **80 milliseconds**.

### UN Sustainable Development Goals (SDG) Alignment:
- **Primary Goal — SDG 6 (Clean Water and Sanitation):**
  - **Target 6.1:** Universal and equitable access to safe and affordable drinking water by 2030.
  - **Target 6.3:** Halving untreated wastewater and eliminating hazardous chemical pollution.
  - **Target 6.b:** Empowering local communities in decentralized water management.
- **Secondary Goal — SDG 3 (Good Health and Well-Being):**
  - **Target 3.9:** Substantially reducing illness and mortality from hazardous waterborne chemicals and microbial pathogens.

---

## 2. Key Features

1. **Interactive Water Diagnostic Workspace:**
   - Real-time sliders for 9 physicochemical parameters with highlighted WHO safe boundaries:
     - pH (6.5 – 8.5)
     - Hardness ($\le 300$ mg/L)
     - Solids / TDS ($\le 1,000$ ppm)
     - Chloramines ($\le 4.0$ ppm)
     - Sulfate ($\le 250$ mg/L)
     - Conductivity ($\le 500$ $\mu$S/cm)
     - Total Organic Carbon ($\le 10$ ppm)
     - Trihalomethanes ($\le 80$ $\mu$g/L)
     - Turbidity ($\le 5.0$ NTU)
   - 1-Click Demonstration Scenarios: Pristine Municipal Tap, Acidic Corrosive Well, Turbid Flood Runoff, Over-Chlorinated Reservoir (High THM), and Saline Mineral Borehole.
2. **WHO Water Quality Index (WA-WQI) Scorecard:**
   - Parameter-by-parameter compliance scorecard (Safe, Borderline, Hazardous) with explicit health implications.
3. **AI Engineering Remediation Protocol:**
   - Prescribes multi-barrier interventions: Coagulation/flocculation (alum/Moringa), calcite bed neutralization, granular activated carbon (GAC) adsorption, membrane reverse osmosis, and immediate household boiling/SODIS precautions.
   - Dual-tier engine: Integrates with live LLMs (Gemini, OpenAI, Groq) with an offline, deterministic **WHO Expert Heuristic Engine fallback**.
4. **Executive Dashboard:**
   - Aggregate municipal metrics (Pass Rate %, Average WQI, Critical Alerts, Monitored Stations).
   - Real-time station telemetry status grid and clickable assessment audit drawer.
5. **High-Throughput Batch Municipal Screener:**
   - CSV dataset upload triaging 100+ community water points simultaneously.
   - Instant download of enriched CSV reports with predicted potability, WQI, and risk classifications.
6. **Scientific Methodology Hub:**
   - Complete confusion matrix, 5-fold cross-validation scores, Gini feature importance rankings, and AI ethics statement.

---

## 3. Technology Stack

- **Frontend:** React 18, TypeScript, Vite, custom accessible CSS design system, Lucide React icons.
- **Backend:** Python 3.14, FastAPI, Uvicorn ASGI server, Pydantic v2 schemas.
- **Machine Learning:** Scikit-Learn (Random Forest Classifier with 150 trees), Joblib model serialization, Pandas, NumPy.
- **Database:** SQLite 3 (`backend/data/aquasafe.db`) with full JSON audit trail persistence.
- **Deliverables & Presentation:** `python-pptx` automated 15-slide presentation generator.

---

## 4. Quick Start & Setup Instructions (Windows)

### Prerequisites:
- Python 3.10+ (tested on Python 3.14)
- Node.js v18+ and npm (tested on Node v24.18)

### Step 1: Clone or Navigate to the Workspace
```powershell
cd "c:\Users\IIISI\Desktop\IBM PROJECT"
```

### Step 2: Install Python Backend Dependencies
```powershell
python -m pip install -r requirements.txt
```

### Step 3: Install Frontend Dependencies
```powershell
cd frontend
npm install
cd ..
```

### Step 4: Configure Environment Variables (Optional)
Copy `.env.example` to `.env` if you wish to configure live LLM API keys:
```powershell
Copy-Item .env.example .env
```
*(If left blank, AquaSafe AI automatically runs the built-in deterministic WHO Expert Heuristic Engine without requiring any paid API key!)*

### Step 5: Run Automated Tests
```powershell
python -m pytest backend/tests -v
```
*(All 13 tests will execute and pass.)*

### Step 6: Start the Backend Server
In PowerShell:
```powershell
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
The FastAPI backend will start at: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`).

### Step 7: Start the Frontend Client
In a second PowerShell terminal:
```powershell
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```
Open your browser and navigate to: **`http://127.0.0.1:5173/`**

---

## 5. Project Directory Structure

```
IBM PROJECT/
├── .env.example                               # Environment template
├── README.md                                  # Project overview and run instructions
├── requirements.txt                           # Python dependencies
│
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                            # FastAPI application entry point
│   │   ├── config.py                          # Environment and paths configuration
│   │   ├── models/
│   │   │   └── schemas.py                     # Pydantic v2 schemas
│   │   ├── routers/
│   │   │   ├── predict.py                     # Primary diagnostic endpoint
│   │   │   ├── dashboard.py                   # Dashboard metrics & audits
│   │   │   ├── stations.py                    # Water monitoring stations
│   │   │   ├── batch.py                       # CSV screening & preset scenarios
│   │   │   └── metrics.py                     # ML parameters & feature importances
│   │   └── services/
│   │       ├── ml_service.py                  # Random Forest inference engine
│   │       ├── wqi_service.py                 # Weighted Arithmetic WQI calculator
│   │       ├── ai_service.py                  # Cognitive advisory & WHO offline fallback
│   │       └── db_service.py                  # SQLite database persistence
│   ├── data/
│   │   ├── water_potability_dataset.csv       # Benchmark training dataset (3,276 samples)
│   │   ├── batch_upload_demo.csv              # Demo municipal screening CSV
│   │   └── aquasafe.db                        # SQLite database
│   ├── models/
│   │   ├── water_potability_model.joblib      # Serialized trained Random Forest pipeline
│   │   └── model_metrics.json                 # Accuracy, ROC-AUC, Confusion Matrix
│   ├── tests/
│   │   ├── test_api.py                        # Endpoint & validation tests
│   │   └── test_ml.py                         # ML and WQI calculation unit tests
│   └── train_model.py                         # Scikit-learn model training script
│
├── frontend/
│   ├── index.html                             # Single Page Application HTML with SEO tags
│   ├── package.json                           # Frontend dependencies
│   ├── tsconfig.json                          # TypeScript configuration
│   ├── vite.config.ts                         # Vite build configuration
│   └── src/
│       ├── App.tsx                            # Root application view router
│       ├── index.css                          # Modern accessible design system
│       ├── main.tsx                           # React DOM mount point
│       ├── types/api.ts                       # TypeScript interfaces
│       ├── services/api.ts                    # Backend API client
│       └── components/
│           ├── Navbar.tsx                     # Top navigation with live API health badge
│           ├── LandingPage.tsx                # Hero section, stats, problem showcase
│           ├── TesterView.tsx                 # Primary diagnostic workflow
│           ├── DashboardView.tsx              # Executive telemetry & audit logs
│           ├── BatchView.tsx                  # High-throughput municipal CSV screener
│           ├── MethodologyView.tsx            # Confusion matrix & SDG science
│           └── Footer.tsx                     # Project footer
│
├── docs/
│   ├── project_specification.md               # Complete project specification
│   ├── lean_canvas.md                         # 9-block Lean Canvas business model
│   ├── sdg_impact_mapping.md                  # UN SDG 6 & 3 target mappings
│   ├── system_architecture.md                 # Architecture & technical data flow
│   ├── ai_methodology.md                      # ML pipeline & generative advisory
│   ├── testing_report.md                      # Automated testing results (13/13 passed)
│   └── presentation_outline.md                # 15-slide structure and speaker notes
│
└── deliverables/
    ├── SDG_AI_Project_Presentation.pptx       # Editable 15-slide PowerPoint deck
    ├── generate_presentation.py               # python-pptx presentation builder
    └── assets/                                # Embedded high-res chart images
        ├── roc_curve.png
        ├── confusion_matrix.png
        └── feature_importance.png
```

---

## 6. Key Deliverables & Documentation Index

- **Project Specification:** [`docs/project_specification.md`](docs/project_specification.md)
- **Lean Canvas Model:** [`docs/lean_canvas.md`](docs/lean_canvas.md)
- **SDG Impact Mapping:** [`docs/sdg_impact_mapping.md`](docs/sdg_impact_mapping.md)
- **System Architecture & Data Flow:** [`docs/system_architecture.md`](docs/system_architecture.md)
- **AI Methodology & Science:** [`docs/ai_methodology.md`](docs/ai_methodology.md)
- **Testing Report:** [`docs/testing_report.md`](docs/testing_report.md)
- **Presentation Outline & Speaker Notes:** [`docs/presentation_outline.md`](docs/presentation_outline.md)
- **PowerPoint Presentation:** [`deliverables/SDG_AI_Project_Presentation.pptx`](deliverables/SDG_AI_Project_Presentation.pptx)

---

## 7. Model Performance Summary

| Metric | Measured Value | Validation Method |
|:---|:---|:---|
| **Accuracy** | **88.72%** | Held-out Test Split ($n = 656$) |
| **Precision** | **85.07%** | True Positives / Predicted Positives |
| **Recall (Sensitivity)** | **87.02%** | True Positives / Actual Positives |
| **F1 Score** | **86.04%** | Harmonic Mean of Precision & Recall |
| **ROC-AUC** | **0.9430** | Area Under Receiver Operating Characteristic Curve |
| **Cross-Validation ROC-AUC** | **$0.9565 \pm 0.008$** | 5-Fold Stratified Cross-Validation on Training Data |

---

## 8. License & Acknowledgements

Developed as an **IBM SkillsBuild Internship Project** adhering to the United Nations 2030 Agenda for Sustainable Development and World Health Organization Guidelines for Drinking-water Quality. Licensed under the MIT License.
