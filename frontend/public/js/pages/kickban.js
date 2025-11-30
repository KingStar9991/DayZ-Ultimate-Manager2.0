export default async function KickBanPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Kick/Ban Panel</h1>
        <button onclick="loadPlayers()" class="btn-primary">Load Players</button>
      </div>
      <div class="glass-panel p-6">
        <div id="players-list" class="space-y-3 mb-6">
          <div class="text-center text-gray-400 py-8">Click "Load Players" to view online players</div>
        </div>
        <div id="action-panel" class="glass-card p-4 hidden">
          <h3 class="font-bold mb-4">Action</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Reason</label>
              <input type="text" id="action-reason" class="input-field w-full" placeholder="Reason for action">
            </div>
            <div id="ban-duration-container" class="hidden">
              <label class="block text-sm text-gray-400 mb-2">Duration (hours, 0 for permanent)</label>
              <input type="number" id="ban-duration" class="input-field w-full" value="0" min="0">
            </div>
            <div class="flex gap-3">
              <button onclick="executeKick()" class="btn-secondary flex-1">Kick</button>
              <button onclick="executeBan()" class="btn-secondary flex-1 bg-red-500/20 text-red-400">Ban</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      let selectedPlayerId = null;
      async function loadPlayers() {
        try {
          const players = await window.api.getOnlinePlayers();
          renderPlayers(players || []);
        } catch (error) {
          alert('Failed to load players');
        }
      }
      function renderPlayers(players) {
        const container = document.getElementById('players-list');
        container.innerHTML = players.map(p => \`
          <div class="glass-card p-3 cursor-pointer hover:bg-opacity-80" onclick="selectPlayer('\${p.id}', '\${p.name}')">
            <div class="font-medium">\${p.name || 'Unknown'}</div>
            <div class="text-sm text-gray-400">\${p.steamId || 'N/A'}</div>
          </div>
        \`).join('');
      }
      function selectPlayer(playerId, playerName) {
        selectedPlayerId = playerId;
        document.getElementById('action-panel').classList.remove('hidden');
        document.getElementById('action-panel').querySelector('h3').textContent = \`Action for \${playerName}\`;
      }
      async function executeKick() {
        if (!selectedPlayerId) return;
        const reason = document.getElementById('action-reason').value || 'No reason provided';
        try {
          await window.api.kickPlayer(selectedPlayerId, reason);
          alert('Player kicked');
          loadPlayers();
        } catch (error) {
          alert('Kick failed');
        }
      }
      async function executeBan() {
        if (!selectedPlayerId) return;
        const reason = document.getElementById('action-reason').value || 'No reason provided';
        const duration = parseInt(document.getElementById('ban-duration').value) || 0;
        try {
          await window.api.banPlayer(selectedPlayerId, reason, duration);
          alert('Player banned');
          loadPlayers();
        } catch (error) {
          alert('Ban failed');
        }
      }
      document.getElementById('action-panel').addEventListener('click', function(e) {
        if (e.target.textContent === 'Ban') {
          document.getElementById('ban-duration-container').classList.remove('hidden');
        }
      });
    </script>
  `;
}

