export default async function EconomyBackupPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Economy Backup & Restore</h1>
        <div class="flex gap-3">
          <button onclick="createBackup()" class="btn-primary">Create Backup</button>
          <button onclick="refreshBackups()" class="btn-secondary">Refresh</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Economy Backups</h2>
        <div id="backup-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">No backups found</div>
        </div>
      </div>
    </div>

    <script>
      async function createBackup() {
        const missionPath = prompt('Enter mission folder path:');
        if (!missionPath) return;
        try {
          await window.api.request('/api/loot/backup', {
            method: 'POST',
            body: { missionPath }
          });
          alert('Backup created');
          refreshBackups();
        } catch (error) {
          alert('Backup failed');
        }
      }

      async function refreshBackups() {
        try {
          const backups = await window.api.request('/api/loot/backups');
          renderBackups(backups || []);
        } catch (error) {
          console.error('Failed to load backups');
        }
      }

      function renderBackups(backups) {
        const list = document.getElementById('backup-list');
        if (backups.length === 0) {
          list.innerHTML = '<div class="text-center text-gray-400 py-8">No backups found</div>';
          return;
        }
        list.innerHTML = backups.map(b => \`
          <div class="glass-card p-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium">\${b.name || 'Backup'}</div>
                <div class="text-sm text-gray-400">\${new Date(b.created).toLocaleString()}</div>
              </div>
              <button onclick="restoreBackup('\${b.path}')" class="btn-secondary text-sm">Restore</button>
            </div>
          </div>
        \`).join('');
      }

      async function restoreBackup(path) {
        if (!confirm('Restore this backup?')) return;
        const missionPath = prompt('Enter mission folder to restore to:');
        if (!missionPath) return;
        try {
          await window.api.request('/api/loot/restore', {
            method: 'POST',
            body: { backupPath: path, missionPath }
          });
          alert('Restored');
        } catch (error) {
          alert('Restore failed');
        }
      }

      refreshBackups();
    </script>
  `;
}

