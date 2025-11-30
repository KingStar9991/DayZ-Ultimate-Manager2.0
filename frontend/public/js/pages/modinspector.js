export default async function ModInspectorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Folder Inspector</h1>
        <button onclick="selectModFolder()" class="btn-primary">Select Mod Folder</button>
      </div>
      <div class="glass-panel p-6">
        <div class="text-sm text-gray-400 mb-4" id="mod-path">No mod selected</div>
        <div id="mod-info" class="space-y-4">
          <div class="text-center text-gray-400 py-8">Select a mod folder to inspect</div>
        </div>
      </div>
    </div>
    <script>
      async function selectModFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            await inspectMod(result.filePaths[0]);
          }
        }
      }
      async function inspectMod(path) {
        document.getElementById('mod-path').textContent = path;
        const container = document.getElementById('mod-info');
        container.innerHTML = '<div class="text-gray-400">Inspecting...</div>';
        try {
          const info = await window.api.request(\`/api/mods/inspect?path=\${encodeURIComponent(path)}\`);
          container.innerHTML = \`
            <div class="glass-card p-4">
              <div class="font-medium mb-2">\${info.name || 'Unknown'}</div>
              <div class="text-sm text-gray-400">Workshop ID: \${info.workshopId || 'N/A'}</div>
              <div class="text-sm text-gray-400">Version: \${info.version || 'N/A'}</div>
              <div class="text-sm text-gray-400">Size: \${formatBytes(info.size || 0)}</div>
            </div>
            <div class="glass-card p-4">
              <div class="font-medium mb-2">Files</div>
              <div class="text-sm text-gray-400">\${info.fileCount || 0} files</div>
            </div>
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Inspection failed</div>';
        }
      }
      function formatBytes(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }
    </script>
  `;
}

