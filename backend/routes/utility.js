const express = require('express');
const router = express.Router();
const xmlTools = require('../services/xmlTools');
const fs = require('fs-extra');
const path = require('path');

router.post('/validate/xml', async (req, res) => {
  try {
    const { path: filePath } = req.body;
    if (!filePath) {
      return res.status(400).json({ error: 'Path required' });
    }
    const result = xmlTools.validateXML(filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validate/json', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }
    try {
      JSON.parse(content);
      res.json({ valid: true });
    } catch (error) {
      res.json({ valid: false, error: error.message });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/validate/script', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Content required' });
    }
    
    // Basic syntax validation for DayZ scripts
    const errors = [];
    const warnings = [];
    
    // Check for unclosed brackets
    const openBrackets = (content.match(/\{/g) || []).length;
    const closeBrackets = (content.match(/\}/g) || []).length;
    if (openBrackets !== closeBrackets) {
      errors.push('Unmatched brackets');
    }
    
    // Check for common syntax issues
    if (content.includes('===')) {
      warnings.push('Using strict equality (===) - DayZ uses ==');
    }
    
    res.json({
      valid: errors.length === 0,
      errors,
      warnings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/check/path', async (req, res) => {
  try {
    const { path: checkPath } = req.body;
    if (!checkPath) {
      return res.status(400).json({ error: 'Path required' });
    }
    
    const exists = await fs.pathExists(checkPath);
    const stats = exists ? await fs.stat(checkPath) : null;
    
    res.json({
      exists,
      isDirectory: stats?.isDirectory() || false,
      isFile: stats?.isFile() || false,
      size: stats?.size || 0,
      modified: stats?.mtime || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/benchmark', async (req, res) => {
  try {
    const si = require('systeminformation');
    
    const [cpu, mem, disk] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.fsSize()
    ]);
    
    res.json({
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free
      },
      disk: disk.map(d => ({
        fs: d.fs,
        size: d.size,
        used: d.used,
        available: d.available
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


