const express = require('express');
const fs = require('fs');
const path = require('path');
const { safeCopyDir, timestamp } = require('../utils/fsHelpers');
const router = express.Router();

// Basic status
router.get('/status', (req, res) => {
  // stubbed values - later replace with real system stats
  res.json({ state: 'running', cpu: '6%', ram: '34%', players: 0 });
});

// server action: start/stop/restart (stubs)
router.post('/server-action', (req, res) => {
  const { action } = req.body;
  console.log('[manager] server-action', action);
  // TODO: implement spawn/kill logic using spawn()
  res.json({ ok: true, action });
});

// rcon passthrough (UI calls /api/rcon/send)
router.post('/rcon/send', (req, res) => {
  const { cmd } = req.body;
  console.log('[manager] rcon send', cmd);
  res.json({ ok: true, sent: cmd });
});

// schedule restart (store cron/time in a file)
router.post('/schedule', (req, res) => {
  const { time } = req.body;
  console.log('[manager] schedule restart', time);
  // store to data/schedule.json for now
  const out = { time, created: Date.now() };
  fs.writeFileSync(path.join(__dirname, '..', '..', 'data', 'schedule.json'), JSON.stringify(out, null, 2));
  res.json({ ok: true, time });
});

// backup endpoint - copies server directory into backups/<timestamp>
router.post('/backup', async (req, res) => {
  const serverPath = req.body.serverPath || req.app.get('serverPath') || path.join(process.cwd(), 'servers', '1', 'serverfiles');
  const outDir = path.join(process.cwd(), 'backups', `backup_${timestamp()}`);
  try {
    await safeCopyDir(serverPath, outDir);
    res.json({ ok: true, outDir });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

// list installed local mods (scans serverPath for @folders)
router.get('/mods', (req, res) => {
  const serverPath = path.join(process.cwd(), 'servers', '1', 'serverfiles');
  const modsRoot = serverPath;
  let mods = [];
  try {
    const dir = fs.readdirSync(modsRoot, { withFileTypes: true });
    mods = dir.filter(d => d.isDirectory() && d.name.startsWith('@')).map(d => d.name);
  } catch (e) {
    // not fatal
  }
  res.json({ mods });
});

module.exports = router;
