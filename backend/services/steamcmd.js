const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');

class SteamCMD {
  constructor(steamCmdPath = null) {
    this.steamCmdPath = steamCmdPath || this.findSteamCMD();
    this.processes = new Map();
  }

  findSteamCMD() {
    const possiblePaths = [
      path.join(process.cwd(), 'steamcmd', 'steamcmd.exe'),
      path.join(process.cwd(), 'steamcmd', 'steamcmd.sh'),
      'steamcmd',
      'steamcmd.exe'
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return p;
      }
    }

    return 'steamcmd';
  }

  async downloadMod(workshopId, outputPath) {
    return new Promise((resolve, reject) => {
      const commands = [
        '+force_install_dir', outputPath,
        '+login', 'anonymous',
        '+workshop_download_item', '221100', workshopId,
        '+quit'
      ];

      const proc = spawn(this.steamCmdPath, commands, {
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject({ success: false, error: errorOutput, code });
        }
      });

      proc.on('error', (error) => {
        reject({ success: false, error: error.message });
      });

      this.processes.set(workshopId, proc);
    });
  }

  async updateMod(workshopId, modPath) {
    return this.downloadMod(workshopId, modPath);
  }

  async downloadServer(appId = '223350', installPath) {
    return new Promise((resolve, reject) => {
      const commands = [
        '+force_install_dir', installPath,
        '+login', 'anonymous',
        '+app_update', appId, 'validate',
        '+quit'
      ];

      const proc = spawn(this.steamCmdPath, commands, {
        shell: true,
        stdio: 'pipe'
      });

      let output = '';
      let errorOutput = '';

      proc.stdout.on('data', (data) => {
        output += data.toString();
      });

      proc.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      proc.on('close', (code) => {
        if (code === 0) {
          resolve({ success: true, output });
        } else {
          reject({ success: false, error: errorOutput, code });
        }
      });

      proc.on('error', (error) => {
        reject({ success: false, error: error.message });
      });
    });
  }

  cancelDownload(workshopId) {
    const proc = this.processes.get(workshopId);
    if (proc) {
      proc.kill();
      this.processes.delete(workshopId);
      return true;
    }
    return false;
  }
}

module.exports = new SteamCMD();
