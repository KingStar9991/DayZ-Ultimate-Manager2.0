export default async function ServerStatusPage() {
  const status = await window.api.getServerStatus().catch(() => ({}));
  const stats = await window.api.getServerStats().catch(() => ({}));
  
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Server Status</h1>
        <div class="flex gap-3">
          ${status.running ? `
            <button onclick="handleStopServer()" class="btn-secondary">Stop Server</button>
            <button onclick="handleRestartServer()" class="btn-secondary">Restart Server</button>
          ` : `
            <button onclick="handleStartServer()" class="btn-primary">Start Server</button>
          `}
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-4 h-4 rounded-full ${status.running ? 'bg-green-400' : 'bg-red-400'} animate-pulse-slow"></div>
          <h2 class="text-2xl font-bold">${status.running ? 'Server Online' : 'Server Offline'}</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <div class="text-sm text-gray-400 mb-1">Uptime</div>
            <div class="text-xl font-bold" id="uptime">${formatUptime(status.uptime || 0)}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Process ID</div>
            <div class="text-xl font-bold font-mono">${status.pid || 'N/A'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Server Port</div>
            <div class="text-xl font-bold font-mono">${status.port || '2302'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Query Port</div>
            <div class="text-xl font-bold font-mono">${status.queryPort || '2303'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Steam Port</div>
            <div class="text-xl font-bold font-mono">${status.steamPort || '2304'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">BattlEye</div>
            <div class="text-xl font-bold">${status.battlEye ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Performance Metrics</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-400">CPU Usage</span>
                <span class="text-sm font-medium">${stats.cpu || 0}%</span>
              </div>
              <div class="w-full bg-gtx-glass rounded-full h-3">
                <div class="bg-gtx-accent h-3 rounded-full transition-all" style="width: ${stats.cpu || 0}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-400">Memory Usage</span>
                <span class="text-sm font-medium">${stats.memory ? formatBytes(stats.memory) : '0 MB'}</span>
              </div>
              <div class="w-full bg-gtx-glass rounded-full h-3">
                <div class="bg-gtx-accent h-3 rounded-full transition-all" style="width: ${stats.memoryPercent || 0}%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-400">Network In</span>
                <span class="text-sm font-medium">${stats.networkIn ? formatBytes(stats.networkIn) + '/s' : '0 B/s'}</span>
              </div>
            </div>
            <div>
              <div class="flex justify-between mb-2">
                <span class="text-sm text-gray-400">Network Out</span>
                <span class="text-sm font-medium">${stats.networkOut ? formatBytes(stats.networkOut) + '/s' : '0 B/s'}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Player Statistics</h2>
          <div class="space-y-4">
            <div class="flex justify-between items-center p-3 bg-gtx-glass rounded-lg">
              <span class="text-gray-400">Current Players</span>
              <span class="text-2xl font-bold">${status.players || 0}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gtx-glass rounded-lg">
              <span class="text-gray-400">Max Players</span>
              <span class="text-2xl font-bold">${status.maxPlayers || 60}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gtx-glass rounded-lg">
              <span class="text-gray-400">Peak Today</span>
              <span class="text-2xl font-bold">${status.peakPlayers || 0}</span>
            </div>
            <div class="flex justify-between items-center p-3 bg-gtx-glass rounded-lg">
              <span class="text-gray-400">Total Connections</span>
              <span class="text-2xl font-bold">${status.totalConnections || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Server Information</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-1">Server Name</div>
            <div class="text-lg font-medium">${status.serverName || 'DayZ Server'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Map</div>
            <div class="text-lg font-medium">${status.map || 'Chernarus'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Version</div>
            <div class="text-lg font-medium font-mono">${status.version || 'Unknown'}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Build</div>
            <div class="text-lg font-medium font-mono">${status.build || 'Unknown'}</div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function formatUptime(seconds) {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return \`\${days}d \${hours}h \${minutes}m\`;
      }

      function formatBytes(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }

      async function handleStartServer() {
        try {
          await window.api.startServer();
          setTimeout(() => router.navigate('/server-status'), 2000);
        } catch (error) {
          alert('Failed to start server: ' + error.message);
        }
      }

      async function handleStopServer() {
        if (confirm('Are you sure you want to stop the server?')) {
          try {
            await window.api.stopServer();
            setTimeout(() => router.navigate('/server-status'), 2000);
          } catch (error) {
            alert('Failed to stop server: ' + error.message);
          }
        }
      }

      async function handleRestartServer() {
        if (confirm('Are you sure you want to restart the server?')) {
          try {
            await window.api.stopServer();
            setTimeout(async () => {
              await window.api.startServer();
              setTimeout(() => router.navigate('/server-status'), 2000);
            }, 3000);
          } catch (error) {
            alert('Failed to restart server: ' + error.message);
          }
        }
      }

      // Update uptime every second
      setInterval(async () => {
        const status = await window.api.getServerStatus().catch(() => ({}));
        if (status.running && status.uptime) {
          document.getElementById('uptime').textContent = formatUptime(status.uptime);
        }
      }, 1000);
    </script>
  `;
}

