const express = require('express');
const router = express.Router();
const rptParser = require('../services/rptParser');
const fs = require('fs-extra');
const path = require('path');

router.get('/rpt', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const result = rptParser.parseRPT(filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/crash', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const result = rptParser.parseCrashDump(filePath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const { path: logDir } = req.query;
    if (!logDir) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    const limit = parseInt(req.query.limit) || 100;
    const logs = rptParser.getRecentLogs(logDir, limit);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stream', async (req, res) => {
  try {
    const { path: filePath } = req.query;
    if (!filePath) {
      return res.status(400).json({ error: 'Path parameter required' });
    }
    
    if (!await fs.pathExists(filePath)) {
      return res.status(404).json({ error: 'Log file not found' });
    }
    
    const stats = await fs.stat(filePath);
    const fileSize = stats.size;
    const range = req.headers.range;
    
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = await fs.open(filePath, 'r');
      const stream = file.createReadStream({ start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'text/plain'
      });
      
      stream.pipe(res);
    } else {
      const content = await fs.readFile(filePath, 'utf-8');
      res.json({ content, size: fileSize });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


