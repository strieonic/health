@echo off
title HealthID Platform Launcher
setlocal

:: Get the directory where the batch file is located
set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

echo.
echo  =============================================================
echo    🚀  HEALTHID PLATFORM - AUTONOMOUS LAUNCHER  🚀
echo  =============================================================
echo.

:: Check if node_modules exists, if not warn the user
if not exist "package.json" (
    echo [ERROR] package.json not found in %PROJECT_DIR%
    echo Please make sure this .bat file is in the root directory.
    pause
    exit /b
)

echo [1/3] Starting Autonomous Watchdog...
:: Start the watchdog in a new window so we can continue in this script
start "HealthID Watchdog" cmd /c "npm run watchdog"

echo [2/3] Waiting for servers to initialize (5s)...
timeout /t 5 /nobreak > nul

echo [3/3] Opening Admin Dashboard in browser...
:: Open the base application
start "" "http://localhost:5173/"

echo.
echo  =============================================================
echo    ✅  PLATFORM IS ONLINE
echo    
echo    Monitoring and Auto-Healing are active in the 
echo    background window. Do NOT close the watchdog window.
echo  =============================================================
echo.

:: Hold for a moment then exit the launcher window
timeout /t 3 /nobreak > nul
exit
