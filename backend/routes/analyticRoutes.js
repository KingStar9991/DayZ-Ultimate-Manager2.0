const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Simple RPT scan example - returns lines with "error" or "exception"
router.post('/analyze-rpt', (req, res) => {
  const rptPath = req.body.rptPath || path.join(process.cwd(), 'sample.rpt');
  let content = '';
  try { content = fs.readFileSync(rptPath, 'utf8'); } catch (e) { return res.status(400).json({ ok:false, reason: 'rpt not found' }); }
  const lines = content.split(/\r?\n/).filter(l => /error|exception|failed/i.test(l)).slice(0,200);
  res.json({ ok:true, issues: lines });
});

module.exports = router;
