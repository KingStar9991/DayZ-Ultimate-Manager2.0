export default async function TraderSpawnPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">NPC Trader Spawn Tool</h1>
        <button onclick="spawnTrader()" class="btn-primary">Spawn Trader</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Trader Class</label>
            <input type="text" id="trader-class" class="input-field w-full" placeholder="TraderNPC">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Position</label>
            <div class="flex gap-2">
              <input type="number" id="spawn-x" class="input-field flex-1" placeholder="X" step="0.01">
              <input type="number" id="spawn-y" class="input-field flex-1" placeholder="Y" step="0.01">
              <input type="number" id="spawn-z" class="input-field flex-1" placeholder="Z" step="0.01">
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Orientation</label>
            <input type="number" id="spawn-orient" class="input-field w-full" placeholder="0" step="0.01">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Trader Config</label>
            <input type="text" id="trader-config" class="input-field w-full" placeholder="TraderConfigName">
          </div>
        </div>
      </div>
    </div>
    <script>
      async function spawnTrader() {
        const traderClass = document.getElementById('trader-class').value;
        const position = {
          x: parseFloat(document.getElementById('spawn-x').value) || 0,
          y: parseFloat(document.getElementById('spawn-y').value) || 0,
          z: parseFloat(document.getElementById('spawn-z').value) || 0
        };
        const orientation = parseFloat(document.getElementById('spawn-orient').value) || 0;
        const config = document.getElementById('trader-config').value;
        try {
          await window.api.request('/api/trader/spawn', {
            method: 'POST',
            body: { traderClass, position, orientation, config }
          });
          alert('Trader spawn command sent');
        } catch (error) {
          alert('Spawn failed');
        }
      }
    </script>
  `;
}

