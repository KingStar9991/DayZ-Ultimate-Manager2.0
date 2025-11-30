
const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');
const apiRoutes = require('./routes/api');
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);
app.use('/', express.static(path.join(__dirname, '..', 'frontend', 'public')));
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/ws' });
wss.on('connection', ws => { console.log('WS client connected'); ws.send(JSON.stringify({ type:'hello', message:'Connected' })); });
function broadcast(obj){ const msg = JSON.stringify(obj); for(const c of wss.clients){ if(c.readyState === WebSocket.OPEN) c.send(msg); } }
setInterval(()=>{ broadcast({ type:'status', uptime: process.uptime(), serverOnline: Math.random()>0.4 }); }, 4000);
const PORT = process.env.PORT || 3220;
server.listen(PORT, ()=>{ console.log(`Backend running on http://localhost:${PORT}`); console.log(`WebSocket running on ws://localhost:${PORT}/ws`); });
