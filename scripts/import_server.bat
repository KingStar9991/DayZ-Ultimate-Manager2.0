
@echo off
REM Usage: import_server.bat "C:\path\to\your\serverfiles"
IF "%~1"=="" (
  echo Please provide path to server files.
  exit /b 1
)
set SRC=%~1
set DEST=%~dp0\data\imported-server
mkdir "%DEST%"
xcopy /E /I "%SRC%" "%DEST%"
echo Server copied to %DEST%
pause
