const express = require('express');
const router = express.Router();
const { startServer, stopServer, getServerStatus, getServerStats } = require('../services/serverMonitor');
const path = require('path');

router.get('/status', async (req, res) => {
  try {
    const status = getServerStatus();
    const stats = await getServerStats();
    res.json({ ...status, ...stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/start', async (req, res) => {
  try {
    const { serverPath, args } = req.body;
    const result = startServer(serverPath || '', args || []);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/stop', async (req, res) => {
  try {
    const result = stopServer();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const stats = await getServerStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


