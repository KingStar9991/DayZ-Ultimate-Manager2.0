# Testing Guide - DayZ Ultimate Manager 2.0

## Quick Start Testing

### 1. Install Dependencies

```bash
npm install
```

### 2. Run in Development Mode

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:3215`
- Wait for the backend to be ready
- Launch the Electron app with DevTools open

### 3. Test Individual Components

#### Test Backend Only
```bash
npm run backend
```
Then open `http://localhost:3215` in your browser to test the API directly.

#### Test Electron Only (requires backend running)
```bash
# Terminal 1: Start backend
npm run backend

# Terminal 2: Start Electron
npm run electron-dev
```

## Testing Checklist

### ✅ Basic Functionality

#### 1. Application Launch
- [ ] Electron window opens successfully
- [ ] Backend server starts without errors
- [ ] WebSocket connection established (check console)
- [ ] UI loads with sidebar and navbar

#### 2. Navigation
- [ ] Click through all sidebar menu items
- [ ] Verify each page loads without errors
- [ ] Check that active menu item highlights correctly
- [ ] Browser back/forward buttons work (if applicable)

#### 3. Dashboard
- [ ] Dashboard displays server status
- [ ] System info updates (CPU, RAM, Server status)
- [ ] Quick action buttons are clickable
- [ ] Recent activity section displays

### ✅ API Endpoints Testing

#### Test with curl or Postman:

```bash
# Health check
curl http://localhost:3215/api/health

# Server status
curl http://localhost:3215/api/server/status

# Server stats
curl http://localhost:3215/api/server/stats
```

#### Test WebSocket Connection:

Open browser console and run:
```javascript
const ws = new WebSocket('ws://localhost:3215/ws');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Message:', JSON.parse(e.data));
ws.send(JSON.stringify({ type: 'subscribe', channel: 'server-stats' }));
```

### ✅ Page-Specific Testing

#### Server Management Pages
- [ ] **Server Status**: Displays server info, start/stop buttons work
- [ ] **Performance Monitor**: Charts render, data updates
- [ ] **Logs Viewer**: Logs load, filtering works
- [ ] **Crash Logs**: Crash detection and analysis works

#### Configuration Pages
- [ ] **Server Config Editor**: Load/save config files
- [ ] **Basic Config**: Form inputs work, preview updates
- [ ] **Advanced Config**: Flag insertion works
- [ ] **init.c Editor**: Code editor functions, snippets insert

#### Mod Management
- [ ] **Mod Manager**: List mods, download mods
- [ ] **Mod Updater**: Check for updates
- [ ] **Mod Conflicts**: Scan detects conflicts
- [ ] **Load Order**: Drag/drop or reorder works

#### Loot/Economy Tools
- [ ] **types.xml Editor**: Load/edit/save XML
- [ ] **events.xml Editor**: Add/edit events
- [ ] **Loot Validator**: Validation runs and shows results

#### Player Tools
- [ ] **Player List**: Displays online players
- [ ] **Kick/Ban**: Actions execute (if server running)
- [ ] **Player Inventory**: View inventory data
- [ ] **Teleport**: Teleport commands work

#### Utility Tools
- [ ] **XML Validator**: Validates XML correctly
- [ ] **JSON Validator**: Validates JSON correctly
- [ ] **Path Checker**: Checks folder paths
- [ ] **RPT Parser**: Parses log files

### ✅ Electron-Specific Testing

#### IPC Communication
- [ ] **Version**: `window.electronAPI.getVersion()` returns version
- [ ] **Select Folder**: Folder picker opens
- [ ] **Select File**: File picker opens with filters

#### Auto-Updater (Production Build Only)
- [ ] Update check runs on startup
- [ ] Update available notification shows
- [ ] Update download completes
- [ ] Update dialog shows even if window closed (fixed bug)

### ✅ UI/UX Testing

#### Visual Design
- [ ] Dark glass aesthetic displays correctly
- [ ] Translucent panels have blur effect
- [ ] Colors match GTX panel style
- [ ] Fonts render correctly (SF Pro/Mono)

#### Responsiveness
- [ ] Window resizing works smoothly
- [ ] Sidebar collapses/expands (if implemented)
- [ ] Grid layouts adapt to window size
- [ ] Scrollbars appear when needed

#### Animations
- [ ] Page transitions are smooth
- [ ] Hover effects work
- [ ] Loading states display
- [ ] Button clicks provide feedback

### ✅ Error Handling

#### Test Error Scenarios:
- [ ] Backend not running: App handles gracefully
- [ ] Invalid file paths: Shows error messages
- [ ] Network errors: Displays user-friendly errors
- [ ] Invalid API responses: Handles gracefully
- [ ] Window closed during update: No crash (fixed)

## Manual Testing Scenarios

### Scenario 1: First Launch
1. Run `npm run dev`
2. Verify backend starts
3. Verify Electron window opens
4. Check console for errors
5. Navigate through pages

### Scenario 2: File Operations
1. Go to File Browser
2. Select a root folder
3. Browse files
4. Preview a file
5. Test search functionality

### Scenario 3: Configuration Editing
1. Go to Server Config Editor
2. Load a config file
3. Make changes
4. Save the file
5. Verify changes persisted

### Scenario 4: Mod Management
1. Go to Mod Manager
2. Enter mods folder path
3. List installed mods
4. Try downloading a mod (requires SteamCMD)
5. Check mod conflicts

### Scenario 5: Real-time Updates
1. Open Performance Monitor
2. Start monitoring
3. Verify charts update
4. Check WebSocket messages in console
5. Verify system stats update

## Automated Testing (Future)

### Unit Tests
```bash
# Install test framework
npm install --save-dev jest

# Run tests
npm test
```

### E2E Tests
```bash
# Install Playwright or Spectron
npm install --save-dev @playwright/test

# Run E2E tests
npm run test:e2e
```

## Debugging Tips

### Enable DevTools
- DevTools open automatically in dev mode
- Press `F12` or `Ctrl+Shift+I` (Windows/Linux)
- Press `Cmd+Option+I` (macOS)

### Check Backend Logs
- Backend logs appear in the terminal running `npm run backend`
- Look for WebSocket connection messages
- Check for API request logs

### Check Electron Logs
- Electron logs appear in the terminal running `npm run electron-dev`
- Check for IPC errors
- Look for window creation messages

### Browser Console
- Open DevTools in Electron window
- Check for JavaScript errors
- Monitor WebSocket messages
- Test API calls manually

### Common Issues

#### Backend Won't Start
- Check if port 3215 is already in use
- Verify Node.js version (18+)
- Check for missing dependencies: `npm install`

#### Electron Window Blank
- Verify backend is running
- Check console for errors
- Verify `frontend/public/index.html` exists

#### WebSocket Not Connecting
- Verify backend WebSocket server started
- Check firewall settings
- Verify URL is `ws://localhost:3215/ws`

#### Pages Not Loading
- Check browser console for import errors
- Verify all page files exist in `frontend/public/js/pages/`
- Check router registration in `app.js`

## Performance Testing

### Memory Usage
- Monitor memory in Task Manager/Activity Monitor
- Check for memory leaks during long sessions
- Verify cleanup on window close

### CPU Usage
- Monitor CPU usage during operations
- Check for excessive polling
- Verify WebSocket efficiency

### Startup Time
- Measure time to first render
- Check backend startup time
- Optimize if > 5 seconds

## Production Build Testing

### Build Application
```bash
npm run build
```

### Test Built Application
1. Navigate to `dist/` folder
2. Run the installer/executable
3. Test all functionality
4. Verify auto-updater works (if configured)

## Reporting Issues

When reporting bugs, include:
- Operating System and version
- Node.js version (`node --version`)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Console errors/logs
- Screenshots (if applicable)

## Success Criteria

✅ Application is ready for production when:
- All pages load without errors
- API endpoints respond correctly
- WebSocket connections are stable
- File operations work correctly
- UI is responsive and polished
- No console errors in production mode
- Auto-updater functions correctly
- Memory usage is reasonable
- Application handles errors gracefully

