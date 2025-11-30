const express = require('express');
const router = express.Router();

// return sample heatmap points (x,y,intensity)
router.get('/', (req, res) => {
  const layer = req.query.layer || 'loot';
  const sample = [
    { x: 1024, y: 2048, intensity: 0.8 },
    { x: 1400, y: 900, intensity: 0.6 },
    { x: 800, y: 1200, intensity: 0.4 }
  ];
  res.json(sample);
});

module.exports = router;
