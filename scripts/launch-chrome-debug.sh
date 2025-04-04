#!/bin/bash

echo "Starting Chrome with remote debugging enabled..."

# Try to find Chrome in common installation locations
CHROME_PATH=""

# macOS
if [ -f "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
    CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
fi

# Linux - check common locations
if [ -z "$CHROME_PATH" ]; then
    if [ -f "/usr/bin/google-chrome" ]; then
        CHROME_PATH="/usr/bin/google-chrome"
    elif [ -f "/usr/bin/google-chrome-stable" ]; then
        CHROME_PATH="/usr/bin/google-chrome-stable"
    elif [ -f "/usr/bin/chromium" ]; then
        CHROME_PATH="/usr/bin/chromium"
    elif [ -f "/usr/bin/chromium-browser" ]; then
        CHROME_PATH="/usr/bin/chromium-browser"
    fi
fi

if [ -z "$CHROME_PATH" ]; then
    echo "Chrome not found in common locations. Please specify the path to Chrome manually."
    exit 1
fi

echo "Found Chrome at $CHROME_PATH"
echo "Launching Chrome with remote debugging enabled..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
USER_DATA_DIR="$SCRIPT_DIR/../chrome-debug-profile"

"$CHROME_PATH" --remote-debugging-port=9222 --user-data-dir="$USER_DATA_DIR" http://localhost:3001

echo "Chrome has been closed."