export default async function BasebuildingPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Basebuilding Object Preview</h1>
        <input type="text" id="bb-search" placeholder="Search objects..." class="input-field w-64" oninput="filterObjects()">
      </div>
      <div class="glass-panel p-6">
        <div id="bb-objects" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="glass-card p-4">
            <div class="font-medium">Fence</div>
            <div class="text-sm text-gray-400 font-mono">Fence</div>
            <div class="text-sm text-gray-400 mt-2">Basebuilding fence</div>
          </div>
          <div class="glass-card p-4">
            <div class="font-medium">Gate</div>
            <div class="text-sm text-gray-400 font-mono">Gate</div>
            <div class="text-sm text-gray-400 mt-2">Basebuilding gate</div>
          </div>
          <div class="glass-card p-4">
            <div class="font-medium">Watchtower</div>
            <div class="text-sm text-gray-400 font-mono">Watchtower</div>
            <div class="text-sm text-gray-400 mt-2">Basebuilding watchtower</div>
          </div>
        </div>
      </div>
    </div>
    <script>
      function filterObjects() {
        const search = document.getElementById('bb-search').value.toLowerCase();
        document.querySelectorAll('#bb-objects > div').forEach(el => {
          const text = el.textContent.toLowerCase();
          el.style.display = text.includes(search) ? '' : 'none';
        });
      }
    </script>
  `;
}

