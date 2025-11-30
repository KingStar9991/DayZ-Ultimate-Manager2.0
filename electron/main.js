const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
// Make auto-updater optional (may not be available in packaged app)
let autoUpdater = null;
try {
  autoUpdater = require('electron-updater').autoUpdater;
} catch (error) {
  console.warn('electron-updater not available, auto-updates disabled');
}
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    frame: true,
    backgroundColor: '#0a0a0a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    show: false
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3215');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'frontend', 'public', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function startBackend() {
  const { spawn } = require('child_process');
  const fs = require('fs');
  
  // In packaged app, use resources path; in dev, use normal path
  let backendPath;
  let cwd;
  
  if (app.isPackaged) {
    // When packaged, backend is in resources/app/backend
    const appPath = app.getAppPath();
    backendPath = path.join(appPath, 'backend', 'server.js');
    cwd = path.join(appPath, 'backend');
    
    // If not found in app.asar, try unpacked location
    if (!fs.existsSync(backendPath)) {
      const unpackedPath = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend', 'server.js');
      if (fs.existsSync(unpackedPath)) {
        backendPath = unpackedPath;
        cwd = path.join(process.resourcesPath, 'app.asar.unpacked', 'backend');
      }
    }
  } else {
    backendPath = path.join(__dirname, '..', 'backend', 'server.js');
    cwd = path.join(__dirname, '..');
  }
  
  // Use system Node.js (user must have Node.js installed)
  // For a fully standalone app, you'd bundle Node.js, but for simplicity we use system Node
  backendProcess = spawn('node', [backendPath], {
    cwd: cwd,
    stdio: app.isPackaged ? 'pipe' : 'inherit',
    shell: true,
    env: {
      ...process.env,
      PORT: '3215',
      NODE_ENV: app.isPackaged ? 'production' : 'development'
    }
  });

  if (app.isPackaged) {
    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data.toString()}`);
    });
    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data.toString()}`);
    });
  }

  backendProcess.on('error', (err) => {
    console.error('Backend process error:', err);
    if (mainWindow) {
      mainWindow.webContents.send('backend-error', {
        message: 'Failed to start backend server. Please ensure Node.js is installed.',
        error: err.message
      });
    }
  });

  backendProcess.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.error(`Backend process exited with code ${code}`);
    }
  });
}

app.whenReady().then(() => {
  // Always start backend
  startBackend();
  createWindow();

  if (!isDev && autoUpdater) {
    try {
      autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      console.warn('Auto-updater check failed:', error);
    }
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

// Auto-updater events (only if available)
if (autoUpdater) {
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for update...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    console.log('Update not available:', info);
  });

  autoUpdater.on('error', (err) => {
    console.error('Error in auto-updater:', err);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info);
    // Use null if mainWindow is closed - dialog will still show as modal
    const parentWindow = mainWindow && !mainWindow.isDestroyed() ? mainWindow : null;
    dialog.showMessageBox(parentWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. The application will restart to apply the update.',
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    }).catch((error) => {
      console.error('Error showing update dialog:', error);
      // If dialog fails, still allow update installation
      autoUpdater.quitAndInstall();
    });
  });
}

// IPC handlers
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('select-folder', async () => {
  // Use null if mainWindow is closed - dialog will still show as modal
  const parentWindow = mainWindow && !mainWindow.isDestroyed() ? mainWindow : null;
  const result = await dialog.showOpenDialog(parentWindow, {
    properties: ['openDirectory']
  });
  return result;
});

ipcMain.handle('select-file', async (event, options) => {
  // Use null if mainWindow is closed - dialog will still show as modal
  const parentWindow = mainWindow && !mainWindow.isDestroyed() ? mainWindow : null;
  const result = await dialog.showOpenDialog(parentWindow, {
    properties: ['openFile'],
    filters: options?.filters || []
  });
  return result;
});
