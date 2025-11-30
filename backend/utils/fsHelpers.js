const fs = require('fs');
const path = require('path');

function timestamp() {
  const d = new Date();
  const pad = n => String(n).padStart(2,'0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

function safeCopyDir(src, dest) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(src)) return reject(new Error('source not found: '+src));
    fs.mkdirSync(dest, { recursive: true });
    // simple recursive copy (not optimized)
    const items = fs.readdirSync(src, { withFileTypes: true });
    items.forEach(it => {
      const s = path.join(src, it.name);
      const d = path.join(dest, it.name);
      if (it.isDirectory()) {
        safeCopyDir(s, d);
      } else {
        try { fs.copyFileSync(s, d); } catch(e){}
      }
    });
    resolve(dest);
  });
}

module.exports = { safeCopyDir, timestamp };
