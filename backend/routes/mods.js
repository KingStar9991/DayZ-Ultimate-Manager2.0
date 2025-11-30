const express = require('express');
const router = express.Router();
const modManager = require('../services/modManager');
const fs = require('fs-extra');

router.get('/list', async (req, res) => {
  try {
    const { path: modsPath } = req.query;
    if (!modsPath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const mods = await modManager.listMods(modsPath);
    res.json(mods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/conflicts', async (req, res) => {
  try {
    const { path: modsPath } = req.query;
    if (!modsPath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const conflicts = await modManager.scanConflicts(modsPath);
    res.json(conflicts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/download', async (req, res) => {
  try {
    const { workshopId, modsPath } = req.body;
    if (!workshopId || !modsPath) {
      return res.status(400).json({ error: 'workshopId and modsPath required' });
    }
    const result = await modManager.downloadMod(workshopId, modsPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update', async (req, res) => {
  try {
    const { workshopId, modsPath } = req.body;
    if (!workshopId || !modsPath) {
      return res.status(400).json({ error: 'workshopId and modsPath required' });
    }
    const result = await modManager.updateMod(workshopId, modsPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/loadorder', async (req, res) => {
  try {
    const { path: serverCfgPath } = req.query;
    if (!serverCfgPath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const order = await modManager.getLoadOrder(serverCfgPath);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/loadorder', async (req, res) => {
  try {
    const { path: serverCfgPath, modList } = req.body;
    if (!serverCfgPath || !modList) {
      return res.status(400).json({ error: 'Path and modList required' });
    }
    const result = await modManager.setLoadOrder(serverCfgPath, modList);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


