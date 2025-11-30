
@echo off
REM Simple validation: check server exe exists
set SERVERPATH=%~dp0\data\imported-server\serverfiles
IF EXIST "%SERVERPATH%\DayZServer_x64.exe" (
  echo Server exe found.
) ELSE (
  echo DayZServer_x64.exe not found in %SERVERPATH%
)
pause
