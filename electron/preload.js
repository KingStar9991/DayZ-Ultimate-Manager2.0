/**
 * electron/preload.js
 * Expose a tiny bridge to the renderer
 */

const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('titanicBridge', {
  openExplorer: (dir) => ipcRenderer.invoke('open-explorer', dir),
  quitApp: () => ipcRenderer.invoke('app-quit'),
  onEvent: (cb) => ipcRenderer.on('du-event', (_e, data) => cb(data))
});
