export default async function PathCheckerPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Folder Path Checker</h1>
        <button onclick="checkPath()" class="btn-primary">Check Path</button>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <label class="block text-sm text-gray-400 mb-2">Path to Check</label>
          <div class="flex gap-2">
            <input type="text" id="check-path-input" class="input-field flex-1 font-mono" placeholder="/path/to/check">
            <button onclick="selectPath()" class="btn-secondary">Browse</button>
          </div>
        </div>
        <div id="path-results" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Enter a path and click "Check Path"</div>
        </div>
      </div>
    </div>
    <script>
      async function selectPath() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            document.getElementById('check-path-input').value = result.filePaths[0];
          }
        }
      }
      async function checkPath() {
        const path = document.getElementById('check-path-input').value;
        if (!path) {
          alert('Enter a path');
          return;
        }
        const container = document.getElementById('path-results');
        container.innerHTML = '<div class="text-gray-400">Checking...</div>';
        try {
          const result = await window.api.checkPath(path);
          container.innerHTML = \`
            <div class="glass-card p-4">
              <div class="font-medium mb-2">Path Status</div>
              <div class="text-sm text-gray-400">Exists: \${result.exists ? 'Yes' : 'No'}</div>
              <div class="text-sm text-gray-400">Type: \${result.type || 'Unknown'}</div>
              <div class="text-sm text-gray-400">Readable: \${result.readable ? 'Yes' : 'No'}</div>
              <div class="text-sm text-gray-400">Writable: \${result.writable ? 'Yes' : 'No'}</div>
              \${result.size ? \`<div class="text-sm text-gray-400">Size: \${result.size} bytes</div>\` : ''}
            </div>
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Check failed: ' + error.message + '</div>';
        }
      }
    </script>
  `;
}

