const express = require('express');
const router = express.Router();
const configController = require('../services/configController');
const fs = require('fs-extra');

router.get('/server', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const config = await configController.readServerCfg(filePath);
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/server', async (req, res) => {
  try {
    const { path: filePath, config } = req.body;
    if (!filePath || !config) {
      return res.status(400).json({ error: 'Path and config required' });
    }
    const result = await configController.saveServerCfg(filePath, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/init', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const result = await configController.readInitC(filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/init', async (req, res) => {
  try {
    const { path: filePath, content } = req.body;
    if (!filePath || !content) {
      return res.status(400).json({ error: 'Path and content required' });
    }
    const result = await configController.saveInitC(filePath, content);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/battleye', async (req, res) => {
  try {
    const { path: bePath } = req.query;
    if (!bePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const files = await configController.getBattlEyeFiles(bePath);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


