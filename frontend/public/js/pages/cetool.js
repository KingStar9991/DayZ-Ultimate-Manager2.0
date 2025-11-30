export default async function CEToolPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">CE Tool Visual Map</h1>
        <div class="flex gap-3">
          <button onclick="loadHeatmap()" class="btn-primary">Load Heatmap</button>
          <button onclick="exportHeatmap()" class="btn-secondary">Export</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <canvas id="heatmap-canvas" width="800" height="800" class="w-full border border-gtx-border rounded"></canvas>
      </div>
      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Statistics</h2>
        <div class="grid grid-cols-4 gap-4">
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400">Total Spawns</div>
            <div class="text-2xl font-bold" id="total-spawns">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400">Hot Zones</div>
            <div class="text-2xl font-bold" id="hot-zones">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400">Cold Zones</div>
            <div class="text-2xl font-bold" id="cold-zones">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400">Average Density</div>
            <div class="text-2xl font-bold" id="avg-density">0</div>
          </div>
        </div>
      </div>
    </div>
    <script>
      async function loadHeatmap() {
        try {
          const heatmap = await window.api.getMapHeatmap();
          renderHeatmap(heatmap);
        } catch (error) {
          alert('Failed to load heatmap');
        }
      }
      function renderHeatmap(data) {
        const canvas = document.getElementById('heatmap-canvas');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Render heatmap visualization
        document.getElementById('total-spawns').textContent = data.totalSpawns || 0;
        document.getElementById('hot-zones').textContent = data.hotZones || 0;
        document.getElementById('cold-zones').textContent = data.coldZones || 0;
        document.getElementById('avg-density').textContent = (data.avgDensity || 0).toFixed(2);
      }
      function exportHeatmap() {
        const canvas = document.getElementById('heatmap-canvas');
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'heatmap.png';
          a.click();
        });
      }
      loadHeatmap();
    </script>
  `;
}

