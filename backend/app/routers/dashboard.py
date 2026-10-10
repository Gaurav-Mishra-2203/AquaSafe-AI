from fastapi import APIRouter
from ..models.schemas import DashboardStats
from ..services.db_service import db_service

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardStats)
def get_dashboard_summary():
    """Returns aggregated executive water safety metrics and trend history"""
    stats = db_service.get_dashboard_stats()
    return DashboardStats(**stats)

@router.get("/assessments")
def get_recent_assessments(limit: int = 50):
    """Retrieves list of recorded field assessments"""
    return db_service.get_recent_assessments(limit=limit)

@router.get("/assessments/{assessment_id}")
def get_assessment_detail(assessment_id: str):
    """Retrieves full JSON audit record for a given assessment"""
    data = db_service.get_assessment_by_id(assessment_id)
    if not data:
        return {"error": "Assessment not found"}
    return data
