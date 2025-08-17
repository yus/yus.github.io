@echo off
:: Git Workflow Automation (Fixed Version)
:: Handles repo detection and staging properly.

setlocal enabledelayedexpansion

echo ***************************************
echo    Git Clone -> Push Workflow (Windows)
echo ***************************************

:: Ask for Git repo URL
set /p repo_url="Enter Git repository URL: "
if "!repo_url!"=="" (
    echo ERROR: No URL provided. Exiting.
    pause
    exit /b
)

:: Clone repository
echo Cloning repository...
git clone !repo_url!
if errorlevel 1 (
    echo ERROR: Failed to clone repository.
    pause
    exit /b
)

:: Extract folder name from URL (handles .git and paths)
for %%F in ("!repo_url!") do set "repo_folder=%%~nF"
cd !repo_folder!

:: Verify Git repo
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo ERROR: Not a Git repository. Exiting.
    pause
    exit /b
)

:: Show status and prompt for changes
echo.
echo Repository: %cd%
git status
echo.
echo Make your changes in this folder, then press any key to continue...
pause

:: Stage ALL changes (including new/untracked files)
echo Staging changes...
git add --all
if errorlevel 1 (
    echo ERROR: Failed to stage changes.
    pause
    exit /b
)

:: Commit
set /p commit_msg="Enter commit message: "
if "!commit_msg!"=="" (
    set "commit_msg=Automatic commit"
)
git commit -m "!commit_msg!"
if errorlevel 1 (
    echo ERROR: Commit failed (no changes?). Use "git status" to check.
    pause
    exit /b
)

:: Pull latest changes (avoid conflicts)
echo Pulling latest changes...
git pull
if errorlevel 1 (
    echo WARNING: Pull failed (proceeding anyway).
)

:: Push
echo Pushing changes...
git push
if errorlevel 1 (
    echo ERROR: Push failed.
    pause
    exit /b
)

echo.
echo SUCCESS: Workflow completed!
pause
