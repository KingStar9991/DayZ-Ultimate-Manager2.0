export default async function CrashLogsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Crash Log Analyzer</h1>
        <div class="flex gap-3">
          <button onclick="scanCrashLogs()" class="btn-primary">Scan for Crashes</button>
          <button onclick="exportReport()" class="btn-secondary">Export Report</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Crash Summary</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="glass-card">
            <div class="text-sm text-gray-400 mb-1">Total Crashes</div>
            <div class="text-3xl font-bold text-red-400" id="total-crashes">0</div>
          </div>
          <div class="glass-card">
            <div class="text-sm text-gray-400 mb-1">Last 24h</div>
            <div class="text-3xl font-bold text-yellow-400" id="crashes-24h">0</div>
          </div>
          <div class="glass-card">
            <div class="text-sm text-gray-400 mb-1">Last 7 Days</div>
            <div class="text-3xl font-bold text-blue-400" id="crashes-7d">0</div>
          </div>
          <div class="glass-card">
            <div class="text-sm text-gray-400 mb-1">Most Common</div>
            <div class="text-lg font-bold" id="most-common">N/A</div>
          </div>
        </div>

        <div class="mb-4">
          <input type="text" id="crash-search" placeholder="Search crashes..." class="input-field w-full" oninput="filterCrashes()">
        </div>

        <div id="crash-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">No crash logs found. Click "Scan for Crashes" to analyze.</div>
        </div>
      </div>

      <div id="crash-detail" class="glass-panel p-6 hidden">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Crash Details</h2>
          <button onclick="closeCrashDetail()" class="btn-secondary">Close</button>
        </div>
        <div id="crash-detail-content" class="code-editor max-h-96 overflow-y-auto"></div>
      </div>
    </div>

    <script>
      let crashes = [];

      async function scanCrashLogs() {
        try {
          const response = await window.api.request('/api/logs/crash/scan');
          crashes = response.crashes || [];
          renderCrashes();
        } catch (error) {
          alert('Failed to scan crash logs: ' + error.message);
        }
      }

      function renderCrashes() {
        const list = document.getElementById('crash-list');
        
        if (crashes.length === 0) {
          list.innerHTML = '<div class="text-center text-gray-400 py-8">No crashes found</div>';
          return;
        }

        list.innerHTML = crashes.map((crash, index) => \`
          <div class="glass-card p-4 cursor-pointer hover:bg-opacity-80 transition-all" onclick="viewCrashDetail(\${index})">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-medium">CRASH</span>
                  <span class="text-sm text-gray-400">\${formatDate(crash.timestamp)}</span>
                </div>
                <div class="font-medium mb-1">\${escapeHtml(crash.error || 'Unknown Error')}</div>
                <div class="text-sm text-gray-400 font-mono">\${escapeHtml(crash.file || 'Unknown file')}:\${crash.line || '?'}</div>
              </div>
              <div class="text-right">
                <div class="text-sm text-gray-400">Type</div>
                <div class="font-medium">\${crash.type || 'Unknown'}</div>
              </div>
            </div>
          </div>
        \`).join('');

        updateSummary();
      }

      function updateSummary() {
        const now = Date.now();
        const day24h = now - 24 * 60 * 60 * 1000;
        const day7d = now - 7 * 24 * 60 * 60 * 1000;

        const crashes24h = crashes.filter(c => new Date(c.timestamp).getTime() > day24h).length;
        const crashes7d = crashes.filter(c => new Date(c.timestamp).getTime() > day7d).length;

        const errorTypes = {};
        crashes.forEach(c => {
          const type = c.type || 'Unknown';
          errorTypes[type] = (errorTypes[type] || 0) + 1;
        });
        const mostCommon = Object.entries(errorTypes).sort((a, b) => b[1] - a[1])[0];

        document.getElementById('total-crashes').textContent = crashes.length;
        document.getElementById('crashes-24h').textContent = crashes24h;
        document.getElementById('crashes-7d').textContent = crashes7d;
        document.getElementById('most-common').textContent = mostCommon ? mostCommon[0] : 'N/A';
      }

      function filterCrashes() {
        const search = document.getElementById('crash-search').value.toLowerCase();
        const items = document.querySelectorAll('#crash-list > div');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(search) ? '' : 'none';
        });
      }

      function viewCrashDetail(index) {
        const crash = crashes[index];
        const detail = document.getElementById('crash-detail');
        const content = document.getElementById('crash-detail-content');
        
        content.innerHTML = \`
          <div class="mb-4">
            <div class="text-sm text-gray-400 mb-1">Timestamp</div>
            <div class="font-mono">\${formatDate(crash.timestamp)}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400 mb-1">Error Type</div>
            <div class="font-medium">\${escapeHtml(crash.type || 'Unknown')}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400 mb-1">Error Message</div>
            <div class="text-red-400">\${escapeHtml(crash.error || 'N/A')}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400 mb-1">File</div>
            <div class="font-mono">\${escapeHtml(crash.file || 'N/A')}:\${crash.line || '?'}</div>
          </div>
          <div class="mb-4">
            <div class="text-sm text-gray-400 mb-1">Stack Trace</div>
            <div class="font-mono text-xs whitespace-pre-wrap">\${escapeHtml(crash.stackTrace || 'N/A')}</div>
          </div>
          <div>
            <div class="text-sm text-gray-400 mb-1">Full Log</div>
            <div class="font-mono text-xs whitespace-pre-wrap max-h-64 overflow-y-auto">\${escapeHtml(crash.fullLog || 'N/A')}</div>
          </div>
        \`;
        
        detail.classList.remove('hidden');
      }

      function closeCrashDetail() {
        document.getElementById('crash-detail').classList.add('hidden');
      }

      function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      async function exportReport() {
        const report = {
          summary: {
            total: crashes.length,
            last24h: crashes.filter(c => new Date(c.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000).length,
            last7d: crashes.filter(c => new Date(c.timestamp).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000).length
          },
          crashes: crashes,
          generated: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`crash-report-\${new Date().toISOString()}.json\`;
        a.click();
      }

      // Auto-scan on load
      scanCrashLogs();
    </script>
  `;
}

