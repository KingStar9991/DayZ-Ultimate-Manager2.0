export default async function ModsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Manager</h1>
        <div class="flex gap-3">
          <button onclick="showDownloadMod()" class="btn-primary">Download Mod</button>
          <button onclick="refreshMods()" class="btn-secondary">Refresh</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Installed Mods</h2>
          <input type="text" id="mod-search" placeholder="Search mods..." class="input-field w-64" oninput="filterMods()">
        </div>

        <div id="mod-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Loading mods...</div>
        </div>
      </div>

      <div id="download-mod-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="glass-panel p-6 max-w-md w-full m-4">
          <h2 class="text-xl font-bold mb-4">Download Mod</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Steam Workshop ID</label>
              <input type="text" id="workshop-id" class="input-field w-full font-mono" placeholder="1234567890">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Mods Folder Path</label>
              <div class="flex gap-2">
                <input type="text" id="mods-path" class="input-field flex-1 font-mono text-sm" placeholder="/path/to/mods">
                <button onclick="selectModsFolder()" class="btn-secondary">Browse</button>
              </div>
            </div>
            <div class="flex gap-3">
              <button onclick="downloadMod()" class="btn-primary flex-1">Download</button>
              <button onclick="closeDownloadMod()" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      async function refreshMods() {
        const modsPath = prompt('Enter mods folder path:') || '';
        if (!modsPath) return;

        try {
          const mods = await window.api.listMods(modsPath);
          renderMods(mods);
        } catch (error) {
          alert('Failed to load mods: ' + error.message);
        }
      }

      function renderMods(mods) {
        const list = document.getElementById('mod-list');
        
        if (mods.length === 0) {
          list.innerHTML = '<div class="text-center text-gray-400 py-8">No mods found</div>';
          return;
        }

        list.innerHTML = mods.map(mod => \`
          <div class="glass-card p-4" data-mod-id="\${mod.id}">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-2xl">📚</span>
                  <div>
                    <div class="font-medium">\${mod.name || mod.id}</div>
                    <div class="text-sm text-gray-400">Workshop ID: \${mod.workshopId || 'N/A'}</div>
                  </div>
                </div>
                <div class="text-sm text-gray-400 mb-2">
                  <div>Path: \${mod.path || 'N/A'}</div>
                  <div>Version: \${mod.version || 'Unknown'}</div>
                  <div>Size: \${formatBytes(mod.size || 0)}</div>
                </div>
              </div>
              <div class="flex gap-2">
                <button onclick="updateMod('\${mod.workshopId}', '\${mod.path}')" class="btn-secondary text-sm">Update</button>
                <button onclick="inspectMod('\${mod.path}')" class="btn-secondary text-sm">Inspect</button>
                <button onclick="toggleMod('\${mod.id}', \${mod.enabled})" class="btn-secondary text-sm">
                  \${mod.enabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        \`).join('');
      }

      function filterMods() {
        const search = document.getElementById('mod-search').value.toLowerCase();
        const items = document.querySelectorAll('#mod-list > div');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(search) ? '' : 'none';
        });
      }

      function showDownloadMod() {
        document.getElementById('download-mod-modal').classList.remove('hidden');
      }

      function closeDownloadMod() {
        document.getElementById('download-mod-modal').classList.add('hidden');
      }

      async function selectModsFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result && result.filePaths && result.filePaths.length > 0) {
            document.getElementById('mods-path').value = result.filePaths[0];
          }
        }
      }

      async function downloadMod() {
        const workshopId = document.getElementById('workshop-id').value;
        const modsPath = document.getElementById('mods-path').value;

        if (!workshopId || !modsPath) {
          alert('Please fill in all fields');
          return;
        }

        try {
          await window.api.downloadMod(workshopId, modsPath);
          alert('Mod download started');
          closeDownloadMod();
          refreshMods();
        } catch (error) {
          alert('Failed to download mod: ' + error.message);
        }
      }

      async function updateMod(workshopId, modsPath) {
        try {
          await window.api.updateMod(workshopId, modsPath);
          alert('Mod update started');
          refreshMods();
        } catch (error) {
          alert('Failed to update mod: ' + error.message);
        }
      }

      function inspectMod(path) {
        router.navigate(\`/mod-inspector?path=\${encodeURIComponent(path)}\`);
      }

      async function toggleMod(modId, enabled) {
        try {
          await window.api.request(\`/api/mods/toggle\`, {
            method: 'POST',
            body: { modId, enabled: !enabled }
          });
          alert('Mod ' + (enabled ? 'disabled' : 'enabled'));
          refreshMods();
        } catch (error) {
          alert('Failed to toggle mod: ' + error.message);
        }
      }

      function formatBytes(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }

      refreshMods();
    </script>
  `;
}

