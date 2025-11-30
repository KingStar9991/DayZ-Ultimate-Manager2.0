const express = require('express');
const router = express.Router();
const xmlTools = require('../services/xmlTools');
const lootValidator = require('../services/lootValidator');
const fs = require('fs-extra');
const path = require('path');

router.get('/types', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseTypesXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/types', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/events', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseEventsXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/events', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/economy', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseEconomyXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/economy', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/spawnabletypes', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseSpawnableTypesXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/spawnabletypes', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mapgroups', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/mapgroups', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mapgrouppos', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const data = await xmlTools.parseXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/mapgrouppos', async (req, res) => {
  try {
    const { path: filePath, data } = req.body;
    if (!filePath || !data) {
      return res.status(400).json({ error: 'Path and data required' });
    }
    const result = await xmlTools.saveXML(filePath, data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validate', async (req, res) => {
  try {
    const { missionPath } = req.body;
    if (!missionPath) {
      return res.status(400).json({ error: 'missionPath required' });
    }
    
    const economyResult = await lootValidator.validateEconomy(missionPath);
    const typesResult = await lootValidator.validateTypesXML(missionPath);
    
    res.json({
      economy: economyResult,
      types: typesResult,
      overall: economyResult.valid && typesResult.valid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


