const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Configurable paths (you'll adjust these in config)
const CONFIG = {
  steamCmdPath: process.env.STEAMCMD_PATH || 'C:\\\\steamcmd', // default placeholder
  workshopDlPath: process.env.WORKSHOP_PATH || path.join(process.cwd(), 'Workshop')
};

// install workshop ids: expect { ids: ["123","456"] }
router.post('/install', async (req, res) => {
  const ids = req.body.ids || [];
  if (!ids.length) return res.status(400).json({ ok: false, reason: 'no ids' });

  // we will spawn steamcmd in a safe way - but here return stub
  console.log('[steam] request install', ids);
  // TODO: spawn steamcmd + output parsing + error handling
  res.json({ ok: true, queued: ids });
});

// list workshop folder
router.get('/local', (req, res) => {
  const p = CONFIG.workshopDlPath;
  let list = [];
  try {
    if (fs.existsSync(p)) list = fs.readdirSync(p);
  } catch (e) {}
  res.json({ path: p, list });
});

module.exports = router;
