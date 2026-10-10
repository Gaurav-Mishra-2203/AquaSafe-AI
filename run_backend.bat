@echo off
title AquaSafe AI - FastAPI Backend Server (Port 8000)
cd /d "%~dp0"
echo ========================================================
echo    AquaSafe AI - FastAPI Backend Server
echo    UN SDG 6 & SDG 3 Water Diagnostics Engine
echo ========================================================
echo.
echo Starting backend at http://127.0.0.1:8000 ...
echo API Documentation available at http://127.0.0.1:8000/docs
echo.
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause
