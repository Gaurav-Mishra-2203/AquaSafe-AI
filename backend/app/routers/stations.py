from fastapi import APIRouter
from typing import List
from ..models.schemas import StationInfo
from ..services.db_service import db_service

router = APIRouter(prefix="/stations", tags=["Monitoring Stations"])

@router.get("", response_model=List[StationInfo])
def list_stations():
    """Returns list of active water monitoring stations and current health statuses"""
    stations = db_service.get_stations()
    return [StationInfo(**s) for s in stations]
