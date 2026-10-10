import io
import pandas as pd
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Dict, Any
from ..models.schemas import WaterSampleInput
from ..services.ml_service import ml_service

router = APIRouter(prefix="/batch", tags=["Batch Processing"])

DEMO_PRESETS = [
    {
        "id": "preset-1",
        "name": "Pristine Municipal Tap Water",
        "category": "Potable Benchmark",
        "description": "Standard safe treated city water complying with all WHO parameters.",
        "data": {
            "ph": 7.35,
            "hardness": 175.0,
            "solids": 12800.0,
            "chloramines": 2.2,
            "sulfate": 210.0,
            "conductivity": 350.0,
            "organic_carbon": 5.8,
            "trihalomethanes": 32.0,
            "turbidity": 1.4,
            "location_name": "Nairobi Central Treatment Plant",
            "source_type": "Municipal Tap Reservoir"
        }
    },
    {
        "id": "preset-2",
        "name": "Acidic Corrosive Wellhead",
        "category": "High Acidity Hazard",
        "description": "Unbuffered groundwater with low pH leaching heavy metals from pipes.",
        "data": {
            "ph": 5.10,
            "hardness": 220.0,
            "solids": 18400.0,
            "chloramines": 3.1,
            "sulfate": 360.0,
            "conductivity": 580.0,
            "organic_carbon": 14.5,
            "trihalomethanes": 45.0,
            "turbidity": 4.1,
            "location_name": "Rural Community Well #4",
            "source_type": "Borehole / Well"
        }
    },
    {
        "id": "preset-3",
        "name": "Turbid Flood Runoff",
        "category": "High Pathogen Risk",
        "description": "Post-monsoon surface storm water with high suspended sediment and pathogen shielding.",
        "data": {
            "ph": 6.80,
            "hardness": 140.0,
            "solids": 29800.0,
            "chloramines": 0.4,
            "sulfate": 180.0,
            "conductivity": 490.0,
            "organic_carbon": 22.4,
            "trihalomethanes": 22.0,
            "turbidity": 7.9,
            "location_name": "River Basin Inflow East",
            "source_type": "Surface River"
        }
    },
    {
        "id": "preset-4",
        "name": "Over-Chlorinated Reservoir (High THM)",
        "category": "Chemical Hazard",
        "description": "Chlorinated water with excessive dissolved organics causing dangerous trihalomethanes.",
        "data": {
            "ph": 7.80,
            "hardness": 195.0,
            "solids": 16200.0,
            "chloramines": 5.9,
            "sulfate": 270.0,
            "conductivity": 420.0,
            "organic_carbon": 18.0,
            "trihalomethanes": 115.0,
            "turbidity": 2.1,
            "location_name": "Suburban Storage Cistern",
            "source_type": "Rainwater Harvest"
        }
    },
    {
        "id": "preset-5",
        "name": "Saline Mineral Borehole (High TDS)",
        "category": "High Salinity & Sulfate",
        "description": "Deep aquifer with extreme mineralization, high sulfate, and high conductivity.",
        "data": {
            "ph": 8.40,
            "hardness": 340.0,
            "solids": 42000.0,
            "chloramines": 1.8,
            "sulfate": 440.0,
            "conductivity": 760.0,
            "organic_carbon": 11.2,
            "trihalomethanes": 58.0,
            "turbidity": 3.8,
            "location_name": "Semi-Arid Perimeter Borehole",
            "source_type": "Deep Borehole"
        }
    }
]

@router.get("/presets")
def get_demonstration_presets():
    """Returns curated representative water scenarios for instant 1-click demonstration"""
    return DEMO_PRESETS

@router.post("/upload")
async def process_batch_csv(file: UploadFile = File(...)):
    """
    Parses an uploaded CSV file of water samples and generates batch ML classifications and WQI scores.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")

    content = await file.read()
    try:
        df = pd.read_csv(io.BytesIO(content))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV: {str(e)}")

    # Standardize column names (case-insensitive)
    df.columns = [c.strip().lower() for c in df.columns]
    
    col_mapping = {
        "ph": "ph",
        "hardness": "hardness",
        "solids": "solids",
        "chloramines": "chloramines",
        "sulfate": "sulfate",
        "conductivity": "conductivity",
        "organic_carbon": "organic_carbon",
        "trihalomethanes": "trihalomethanes",
        "turbidity": "turbidity"
    }

    missing_cols = [c for c in col_mapping.keys() if c not in df.columns]
    if missing_cols:
        raise HTTPException(
            status_code=422,
            detail=f"CSV missing mandatory water parameters: {missing_cols}. Columns required: {list(col_mapping.keys())}"
        )

    results = []
    potable_count = 0
    total_samples = len(df)

    for idx, row in df.iterrows():
        try:
            sample_in = WaterSampleInput(
                ph=float(row["ph"]),
                hardness=float(row["hardness"]),
                solids=float(row["solids"]),
                chloramines=float(row["chloramines"]),
                sulfate=float(row["sulfate"]),
                conductivity=float(row["conductivity"]),
                organic_carbon=float(row["organic_carbon"]),
                trihalomethanes=float(row["trihalomethanes"]),
                turbidity=float(row["turbidity"]),
                location_name=str(row.get("location_name", f"Sample #{idx + 1}")),
                source_type=str(row.get("source_type", "Field Batch"))
            )
            pred = ml_service.predict(sample_in)
            if pred.is_potable:
                potable_count += 1
            
            results.append({
                "sample_id": f"CSV-{idx + 1:03d}",
                "location": sample_in.location_name,
                "source_type": sample_in.source_type,
                "ph": sample_in.ph,
                "turbidity": sample_in.turbidity,
                "solids": sample_in.solids,
                "potability": pred.potability,
                "is_potable": pred.is_potable,
                "probability": pred.potability_probability,
                "wqi_score": pred.wqi_score,
                "wqi_category": pred.wqi_category,
                "risk_level": pred.risk_level,
                "anomalies_count": len(pred.key_anomalies)
            })
        except Exception as e:
            continue

    return {
        "total_processed": len(results),
        "potable_count": potable_count,
        "non_potable_count": len(results) - potable_count,
        "potability_rate_pct": round(potable_count / len(results) * 100.0, 1) if results else 0.0,
        "results": results
    }
