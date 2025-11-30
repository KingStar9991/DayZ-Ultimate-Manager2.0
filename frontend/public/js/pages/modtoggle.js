export default async function ModTogglePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Mod Enable/Disable</h1>
        <button onclick="loadMods()" class="btn-primary">Load Mods</button>
      </div>
      <div class="glass-panel p-6">
        <div id="mods-list" class="space-y-2">
          <div class="text-center text-gray-400 py-8">Load mods to manage</div>
        </div>
      </div>
    </div>
    <script>
      async function loadMods() {
        const modsPath = prompt('Enter mods folder path:') || '';
        if (!modsPath) return;
        try {
          const mods = await window.api.listMods(modsPath);
          renderMods(mods || []);
        } catch (error) {
          alert('Load failed');
        }
      }
      function renderMods(mods) {
        const container = document.getElementById('mods-list');
        container.innerHTML = mods.map(m => \`
          <div class="glass-card p-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <input type="checkbox" \${m.enabled ? 'checked' : ''} onchange="toggleMod('\${m.id}', this.checked)" class="w-5 h-5">
              <span class="font-medium">\${m.name || m.id}</span>
            </div>
            <span class="text-sm text-gray-400">\${m.workshopId || 'N/A'}</span>
          </div>
        \`).join('');
      }
      async function toggleMod(modId, enabled) {
        try {
          await window.api.request('/api/mods/toggle', { method: 'POST', body: { modId, enabled } });
        } catch (error) {
          alert('Toggle failed');
        }
      }
    </script>
  `;
}

