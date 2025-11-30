export default async function PlayerManagerPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Online Players Manager</h1>
        <button onclick="refreshPlayers()" class="btn-primary">Refresh</button>
      </div>
      <div class="glass-panel p-6">
        <div id="players-manager-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Loading players...</div>
        </div>
      </div>
    </div>
    <script>
      async function refreshPlayers() {
        try {
          const players = await window.api.getOnlinePlayers();
          renderPlayers(players || []);
        } catch (error) {
          document.getElementById('players-manager-list').innerHTML = '<div class="text-red-400">Failed to load players</div>';
        }
      }
      function renderPlayers(players) {
        const container = document.getElementById('players-manager-list');
        if (players.length === 0) {
          container.innerHTML = '<div class="text-center text-gray-400 py-8">No players online</div>';
          return;
        }
        container.innerHTML = players.map(p => \`
          <div class="glass-card p-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium">\${p.name || 'Unknown'}</div>
                <div class="text-sm text-gray-400">ID: \${p.id} | Steam: \${p.steamId || 'N/A'}</div>
              </div>
              <div class="flex gap-2">
                <button onclick="viewInventory('\${p.id}')" class="btn-secondary text-sm">Inventory</button>
                <button onclick="teleportPlayer('\${p.id}')" class="btn-secondary text-sm">Teleport</button>
              </div>
            </div>
          </div>
        \`).join('');
      }
      function viewInventory(playerId) {
        router.navigate(\`/player-inventory?playerId=\${playerId}\`);
      }
      function teleportPlayer(playerId) {
        router.navigate(\`/player-teleport?playerId=\${playerId}\`);
      }
      refreshPlayers();
      setInterval(refreshPlayers, 5000);
    </script>
  `;
}

