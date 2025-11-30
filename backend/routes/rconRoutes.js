const express = require('express');
const router = express.Router();

// stub for rcon endpoints - TODO: integrate node-rcon or rcon-client
router.post('/exec', (req, res) => {
  const { host, port, password, cmd } = req.body;
  console.log('[rcon] exec', { host, port, cmd });
  // For safety we do not implement direct RCON here yet.
  // Replace with real implementation when you want.
  res.json({ ok: true, echo: cmd });
});

module.exports = router;
