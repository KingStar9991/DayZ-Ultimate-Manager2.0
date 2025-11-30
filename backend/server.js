const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const WebSocket = require('ws');
const fs = require('fs-extra');

// Import routes
const serverRoutes = require('./routes/server');
const configRoutes = require('./routes/config');
const logsRoutes = require('./routes/logs');
const modsRoutes = require('./routes/mods');
const lootRoutes = require('./routes/loot');
const traderRoutes = require('./routes/trader');
const playerRoutes = require('./routes/player');
const mapRoutes = require('./routes/map');
const automationRoutes = require('./routes/automation');
const utilityRoutes = require('./routes/utility');

// Import services
const WebSocketServer = require('./websocket');
const { monitorServer } = require('./services/serverMonitor');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'public')));

// API Routes
app.use('/api/server', serverRoutes);
app.use('/api/config', configRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/mods', modsRoutes);
app.use('/api/loot', lootRoutes);
app.use('/api/trader', traderRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/utility', utilityRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize WebSocket server
const wss = new WebSocketServer(server);

// Start server monitoring
monitorServer(wss);

const PORT = process.env.PORT || 3215;

server.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server running on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

module.exports = { app, server };


