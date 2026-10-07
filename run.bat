@echo off
echo ========================================================
echo   Starting Resume Generation Project
echo ========================================================
echo Backend will run on  : http://localhost:3000
echo Frontend will run on : http://localhost:5173
echo.
start "Backend - Resume Generation (Port 3000)" cmd /k "cd /d ""%~dp0Backend"" && npm run dev"
start "Frontend - Resume Generation (Port 5173)" cmd /k "cd /d ""%~dp0Frontend"" && npm run dev"
echo Both servers have been launched in separate windows.
