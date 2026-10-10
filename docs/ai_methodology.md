# AI Methodology: Machine Learning & Generative Advisory

**Project:** AquaSafe AI  
**Author:** IBM SkillsBuild Internship Project Team  
**Date:** October 2026  

---

## 1. Machine Learning Methodology

### 1.1 Dataset Definition & Physicochemical Features
The classification engine models **9 essential physicochemical parameters** benchmarked against World Health Organization (WHO) and US EPA Drinking Water Standards:

| Parameter | Unit | WHO / EPA Standard | Scientific Significance |
|:---|:---|:---|:---|
| **pH** | Scale (0–14) | 6.5 – 8.5 | Determines chemical equilibrium, heavy metal leaching, and disinfection efficacy. |
| **Hardness** | mg/L | $\le 300$ mg/L | Dissolved calcium ($Ca^{2+}$) and magnesium ($Mg^{2+}$) mineral scale indicators. |
| **Solids (TDS)** | ppm (mg/L) | $\le 1,000$ ppm | Total dissolved inorganic salts and organic matter from soil or industrial discharge. |
| **Chloramines** | ppm | $\le 4.0$ ppm | Secondary chlorine/ammonia disinfectant residual; excessive levels irritate mucosa. |
| **Sulfate** | mg/L | $\le 250$ mg/L | Naturally occurring mineral salts; excessive levels cause acute laxative dehydration. |
| **Conductivity** | $\mu$S/cm | $\le 500$ $\mu$S/cm | Electrical conductance indicating total dissolved ion concentration and salinity. |
| **Organic Carbon** | ppm | $\le 10.0$ ppm | Total Organic Carbon (TOC); acts as substrate for microbial growth and THM precursor. |
| **Trihalomethanes** | $\mu$g/L | $\le 80$ $\mu$g/L | Volatile halogenated disinfection byproducts with documented carcinogenic risks. |
| **Turbidity** | NTU | $\le 5.0$ NTU | Suspended colloidal silt shielding pathogens (Cryptosporidium, viruses) from UV/chlorine. |

### 1.2 Model Selection & Training Pipeline
A standard supervised Random Forest Classifier was chosen over black-box deep learning architectures due to:
1. **Multivariate Tabular Performance:** Ensemble decision trees consistently outperform neural networks on small-to-medium tabular chemistry datasets with heterogeneous feature scales.
2. **Robustness to Sensor Missing Values:** Handled via median imputation in the preprocessing pipeline.
3. **Interpretability:** Enables exact Gini impurity feature attribution for transparent clinical auditing.

**Pipeline Construction:**
```python
pipeline = Pipeline([
    ('imputer', SimpleImputer(strategy='median')),
    ('scaler', StandardScaler()),
    ('classifier', RandomForestClassifier(
        n_estimators=150,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    ))
])
```

### 1.3 Empirical Evaluation Results
Trained on 2,620 samples and validated on a strictly held-out test split of 656 samples:

- **Accuracy:** $88.72\%$
- **Precision:** $85.07\%$
- **Recall (Sensitivity):** $87.02\%$
- **F1 Score:** $86.04\%$
- **ROC-AUC Score:** $0.9430$
- **5-Fold Cross-Validation ROC-AUC:** $0.9565 \pm 0.008$

**Held-Out Confusion Matrix:**
- **True Negatives (TN):** 354 (Accurately identified contaminated hazardous water)
- **False Positives (FP):** 40 (Over-cautious warnings)
- **False Negatives (FN):** 34 (Critical missed excursions — minimized by conservative thresholding)
- **True Positives (TP):** 228 (Confirmed safe potable water)

### 1.4 Feature Importance Ranking (Gini Impurity)
1. **pH Level:** $27.22\%$
2. **Solids (TDS):** $17.24\%$
3. **Turbidity:** $15.75\%$
4. **Hardness:** $10.46\%$
5. **Sulfate:** $8.40\%$
6. **Trihalomethanes:** $6.82\%$
7. **Chloramines:** $5.35\%$
8. **Conductivity:** $4.88\%$
9. **Organic Carbon:** $3.87\%$

---

## 2. Water Quality Index (WQI) Methodology

In addition to binary classification, the platform implements the **Weighted Arithmetic Water Quality Index (WA-WQI)** method (Brown et al., WHO adaptation):

$$WQI = \sum_{i=1}^{n} q_i \cdot W_i$$

Where:
- $W_i$: Normalized unit weight assigned to each parameter based on toxicological significance ($\sum W_i = 1.0$).
- $q_i$: Quality rating sub-index derived from measured concentration versus WHO ideal and maximum permissible limits ($0 \le q_i \le 100$).

**Grading Scale:**
- $90 - 100$: Excellent Quality (Pristine)
- $70 - 89$: Good Quality (Safe for standard consumption)
- $50 - 69$: Poor Quality (Marginal; pre-treatment recommended)
- $25 - 49$: Very Poor Quality (High risk; hazardous)
- $< 25$: Unfit for Drinking (Critical toxicological danger)

---

## 3. Generative AI Advisory Engine & Transparent Fallback

### 3.1 Cognitive Remediation Architecture
While ML classifies risk, field technicians require actionable remediation protocols:
- How much coagulant should be dosed?
- Can household solar disinfection (SODIS) neutralize the threat, or is reverse osmosis required?
- Is distribution pipe corrosion occurring?

The service layer implements a **provider-agnostic cognitive adapter**:
- **Supported Providers:** Google Gemini (1.5 Flash), OpenAI (GPT-4o-mini), and Groq (Llama-3.1).
- **Prompt Strategy:** Ingests measured values, WQI score, ML classification probability, and identified WHO excursions. Requests strictly validated JSON with remediation summary, action urgency, step-by-step engineering interventions, and emergency household precautions.

### 3.2 Deterministic WHO Expert Heuristic Engine (Offline Fallback)
To ensure reliable operation in disconnected or cost-constrained environments, AquaSafe AI features an offline **Deterministic Expert Rule Matrix**:
- Evaluates specific physicochemical excursions (e.g., pH $< 6.5 \to$ calcite bed neutralization; Turbidity $> 5.0 \to$ alum / Moringa flocculation + sand filtration; THM $> 80 \to$ granular activated carbon adsorption; TDS $> 1000 \to$ thin-film composite reverse osmosis).
- Explicitly flags: `is_live_ai = False` and `provider = "WHO Expert Heuristic Engine (Deterministic Offline Fallback)"`.

This eliminates hallucination risks, ensures 100% operational uptime, and upholds scientific integrity.
