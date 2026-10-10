"""
AquaSafe AI - FastAPI Application Entry Point
UN Sustainable Development Goals (SDG 6 & 3) AI-Powered Water Safety Platform
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import predict, dashboard, stations, batch, metrics

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Intelligent Community Water Potability Diagnostics and Remediation System (SDG 6 & SDG 3)"
)

# Enable CORS for frontend Vite development & production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(predict.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(stations.router, prefix=settings.API_PREFIX)
app.include_router(batch.router, prefix=settings.API_PREFIX)
app.include_router(metrics.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "project": settings.APP_NAME,
        "tagline": "Democratizing WHO-grade water potability diagnostics and AI-driven remediation",
        "primary_sdg": "SDG 6: Clean Water and Sanitation (Target 6.1, 6.3)",
        "secondary_sdg": "SDG 3: Good Health and Well-Being (Target 3.9)",
        "version": settings.APP_VERSION,
        "status": "Operational",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health_check():
    from .services.ml_service import ml_service
    from .services.ai_service import ai_service
    
    live_ai_available = bool(ai_service.gemini_key or ai_service.openai_key or ai_service.groq_key)
    provider_name = "Live LLM" if live_ai_available else "WHO Expert Heuristic Engine (Deterministic Fallback)"
    
    return {
        "status": "healthy",
        "ml_model_loaded": ml_service.model is not None,
        "ai_provider_mode": provider_name,
        "live_ai_available": live_ai_available,
        "database": "SQLite connected"
    }
