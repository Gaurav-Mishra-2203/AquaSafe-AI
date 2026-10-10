from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class WaterSampleInput(BaseModel):
    ph: float = Field(..., ge=0.0, le=14.0, description="pH level (0-14, safe: 6.5-8.5)")
    hardness: float = Field(..., ge=0.0, le=1000.0, description="Hardness in mg/L (safe < 300)")
    solids: float = Field(..., ge=0.0, le=100000.0, description="Total Dissolved Solids in ppm (safe < 1000)")
    chloramines: float = Field(..., ge=0.0, le=25.0, description="Chloramines in ppm (safe < 4.0)")
    sulfate: float = Field(..., ge=0.0, le=1000.0, description="Sulfate in mg/L (safe < 250)")
    conductivity: float = Field(..., ge=0.0, le=2000.0, description="Electrical Conductivity in uS/cm (safe < 500)")
    organic_carbon: float = Field(..., ge=0.0, le=100.0, description="Total Organic Carbon in ppm (safe < 10)")
    trihalomethanes: float = Field(..., ge=0.0, le=300.0, description="Trihalomethanes in ug/L (safe < 80)")
    turbidity: float = Field(..., ge=0.0, le=20.0, description="Turbidity in NTU (safe < 5.0)")
    
    # Optional metadata
    location_name: Optional[str] = Field("Community Water Point #1", description="Location or community identifier")
    source_type: Optional[str] = Field("Borehole / Well", description="Water source category")
    station_id: Optional[str] = Field(None, description="Optional associated monitoring station ID")
    notes: Optional[str] = Field(None, description="Field operator notes")

class ParameterDeviation(BaseModel):
    parameter: str
    measured_value: float
    unit: str
    who_guideline: str
    status: str # "Safe", "Borderline", "Hazardous"
    severity: int # 0=Safe, 1=Borderline, 2=Severe
    health_implication: str

class PredictionResult(BaseModel):
    potability: int # 1 or 0
    is_potable: bool
    potability_probability: float
    risk_level: str # "Low Risk / Safe", "Moderate Risk", "High Risk / Contaminated", "Critical Health Hazard"
    wqi_score: float # 0 to 100
    wqi_category: str # "Excellent (90-100)", "Good (70-89)", "Poor (50-69)", "Very Poor (25-49)", "Unfit (<25)"
    parameter_deviations: List[ParameterDeviation]
    key_anomalies: List[str]

class TreatmentStep(BaseModel):
    step_number: int
    title: str
    action: str
    mechanism: str
    estimated_cost_tier: str # "Low / Household", "Medium / Community", "High / Municipal"
    target_pollutants: List[str]

class RemediationPlan(BaseModel):
    summary: str
    urgency: str # "Routine Monitoring", "Precautionary Advisory", "Urgent Intervention", "Immediate Boil/Halt Notice"
    treatment_steps: List[TreatmentStep]
    emergency_household_actions: List[str]
    municipal_infrastructure_recommendations: List[str]
    who_target_alignment: List[str]
    provider: str
    is_live_ai: bool

class FullAssessmentResponse(BaseModel):
    id: str
    created_at: str
    input: WaterSampleInput
    prediction: PredictionResult
    remediation: RemediationPlan

class StationInfo(BaseModel):
    station_id: str
    name: str
    location: str
    source_type: str
    latitude: float
    longitude: float
    status: str # "Operational", "Warning", "Critical Alert"
    last_wqi: float
    last_tested: str
    samples_count: int

class DashboardStats(BaseModel):
    total_samples_analyzed: int
    potable_count: int
    non_potable_count: int
    potability_rate_pct: float
    average_wqi: float
    critical_alerts_count: int
    active_monitoring_stations: int
    who_compliance_rate_pct: float
    recent_assessments: List[Dict[str, Any]]
    wqi_distribution: Dict[str, int]
    recent_trends: List[Dict[str, Any]]
