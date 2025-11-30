export default async function EconomySanityPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Economy Sanity Checker</h1>
        <button onclick="runSanityCheck()" class="btn-primary">Run Check</button>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <label class="block text-sm text-gray-400 mb-2">Mission Folder Path</label>
          <div class="flex gap-2">
            <input type="text" id="sanity-mission-path" class="input-field flex-1 font-mono" placeholder="/path/to/mission">
            <button onclick="selectMissionFolder()" class="btn-secondary">Browse</button>
          </div>
        </div>
        <div id="sanity-results" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Click "Run Check" to analyze economy</div>
        </div>
      </div>
    </div>
    <script>
      async function selectMissionFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            document.getElementById('sanity-mission-path').value = result.filePaths[0];
          }
        }
      }
      async function runSanityCheck() {
        const missionPath = document.getElementById('sanity-mission-path').value;
        if (!missionPath) {
          alert('Enter mission folder path');
          return;
        }
        const container = document.getElementById('sanity-results');
        container.innerHTML = '<div class="text-gray-400">Running sanity check...</div>';
        try {
          const result = await window.api.request('/api/loot/sanity-check', {
            method: 'POST',
            body: { missionPath }
          });
          container.innerHTML = \`
            <div class="glass-card p-4 mb-4">
              <div class="text-green-400 mb-2">✓ Checks Passed: \${result.passed || 0}</div>
              <div class="text-red-400 mb-2">✗ Issues Found: \${result.issues?.length || 0}</div>
            </div>
            \${(result.issues || []).map(i => \`
              <div class="glass-card p-3 border-l-4 border-red-400">
                <div class="font-medium text-red-400">\${i.type || 'Issue'}</div>
                <div class="text-sm text-gray-400">\${i.message || ''}</div>
              </div>
            \`).join('')}
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Sanity check failed</div>';
        }
      }
    </script>
  `;
}

