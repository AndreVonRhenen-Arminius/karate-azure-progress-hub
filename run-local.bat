@echo off
setlocal
cd /d "%~dp0"

echo Starting Karate ^& Azure Progress Hub...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0local-server.ps1" -Port 8080

if errorlevel 1 (
  echo.
  echo The app did not start successfully.
  pause
)
endlocal
