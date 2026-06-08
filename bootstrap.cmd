@echo off
REM Wrapper to run the PowerShell bootstrap script with bypass policy
SET script=%~dp0bootstrap-windows.ps1
powershell -ExecutionPolicy Bypass -NoProfile -File "%script%"
pause
