@echo off
title EcoSphere ESG Platform - Local Runtime
echo ===================================================
echo   🌍 EcoSphere ESG Management Platform Local Starter
echo ===================================================
echo.

:: 1. Verify Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js v18 or higher from https://nodejs.org before running.
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js environment detected.
echo.

:: 2. Install dependencies if node_modules folder doesn't exist inside frontend/
if not exist "frontend\node_modules\" (
    echo [INFO] frontend\node_modules folder is missing. Running 'npm install' inside 'frontend'...
    echo This may take a minute or two...
    cd frontend
    call npm install
    cd ..
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] 'npm install' failed inside 'frontend'. Check your connection.
        pause
        exit /b 1
    )
    echo [SUCCESS] Dependencies successfully downloaded.
    echo.
) else (
    echo [INFO] Dependencies already installed. Skipping 'npm install'.
    echo.
)

:: 3. Start the local Vite development server
echo [INFO] Starting Vite local development server...
echo The app will load at: http://localhost:5173
echo Press Ctrl+C in this terminal window to stop the server at any time.
echo.

:: Try to launch default web browser after a 2 seconds delay
start "" http://localhost:5173

:: Start the dev command
cd frontend
call npm run dev

pause
