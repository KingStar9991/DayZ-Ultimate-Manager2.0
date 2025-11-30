const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');

router.get('/groups', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const xmlTools = require('../services/xmlTools');
    const data = await xmlTools.parseXML(filePath);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/heatmap', async (req, res) => {
  try {
    // Generate heatmap data for CE tool visualization
    const heatmapData = {
      grid: [],
      maxValue: 0
    };
    
    // Mock heatmap data - in real app, parse from server data
    for (let x = 0; x < 100; x++) {
      for (let y = 0; y < 100; y++) {
        const value = Math.random() * 100;
        heatmapData.grid.push({ x, y, value });
        if (value > heatmapData.maxValue) {
          heatmapData.maxValue = value;
        }
      }
    }
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/spawn', async (req, res) => {
  try {
    const { classname, position, quantity } = req.body;
    // In real implementation, send spawn command via RCON
    res.json({ success: true, message: `Spawned ${quantity} ${classname} at ${position}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/weather', async (req, res) => {
  try {
    const { fog, rain, wind } = req.body;
    // In real implementation, send weather command via RCON
    res.json({ success: true, message: 'Weather updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/time', async (req, res) => {
  try {
    const { hour, minute } = req.body;
    // In real implementation, send time command via RCON
    res.json({ success: true, message: `Time set to ${hour}:${minute}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


