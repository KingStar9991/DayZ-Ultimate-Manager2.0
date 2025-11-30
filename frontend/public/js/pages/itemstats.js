export default async function ItemStatsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Item Statistics Inspector</h1>
        <input type="text" id="item-class-input" placeholder="ItemClassName" class="input-field w-64" onkeypress="if(event.key==='Enter') inspectItem()">
        <button onclick="inspectItem()" class="btn-primary">Inspect</button>
      </div>
      <div id="item-stats" class="glass-panel p-6">
        <div class="text-center text-gray-400 py-8">Enter an item class name to inspect</div>
      </div>
    </div>
    <script>
      async function inspectItem() {
        const itemClass = document.getElementById('item-class-input').value;
        if (!itemClass) {
          alert('Enter item class name');
          return;
        }
        const container = document.getElementById('item-stats');
        container.innerHTML = '<div class="text-gray-400">Loading...</div>';
        try {
          const stats = await window.api.request(\`/api/trader/item-stats/\${itemClass}\`);
          container.innerHTML = \`
            <div class="space-y-4">
              <div class="font-medium text-xl">\${stats.class || itemClass}</div>
              <div class="grid grid-cols-2 gap-4">
                <div class="glass-card p-3">
                  <div class="text-sm text-gray-400">Name</div>
                  <div class="font-medium">\${stats.name || 'N/A'}</div>
                </div>
                <div class="glass-card p-3">
                  <div class="text-sm text-gray-400">Category</div>
                  <div class="font-medium">\${stats.category || 'N/A'}</div>
                </div>
                <div class="glass-card p-3">
                  <div class="text-sm text-gray-400">Weight</div>
                  <div class="font-medium">\${stats.weight || 'N/A'} kg</div>
                </div>
                <div class="glass-card p-3">
                  <div class="text-sm text-gray-400">Value</div>
                  <div class="font-medium">\${stats.value || 'N/A'}</div>
                </div>
              </div>
            </div>
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Failed to load stats</div>';
        }
      }
    </script>
  `;
}

