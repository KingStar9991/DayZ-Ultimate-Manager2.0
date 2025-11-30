const express = require('express');
const router = express.Router();
const traderBuilder = require('../services/traderBuilder');

router.post('/create', async (req, res) => {
  try {
    const { name, config } = req.body;
    if (!name || !config) {
      return res.status(400).json({ error: 'Name and config required' });
    }
    const result = await traderBuilder.createTrader(name, config);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/build', async (req, res) => {
  try {
    const { path: traderPath } = req.body;
    if (!traderPath) {
      return res.status(400).json({ error: 'Path required' });
    }
    const result = await traderBuilder.buildTraderXML(traderPath);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/calculate', async (req, res) => {
  try {
    const { items, multiplier } = req.body;
    if (!items) {
      return res.status(400).json({ error: 'Items required' });
    }
    const result = await traderBuilder.calculatePrices(items, multiplier || 1.0);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/list', async (req, res) => {
  try {
    const traders = await traderBuilder.listTraders();
    res.json(traders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


