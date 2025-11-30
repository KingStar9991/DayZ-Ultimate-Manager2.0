export default async function ItemDatabasePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Item Class Database Viewer</h1>
        <input type="text" id="item-search" placeholder="Search items..." class="input-field w-64" oninput="searchItems()">
      </div>
      <div class="glass-panel p-6">
        <div id="items-list" class="space-y-2 max-h-96 overflow-y-auto">
          <div class="text-center text-gray-400 py-8">Loading item database...</div>
        </div>
      </div>
    </div>
    <script>
      async function loadItems() {
        try {
          const items = await window.api.request('/api/trader/items');
          renderItems(items || []);
        } catch (error) {
          document.getElementById('items-list').innerHTML = '<div class="text-red-400">Failed to load items</div>';
        }
      }
      function renderItems(items) {
        const container = document.getElementById('items-list');
        container.innerHTML = items.map(i => \`
          <div class="glass-card p-3" data-item-class="\${i.class}">
            <div class="font-medium font-mono">\${i.class}</div>
            <div class="text-sm text-gray-400">\${i.name || 'Unknown'}</div>
            <div class="text-sm text-gray-400">Category: \${i.category || 'N/A'}</div>
          </div>
        \`).join('');
      }
      function searchItems() {
        const search = document.getElementById('item-search').value.toLowerCase();
        document.querySelectorAll('#items-list > div').forEach(el => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(search) ? '' : 'none';
        });
      }
      loadItems();
    </script>
  `;
}

