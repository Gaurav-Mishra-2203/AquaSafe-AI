"""
Water Quality Index (WQI) calculation service.
Implements the Weighted Arithmetic Water Quality Index method (WA-WQI)
calibrated to World Health Organization (WHO) and EPA drinking water guidelines.
"""

from typing import Dict, Any, List, Tuple
from ..models.schemas import ParameterDeviation

# WHO Standards and Unit Weights (Sum of weights = 1.0)
WHO_STANDARDS = {
    "ph": {
        "ideal": 7.0,
        "standard_min": 6.5,
        "standard_max": 8.5,
        "weight": 0.18,
        "unit": "pH",
        "description": "Acidity / Alkalinity balance"
    },
    "hardness": {
        "ideal": 150.0,
        "standard_max": 300.0,
        "weight": 0.08,
        "unit": "mg/L",
        "description": "Calcium and magnesium mineral content"
    },
    "solids": {
        "ideal": 300.0,
        "standard_max": 1000.0,
        "weight": 0.12,
        "unit": "ppm (TDS)",
        "description": "Total dissolved solids / mineral salinity"
    },
    "chloramines": {
        "ideal": 1.0,
        "standard_max": 4.0,
        "weight": 0.10,
        "unit": "ppm",
        "description": "Disinfectant residual concentration"
    },
    "sulfate": {
        "ideal": 100.0,
        "standard_max": 250.0,
        "weight": 0.09,
        "unit": "mg/L",
        "description": "Dissolved sulfate mineral salts"
    },
    "conductivity": {
        "ideal": 250.0,
        "standard_max": 500.0,
        "weight": 0.08,
        "unit": "uS/cm",
        "description": "Electrical conductivity / ion concentration"
    },
    "organic_carbon": {
        "ideal": 2.0,
        "standard_max": 10.0,
        "weight": 0.11,
        "unit": "ppm",
        "description": "Total organic carbon / biological matter"
    },
    "trihalomethanes": {
        "ideal": 10.0,
        "standard_max": 80.0,
        "weight": 0.12,
        "unit": "ug/L",
        "description": "Disinfection byproducts (carcinogenic risk)"
    },
    "turbidity": {
        "ideal": 1.0,
        "standard_max": 5.0,
        "weight": 0.12,
        "unit": "NTU",
        "description": "Cloudiness and suspended colloidal particles"
    }
}

def analyze_parameters(sample: Dict[str, float]) -> Tuple[float, str, List[ParameterDeviation], List[str]]:
    """
    Computes:
    1. WQI Score (0 to 100, where 100 is pristine water)
    2. WQI Category
    3. List of detailed parameter deviations against WHO standards
    4. Key anomalies list
    """
    deviations: List[ParameterDeviation] = []
    anomalies: List[str] = []
    sub_indices: List[float] = []
    
    # 1. pH evaluation
    ph_val = sample.get("ph", 7.0)
    ph_status = "Safe"
    ph_sev = 0
    ph_health = "Within optimal biological equilibrium."
    if ph_val < 6.5:
        ph_status = "Hazardous" if ph_val < 6.0 else "Borderline"
        ph_sev = 2 if ph_val < 6.0 else 1
        ph_health = "Corrosive water; leaches toxic heavy metals (lead, copper) from pipes and causes gastrointestinal irritation."
        anomalies.append(f"Acidic pH ({ph_val:.2f}) below WHO 6.5 threshold (pipe corrosion hazard)")
    elif ph_val > 8.5:
        ph_status = "Hazardous" if ph_val > 9.0 else "Borderline"
        ph_sev = 2 if ph_val > 9.0 else 1
        ph_health = "Highly alkaline water; reduces chlorination disinfection efficacy and imparts bitter taste."
        anomalies.append(f"Alkaline pH ({ph_val:.2f}) above WHO 8.5 threshold (compromises disinfection)")
    
    # Sub-index for pH: distance from ideal 7.0
    ph_penalty = min(100.0, (abs(ph_val - 7.0) / 2.5) * 100.0)
    q_ph = max(0.0, 100.0 - ph_penalty)
    sub_indices.append(q_ph * WHO_STANDARDS["ph"]["weight"])
    
    deviations.append(ParameterDeviation(
        parameter="pH Level",
        measured_value=round(ph_val, 2),
        unit="pH",
        who_guideline="6.5 - 8.5",
        status=ph_status,
        severity=ph_sev,
        health_implication=ph_health
    ))

    # Generic evaluation for other parameters with upper limits
    eval_rules = [
        ("Hardness", "hardness", 300.0, 450.0, "mg/L", "Excessive hardness causes mineral scaling in pipes and decreases detergent lather.", "High mineral hardness"),
        ("Solids (TDS)", "solids", 1000.0, 2000.0, "ppm", "Elevated dissolved solids indicate high mineral salinity or industrial/agricultural runoff.", "Elevated total dissolved solids"),
        ("Chloramines", "chloramines", 4.0, 6.0, "ppm", "Excessive chloramine levels cause mucosal irritation and eye/skin burning.", "High chloramine disinfectant"),
        ("Sulfate", "sulfate", 250.0, 400.0, "mg/L", "High sulfate levels can induce severe laxative effects and dehydration, especially in infants.", "Elevated sulfate concentration"),
        ("Conductivity", "conductivity", 500.0, 800.0, "uS/cm", "High conductivity indicates elevated dissolved ionic salts or chemical leakage.", "Elevated electrical conductivity"),
        ("Organic Carbon", "organic_carbon", 10.0, 18.0, "ppm", "High TOC indicates organic breakdown, serving as substrate for bacterial biofilm growth.", "High Total Organic Carbon (TOC)"),
        ("Trihalomethanes", "trihalomethanes", 80.0, 110.0, "ug/L", "Trihalomethanes are volatile chlorinated byproducts with documented carcinogenic risks.", "Carcinogenic Trihalomethanes (THMs)"),
        ("Turbidity", "turbidity", 5.0, 8.0, "NTU", "Turbidity shields pathogenic microorganisms (cryptosporidium, viruses) from UV/chlorine disinfection.", "Critical turbidity (pathogen shielding)")
    ]

    for display_name, key, safe_max, hazard_max, unit, health_msg, anomaly_title in eval_rules:
        val = sample.get(key, 0.0)
        std_info = WHO_STANDARDS[key]
        
        if val <= safe_max:
            status = "Safe"
            severity = 0
            implication = "Meets WHO safe drinking water guideline."
            q = max(70.0, 100.0 - (val / safe_max) * 30.0)
        elif val <= hazard_max:
            status = "Borderline"
            severity = 1
            implication = health_msg
            anomalies.append(f"{anomaly_title}: {val:.1f} {unit} (WHO limit: {safe_max} {unit})")
            q = max(35.0, 70.0 - ((val - safe_max) / (hazard_max - safe_max)) * 35.0)
        else:
            status = "Hazardous"
            severity = 2
            implication = health_msg
            anomalies.append(f"CRITICAL {anomaly_title}: {val:.1f} {unit} (Exceeds {hazard_max} {unit})")
            q = max(0.0, 35.0 - ((val - hazard_max) / hazard_max) * 35.0)

        sub_indices.append(q * std_info["weight"])
        deviations.append(ParameterDeviation(
            parameter=display_name,
            measured_value=round(val, 2),
            unit=unit,
            who_guideline=f"<= {safe_max} {unit}",
            status=status,
            severity=severity,
            health_implication=implication
        ))

    # Aggregate composite WQI (0 to 100)
    wqi_score = round(sum(sub_indices), 1)
    wqi_score = min(100.0, max(0.0, wqi_score))

    if wqi_score >= 90.0:
        wqi_category = "Excellent (90-100)"
    elif wqi_score >= 70.0:
        wqi_category = "Good (70-89)"
    elif wqi_score >= 50.0:
        wqi_category = "Poor (50-69)"
    elif wqi_score >= 25.0:
        wqi_category = "Very Poor (25-49)"
    else:
        wqi_category = "Unfit for Drinking (<25)"

    return wqi_score, wqi_category, deviations, anomalies
