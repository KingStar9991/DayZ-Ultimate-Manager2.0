export default async function ModUpdaterPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Updater</h1>
        <div class="flex gap-3">
          <button onclick="checkUpdates()" class="btn-primary">Check Updates</button>
          <button onclick="updateAll()" class="btn-secondary">Update All</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div id="mod-updates" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Click "Check Updates" to scan for mod updates</div>
        </div>
      </div>
    </div>
    <script>
      async function checkUpdates() {
        const container = document.getElementById('mod-updates');
        container.innerHTML = '<div class="text-gray-400">Checking for updates...</div>';
        try {
          const updates = await window.api.request('/api/mods/check-updates');
          renderUpdates(updates || []);
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Failed to check updates</div>';
        }
      }
      function renderUpdates(updates) {
        const container = document.getElementById('mod-updates');
        if (updates.length === 0) {
          container.innerHTML = '<div class="text-center text-green-400 py-8">All mods are up to date</div>';
          return;
        }
        container.innerHTML = updates.map(u => \`
          <div class="glass-card p-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium">\${u.name}</div>
                <div class="text-sm text-gray-400">Current: \${u.currentVersion} → Latest: \${u.latestVersion}</div>
              </div>
              <button onclick="updateMod('\${u.workshopId}')" class="btn-primary text-sm">Update</button>
            </div>
          </div>
        \`).join('');
      }
      async function updateMod(workshopId) {
        try {
          await window.api.updateMod(workshopId, '');
          alert('Update started');
          checkUpdates();
        } catch (error) {
          alert('Update failed');
        }
      }
      async function updateAll() {
        if (!confirm('Update all mods?')) return;
        try {
          await window.api.request('/api/mods/update-all', { method: 'POST' });
          alert('Updates started');
          checkUpdates();
        } catch (error) {
          alert('Update failed');
        }
      }
    </script>
  `;
}

