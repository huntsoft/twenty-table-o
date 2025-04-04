# Debugging Guide for Twenty

This guide provides instructions on how to debug the Twenty application using Visual Studio Code.

## Prerequisites

- Visual Studio Code with the following extensions:
  - JavaScript Debugger (comes built-in with VS Code)
  - Chrome Debugger extension (if not already installed)

## Debugging the Frontend

There are multiple ways to debug the frontend:

### Method 1: Using the "Frontend: Debug" Configuration (Chrome)

1. Open the Debug panel in VS Code (Ctrl+Shift+D or Cmd+Shift+D on macOS)
2. Select "Frontend: Debug" from the dropdown
3. Click the green play button to start debugging
4. VS Code will start the frontend development server and launch Chrome
5. You can now set breakpoints in your frontend code

If you encounter issues with this method (like "unable to launch browser" or "unable to attach browser"), try Method 2 or 3.

### Method 2: Using the "Frontend: Debug (Edge)" Configuration (Microsoft Edge)

1. Open the Debug panel in VS Code
2. Select "Frontend: Debug (Edge)" from the dropdown
3. Click the green play button to start debugging
4. VS Code will start the frontend development server and launch Microsoft Edge
5. You can now set breakpoints in your frontend code

### Method 3: Manual Chrome Launch + Attach

1. Run the task "start-frontend-and-chrome" by:
   - Opening the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS)
   - Typing "Run Task" and selecting it
   - Choosing "start-frontend-and-chrome"
2. This will start the frontend server and launch Chrome with remote debugging enabled
3. Once Chrome is running, go back to VS Code
4. Open the Debug panel
5. Select "Frontend: Attach" from the dropdown
6. Click the green play button
7. VS Code will attach to the running Chrome instance
8. You can now set breakpoints in your frontend code

Alternatively, you can run these steps manually:
1. Start the frontend server: `yarn nx serve twenty-front --sourcemap`
2. Run the Chrome launch script: `scripts/launch-chrome-debug.bat` (Windows) or `bash scripts/launch-chrome-debug.sh` (macOS/Linux)
3. Use the "Frontend: Attach" debug configuration in VS Code

### Method 4: Manual Edge Launch + Attach

1. Run the task "start-frontend-and-edge" by:
   - Opening the Command Palette (Ctrl+Shift+P or Cmd+Shift+P on macOS)
   - Typing "Run Task" and selecting it
   - Choosing "start-frontend-and-edge"
2. This will start the frontend server and launch Microsoft Edge with remote debugging enabled
3. Once Edge is running, go back to VS Code
4. Open the Debug panel
5. Select "Frontend: Attach" from the dropdown
6. Click the green play button
7. VS Code will attach to the running Edge instance
8. You can now set breakpoints in your frontend code

Alternatively, you can run these steps manually:
1. Start the frontend server: `yarn nx serve twenty-front --sourcemap`
2. Run the Edge launch script: `scripts/launch-edge-debug.bat` (Windows)
3. Use the "Frontend: Attach" debug configuration in VS Code

## Debugging the Backend

1. Open the Debug panel in VS Code
2. Select "Backend: Debug" from the dropdown
3. Click the green play button to start debugging
4. VS Code will start the backend server in debug mode
5. You can now set breakpoints in your backend code

## Full Stack Debugging

There are two ways to debug both frontend and backend simultaneously:

### Method 1: Using the "Full Stack Debug" Configuration

1. Open the Debug panel in VS Code
2. Select "Full Stack Debug" from the dropdown
3. Click the green play button
4. This will start both the frontend and backend in debug mode

### Method 2: Using the "Full Stack Debug (Attach)" Configuration

1. Run the task "start-frontend-and-chrome" (as described above)
2. Open the Debug panel in VS Code
3. Select "Full Stack Debug (Attach)" from the dropdown
4. Click the green play button
5. This will start the backend in debug mode and attach to the running Chrome instance

## Troubleshooting

### Browser Doesn't Launch

If VS Code fails to launch Chrome or Edge, try:

1. Make sure the browser is installed on your system
2. Try running the browser launch script manually:
   - For Chrome:
     - Windows: `scripts/launch-chrome-debug.bat`
     - macOS/Linux: `bash scripts/launch-chrome-debug.sh`
   - For Edge:
     - Windows: `scripts/launch-edge-debug.bat`
3. Use the "Frontend: Attach" configuration after manually launching the browser
4. Try using a different browser (if Chrome doesn't work, try Edge or vice versa)

### "Unable to launch browser" or "Unable to attach browser" Error

This error can occur for several reasons:

1. The browser executable cannot be found
   - Try specifying the full path to the browser executable in the launch.json file
   - Use the manual launch scripts provided

2. Port conflict
   - Make sure no other instance of the browser is running with remote debugging on port 9222
   - Close all instances of the browser and try again
   - Try changing the remote debugging port in both the launch script and the attach configuration

3. User data directory issues
   - The browser might be having issues with the user data directory
   - Try deleting the chrome-debug-profile or edge-debug-profile directory and try again

### Breakpoints Not Hitting

If your breakpoints are not being hit:

1. Make sure source maps are enabled (they should be by default)
2. Check that the file you're setting breakpoints in is the same one being executed
3. Try adding the `debugger;` statement in your code where you want to break
4. Refresh the page in the browser after setting breakpoints
5. Make sure the sourceMapPathOverrides in launch.json match your project structure

### Other Issues

- Make sure all required ports are available (3000 for backend, 3001 for frontend, 9222 for browser debugging)
- Check the Debug Console in VS Code for any error messages
- Try using a different browser for debugging
- Try restarting VS Code if all else fails
- Check if your antivirus or firewall is blocking the debugging connection
- Make sure you have the latest version of VS Code and the browser extensions