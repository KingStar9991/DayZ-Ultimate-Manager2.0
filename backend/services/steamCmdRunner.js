// backend/services/steamCmdRunner.js
const { spawn } = require('child_process');
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs-extra');

class SteamCmdRunner extends EventEmitter {
  constructor(steamCmdExe) {
    super();
    this.steamCmdExe = C:\\Users\\imvStar90\\Desktop\\WORKSHOP DL\\steamcmd\\steamcmd.exe || 'steamcmd'; // full path recommended
  }

  downloadWorkshopItem(appId, workshopId, destPath, opts = { validate: false }) {
    return new Promise((resolve, reject) => {
      if (!workshopId) return reject(new Error('workshopId required'));
      // Build steamcmd args:
      const args = [];
      if (process.platform === 'win32') {
        // Windows steamcmd.exe accepts +login and +workshop_download_item
        args.push('+login', 'anonymous');
        args.push('+workshop_download_item', String(appId), String(workshopId));
        if (opts.validate) args.push('+validate');
        args.push('+quit');
      } else {
        args.push('+login', 'anonymous');
        args.push('+workshop_download_item', String(appId), String(workshopId));
        if (opts.validate) args.push('+validate');
        args.push('+quit');
      }

      const proc = spawn(this.steamCmdExe, args, { shell: false });

      proc.stdout.on('data', d => {
        const s = d.toString();
        this.emit('stdout', { workshopId, text: s });
        // crude progress detection:
        const m = s.match(/([0-9]{1,3})%/);
        if (m) this.emit('progress', { workshopId, progress: Number(m[1]) });
      });

      proc.stderr.on('data', d => {
        this.emit('stderr', { workshopId, text: d.toString() });
      });

      proc.on('error', err => {
        this.emit('error', { workshopId, error: err });
        reject(err);
      });

      proc.on('close', code => {
        if (code === 0) {
          // Find downloaded folder - best guess:
          // SteamCMD places items in <steamcmd_dir>/steamapps/workshop/content/<appId>/<workshopId>
          this.emit('done', { workshopId, code });
          resolve({ workshopId, code, destGuess: destPath });
        } else {
          const err = new Error('steamcmd exit code ' + code);
          this.emit('done', { workshopId, code, error: err.message });
          reject(err);
        }
      });
    });
  }
}

module.exports = SteamCmdRunner;
