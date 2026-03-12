@echo off
title SHIFT CTRL - Event Controller
cd /d "%~dp0"

if not exist config.json (
  echo Creating default config.json...
  echo { > config.json
  echo   "SERVER_PORT": 3000, >> config.json
  echo   "PROJECTORS": [ >> config.json
  echo     { "name": "Projector 1", "ip": "192.168.1.101" }, >> config.json
  echo     { "name": "Projector 2", "ip": "192.168.1.102" }, >> config.json
  echo     { "name": "Projector 3", "ip": "192.168.1.103" } >> config.json
  echo   ], >> config.json
  echo   "RESOLUME_IP": "127.0.0.1", >> config.json
  echo   "RESOLUME_PORT": 8080 >> config.json
  echo } >> config.json
)

echo.
echo   ==============================
echo    SHIFT CTRL - Event Controller
echo   ==============================
echo.
echo   Starting server on port 3000...
echo   Open http://localhost:3000
echo.

node.exe server.js
pause
