import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException
from ..models.schemas import WaterSampleInput, FullAssessmentResponse
from ..services.ml_service import ml_service
from ..services.ai_service import ai_service
from ..services.db_service import db_service

router = APIRouter(prefix="/predict", tags=["Prediction & Remediation"])

@router.post("", response_model=FullAssessmentResponse)
async def assess_water_sample(sample: WaterSampleInput):
    """
    Evaluates a water sample using:
    1. Calibrated Random Forest Machine Learning Potability Model
    2. World Health Organization Weighted Arithmetic Water Quality Index (WA-WQI)
    3. AI Remediation Advisory Engine (Live LLM or WHO Deterministic Expert Fallback)
    4. Persists the assessment in SQLite database
    """
    # 1. Run Machine Learning and WHO parameter verification
    prediction = ml_service.predict(sample)

    # 2. Generate AI Remediation Protocol
    remediation = await ai_service.generate_remediation_plan(sample, prediction)

    # 3. Create unique assessment record
    assessment_id = f"ASM-{uuid.uuid4().hex[:8].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()

    full_payload = {
        "id": assessment_id,
        "created_at": now_iso,
        "input": sample.model_dump(),
        "prediction": prediction.model_dump(),
        "remediation": remediation.model_dump()
    }

    # 4. Save to persistent SQLite storage
    db_service.save_assessment(full_payload)

    return FullAssessmentResponse(**full_payload)
