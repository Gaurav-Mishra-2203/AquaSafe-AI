import os
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "AquaSafe AI"
    APP_VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # AI configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "auto") # auto, gemini, openai, groq, mock
    
    # Model and Database paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    MODEL_PATH: str = os.path.join(BASE_DIR, "models", "water_potability_model.joblib")
    METRICS_PATH: str = os.path.join(BASE_DIR, "models", "model_metrics.json")
    DB_PATH: str = os.path.join(BASE_DIR, "data", "aquasafe.db")

settings = Settings()
