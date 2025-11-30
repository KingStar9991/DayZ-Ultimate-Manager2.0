export default async function KeysPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Client/Server Key Manager</h1>
        <div class="flex gap-3">
          <button onclick="selectKeysFolder()" class="btn-primary">Select Keys Folder</button>
          <button onclick="generateKeys()" class="btn-secondary">Generate Keys</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Server Keys</h2>
          <div id="server-keys" class="space-y-2">
            <div class="text-center text-gray-400 py-8">Select keys folder</div>
          </div>
        </div>
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Client Keys</h2>
          <div id="client-keys" class="space-y-2">
            <div class="text-center text-gray-400 py-8">Select keys folder</div>
          </div>
        </div>
      </div>
    </div>
    <script>
      async function selectKeysFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            await loadKeys(result.filePaths[0]);
          }
        }
      }
      async function loadKeys(path) {
        try {
          const keys = await window.api.request(\`/api/mods/keys?path=\${encodeURIComponent(path)}\`);
          renderKeys(keys);
        } catch (error) {
          alert('Load failed');
        }
      }
      function renderKeys(keys) {
        const serverKeys = document.getElementById('server-keys');
        const clientKeys = document.getElementById('client-keys');
        serverKeys.innerHTML = (keys.server || []).map(k => \`
          <div class="glass-card p-3">
            <div class="font-mono text-sm">\${k.name}</div>
            <div class="text-xs text-gray-400">\${k.fingerprint || 'N/A'}</div>
          </div>
        \`).join('');
        clientKeys.innerHTML = (keys.client || []).map(k => \`
          <div class="glass-card p-3">
            <div class="font-mono text-sm">\${k.name}</div>
            <div class="text-xs text-gray-400">\${k.fingerprint || 'N/A'}</div>
          </div>
        \`).join('');
      }
      async function generateKeys() {
        if (!confirm('Generate new keys? This will overwrite existing keys.')) return;
        try {
          await window.api.request('/api/mods/generate-keys', { method: 'POST' });
          alert('Keys generated');
        } catch (error) {
          alert('Generation failed');
        }
      }
    </script>
  `;
}

