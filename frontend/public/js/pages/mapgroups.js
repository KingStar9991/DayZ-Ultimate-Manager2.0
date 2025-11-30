export default async function MapGroupsPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">MapGroups Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadMapGroups()" class="btn-primary">Load File</button>
          <button onclick="saveMapGroups()" class="btn-secondary">Save</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm text-gray-400" id="file-path">No file loaded</div>
          <input type="text" id="search-groups" placeholder="Search groups..." class="input-field w-64" oninput="filterGroups()">
        </div>
        <div id="mapgroups-list" class="space-y-2 max-h-96 overflow-y-auto">
          <div class="text-center text-gray-400 py-8">Load a MapGroups.xml file</div>
        </div>
      </div>
    </div>

    <script>
      let currentPath = null;
      let mapGroups = [];

      async function loadMapGroups() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [{ name: 'XML Files', extensions: ['xml'] }]
          });
          if (result?.filePaths?.[0]) {
            currentPath = result.filePaths[0];
            try {
              const response = await window.api.getMapGroups(currentPath);
              mapGroups = response.groups || [];
              document.getElementById('file-path').textContent = currentPath;
              renderGroups();
            } catch (error) {
              alert('Load failed');
            }
          }
        }
      }

      function renderGroups() {
        const list = document.getElementById('mapgroups-list');
        if (mapGroups.length === 0) {
          list.innerHTML = '<div class="text-center text-gray-400 py-8">No groups found</div>';
          return;
        }
        list.innerHTML = mapGroups.map((g, i) => \`
          <div class="glass-card p-3" data-index="\${i}">
            <div class="font-medium">\${g.name || 'Unnamed'}</div>
            <div class="text-sm text-gray-400">Items: \${g.items?.length || 0}</div>
          </div>
        \`).join('');
      }

      function filterGroups() {
        const search = document.getElementById('search-groups').value.toLowerCase();
        document.querySelectorAll('#mapgroups-list > div').forEach(el => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(search) ? '' : 'none';
        });
      }

      async function saveMapGroups() {
        if (!currentPath) {
          alert('Load a file first');
          return;
        }
        try {
          await window.api.saveMapGroups(currentPath, { groups: mapGroups });
          alert('Saved');
        } catch (error) {
          alert('Save failed');
        }
      }
    </script>
  `;
}

