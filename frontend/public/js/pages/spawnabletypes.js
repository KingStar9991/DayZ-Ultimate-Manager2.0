export default async function SpawnableTypesPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">spawnabletypes.xml Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadFile()" class="btn-primary">Load File</button>
          <button onclick="saveFile()" class="btn-secondary">Save</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="text-sm text-gray-400 mb-4" id="file-path">No file loaded</div>
        <textarea id="xml-editor" class="code-editor w-full h-[600px] font-mono text-sm" placeholder="Load spawnabletypes.xml..."></textarea>
      </div>
    </div>

    <script>
      let currentPath = null;

      async function loadFile() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [{ name: 'XML Files', extensions: ['xml'] }]
          });
          if (result?.filePaths?.[0]) {
            currentPath = result.filePaths[0];
            try {
              const response = await window.api.getSpawnableTypesXML(currentPath);
              document.getElementById('xml-editor').value = response.content || '';
              document.getElementById('file-path').textContent = currentPath;
            } catch (error) {
              alert('Load failed');
            }
          }
        }
      }

      async function saveFile() {
        if (!currentPath) {
          alert('Load a file first');
          return;
        }
        const content = document.getElementById('xml-editor').value;
        try {
          await window.api.saveSpawnableTypesXML(currentPath, content);
          alert('Saved');
        } catch (error) {
          alert('Save failed');
        }
      }
    </script>
  `;
}

