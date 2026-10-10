@echo off
title AquaSafe AI - Master Launcher
cd /d "%~dp0"
echo ========================================================
echo    Launching AquaSafe AI Full-Stack Platform...
echo ========================================================
echo.
echo [1/3] Starting FastAPI Backend on port 8000...
start "AquaSafe AI - Backend" cmd /k "%~dp0run_backend.bat"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Vite React Frontend on port 5173...
start "AquaSafe AI - Frontend" cmd /k "%~dp0run_frontend.bat"

timeout /t 3 /nobreak >nul

echo [3/3] Opening AquaSafe AI in your browser...
start http://localhost:5173

echo.
echo ========================================================
echo AquaSafe AI is now running!
echo - Frontend: http://localhost:5173
echo - Backend:  http://127.0.0.1:8000
echo - API Docs: http://127.0.0.1:8000/docs
echo ========================================================
echo Keep the backend and frontend terminal windows open.
pause
