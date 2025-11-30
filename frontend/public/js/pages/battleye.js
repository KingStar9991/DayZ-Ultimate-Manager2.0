export default async function BattlEyePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">BattlEye Folder Editor</h1>
        <div class="flex gap-3">
          <button onclick="selectBattlEyeFolder()" class="btn-primary">Select Folder</button>
          <button onclick="refreshFiles()" class="btn-secondary">Refresh</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">BattlEye Files</h2>
          <div class="mb-4">
            <div class="text-sm text-gray-400" id="folder-path">No folder selected</div>
          </div>
          <div id="battleye-files" class="space-y-2 max-h-96 overflow-y-auto">
            <div class="text-center text-gray-400 py-8">Select BattlEye folder to view files</div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">File Editor</h2>
          <div id="file-editor-container">
            <div class="text-center text-gray-400 py-8">Select a file to edit</div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Common BattlEye Files</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-card p-4">
            <div class="font-medium mb-2">BEServer.cfg</div>
            <div class="text-sm text-gray-400 mb-2">Main BattlEye server configuration</div>
            <button onclick="editFile('BEServer.cfg')" class="btn-secondary w-full text-sm">Edit</button>
          </div>
          <div class="glass-card p-4">
            <div class="font-medium mb-2">BEServer_x64.cfg</div>
            <div class="text-sm text-gray-400 mb-2">64-bit server configuration</div>
            <button onclick="editFile('BEServer_x64.cfg')" class="btn-secondary w-full text-sm">Edit</button>
          </div>
          <div class="glass-card p-4">
            <div class="font-medium mb-2">Scripts.txt</div>
            <div class="text-sm text-gray-400 mb-2">Script restrictions</div>
            <button onclick="editFile('Scripts.txt')" class="btn-secondary w-full text-sm">Edit</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentFolder = null;

      async function selectBattlEyeFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result && result.filePaths && result.filePaths.length > 0) {
            currentFolder = result.filePaths[0];
            document.getElementById('folder-path').textContent = currentFolder;
            await loadFiles();
          }
        }
      }

      async function loadFiles() {
        if (!currentFolder) return;
        try {
          const response = await window.api.request(\`/api/utility/files?path=\${encodeURIComponent(currentFolder)}\`);
          renderFiles(response.files || []);
        } catch (error) {
          alert('Failed to load files: ' + error.message);
        }
      }

      function renderFiles(files) {
        const container = document.getElementById('battleye-files');
        container.innerHTML = files.map(file => \`
          <div class="flex items-center gap-3 p-2 hover:bg-gtx-glass rounded cursor-pointer" onclick="editFile('\${file.path}')">
            <span>\${file.isDirectory ? '📁' : '📄'}</span>
            <span class="flex-1 font-mono text-sm">\${file.name}</span>
          </div>
        \`).join('');
      }

      async function editFile(filePath) {
        const fullPath = currentFolder ? currentFolder + '/' + filePath : filePath;
        try {
          const response = await window.api.request(\`/api/utility/file?path=\${encodeURIComponent(fullPath)}\`);
          const container = document.getElementById('file-editor-container');
          container.innerHTML = \`
            <div class="mb-2 flex items-center justify-between">
              <div class="font-mono text-sm">\${filePath}</div>
              <button onclick="saveFile('\${fullPath}')" class="btn-primary text-sm">Save</button>
            </div>
            <textarea id="file-content" class="code-editor w-full h-96 font-mono text-sm">\${escapeHtml(response.content || '')}</textarea>
          \`;
        } catch (error) {
          alert('Failed to load file: ' + error.message);
        }
      }

      async function saveFile(filePath) {
        const content = document.getElementById('file-content').value;
        try {
          await window.api.request('/api/utility/file', {
            method: 'POST',
            body: { path: filePath, content }
          });
          alert('File saved successfully');
        } catch (error) {
          alert('Failed to save file: ' + error.message);
        }
      }

      function refreshFiles() {
        if (currentFolder) {
          loadFiles();
        }
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    </script>
  `;
}

