@echo off
echo ========================================================
echo   Starting SEOlytics AI (Full-Stack Full Suite)
echo ========================================================
echo.
echo [1/2] Launching Backend Server on http://127.0.0.1:8000 ...
start "SEOlytics AI - Backend" cmd /k "cd backend && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo [2/2] Launching Frontend Server on http://127.0.0.1:5173 ...
start "SEOlytics AI - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting in separate windows!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000
echo - Swagger:  http://localhost:8000/docs
echo ========================================================
