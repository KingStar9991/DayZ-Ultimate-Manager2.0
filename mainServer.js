/**
 * backend/mainServer.js
 * Simple Express + WebSocket server for DayZ Ultimate Manager
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs-extra');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/* WebSocket: broadcast helper */
function broadcast(obj) {
  const text = JSON.stringify(obj);
  wss.clients.forEach(c => {
    if (c.readyState === 1) c.send(text);
  });
}

/* On new WS connection */
wss.on('connection', ws => {
  ws.send(JSON.stringify({ type: 'hello', msg: 'DayZ Ultimate Manager backend connected' }));
});

/* Basic endpoints */
app.get('/api/status', (req, res) => {
  res.json({ ok: true, ts: Date.now(), env: process.env.NODE_ENV || 'development' });
});

/* Simulate an update detection (UI button uses this) */
app.post('/api/simulate-update', (req, res) => {
  broadcast({ type: 'update-detected', data: req.body || {} });
  res.json({ simulated: true });
});

/* Trigger file-system event (for testing) */
app.post('/api/fs-event', (req, res) => {
  broadcast({ type: 'fs-event', data: req.body });
  res.json({ ok: true });
});

/* SteamCMD download stub (real implementation in services) */
app.post('/api/steam/download', async (req, res) => {
  const { workshopId } = req.body || {};
  if (!workshopId) return res.status(400).json({ ok: false, error: 'workshopId required' });
  // In production: call services/installWorkflow.installWorkshopModWithDeps
  broadcast({ type: 'steam-download-start', workshopId });
  setTimeout(() => broadcast({ type: 'steam-download-done', workshopId }), 3000);
  res.json({ ok: true, queued: true, workshopId });
});

/* Serve static (frontend built fans) - for dev this is optional */
app.use('/static', express.static(path.join(__dirname, '..', 'frontend', 'public')));

/* Start server */
const PORT = process.env.DU_BACKEND_PORT || 3214;
server.listen(PORT, () => console.log(`DayZ-UM backend listening on ${PORT}`));

/* Basic FS watcher: watches ./data/servers for changes */
const WATCH_PATH = path.join(process.cwd(), 'data', 'servers');
fs.ensureDirSync(WATCH_PATH);
const chokidar = require('chokidar');
const watcher = chokidar.watch(WATCH_PATH, { ignoreInitial: true });
watcher.on('all', (ev, p) => {
  broadcast({ type: 'fs-event', event: ev, path: p, ts: Date.now() });
});
