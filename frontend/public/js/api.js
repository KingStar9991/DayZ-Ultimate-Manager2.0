const API_BASE = window.location.origin;

class API {
  constructor() {
    this.ws = null;
    this.wsReconnectTimeout = null;
    this.connectWebSocket();
  }

  connectWebSocket() {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;
    
    this.ws = new WebSocket(wsUrl);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.ws.send(JSON.stringify({ type: 'subscribe', channel: 'server-stats' }));
    };
    
    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        this.handleWebSocketMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      this.wsReconnectTimeout = setTimeout(() => this.connectWebSocket(), 3000);
    };
  }

  handleWebSocketMessage(data) {
    if (data.type === 'server-stats') {
      const event = new CustomEvent('server-stats', { detail: data.data });
      window.dispatchEvent(event);
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Server endpoints
  async getServerStatus() {
    return this.request('/api/server/status');
  }

  async startServer(serverPath, args) {
    return this.request('/api/server/start', {
      method: 'POST',
      body: { serverPath, args }
    });
  }

  async stopServer() {
    return this.request('/api/server/stop', {
      method: 'POST'
    });
  }

  async getServerStats() {
    return this.request('/api/server/stats');
  }

  // Config endpoints
  async getServerConfig(filePath) {
    return this.request(`/api/config/server?path=${encodeURIComponent(filePath)}`);
  }

  async saveServerConfig(filePath, config) {
    return this.request('/api/config/server', {
      method: 'POST',
      body: { path: filePath, config }
    });
  }

  async getInitC(filePath) {
    return this.request(`/api/config/init?path=${encodeURIComponent(filePath)}`);
  }

  async saveInitC(filePath, content) {
    return this.request('/api/config/init', {
      method: 'POST',
      body: { path: filePath, content }
    });
  }

  // Logs endpoints
  async getRPTLog(filePath) {
    return this.request(`/api/logs/rpt?path=${encodeURIComponent(filePath)}`);
  }

  async getCrashLog(filePath) {
    return this.request(`/api/logs/crash?path=${encodeURIComponent(filePath)}`);
  }

  async getLogList(logDir, limit = 100) {
    return this.request(`/api/logs/list?path=${encodeURIComponent(logDir)}&limit=${limit}`);
  }

  // Mods endpoints
  async listMods(modsPath) {
    return this.request(`/api/mods/list?path=${encodeURIComponent(modsPath)}`);
  }

  async scanConflicts(modsPath) {
    return this.request(`/api/mods/conflicts?path=${encodeURIComponent(modsPath)}`);
  }

  async downloadMod(workshopId, modsPath) {
    return this.request('/api/mods/download', {
      method: 'POST',
      body: { workshopId, modsPath }
    });
  }

  async updateMod(workshopId, modsPath) {
    return this.request('/api/mods/update', {
      method: 'POST',
      body: { workshopId, modsPath }
    });
  }

  async getLoadOrder(serverCfgPath) {
    return this.request(`/api/mods/loadorder?path=${encodeURIComponent(serverCfgPath)}`);
  }

  async setLoadOrder(serverCfgPath, modList) {
    return this.request('/api/mods/loadorder', {
      method: 'POST',
      body: { path: serverCfgPath, modList }
    });
  }

  // Loot endpoints
  async getTypesXML(filePath) {
    return this.request(`/api/loot/types?path=${encodeURIComponent(filePath)}`);
  }

  async saveTypesXML(filePath, data) {
    return this.request('/api/loot/types', {
      method: 'POST',
      body: { path: filePath, data }
    });
  }

  async getEventsXML(filePath) {
    return this.request(`/api/loot/events?path=${encodeURIComponent(filePath)}`);
  }

  async saveEventsXML(filePath, data) {
    return this.request('/api/loot/events', {
      method: 'POST',
      body: { path: filePath, data }
    });
  }

  async getEconomyXML(filePath) {
    return this.request(`/api/loot/economy?path=${encodeURIComponent(filePath)}`);
  }

  async saveEconomyXML(filePath, data) {
    return this.request('/api/loot/economy', {
      method: 'POST',
      body: { path: filePath, data }
    });
  }

  async getSpawnableTypesXML(filePath) {
    return this.request(`/api/loot/spawnabletypes?path=${encodeURIComponent(filePath)}`);
  }

  async saveSpawnableTypesXML(filePath, data) {
    return this.request('/api/loot/spawnabletypes', {
      method: 'POST',
      body: { path: filePath, data }
    });
  }

  async getMapGroups(filePath) {
    return this.request(`/api/loot/mapgroups?path=${encodeURIComponent(filePath)}`);
  }

  async saveMapGroups(filePath, data) {
    return this.request('/api/loot/mapgroups', {
      method: 'POST',
      body: { path: filePath, data }
    });
  }

  async validateLoot(missionPath) {
    return this.request('/api/loot/validate', {
      method: 'POST',
      body: { missionPath }
    });
  }

  // Trader endpoints
  async createTrader(name, config) {
    return this.request('/api/trader/create', {
      method: 'POST',
      body: { name, config }
    });
  }

  async buildTraderXML(traderPath) {
    return this.request('/api/trader/build', {
      method: 'POST',
      body: { path: traderPath }
    });
  }

  async calculatePrices(items, multiplier) {
    return this.request('/api/trader/calculate', {
      method: 'POST',
      body: { items, multiplier }
    });
  }

  async listTraders() {
    return this.request('/api/trader/list');
  }

  // Player endpoints
  async getOnlinePlayers() {
    return this.request('/api/player/online');
  }

  async kickPlayer(playerId, reason) {
    return this.request('/api/player/kick', {
      method: 'POST',
      body: { playerId, reason }
    });
  }

  async banPlayer(playerId, reason, duration) {
    return this.request('/api/player/ban', {
      method: 'POST',
      body: { playerId, reason, duration }
    });
  }

  async getPlayerInventory(playerId) {
    return this.request(`/api/player/inventory/${playerId}`);
  }

  async teleportPlayer(playerId, position) {
    return this.request('/api/player/teleport', {
      method: 'POST',
      body: { playerId, position }
    });
  }

  // Map endpoints
  async getMapHeatmap() {
    return this.request('/api/map/heatmap');
  }

  async spawnObject(classname, position, quantity) {
    return this.request('/api/map/spawn', {
      method: 'POST',
      body: { classname, position, quantity }
    });
  }

  async setWeather(fog, rain, wind) {
    return this.request('/api/map/weather', {
      method: 'POST',
      body: { fog, rain, wind }
    });
  }

  async setTime(hour, minute) {
    return this.request('/api/map/time', {
      method: 'POST',
      body: { hour, minute }
    });
  }

  // Automation endpoints
  async getSchedules() {
    return this.request('/api/automation/schedules');
  }

  async createSchedule(type, schedule, enabled) {
    return this.request('/api/automation/schedules', {
      method: 'POST',
      body: { type, schedule, enabled }
    });
  }

  async deleteSchedule(id) {
    return this.request(`/api/automation/schedules/${id}`, {
      method: 'DELETE'
    });
  }

  async createBackup(sourcePath, backupName) {
    return this.request('/api/automation/backup', {
      method: 'POST',
      body: { sourcePath, backupName }
    });
  }

  async listBackups() {
    return this.request('/api/automation/backups');
  }

  async restoreBackup(backupPath, targetPath) {
    return this.request('/api/automation/backup/restore', {
      method: 'POST',
      body: { backupPath, targetPath }
    });
  }

  // Utility endpoints
  async validateXML(filePath) {
    return this.request('/api/utility/validate/xml', {
      method: 'POST',
      body: { path: filePath }
    });
  }

  async validateJSON(content) {
    return this.request('/api/utility/validate/json', {
      method: 'POST',
      body: { content }
    });
  }

  async validateScript(content) {
    return this.request('/api/utility/validate/script', {
      method: 'POST',
      body: { content }
    });
  }

  async checkPath(checkPath) {
    return this.request('/api/utility/check/path', {
      method: 'POST',
      body: { path: checkPath }
    });
  }

  async getBenchmark() {
    return this.request('/api/utility/benchmark');
  }
}

const api = new API();
window.api = api;


