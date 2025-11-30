const express = require('express');
const router = express.Router();
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const schedules = [];
const backups = [];

router.get('/schedules', async (req, res) => {
  try {
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/schedules', async (req, res) => {
  try {
    const { type, schedule, enabled } = req.body;
    const newSchedule = {
      id: Date.now().toString(),
      type,
      schedule,
      enabled: enabled !== false,
      createdAt: new Date().toISOString()
    };
    schedules.push(newSchedule);
    res.json(newSchedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/schedules/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Schedule not found' });
    }
    schedules.splice(index, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backup', async (req, res) => {
  try {
    const { sourcePath, backupName } = req.body;
    if (!sourcePath) {
      return res.status(400).json({ error: 'sourcePath required' });
    }
    
    const backupDir = path.join(process.cwd(), 'data', 'backups');
    await fs.ensureDir(backupDir);
    
    const backupFileName = backupName || `backup-${Date.now()}.zip`;
    const backupPath = path.join(backupDir, backupFileName);
    
    const output = fs.createWriteStream(backupPath);
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    archive.pipe(output);
    archive.directory(sourcePath, false);
    await archive.finalize();
    
    const backup = {
      name: backupFileName,
      path: backupPath,
      size: (await fs.stat(backupPath)).size,
      createdAt: new Date().toISOString()
    };
    
    backups.push(backup);
    res.json(backup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/backups', async (req, res) => {
  try {
    res.json(backups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/backup/restore', async (req, res) => {
  try {
    const { backupPath, targetPath } = req.body;
    if (!backupPath || !targetPath) {
      return res.status(400).json({ error: 'backupPath and targetPath required' });
    }
    
    const unzipper = require('unzipper');
    await fs.ensureDir(targetPath);
    
    await new Promise((resolve, reject) => {
      fs.createReadStream(backupPath)
        .pipe(unzipper.Extract({ path: targetPath }))
        .on('close', resolve)
        .on('error', reject);
    });
    
    res.json({ success: true, message: 'Backup restored' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


