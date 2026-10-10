from fastapi import APIRouter
from ..services.ml_service import ml_service

router = APIRouter(prefix="/metrics", tags=["Model Analytics"])

@router.get("")
def get_ml_metrics():
    """Returns trained machine learning model parameters, confusion matrix, and feature importances"""
    return ml_service.get_model_info()
