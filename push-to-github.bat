@echo off
title EcoSphere ESG Platform - Push to GitHub
echo ===================================================
echo   🌍 Copying and Pushing EcoSphere to GitHub Repo
echo ===================================================
echo.

:: 1. Verify Git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not found in your system's PATH.
    echo Please install Git before running this script.
    echo.
    pause
    exit /b 1
)

:: 2. Verify odoo-2026 repository folder exists
if not exist "odoo-2026\.git\" (
    echo [ERROR] The repository directory 'odoo-2026' was not found or is missing a .git folder.
    echo Make sure you run this script in the workspace root where 'odoo-2026' resides.
    echo.
    pause
    exit /b 1
)

echo [INFO] Copying frontend architecture files into odoo-2026/ ...
echo.

:: 3. Copy files using robocopy and copy commands
:: MIR copies folder structure. XD excludes subdirectories.
robocopy src odoo-2026\src /MIR /XD node_modules
copy package.json odoo-2026\
copy tsconfig.json odoo-2026\
copy tsconfig.node.json odoo-2026\
copy vite.config.ts odoo-2026\
copy postcss.config.js odoo-2026\
copy tailwind.config.js odoo-2026\
copy index.html odoo-2026\
copy run-local.bat odoo-2026\
copy README.md odoo-2026\

echo.
echo [SUCCESS] Copy completed. Moving into 'odoo-2026' directory...
echo.

cd odoo-2026

:: 4. Git workflow: stage, commit, and push to master
echo [INFO] Initializing Git actions for branch 'master'...
echo.

:: Ensure we are on master branch or create it
git checkout master >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Branch 'master' does not exist locally. Creating and switching to 'master'...
    git checkout -b master
) else (
    echo [INFO] Switched to 'master' branch.
)

echo.
echo [INFO] Staging all files...
git add .

echo.
echo [INFO] Committing changes...
git commit -m "Feat: Initialize EcoSphere frontend architecture, design system, and mock services (Phases 1-8)"

echo.
echo [INFO] Pushing changes to remote master branch...
git push origin master

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] Direct push failed. If the remote repository requires authentication or contains updates,
    echo please pull or verify your credentials, then try manually pushing in the 'odoo-2026' folder.
) else (
    echo.
    echo [SUCCESS] Code successfully pushed to https://github.com/Jagan-2406/odoo-2026 on branch 'master'!
)

echo.
pause
