const WebSocket = require('ws');

class WebSocketServer {
  constructor(httpServer) {
    this.wss = new WebSocket.Server({ 
      server: httpServer, 
      path: '/ws',
      perMessageDeflate: false
    });
    
    this.clients = new Set();
    this.setupHandlers();
  }

  setupHandlers() {
    this.wss.on('connection', (ws, req) => {
      console.log('WebSocket client connected:', req.socket.remoteAddress);
      this.clients.add(ws);

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          this.handleMessage(ws, data);
        } catch (err) {
          console.error('WebSocket message parse error:', err);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });

      // Send initial connection message
      this.send(ws, {
        type: 'connected',
        message: 'WebSocket connection established',
        timestamp: new Date().toISOString()
      });
    });
  }

  handleMessage(ws, data) {
    switch (data.type) {
      case 'ping':
        this.send(ws, { type: 'pong', timestamp: new Date().toISOString() });
        break;
      case 'subscribe':
        ws.subscriptions = ws.subscriptions || [];
        if (!ws.subscriptions.includes(data.channel)) {
          ws.subscriptions.push(data.channel);
        }
        break;
      case 'unsubscribe':
        if (ws.subscriptions) {
          ws.subscriptions = ws.subscriptions.filter(c => c !== data.channel);
        }
        break;
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  broadcast(data, channel = null) {
    const message = JSON.stringify(data);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (!channel || !client.subscriptions || client.subscriptions.includes(channel)) {
          client.send(message);
        }
      }
    });
  }

  send(ws, data) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  getClientCount() {
    return this.clients.size;
  }
}

module.exports = WebSocketServer;


