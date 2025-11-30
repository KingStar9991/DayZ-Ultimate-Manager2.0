export default async function CoordinatesPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Coordinate Helper</h1>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Convert Coordinates</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">World Coordinates (X, Y, Z)</label>
              <div class="flex gap-2">
                <input type="number" id="world-x" class="input-field flex-1" placeholder="X" step="0.01">
                <input type="number" id="world-y" class="input-field flex-1" placeholder="Y" step="0.01">
                <input type="number" id="world-z" class="input-field flex-1" placeholder="Z" step="0.01">
              </div>
            </div>
            <button onclick="convertToGrid()" class="btn-primary w-full">Convert to Grid</button>
            <div class="glass-card p-3">
              <div class="text-sm text-gray-400 mb-1">Grid Coordinates</div>
              <div class="font-mono" id="grid-result">-</div>
            </div>
          </div>
        </div>
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Location Database</h2>
          <input type="text" id="location-search" placeholder="Search locations..." class="input-field w-full mb-4" oninput="searchLocations()">
          <div id="locations-list" class="space-y-2 max-h-96 overflow-y-auto">
            <div class="glass-card p-3">
              <div class="font-medium">Cherno</div>
              <div class="text-sm text-gray-400 font-mono">3650, 0, 3000</div>
            </div>
            <div class="glass-card p-3">
              <div class="font-medium">Elektrozavodsk</div>
              <div class="text-sm text-gray-400 font-mono">12000, 0, 12000</div>
            </div>
            <div class="glass-card p-3">
              <div class="font-medium">Berezino</div>
              <div class="text-sm text-gray-400 font-mono">8000, 0, 8000</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      function convertToGrid() {
        const x = parseFloat(document.getElementById('world-x').value) || 0;
        const y = parseFloat(document.getElementById('world-y').value) || 0;
        const z = parseFloat(document.getElementById('world-z').value) || 0;
        const gridX = Math.floor(x / 100);
        const gridY = Math.floor(z / 100);
        document.getElementById('grid-result').textContent = \`\${gridX}, \${gridY}\`;
      }
      function searchLocations() {
        const search = document.getElementById('location-search').value.toLowerCase();
        document.querySelectorAll('#locations-list > div').forEach(el => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(search) ? '' : 'none';
        });
      }
    </script>
  `;
}

