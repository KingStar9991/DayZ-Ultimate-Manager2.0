export default async function FileBrowserPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">File Browser</h1>
        <div class="flex gap-3">
          <button onclick="selectRootFolder()" class="btn-primary">Select Root Folder</button>
          <button onclick="refreshFiles()" class="btn-secondary">Refresh</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center gap-4 mb-4">
          <button onclick="navigateUp()" class="btn-secondary" id="nav-up-btn" disabled>↑ Up</button>
          <div class="flex-1">
            <input type="text" id="current-path" class="input-field w-full font-mono" readonly value="/">
          </div>
          <button onclick="refreshFiles()" class="btn-secondary">🔄</button>
        </div>

        <div class="mb-4">
          <input type="text" id="file-search" placeholder="Search files..." class="input-field w-full" oninput="filterFiles()">
        </div>

        <div id="file-list" class="space-y-1 max-h-96 overflow-y-auto">
          <div class="text-center text-gray-400 py-8">Select a root folder to browse</div>
        </div>

        <div class="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div>
            <span id="file-count">0</span> items
          </div>
          <div>
            <span id="selected-size">0 B</span> selected
          </div>
        </div>
      </div>

      <div id="file-preview" class="glass-panel p-6 hidden">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold" id="preview-name">File Preview</h2>
          <button onclick="closePreview()" class="btn-secondary">Close</button>
        </div>
        <div id="preview-content" class="code-editor max-h-96 overflow-y-auto"></div>
      </div>
    </div>

    <script>
      let currentPath = '/';
      let rootPath = null;

      async function selectRootFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result && result.filePaths && result.filePaths.length > 0) {
            rootPath = result.filePaths[0];
            currentPath = rootPath;
            document.getElementById('current-path').value = currentPath;
            await loadFiles(currentPath);
          }
        } else {
          rootPath = prompt('Enter root folder path:');
          if (rootPath) {
            currentPath = rootPath;
            document.getElementById('current-path').value = currentPath;
            await loadFiles(currentPath);
          }
        }
      }

      async function loadFiles(path) {
        try {
          const response = await window.api.request(\`/api/utility/files?path=\${encodeURIComponent(path)}\`);
          renderFiles(response.files || []);
        } catch (error) {
          alert('Failed to load files: ' + error.message);
        }
      }

      function renderFiles(files) {
        const list = document.getElementById('file-list');
        
        if (files.length === 0) {
          list.innerHTML = '<div class="text-center text-gray-400 py-8">Empty directory</div>';
          return;
        }

        // Sort: directories first, then files
        files.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        });

        list.innerHTML = files.map(file => \`
          <div class="flex items-center gap-3 p-3 hover:bg-gtx-glass rounded-lg cursor-pointer transition-colors" 
               onclick="\${file.isDirectory ? \`navigateTo('\${file.path}')\` : \`previewFile('\${file.path}')\`}">
            <span class="text-xl">\${file.isDirectory ? '📁' : getFileIcon(file.name)}</span>
            <div class="flex-1">
              <div class="font-medium">\${escapeHtml(file.name)}</div>
              <div class="text-xs text-gray-400">
                \${file.isDirectory ? 'Directory' : formatBytes(file.size || 0)}
                \${file.modified ? ' • ' + formatDate(file.modified) : ''}
              </div>
            </div>
            <div class="flex gap-2">
              \${!file.isDirectory ? \`<button onclick="event.stopPropagation(); downloadFile('\${file.path}')" class="text-blue-400 hover:text-blue-300">⬇</button>\` : ''}
              <button onclick="event.stopPropagation(); deleteItem('\${file.path}', \${file.isDirectory})" class="text-red-400 hover:text-red-300">🗑</button>
            </div>
          </div>
        \`).join('');

        document.getElementById('file-count').textContent = files.length;
        document.getElementById('nav-up-btn').disabled = currentPath === rootPath;
      }

      function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
          'js': '📜', 'json': '📋', 'xml': '📄', 'txt': '📝', 'log': '📋',
          'cfg': '⚙️', 'exe': '⚙️', 'dll': '⚙️', 'bat': '📜', 'ps1': '📜',
          'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦', 'gz': '📦',
          'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️', 'svg': '🖼️',
          'mp3': '🎵', 'wav': '🎵', 'ogg': '🎵',
          'mp4': '🎬', 'avi': '🎬', 'mkv': '🎬'
        };
        return icons[ext] || '📄';
      }

      function navigateTo(path) {
        currentPath = path;
        document.getElementById('current-path').value = currentPath;
        loadFiles(path);
      }

      function navigateUp() {
        if (currentPath === rootPath) return;
        const parent = currentPath.split(/[/\\\\]/).slice(0, -1).join('/') || '/';
        navigateTo(parent);
      }

      async function previewFile(path) {
        try {
          const response = await window.api.request(\`/api/utility/file?path=\${encodeURIComponent(path)}\`);
          const preview = document.getElementById('file-preview');
          const content = document.getElementById('preview-content');
          const name = document.getElementById('preview-name');
          
          name.textContent = path.split(/[/\\\\]/).pop();
          content.textContent = response.content || 'Binary file or empty';
          preview.classList.remove('hidden');
        } catch (error) {
          alert('Failed to preview file: ' + error.message);
        }
      }

      function closePreview() {
        document.getElementById('file-preview').classList.add('hidden');
      }

      function filterFiles() {
        const search = document.getElementById('file-search').value.toLowerCase();
        const items = document.querySelectorAll('#file-list > div');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(search) ? '' : 'none';
        });
      }

      function refreshFiles() {
        if (currentPath) {
          loadFiles(currentPath);
        }
      }

      function formatBytes(bytes) {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
      }

      function formatDate(date) {
        return new Date(date).toLocaleString();
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }

      async function downloadFile(path) {
        alert('Download functionality coming soon');
      }

      async function deleteItem(path, isDirectory) {
        if (!confirm(\`Are you sure you want to delete this \${isDirectory ? 'directory' : 'file'}?\`)) {
          return;
        }

        try {
          await window.api.request('/api/utility/file', {
            method: 'DELETE',
            body: { path }
          });
          alert('Item deleted successfully');
          refreshFiles();
        } catch (error) {
          alert('Failed to delete item: ' + error.message);
        }
      }
    </script>
  `;
}

