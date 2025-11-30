@echo off
title DayZ-Ultimate-Manager2.0 GitHub Auto Setup
color 0A

echo ================================================
echo   DayZ-Ultimate-Manager2.0 GitHub Auto Setup
echo ================================================
echo.

REM --- Ask for GitHub email ---
set /p GITEMAIL="Enter your GitHub email (or noreply email): "

REM --- Ask for GitHub username ---
set /p GITUSER="Enter your GitHub username: "

REM --- Confirm folder ---
echo.
echo Current folder:
echo %cd%
echo.
set /p CONFIRM="Is this your DayZ-Ultimate-Manager2.0 folder? (Y/N): "

if /I "%CONFIRM%" NEQ "Y" (
    echo.
    echo !!! PLEASE MOVE THIS BAT FILE INTO:
    echo     C:\DayZ-Ultimate-Manager2.0\
    echo     AND RUN IT AGAIN.
    echo.
    pause
    exit /b
)

REM --- Configure Git ---
echo.
echo Configuring Git identity...
git config --global user.email "%GITEMAIL%"
git config --global user.name "%GITUSER%"
echo Git identity set.

REM --- Initialize Git repo ---
echo.
echo Initializing Git repository...
git init

REM --- Add all files ---
echo.
echo Adding files...
git add .

REM --- Commit ---
echo.
echo Creating initial commit...
git commit -m "Initial DayZ-Ultimate-Manager2.0 scaffold"

REM --- Set main branch ---
git branch -M main

REM --- Add remote ---
echo.
echo Adding GitHub remote:
echo https://github.com/%GITUSER%/DayZ-Ultimate-Manager2.0.git
git remote add origin https://github.com/%GITUSER%/DayZ-Ultimate-Manager2.0.git

REM --- Push to GitHub ---
echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ================================================
echo           PUSH COMPLETE!
echo   Your repo is now on GitHub:            
echo   https://github.com/%GITUSER%/DayZ-Ultimate-Manager2.0
echo ================================================
pause
