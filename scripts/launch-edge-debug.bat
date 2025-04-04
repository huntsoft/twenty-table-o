@echo off
echo Starting Microsoft Edge with remote debugging enabled...

REM Try to find Edge in common installation locations
set EDGE_PATH=

REM Check Program Files (x86)
if exist "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" (
    set EDGE_PATH="C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    goto :found
)

REM Check Program Files
if exist "C:\Program Files\Microsoft\Edge\Application\msedge.exe" (
    set EDGE_PATH="C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    goto :found
)

echo Microsoft Edge not found in common locations. Please specify the path to msedge.exe manually.
goto :eof

:found
echo Found Microsoft Edge at %EDGE_PATH%
echo Launching Edge with remote debugging enabled...

%EDGE_PATH% --remote-debugging-port=9222 --user-data-dir="%~dp0\..\edge-debug-profile" http://localhost:3001

echo Microsoft Edge has been closed.