/**
 * backend/services/steamCmdRunner.js
 * Wrapper around SteamCMD. This is a lightweight stub that emits events.
 * Replace spawn/args with proper steamcmd location on your machine.
 */

const { spawn } = require('child_process');
const EventEmitter = require('events');

class SteamCmdRunner extends EventEmitter {
  constructor(steamCmdPath = 'steamcmd') {
    super();
    this.steamCmdPath = steamCmdPath;
  }

  downloadWorkshopItem(appId, workshopId, opts = { validate: false }) {
    // This is a stubbed implementation. For production, run steamcmd +workshop_download_item ...
    const fakeProc = setInterval(() => {
      this.emit('progress', { workshopId, progress: Math.min(100, Math.floor(Math.random() * 100)) });
    }, 400);
    setTimeout(() => {
      clearInterval(fakeProc);
      this.emit('done', { workshopId, code: 0 });
    }, 3000 + Math.floor(Math.random() * 3000));
    return { fake: true };
  }
}

module.exports = SteamCmdRunner;
