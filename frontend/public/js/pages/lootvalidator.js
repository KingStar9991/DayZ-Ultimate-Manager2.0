export default async function LootValidatorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Loot Economy Validator</h1>
        <div class="flex gap-3">
          <button onclick="validateEconomy()" class="btn-primary">Validate Economy</button>
          <button onclick="exportReport()" class="btn-secondary">Export Report</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <label class="block text-sm text-gray-400 mb-2">Mission Folder Path</label>
          <div class="flex gap-2">
            <input type="text" id="mission-path" class="input-field flex-1 font-mono" placeholder="/path/to/mission">
            <button onclick="selectMissionFolder()" class="btn-secondary">Browse</button>
          </div>
        </div>
        <div id="validation-results" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Click "Validate Economy" to start</div>
        </div>
      </div>
    </div>
    <script>
      async function validateEconomy() {
        const missionPath = document.getElementById('mission-path').value;
        if (!missionPath) {
          alert('Enter mission path');
          return;
        }
        const results = document.getElementById('validation-results');
        results.innerHTML = '<div class="text-gray-400">Validating...</div>';
        try {
          const result = await window.api.validateLoot(missionPath);
          renderResults(result);
        } catch (error) {
          results.innerHTML = '<div class="text-red-400">Validation failed: ' + error.message + '</div>';
        }
      }
      function renderResults(result) {
        const container = document.getElementById('validation-results');
        const errors = result.errors || [];
        const warnings = result.warnings || [];
        container.innerHTML = \`
          <div class="glass-card p-4 mb-4">
            <div class="text-green-400 mb-2">✓ Valid: \${result.valid ? 'Yes' : 'No'}</div>
            <div class="text-red-400 mb-2">✗ Errors: \${errors.length}</div>
            <div class="text-yellow-400">⚠ Warnings: \${warnings.length}</div>
          </div>
          \${errors.map(e => \`<div class="glass-card p-3 text-red-400">\${e}</div>\`).join('')}
          \${warnings.map(w => \`<div class="glass-card p-3 text-yellow-400">\${w}</div>\`).join('')}
        \`;
      }
      async function selectMissionFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            document.getElementById('mission-path').value = result.filePaths[0];
          }
        }
      }
      function exportReport() {
        const results = document.getElementById('validation-results').textContent;
        const blob = new Blob([results], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'validation-report.txt';
        a.click();
      }
    </script>
  `;
}

