export default async function PlayersPage() {
  const players = await window.api.getOnlinePlayers().catch(() => []);
  
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Live Player List</h1>
        <div class="flex gap-3">
          <button onclick="refreshPlayers()" class="btn-secondary">Refresh</button>
          <button onclick="router.navigate('/player-manager')" class="btn-primary">Manage Players</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Online Players (${players.length})</h2>
          <div class="flex items-center gap-4">
            <input type="text" id="player-search" placeholder="Search players..." class="input-field w-64" oninput="filterPlayers()">
            <select id="sort-by" class="input-field" onchange="sortPlayers()">
              <option value="name">Sort by Name</option>
              <option value="ping">Sort by Ping</option>
              <option value="time">Sort by Playtime</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gtx-border">
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Player</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Steam ID</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Ping</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Playtime</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Location</th>
                <th class="text-left py-3 px-4 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody id="players-table">
              ${players.length === 0 ? `
                <tr>
                  <td colspan="6" class="text-center py-8 text-gray-400">No players online</td>
                </tr>
              ` : players.map(player => `
                <tr class="border-b border-gtx-border hover:bg-gtx-glass transition-colors" data-player-id="${player.id}">
                  <td class="py-3 px-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-gtx-accent flex items-center justify-center font-bold">
                        ${player.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div class="font-medium">${player.name || 'Unknown'}</div>
                        <div class="text-xs text-gray-400">ID: ${player.id}</div>
                      </div>
                    </div>
                  </td>
                  <td class="py-3 px-4 font-mono text-sm">${player.steamId || 'N/A'}</td>
                  <td class="py-3 px-4">
                    <span class="px-2 py-1 rounded ${player.ping < 50 ? 'bg-green-500/20 text-green-400' : player.ping < 100 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}">
                      ${player.ping || 0}ms
                    </span>
                  </td>
                  <td class="py-3 px-4">${formatPlaytime(player.playtime || 0)}</td>
                  <td class="py-3 px-4">
                    <div class="text-sm">${player.location || 'Unknown'}</div>
                    <div class="text-xs text-gray-400 font-mono">${player.coordinates || 'N/A'}</div>
                  </td>
                  <td class="py-3 px-4">
                    <div class="flex gap-2">
                      <button onclick="viewPlayerInventory('${player.id}')" class="text-blue-400 hover:text-blue-300 text-sm" title="View Inventory">🎒</button>
                      <button onclick="teleportPlayer('${player.id}')" class="text-green-400 hover:text-green-300 text-sm" title="Teleport">🚀</button>
                      <button onclick="kickPlayer('${player.id}')" class="text-yellow-400 hover:text-yellow-300 text-sm" title="Kick">👢</button>
                      <button onclick="banPlayer('${player.id}')" class="text-red-400 hover:text-red-300 text-sm" title="Ban">🚫</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Total Players</div>
          <div class="text-3xl font-bold">${players.length}</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Average Ping</div>
          <div class="text-3xl font-bold">${players.length > 0 ? Math.round(players.reduce((sum, p) => sum + (p.ping || 0), 0) / players.length) : 0}ms</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Total Playtime</div>
          <div class="text-3xl font-bold">${formatPlaytime(players.reduce((sum, p) => sum + (p.playtime || 0), 0))}</div>
        </div>
      </div>
    </div>

    <script>
      function formatPlaytime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return \`\${hours}h \${minutes}m\`;
      }

      function filterPlayers() {
        const search = document.getElementById('player-search').value.toLowerCase();
        const rows = document.querySelectorAll('#players-table tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(search) ? '' : 'none';
        });
      }

      function sortPlayers() {
        const sortBy = document.getElementById('sort-by').value;
        const tbody = document.getElementById('players-table');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
          const aData = a.dataset;
          const bData = b.dataset;
          // Simplified sorting - in real app, would use actual data
          return 0;
        });
        
        rows.forEach(row => tbody.appendChild(row));
      }

      async function refreshPlayers() {
        const players = await window.api.getOnlinePlayers().catch(() => []);
        router.navigate('/players');
      }

      function viewPlayerInventory(playerId) {
        router.navigate(\`/player-inventory?playerId=\${playerId}\`);
      }

      function teleportPlayer(playerId) {
        router.navigate(\`/player-teleport?playerId=\${playerId}\`);
      }

      async function kickPlayer(playerId) {
        const reason = prompt('Enter kick reason:');
        if (reason) {
          try {
            await window.api.kickPlayer(playerId, reason);
            alert('Player kicked successfully');
            refreshPlayers();
          } catch (error) {
            alert('Failed to kick player: ' + error.message);
          }
        }
      }

      async function banPlayer(playerId) {
        const reason = prompt('Enter ban reason:');
        const duration = prompt('Enter ban duration in hours (0 for permanent):');
        if (reason && duration !== null) {
          try {
            await window.api.banPlayer(playerId, reason, parseInt(duration) || 0);
            alert('Player banned successfully');
            refreshPlayers();
          } catch (error) {
            alert('Failed to ban player: ' + error.message);
          }
        }
      }

      // Auto-refresh every 5 seconds
      setInterval(refreshPlayers, 5000);
    </script>
  `;
}

