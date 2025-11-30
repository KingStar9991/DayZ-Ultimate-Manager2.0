export default async function DashboardPage() {
  const stats = await window.api.getServerStatus().catch(() => ({}));
  
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <div class="flex gap-3">
          <button onclick="window.api.startServer()" class="btn-primary">Start Server</button>
          <button onclick="window.api.stopServer()" class="btn-secondary">Stop Server</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="stat-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Server Status</span>
            <span class="text-2xl">${stats.running ? '🟢' : '🔴'}</span>
          </div>
          <h3 class="text-2xl font-bold text-white">${stats.running ? 'Online' : 'Offline'}</h3>
          <p class="text-gray-400 text-sm mt-1">${stats.uptime || '0'} seconds</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Players Online</span>
            <span class="text-2xl">👥</span>
          </div>
          <h3 class="text-2xl font-bold text-white">${stats.players || 0}</h3>
          <p class="text-gray-400 text-sm mt-1">Max: ${stats.maxPlayers || 60}</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">CPU Usage</span>
            <span class="text-2xl">⚡</span>
          </div>
          <h3 class="text-2xl font-bold text-white">${stats.cpu || 0}%</h3>
          <p class="text-gray-400 text-sm mt-1">Server Process</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center justify-between mb-2">
            <span class="text-gray-400 text-sm">Memory Usage</span>
            <span class="text-2xl">💾</span>
          </div>
          <h3 class="text-2xl font-bold text-white">${stats.memory ? (stats.memory / 1024 / 1024).toFixed(0) : 0} MB</h3>
          <p class="text-gray-400 text-sm mt-1">RAM Consumption</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Quick Actions</h2>
          <div class="grid grid-cols-2 gap-3">
            <button onclick="router.navigate('/server-config')" class="btn-secondary text-left p-4">
              <div class="text-lg mb-1">⚙️</div>
              <div class="font-medium">Server Config</div>
            </button>
            <button onclick="router.navigate('/mods')" class="btn-secondary text-left p-4">
              <div class="text-lg mb-1">📚</div>
              <div class="font-medium">Mod Manager</div>
            </button>
            <button onclick="router.navigate('/logs')" class="btn-secondary text-left p-4">
              <div class="text-lg mb-1">📝</div>
              <div class="font-medium">View Logs</div>
            </button>
            <button onclick="router.navigate('/backups')" class="btn-secondary text-left p-4">
              <div class="text-lg mb-1">💾</div>
              <div class="font-medium">Backups</div>
            </button>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-3 p-3 bg-gtx-glass rounded-lg">
              <span class="text-green-400">✓</span>
              <div class="flex-1">
                <div class="text-sm font-medium">Server started successfully</div>
                <div class="text-xs text-gray-400">2 minutes ago</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gtx-glass rounded-lg">
              <span class="text-blue-400">ℹ</span>
              <div class="flex-1">
                <div class="text-sm font-medium">Mod updated: Community Framework</div>
                <div class="text-xs text-gray-400">15 minutes ago</div>
              </div>
            </div>
            <div class="flex items-center gap-3 p-3 bg-gtx-glass rounded-lg">
              <span class="text-yellow-400">⚠</span>
              <div class="flex-1">
                <div class="text-sm font-medium">Backup scheduled for tonight</div>
                <div class="text-xs text-gray-400">1 hour ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">System Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-400">System CPU</span>
              <span class="text-sm font-medium" id="sys-cpu">0%</span>
            </div>
            <div class="w-full bg-gtx-glass rounded-full h-2">
              <div class="bg-gtx-accent h-2 rounded-full transition-all" style="width: 0%" id="sys-cpu-bar"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-400">System RAM</span>
              <span class="text-sm font-medium" id="sys-ram">0%</span>
            </div>
            <div class="w-full bg-gtx-glass rounded-full h-2">
              <div class="bg-gtx-accent h-2 rounded-full transition-all" style="width: 0%" id="sys-ram-bar"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm text-gray-400">Disk Usage</span>
              <span class="text-sm font-medium">45%</span>
            </div>
            <div class="w-full bg-gtx-glass rounded-full h-2">
              <div class="bg-gtx-accent h-2 rounded-full transition-all" style="width: 45%"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

