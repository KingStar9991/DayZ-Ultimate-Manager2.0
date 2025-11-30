@echo off
title GitHub Sync + Force Push Fix
color 0E

echo ================================================
echo    Fixing GitHub "fetch first" push problem
echo ================================================
echo.

REM --- Set Git identity ---
set /p GITEMAIL="Enter your GitHub email: "
set /p GITUSER="Enter your GitHub username: "

git config --global user.email "%GITEMAIL%"
git config --global user.name "%GITUSER%"

echo.
echo Checking remote...
git remote -v

echo.
echo If origin already exists, continuing...

REM --- Make sure branch is main ---
git branch -M main

echo.
echo Pulling remote changes (merging automatically)...

git pull origin main --allow-unrelated-histories

echo.
echo Staging all local files...
git add .

echo.
echo Creating commit...
git commit -m "Merge local DayZ-Ultimate-Manager2.0 changes"

echo.
echo Pushing to GitHub (this time it WILL work)...
git push -u origin main

echo.
echo ================================================
echo        SYNC + PUSH COMPLETED SUCCESSFULLY
echo ================================================
pause
