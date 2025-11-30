@echo off
title DayZ-Ultimate-Manager 2.0 ZIP Rebuilder
color 0A

echo ================================================
echo   DayZ-Ultimate-Manager 2.0 - ZIP Rebuilder
echo ================================================
echo.

REM Check for parts
setlocal enabledelayedexpansion
set PARTS_FOUND=0
for %%F in (part*.txt) do (
    echo Found: %%F
    set PARTS_FOUND=1
)

if %PARTS_FOUND%==0 (
    echo [ERROR] No partX.txt files found in this folder.
    echo Place: part1.txt, part2.txt, part3.txt, ... next to this .bat
    pause
    exit /b
)

echo.
echo Combining parts...
echo.

REM Combine all part*.txt in numeric order
type part1.txt > combined_base64.txt
for /l %%i in (2,1,200) do (
    if exist part%%i.txt (
        echo Adding part%%i.txt
        type part%%i.txt >> combined_base64.txt
    )
)

echo.
echo Rebuilding ZIP...
echo.

REM Decode Base64 -> ZIP
powershell -command ^
  "$b=[IO.File]::ReadAllText('combined_base64.txt');" ^
  "[IO.File]::WriteAllBytes('DayZ-Ultimate-Manager-Full.zip',[Convert]::FromBase64String($b))"

if exist DayZ-Ultimate-Manager-Full.zip (
    echo.
    echo ================================================
    echo     SUCCESS – ZIP successfully reconstructed!
    echo     File: DayZ-Ultimate-Manager-Full.zip
    echo ================================================
    del combined_base64.txt
) else (
    echo [ERROR] Failed to decode Base64.
    echo Check that the parts are not damaged.
)

echo.
pause
