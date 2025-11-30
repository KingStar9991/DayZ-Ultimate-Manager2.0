export default async function ModConflictsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Conflict Scanner</h1>
        <button onclick="scanConflicts()" class="btn-primary">Scan Conflicts</button>
      </div>
      <div class="glass-panel p-6">
        <div id="conflicts-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Click "Scan Conflicts" to check for mod conflicts</div>
        </div>
      </div>
    </div>
    <script>
      async function scanConflicts() {
        const modsPath = prompt('Enter mods folder path:') || '';
        if (!modsPath) return;
        const container = document.getElementById('conflicts-list');
        container.innerHTML = '<div class="text-gray-400">Scanning...</div>';
        try {
          const conflicts = await window.api.scanConflicts(modsPath);
          renderConflicts(conflicts || []);
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Scan failed</div>';
        }
      }
      function renderConflicts(conflicts) {
        const container = document.getElementById('conflicts-list');
        if (conflicts.length === 0) {
          container.innerHTML = '<div class="text-center text-green-400 py-8">No conflicts found</div>';
          return;
        }
        container.innerHTML = conflicts.map(c => \`
          <div class="glass-card p-4 border-l-4 border-red-400">
            <div class="font-medium text-red-400 mb-2">Conflict Detected</div>
            <div class="text-sm">\${c.type || 'Unknown'}</div>
            <div class="text-sm text-gray-400">Mods: \${(c.mods || []).join(', ')}</div>
            <div class="text-sm text-gray-400 mt-2">\${c.description || ''}</div>
          </div>
        \`).join('');
      }
    </script>
  `;
}

