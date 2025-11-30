export default async function PerformancePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Performance Monitor</h1>
        <div class="flex gap-3">
          <button onclick="startMonitoring()" class="btn-primary" id="monitor-btn">Start Monitoring</button>
          <button onclick="exportData()" class="btn-secondary">Export Data</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">CPU Usage</h2>
          <canvas id="cpu-chart" width="400" height="200"></canvas>
          <div class="mt-4 flex justify-between">
            <div>
              <div class="text-sm text-gray-400">Current</div>
              <div class="text-2xl font-bold" id="cpu-current">0%</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Average</div>
              <div class="text-2xl font-bold" id="cpu-avg">0%</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Peak</div>
              <div class="text-2xl font-bold" id="cpu-peak">0%</div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Memory Usage</h2>
          <canvas id="memory-chart" width="400" height="200"></canvas>
          <div class="mt-4 flex justify-between">
            <div>
              <div class="text-sm text-gray-400">Current</div>
              <div class="text-2xl font-bold" id="memory-current">0 MB</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Average</div>
              <div class="text-2xl font-bold" id="memory-avg">0 MB</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Peak</div>
              <div class="text-2xl font-bold" id="memory-peak">0 MB</div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Network I/O</h2>
          <canvas id="network-chart" width="400" height="200"></canvas>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-400">Upload</div>
              <div class="text-xl font-bold" id="network-up">0 KB/s</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Download</div>
              <div class="text-xl font-bold" id="network-down">0 KB/s</div>
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Disk I/O</h2>
          <canvas id="disk-chart" width="400" height="200"></canvas>
          <div class="mt-4 grid grid-cols-2 gap-4">
            <div>
              <div class="text-sm text-gray-400">Read</div>
              <div class="text-xl font-bold" id="disk-read">0 KB/s</div>
            </div>
            <div>
              <div class="text-sm text-gray-400">Write</div>
              <div class="text-xl font-bold" id="disk-write">0 KB/s</div>
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">System Resources</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-400 mb-2">System CPU</div>
            <div class="w-full bg-gtx-glass rounded-full h-3">
              <div class="bg-gtx-accent h-3 rounded-full transition-all" id="sys-cpu-bar" style="width: 0%"></div>
            </div>
            <div class="text-lg font-bold mt-1" id="sys-cpu">0%</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-2">System RAM</div>
            <div class="w-full bg-gtx-glass rounded-full h-3">
              <div class="bg-gtx-accent h-3 rounded-full transition-all" id="sys-ram-bar" style="width: 0%"></div>
            </div>
            <div class="text-lg font-bold mt-1" id="sys-ram">0%</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-2">Disk Usage</div>
            <div class="w-full bg-gtx-glass rounded-full h-3">
              <div class="bg-gtx-accent h-3 rounded-full transition-all" id="disk-usage-bar" style="width: 0%"></div>
            </div>
            <div class="text-lg font-bold mt-1" id="disk-usage">0%</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-2">Network Usage</div>
            <div class="w-full bg-gtx-glass rounded-full h-3">
              <div class="bg-gtx-accent h-3 rounded-full transition-all" id="network-usage-bar" style="width: 0%"></div>
            </div>
            <div class="text-lg font-bold mt-1" id="network-usage">0%</div>
          </div>
        </div>
      </div>
    </div>

    <script>
      let monitoring = false;
      let cpuData = [];
      let memoryData = [];
      let networkData = [];
      let diskData = [];
      const maxDataPoints = 60;

      function startMonitoring() {
        monitoring = !monitoring;
        document.getElementById('monitor-btn').textContent = monitoring ? 'Stop Monitoring' : 'Start Monitoring';
        
        if (monitoring) {
          monitorLoop();
        }
      }

      async function monitorLoop() {
        if (!monitoring) return;
        
        try {
          const stats = await window.api.getServerStats();
          updateCharts(stats);
        } catch (error) {
          console.error('Failed to get stats:', error);
        }
        
        setTimeout(monitorLoop, 1000);
      }

      function updateCharts(stats) {
        // Update CPU
        cpuData.push(stats.cpu || 0);
        if (cpuData.length > maxDataPoints) cpuData.shift();
        updateChart('cpu-chart', cpuData, '#007AFF');
        document.getElementById('cpu-current').textContent = (stats.cpu || 0).toFixed(1) + '%';
        document.getElementById('cpu-avg').textContent = (cpuData.reduce((a, b) => a + b, 0) / cpuData.length).toFixed(1) + '%';
        document.getElementById('cpu-peak').textContent = Math.max(...cpuData).toFixed(1) + '%';

        // Update Memory
        const memoryMB = (stats.memory || 0) / 1024 / 1024;
        memoryData.push(memoryMB);
        if (memoryData.length > maxDataPoints) memoryData.shift();
        updateChart('memory-chart', memoryData, '#34C759');
        document.getElementById('memory-current').textContent = memoryMB.toFixed(0) + ' MB';
        document.getElementById('memory-avg').textContent = (memoryData.reduce((a, b) => a + b, 0) / memoryData.length).toFixed(0) + ' MB';
        document.getElementById('memory-peak').textContent = Math.max(...memoryData).toFixed(0) + ' MB';

        // Update system resources
        if (stats.systemCpu !== undefined) {
          document.getElementById('sys-cpu').textContent = stats.systemCpu.toFixed(1) + '%';
          document.getElementById('sys-cpu-bar').style.width = stats.systemCpu + '%';
        }
        if (stats.systemMemory) {
          const ramPercent = stats.systemMemory.percent || 0;
          document.getElementById('sys-ram').textContent = ramPercent.toFixed(1) + '%';
          document.getElementById('sys-ram-bar').style.width = ramPercent + '%';
        }
      }

      function updateChart(canvasId, data, color) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        const max = Math.max(...data, 1);
        const stepX = width / maxDataPoints;
        
        data.forEach((value, index) => {
          const x = index * stepX;
          const y = height - (value / max * height);
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        
        ctx.stroke();
      }

      function exportData() {
        const data = {
          cpu: cpuData,
          memory: memoryData,
          timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'performance-data.json';
        a.click();
      }

      // Start monitoring automatically
      startMonitoring();
    </script>
  `;
}

