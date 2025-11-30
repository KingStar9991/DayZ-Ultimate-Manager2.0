export default async function RPTParserPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">RPT Parser</h1>
        <div class="flex gap-3">
          <button onclick="selectRPTFile()" class="btn-primary">Select RPT File</button>
          <button onclick="parseRPT()" class="btn-secondary">Parse</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <div class="text-sm text-gray-400" id="rpt-file-path">No file selected</div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400 mb-1">Errors</div>
            <div class="text-3xl font-bold text-red-400" id="error-count">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400 mb-1">Warnings</div>
            <div class="text-3xl font-bold text-yellow-400" id="warning-count">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400 mb-1">Info</div>
            <div class="text-3xl font-bold text-blue-400" id="info-count">0</div>
          </div>
          <div class="glass-card p-4">
            <div class="text-sm text-gray-400 mb-1">Total Lines</div>
            <div class="text-3xl font-bold" id="total-count">0</div>
          </div>
        </div>
        <div id="rpt-results" class="space-y-2 max-h-96 overflow-y-auto">
          <div class="text-center text-gray-400 py-8">Select an RPT file and click "Parse"</div>
        </div>
      </div>
    </div>
    <script>
      let currentRPTPath = null;
      async function selectRPTFile() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [{ name: 'RPT Files', extensions: ['rpt'] }]
          });
          if (result?.filePaths?.[0]) {
            currentRPTPath = result.filePaths[0];
            document.getElementById('rpt-file-path').textContent = currentRPTPath;
          }
        }
      }
      async function parseRPT() {
        if (!currentRPTPath) {
          alert('Select an RPT file first');
          return;
        }
        const container = document.getElementById('rpt-results');
        container.innerHTML = '<div class="text-gray-400">Parsing...</div>';
        try {
          const result = await window.api.request('/api/logs/rpt/parse', {
            method: 'POST',
            body: { path: currentRPTPath }
          });
          document.getElementById('error-count').textContent = result.errors?.length || 0;
          document.getElementById('warning-count').textContent = result.warnings?.length || 0;
          document.getElementById('info-count').textContent = result.info?.length || 0;
          document.getElementById('total-count').textContent = result.totalLines || 0;
          container.innerHTML = [
            ...(result.errors || []).map(e => \`<div class="glass-card p-2 text-red-400 text-sm">\${e}</div>\`),
            ...(result.warnings || []).map(w => \`<div class="glass-card p-2 text-yellow-400 text-sm">\${w}</div>\`)
          ].join('');
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Parse failed</div>';
        }
      }
    </script>
  `;
}

