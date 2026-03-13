@echo off
title SHIFT CTRL - Event Controller
cd /d "%~dp0"

:: Enable long paths for this process
reg query "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v "LongPathsEnabled" >nul 2>&1

if not exist config.json (
  echo Creating default config.json...
  (
    echo {
    echo   "SERVER_PORT": 3000,
    echo   "PROJECTORS": [
    echo     { "name": "Projector 1", "ip": "192.168.1.101" },
    echo     { "name": "Projector 2", "ip": "192.168.1.102" },
    echo     { "name": "Projector 3", "ip": "192.168.1.103" }
    echo   ],
    echo   "RESOLUME_IP": "127.0.0.1",
    echo   "RESOLUME_PORT": 8080
    echo }
  ) > config.json
)

echo.
echo   ==============================
echo    SHIFT CTRL - Event Controller
echo   ==============================
echo.
echo   Starting server on port 3000...
echo   Open http://localhost:3000
echo.
echo   TIP: Extract this folder to C:\shift-ctrl
echo        if you get path-related errors.
echo.

node.exe server.js
pause
