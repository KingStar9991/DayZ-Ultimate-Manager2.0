// backend/services/serverManager.js
const { spawn } = require('child_process');
const path = require('path');
const EventEmitter = require('events');
const fs = require('fs-extra');

class ServerManager extends EventEmitter {
  constructor(opts = {}) {
    super();
    this.serverExe = opts.serverExe || 'DayZServer_x64.exe';
    this.serverCwd = opts.serverCwd || process.cwd();
    this.proc = null;
    this.logPath = opts.logPath || path.join(this.serverCwd, 'server_console.log');
  }

  startServer(startArgs = [], env = {}) {
    if (this.proc && !this.proc.killed) {
      this.emit('status', { running: true });
      return Promise.resolve({ running: true });
    }
    const execPath = path.isAbsolute(this.serverExe) ? this.serverExe : path.join(this.serverCwd, this.serverExe);
    const spawnArgs = startArgs;
    this.proc = spawn(execPath, spawnArgs, { cwd: this.serverCwd, env: Object.assign(process.env, env), windowsHide: false });
    this.proc.stdout.on('data', d => { this.emit('stdout', d.toString()); this._appendLog(d.toString()); });
    this.proc.stderr.on('data', d => { this.emit('stderr', d.toString()); this._appendLog(d.toString()); });
    this.proc.on('close', code => { this.emit('exit', code); });
    this.emit('started', { pid: this.proc.pid });
    // Start tailing the log file if exists
    return Promise.resolve({ started: true, pid: this.proc.pid });
  }

  stopServer() {
    if (!this.proc) return Promise.resolve({ stopped: true, reason: 'not running' });
    this.proc.kill('SIGTERM');
    this.emit('stopped', { pid: this.proc.pid });
    this.proc = null;
    return Promise.resolve({ stopped: true });
  }

  restartServer(startArgs = [], env = {}) {
    return this.stopServer().then(() => this.startServer(startArgs, env));
  }

  _appendLog(text) {
    try {
      fs.appendFileSync(this.logPath, text);
    } catch (e) {}
  }

  tailLogLines(lines = 200) {
    try {
      if (!fs.existsSync(this.logPath)) return '';
      const txt = fs.readFileSync(this.logPath, 'utf8').split(/\r?\n/);
      return txt.slice(-lines).join('\n');
    } catch (e) {
      return '';
    }
  }
}

module.exports = ServerManager;
