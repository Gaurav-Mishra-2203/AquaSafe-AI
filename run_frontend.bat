@echo off
title AquaSafe AI - React TypeScript Frontend (Port 5173)
cd /d "%~dp0frontend"
echo ========================================================
echo    AquaSafe AI - React + Vite Frontend Client
echo    Opening at http://localhost:5173
echo ========================================================
echo.
echo Starting Vite development server...
echo.
npm run dev -- --host 127.0.0.1 --port 5173
pause
