export default async function BackupsPage() {
  const backups = await window.api.listBackups().catch(() => []);
  
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Backup Manager</h1>
        <div class="flex gap-3">
          <button onclick="showCreateBackup()" class="btn-primary">Create Backup</button>
          <button onclick="refreshBackups()" class="btn-secondary">Refresh</button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Total Backups</div>
          <div class="text-3xl font-bold">${backups.length}</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Total Size</div>
          <div class="text-3xl font-bold">${formatBytes(backups.reduce((sum, b) => sum + (b.size || 0), 0))}</div>
        </div>
        <div class="glass-card">
          <div class="text-sm text-gray-400 mb-1">Last Backup</div>
          <div class="text-lg font-bold">${backups.length > 0 ? formatDate(backups[0].created) : 'Never'}</div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold">Backup List</h2>
          <input type="text" id="backup-search" placeholder="Search backups..." class="input-field w-64" oninput="filterBackups()">
        </div>

        <div id="backup-list" class="space-y-3">
          ${backups.length === 0 ? `
            <div class="text-center text-gray-400 py-8">No backups found</div>
          ` : backups.map(backup => `
            <div class="glass-card p-4" data-backup-id="${backup.id}">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="text-2xl">💾</span>
                    <div>
                      <div class="font-medium">${backup.name || 'Untitled Backup'}</div>
                      <div class="text-sm text-gray-400">${formatDate(backup.created)}</div>
                    </div>
                  </div>
                  <div class="text-sm text-gray-400 mb-2">
                    <div>Source: ${backup.sourcePath || 'N/A'}</div>
                    <div>Size: ${formatBytes(backup.size || 0)}</div>
                    ${backup.description ? `<div>Description: ${backup.description}</div>` : ''}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button onclick="restoreBackup('${backup.id}')" class="btn-secondary text-sm">Restore</button>
                  <button onclick="downloadBackup('${backup.id}')" class="btn-secondary text-sm">Download</button>
                  <button onclick="deleteBackup('${backup.id}')" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="create-backup-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="glass-panel p-6 max-w-md w-full m-4">
          <h2 class="text-xl font-bold mb-4">Create Backup</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Backup Name</label>
              <input type="text" id="backup-name" class="input-field w-full" placeholder="My Backup">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Source Path</label>
              <div class="flex gap-2">
                <input type="text" id="backup-source" class="input-field flex-1" placeholder="/path/to/backup">
                <button onclick="selectBackupFolder()" class="btn-secondary">Browse</button>
              </div>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Description (Optional)</label>
              <textarea id="backup-description" class="input-field w-full h-24" placeholder="Backup description..."></textarea>
            </div>
            <div class="flex gap-3">
              <button onclick="createBackup()" class="btn-primary flex-1">Create</button>
              <button onclick="closeCreateBackup()" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
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

      function filterBackups() {
        const search = document.getElementById('backup-search').value.toLowerCase();
        const items = document.querySelectorAll('#backup-list > div');
        items.forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(search) ? '' : 'none';
        });
      }

      function showCreateBackup() {
        document.getElementById('create-backup-modal').classList.remove('hidden');
      }

      function closeCreateBackup() {
        document.getElementById('create-backup-modal').classList.add('hidden');
      }

      async function selectBackupFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result && result.filePaths && result.filePaths.length > 0) {
            document.getElementById('backup-source').value = result.filePaths[0];
          }
        }
      }

      async function createBackup() {
        const name = document.getElementById('backup-name').value || 'Backup ' + new Date().toISOString();
        const sourcePath = document.getElementById('backup-source').value;
        const description = document.getElementById('backup-description').value;

        if (!sourcePath) {
          alert('Please select a source path');
          return;
        }

        try {
          await window.api.createBackup(sourcePath, name);
          alert('Backup created successfully');
          closeCreateBackup();
          refreshBackups();
        } catch (error) {
          alert('Failed to create backup: ' + error.message);
        }
      }

      async function restoreBackup(backupId) {
        if (!confirm('Are you sure you want to restore this backup? This will overwrite existing files.')) {
          return;
        }

        const targetPath = prompt('Enter target path to restore to:');
        if (!targetPath) return;

        try {
          const backups = await window.api.listBackups();
          const backup = backups.find(b => b.id === backupId);
          if (backup) {
            await window.api.restoreBackup(backup.path, targetPath);
            alert('Backup restored successfully');
          }
        } catch (error) {
          alert('Failed to restore backup: ' + error.message);
        }
      }

      async function downloadBackup(backupId) {
        // Implementation would download backup file
        alert('Download feature coming soon');
      }

      async function deleteBackup(backupId) {
        if (!confirm('Are you sure you want to delete this backup?')) {
          return;
        }

        try {
          await window.api.request(\`/api/automation/backups/\${backupId}\`, { method: 'DELETE' });
          alert('Backup deleted successfully');
          refreshBackups();
        } catch (error) {
          alert('Failed to delete backup: ' + error.message);
        }
      }

      async function refreshBackups() {
        router.navigate('/backups');
      }
    </script>
  `;
}

