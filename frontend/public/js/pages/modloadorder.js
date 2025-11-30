export default async function ModLoadOrderPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Load Order Manager</h1>
        <div class="flex gap-3">
          <button onclick="loadOrder()" class="btn-primary">Load Order</button>
          <button onclick="saveOrder()" class="btn-secondary">Save Order</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <input type="text" id="servercfg-path" class="input-field w-full font-mono text-sm" placeholder="serverDZ.cfg path">
        </div>
        <div id="load-order-list" class="space-y-2">
          <div class="text-center text-gray-400 py-8">Load server config to view mod order</div>
        </div>
      </div>
    </div>
    <script>
      let modOrder = [];
      async function loadOrder() {
        const path = document.getElementById('servercfg-path').value || prompt('Enter serverDZ.cfg path:');
        if (!path) return;
        try {
          const order = await window.api.getLoadOrder(path);
          modOrder = order.mods || [];
          renderOrder();
        } catch (error) {
          alert('Load failed');
        }
      }
      function renderOrder() {
        const container = document.getElementById('load-order-list');
        container.innerHTML = modOrder.map((mod, i) => \`
          <div class="glass-card p-3 flex items-center gap-3">
            <span class="text-gray-400 w-8">\${i + 1}</span>
            <span class="flex-1 font-mono text-sm">\${mod}</span>
            <button onclick="moveUp(\${i})" class="btn-secondary text-xs" \${i === 0 ? 'disabled' : ''}>↑</button>
            <button onclick="moveDown(\${i})" class="btn-secondary text-xs" \${i === modOrder.length - 1 ? 'disabled' : ''}>↓</button>
          </div>
        \`).join('');
      }
      function moveUp(index) {
        if (index === 0) return;
        [modOrder[index], modOrder[index - 1]] = [modOrder[index - 1], modOrder[index]];
        renderOrder();
      }
      function moveDown(index) {
        if (index === modOrder.length - 1) return;
        [modOrder[index], modOrder[index + 1]] = [modOrder[index + 1], modOrder[index]];
        renderOrder();
      }
      async function saveOrder() {
        const path = document.getElementById('servercfg-path').value;
        if (!path) {
          alert('Enter config path');
          return;
        }
        try {
          await window.api.setLoadOrder(path, modOrder);
          alert('Order saved');
        } catch (error) {
          alert('Save failed');
        }
      }
    </script>
  `;
}

