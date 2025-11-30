export default async function ObjectSpawnerPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Object Spawner UI</h1>
        <button onclick="spawnObject()" class="btn-primary">Spawn Object</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Object Class Name</label>
            <input type="text" id="object-class" class="input-field w-full font-mono" placeholder="ItemClassName">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Position</label>
            <div class="flex gap-2">
              <input type="number" id="obj-x" class="input-field flex-1" placeholder="X" step="0.01">
              <input type="number" id="obj-y" class="input-field flex-1" placeholder="Y" step="0.01">
              <input type="number" id="obj-z" class="input-field flex-1" placeholder="Z" step="0.01">
            </div>
            <label class="block text-sm text-gray-400 mb-2 mt-4">Quantity</label>
            <input type="number" id="obj-quantity" class="input-field w-full" value="1" min="1">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Orientation</label>
            <input type="number" id="obj-orient" class="input-field w-full" placeholder="0" step="0.01">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Common Objects</label>
            <div class="space-y-2">
              <button onclick="setObject('AKM')" class="btn-secondary w-full text-left text-sm">AKM</button>
              <button onclick="setObject('M4A1')" class="btn-secondary w-full text-left text-sm">M4A1</button>
              <button onclick="setObject('TentBase')" class="btn-secondary w-full text-left text-sm">Tent</button>
              <button onclick="setObject('Barrel_ColorBase')" class="btn-secondary w-full text-left text-sm">Barrel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      function setObject(className) {
        document.getElementById('object-class').value = className;
      }
      async function spawnObject() {
        const classname = document.getElementById('object-class').value;
        const position = {
          x: parseFloat(document.getElementById('obj-x').value) || 0,
          y: parseFloat(document.getElementById('obj-y').value) || 0,
          z: parseFloat(document.getElementById('obj-z').value) || 0
        };
        const quantity = parseInt(document.getElementById('obj-quantity').value) || 1;
        if (!classname) {
          alert('Enter object class name');
          return;
        }
        try {
          await window.api.spawnObject(classname, position, quantity);
          alert('Object spawn command sent');
        } catch (error) {
          alert('Spawn failed');
        }
      }
    </script>
  `;
}

