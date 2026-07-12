@echo off
title EcoSphere ESG Platform - Safe Frontend Git Push
echo ===================================================
echo   🌍 Safe Git Push Workflow: Frontend Integration
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

echo [STEP 1] Moving to Git repository 'odoo-2026' ...
cd odoo-2026

echo.
echo [STEP 2] Fetching remote branch information...
git fetch origin

echo.
echo [STEP 3] Checking out master branch...
git checkout master
if %errorlevel% neq 0 (
    echo [INFO] Branch 'master' does not exist locally. Creating master...
    git checkout -b master
)

echo.
echo [STEP 4] Pulling latest changes from remote master branch...
echo This ensures any backend updates from other developers are loaded locally.
git pull origin master

if %errorlevel% neq 0 (
    echo.
    echo [WARNING] git pull encountered conflicts or failed.
    echo Please resolve any remote conflicts manually before continuing.
    pause
    exit /b 1
)

echo.
echo [STEP 5] Copying only frontend source files into the repository...
cd ..
:: Mirror src folder (excludes node_modules)
robocopy src odoo-2026\src /MIR /XD node_modules /NJH /NJS /NDL /NC /NS
:: Copy root configs
copy /Y package.json odoo-2026\
copy /Y tsconfig.json odoo-2026\
copy /Y tsconfig.node.json odoo-2026\
copy /Y vite.config.ts odoo-2026\
copy /Y postcss.config.js odoo-2026\
copy /Y tailwind.config.js odoo-2026\
copy /Y index.html odoo-2026\
copy /Y run-local.bat odoo-2026\
copy /Y README.md odoo-2026\
cd odoo-2026

echo.
echo ===================================================
echo   🔍 GIT PRE-COMMIT VERIFICATION REPORT
echo ===================================================
echo.
echo Current branch:
git branch --show-current
echo.

echo Git Status (Unstaged Changes):
git status -s
echo.

echo Files to be committed (Frontend files only):
echo - src/ (Feature Pages, Components, State Hooks, Mock Databases)
echo - package.json, tsconfig.json, tsconfig.node.json, vite.config.ts
echo - postcss.config.js, tailwind.config.js, index.html, run-local.bat
echo - README.md
echo.

echo Ignored files check (e.g. node_modules):
git status --ignored -s | findstr /R /C:"^[?][?]" /C:"^[I]"
echo.

echo Commit Message Summary:
echo "Feat: Initialize EcoSphere frontend architecture, design system, and mock services (Phases 1-9)"
echo.

echo ===================================================
echo   ⚠️ USER CONFIRMATION REQUIRED
echo ===================================================
echo [WARNING] Please review the status above. Make sure no backend folders
echo or files are modified, staged, or deleted.
echo.
set /p CONFIRM="Do you want to stage, commit, and push these frontend changes to origin/master? (Y/N): "

if /i "%CONFIRM%" neq "Y" (
    echo.
    echo [INFO] Git push cancelled by the user. No files were committed or pushed.
    echo.
    pause
    exit /b 0
)

echo.
echo [STEP 6] Staging frontend changes...
git add src/ package.json tsconfig.json tsconfig.node.json vite.config.ts postcss.config.js tailwind.config.js index.html run-local.bat README.md

echo.
echo [STEP 7] Committing changes...
git commit -m "Feat: Initialize EcoSphere frontend architecture, design system, and mock services (Phases 1-9)"

echo.
echo [STEP 8] Pushing changes to remote master...
git push origin master

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Git push failed. Verify your remote repository access permissions or SSH/PAT credentials.
) else (
    echo.
    echo [SUCCESS] Safe Git Push Completed!
    echo Remote Branch: master
    echo Commit ID:
    git rev-parse HEAD
)

echo.
pause
