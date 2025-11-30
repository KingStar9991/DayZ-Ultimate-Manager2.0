export default async function PlayerLogsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Player Log History Viewer</h1>
        <div class="flex gap-3">
          <input type="text" id="player-search-input" placeholder="Search player..." class="input-field w-64" onkeypress="if(event.key==='Enter') searchPlayer()">
          <button onclick="searchPlayer()" class="btn-primary">Search</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div id="player-logs" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Search for a player to view their log history</div>
        </div>
      </div>
    </div>
    <script>
      async function searchPlayer() {
        const search = document.getElementById('player-search-input').value;
        if (!search) {
          alert('Enter player name or ID');
          return;
        }
        const container = document.getElementById('player-logs');
        container.innerHTML = '<div class="text-gray-400">Searching...</div>';
        try {
          const logs = await window.api.request(\`/api/player/logs?search=\${encodeURIComponent(search)}\`);
          renderLogs(logs || []);
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Search failed</div>';
        }
      }
      function renderLogs(logs) {
        const container = document.getElementById('player-logs');
        if (logs.length === 0) {
          container.innerHTML = '<div class="text-center text-gray-400 py-8">No logs found</div>';
          return;
        }
        container.innerHTML = logs.map(log => \`
          <div class="glass-card p-3">
            <div class="flex justify-between items-start">
              <div>
                <div class="font-medium">\${log.event || 'Unknown'}</div>
                <div class="text-sm text-gray-400">\${new Date(log.timestamp).toLocaleString()}</div>
              </div>
              <span class="px-2 py-1 rounded text-xs \${log.type === 'error' ? 'bg-red-500/20 text-red-400' : log.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'}">\${log.type || 'info'}</span>
            </div>
            <div class="text-sm text-gray-400 mt-2">\${log.details || ''}</div>
          </div>
        \`).join('');
      }
    </script>
  `;
}

