export default async function SpawnEditorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Animal/Zombie Spawn Editor</h1>
        <button onclick="saveSpawns()" class="btn-primary">Save Spawns</button>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <select id="spawn-type" class="input-field" onchange="loadSpawns()">
            <option value="animal">Animals</option>
            <option value="zombie">Zombies</option>
          </select>
        </div>
        <div id="spawns-list" class="space-y-3">
          <div class="text-center text-gray-400 py-8">Select spawn type to load</div>
        </div>
      </div>
    </div>
    <script>
      async function loadSpawns() {
        const type = document.getElementById('spawn-type').value;
        const container = document.getElementById('spawns-list');
        container.innerHTML = '<div class="text-gray-400">Loading...</div>';
        try {
          const spawns = await window.api.request(\`/api/map/spawns/\${type}\`);
          renderSpawns(spawns || []);
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Load failed</div>';
        }
      }
      function renderSpawns(spawns) {
        const container = document.getElementById('spawns-list');
        container.innerHTML = spawns.map(s => \`
          <div class="glass-card p-4">
            <div class="font-medium">\${s.class || 'Unknown'}</div>
            <div class="text-sm text-gray-400">Position: \${s.position?.x || 0}, \${s.position?.y || 0}, \${s.position?.z || 0}</div>
            <div class="text-sm text-gray-400">Count: \${s.count || 1}</div>
          </div>
        \`).join('');
      }
      async function saveSpawns() {
        alert('Save functionality coming soon');
      }
      loadSpawns();
    </script>
  `;
}

