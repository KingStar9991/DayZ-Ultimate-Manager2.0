const { autoUpdater } = require('electron-updater');

class AppUpdater {
  constructor() {
    autoUpdater.channel = 'latest';
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;
  }

  checkForUpdates() {
    return autoUpdater.checkForUpdatesAndNotify();
  }
}

module.exports = AppUpdater;


