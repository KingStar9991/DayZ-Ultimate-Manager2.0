@echo off
REM Usage: install_workshop.bat 123456789 987654321 ...
REM Requires steamcmd installed and in STEAMCMD_PATH

set STEAMCMD_PATH=%~dp0\..\tools\steamcmd
if "%STEAMCMD%"=="" set STEAMCMD=%STEAMCMD_PATH%\steamcmd.exe

if not exist "%STEAMCMD%" (
  echo SteamCMD not found at %STEAMCMD%
  echo Please download steamcmd and set STEAMCMD_PATH environment variable.
  pause
  exit /b 1
)

set ARGS=
:loop
if "%~1"=="" goto done
set ARGS=%ARGS% +workshop_download_item 221100 %1 validate
shift
goto loop
:done

"%STEAMCMD%" +login anonymous %ARGS% +quit
echo Done.
pause
