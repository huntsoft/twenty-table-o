@echo off
echo Starting Chrome with remote debugging enabled...

REM Try to find Chrome in common installation locations
set CHROME_PATH=

REM Check Program Files (x86)
if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    goto :found
)

REM Check Program Files
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
    goto :found
)

REM Check user profile
if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
    goto :found
)

echo Chrome not found in common locations. Please specify the path to chrome.exe manually.
goto :eof

:found
echo Found Chrome at %CHROME_PATH%
echo Launching Chrome with remote debugging enabled...

%CHROME_PATH% --remote-debugging-port=9222 --user-data-dir="%~dp0\..\chrome-debug-profile" http://localhost:3001

echo Chrome has been closed.