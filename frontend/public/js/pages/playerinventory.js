export default async function PlayerInventoryPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Player Inventory Viewer</h1>
        <button onclick="loadInventory()" class="btn-primary">Load Inventory</button>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <input type="text" id="player-id-input" class="input-field w-64" placeholder="Player ID" value="${new URLSearchParams(window.location.search).get('playerId') || ''}">
        </div>
        <div id="inventory-display" class="space-y-4">
          <div class="text-center text-gray-400 py-8">Enter player ID and click "Load Inventory"</div>
        </div>
      </div>
    </div>
    <script>
      async function loadInventory() {
        const playerId = document.getElementById('player-id-input').value;
        if (!playerId) {
          alert('Enter player ID');
          return;
        }
        const container = document.getElementById('inventory-display');
        container.innerHTML = '<div class="text-gray-400">Loading...</div>';
        try {
          const inventory = await window.api.getPlayerInventory(playerId);
          container.innerHTML = \`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="glass-card p-4">
                <div class="font-medium mb-2">Hands</div>
                <div class="text-sm text-gray-400">\${inventory.hands || 'Empty'}</div>
              </div>
              <div class="glass-card p-4">
                <div class="font-medium mb-2">Backpack</div>
                <div class="text-sm text-gray-400">\${inventory.backpack || 'Empty'}</div>
              </div>
              <div class="glass-card p-4">
                <div class="font-medium mb-2">Vest</div>
                <div class="text-sm text-gray-400">\${inventory.vest || 'Empty'}</div>
              </div>
            </div>
            <div class="glass-card p-4 mt-4">
              <div class="font-medium mb-2">Items</div>
              <div class="space-y-1 text-sm">
                \${(inventory.items || []).map(i => \`<div>\${i.class} x\${i.quantity || 1}</div>\`).join('')}
              </div>
            </div>
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Failed to load inventory</div>';
        }
      }
      if (document.getElementById('player-id-input').value) {
        loadInventory();
      }
    </script>
  `;
}

