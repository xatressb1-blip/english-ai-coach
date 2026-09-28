@echo off
setlocal
cd /d "%~dp0"

echo ============================================================
echo English AI Interview Coach - Classroom Production Launcher
echo ============================================================
echo.

if not exist ".next\BUILD_ID" (
  echo Production build not found. Building the app first...
  echo.
  call npm run build
  if errorlevel 1 goto :failed
)

echo.
echo Starting the classroom server on all local network adapters...
echo Keep this window OPEN during the classroom activity.
echo.
echo The browser will open at http://localhost:3000/classroom
echo Fix 41.1 will auto-detect the current LAN IPv4 address for phones.
echo.

start "" cmd /c "timeout /t 3 /nobreak ^>nul & start http://localhost:3000/classroom"
call npm run start -- --hostname 0.0.0.0
exit /b %errorlevel%

:failed
echo.
echo Build failed. The classroom server was not started.
pause
exit /b 1
