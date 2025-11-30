export default async function PlayerTeleportPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Player Teleport</h1>
        <button onclick="teleport()" class="btn-primary">Teleport</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Player ID</label>
            <input type="text" id="teleport-player-id" class="input-field w-full" value="${new URLSearchParams(window.location.search).get('playerId') || ''}" placeholder="Player ID">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Position</label>
            <div class="flex gap-2">
              <input type="number" id="teleport-x" class="input-field flex-1" placeholder="X" step="0.01">
              <input type="number" id="teleport-y" class="input-field flex-1" placeholder="Y" step="0.01">
              <input type="number" id="teleport-z" class="input-field flex-1" placeholder="Z" step="0.01">
            </div>
          </div>
        </div>
        <div class="mt-4 glass-card p-4">
          <div class="text-sm text-gray-400 mb-2">Quick Locations</div>
          <div class="flex flex-wrap gap-2">
            <button onclick="setLocation(0, 0, 0)" class="btn-secondary text-xs">Origin</button>
            <button onclick="setLocation(3650, 0, 3000)" class="btn-secondary text-xs">Cherno</button>
            <button onclick="setLocation(12000, 0, 12000)" class="btn-secondary text-xs">Elektro</button>
            <button onclick="setLocation(8000, 0, 8000)" class="btn-secondary text-xs">Berezino</button>
          </div>
        </div>
      </div>
    </div>
    <script>
      function setLocation(x, y, z) {
        document.getElementById('teleport-x').value = x;
        document.getElementById('teleport-y').value = y;
        document.getElementById('teleport-z').value = z;
      }
      async function teleport() {
        const playerId = document.getElementById('teleport-player-id').value;
        const position = {
          x: parseFloat(document.getElementById('teleport-x').value) || 0,
          y: parseFloat(document.getElementById('teleport-y').value) || 0,
          z: parseFloat(document.getElementById('teleport-z').value) || 0
        };
        if (!playerId) {
          alert('Enter player ID');
          return;
        }
        try {
          await window.api.teleportPlayer(playerId, position);
          alert('Teleport command sent');
        } catch (error) {
          alert('Teleport failed');
        }
      }
    </script>
  `;
}

