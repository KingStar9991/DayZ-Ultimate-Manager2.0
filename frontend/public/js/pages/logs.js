export default async function LogsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Logs Viewer</h1>
        <div class="flex gap-3">
          <select id="log-type" class="input-field" onchange="loadLogs()">
            <option value="rpt">RPT Logs</option>
            <option value="script">Script Logs</option>
            <option value="admin">Admin Logs</option>
            <option value="battleye">BattlEye Logs</option>
          </select>
          <button onclick="loadLogs()" class="btn-secondary">Refresh</button>
          <button onclick="clearLogs()" class="btn-secondary">Clear</button>
          <button onclick="exportLogs()" class="btn-primary">Export</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center gap-4 mb-4">
          <input type="text" id="log-filter" placeholder="Filter logs..." class="input-field flex-1" oninput="filterLogs()">
          <select id="log-level" class="input-field" onchange="filterLogs()">
            <option value="all">All Levels</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" id="auto-scroll" checked onchange="toggleAutoScroll()">
            Auto-scroll
          </label>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" id="auto-refresh" onchange="toggleAutoRefresh()">
            Auto-refresh
          </label>
        </div>

        <div id="log-viewer" class="code-editor h-96 overflow-y-auto font-mono text-xs">
          <div class="text-gray-400">Loading logs...</div>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div>
            <span id="log-count">0</span> lines loaded
          </div>
          <div>
            Last updated: <span id="last-update">Never</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Errors</div>
          <div class="text-2xl font-bold text-red-400" id="error-count">0</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Warnings</div>
          <div class="text-2xl font-bold text-yellow-400" id="warning-count">0</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Total Lines</div>
          <div class="text-2xl font-bold" id="total-count">0</div>
        </div>
      </div>
    </div>

    <script>
      let logs = [];
      let filteredLogs = [];
      let autoRefreshInterval = null;

      async function loadLogs() {
        const logType = document.getElementById('log-type').value;
        try {
          const response = await window.api.request(\`/api/logs/\${logType}\`);
          logs = response.lines || [];
          filterLogs();
        } catch (error) {
          console.error('Failed to load logs:', error);
          document.getElementById('log-viewer').innerHTML = '<div class="text-red-400">Failed to load logs: ' + error.message + '</div>';
        }
      }

      function filterLogs() {
        const filter = document.getElementById('log-filter').value.toLowerCase();
        const level = document.getElementById('log-level').value;
        
        filteredLogs = logs.filter(log => {
          const matchesFilter = !filter || log.text.toLowerCase().includes(filter);
          const matchesLevel = level === 'all' || log.level === level;
          return matchesFilter && matchesLevel;
        });

        renderLogs();
        updateStats();
      }

      function renderLogs() {
        const viewer = document.getElementById('log-viewer');
        viewer.innerHTML = filteredLogs.map(log => {
          const levelClass = {
            error: 'text-red-400',
            warning: 'text-yellow-400',
            info: 'text-blue-400',
            debug: 'text-gray-400'
          }[log.level] || 'text-white';
          
          return \`<div class="\${levelClass} mb-1">\${escapeHtml(log.text)}</div>\`;
        }).join('');

        if (document.getElementById('auto-scroll').checked) {
          viewer.scrollTop = viewer.scrollHeight;
        }

        document.getElementById('log-count').textContent = filteredLogs.length;
        document.getElementById('last-update').textContent = new Date().toLocaleTimeString();
      }

      function updateStats() {
        const errors = logs.filter(l => l.level === 'error').length;
        const warnings = logs.filter(l => l.level === 'warning').length;
        
        document.getElementById('error-count').textContent = errors;
        document.getElementById('warning-count').textContent = warnings;
        document.getElementById('total-count').textContent = logs.length;
      }

      function clearLogs() {
        if (confirm('Clear all loaded logs?')) {
          logs = [];
          filteredLogs = [];
          renderLogs();
          updateStats();
        }
      }

      function exportLogs() {
        const content = filteredLogs.map(l => l.text).join('\\n');
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`logs-\${new Date().toISOString()}.txt\`;
        a.click();
      }

      function toggleAutoScroll() {
        // Handled in renderLogs
      }

      function toggleAutoRefresh() {
        if (document.getElementById('auto-refresh').checked) {
          autoRefreshInterval = setInterval(loadLogs, 5000);
        } else {
          if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
          }
        }
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      // Initial load
      loadLogs();
    </script>
  `;
}

