// backend/services/crashWatcher.js
const fs = require('fs-extra');
const path = require('path');
const EventEmitter = require('events');

class CrashWatcher extends EventEmitter {
  constructor(rptPath) {
    super();
    this.rptPath = rptPath;
    this.lastSize = 0;
    this.pollInterval = 5000;
    this.timer = null;
  }

  start() {
    this.timer = setInterval(async () => {
      try {
        if (!await fs.pathExists(this.rptPath)) return;
        const stats = await fs.stat(this.rptPath);
        if (stats.size > this.lastSize) {
          const stream = fs.createReadStream(this.rptPath, { start: this.lastSize, end: stats.size });
          let buff = '';
          for await (const chunk of stream) buff += chunk.toString();
          this.lastSize = stats.size;
          this.emit('rpt-chunk', buff);
          // crude detection: if chunk contains "ERROR" or "Exception"
          if (/error|exception|fatal/i.test(buff)) this.emit('rpt-crash', { msg:'possible crash marker', text: buff });
        }
      } catch (e) {}
    }, this.pollInterval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

module.exports = CrashWatcher;
