export default async function MapViewerPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">2D Map Viewer</h1>
        <div class="flex gap-3">
          <button onclick="loadMap()" class="btn-primary">Load Map</button>
          <button onclick="exportMap()" class="btn-secondary">Export</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <canvas id="map-canvas" width="1024" height="1024" class="w-full border border-gtx-border rounded cursor-crosshair" onclick="handleMapClick(event)"></canvas>
        <div class="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div>Coordinates: <span id="map-coords">0, 0</span></div>
          <div>Zoom: <span id="map-zoom">100%</span></div>
        </div>
      </div>
    </div>
    <script>
      let mapData = null;
      async function loadMap() {
        try {
          const data = await window.api.request('/api/map/data');
          mapData = data;
          renderMap();
        } catch (error) {
          alert('Failed to load map');
        }
      }
      function renderMap() {
        const canvas = document.getElementById('map-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Render map visualization
      }
      function handleMapClick(event) {
        const canvas = document.getElementById('map-canvas');
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const mapX = (x / canvas.width) * 15360;
        const mapY = (y / canvas.height) * 15360;
        document.getElementById('map-coords').textContent = \`\${mapX.toFixed(0)}, \${mapY.toFixed(0)}\`;
      }
      function exportMap() {
        const canvas = document.getElementById('map-canvas');
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'map.png';
          a.click();
        });
      }
      loadMap();
    </script>
  `;
}

