export default async function TraderCreatePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Trader Configuration Creator</h1>
        <button onclick="createTrader()" class="btn-primary">Create Trader</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Trader Name</label>
            <input type="text" id="trader-name" class="input-field w-full" placeholder="TraderName">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Position (X, Y, Z)</label>
            <div class="flex gap-2">
              <input type="number" id="pos-x" class="input-field flex-1" placeholder="X" step="0.01">
              <input type="number" id="pos-y" class="input-field flex-1" placeholder="Y" step="0.01">
              <input type="number" id="pos-z" class="input-field flex-1" placeholder="Z" step="0.01">
            </div>
            <label class="block text-sm text-gray-400 mb-2 mt-4">Orientation</label>
            <input type="number" id="orientation" class="input-field w-full" placeholder="0" step="0.01">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Items</label>
            <textarea id="trader-items" class="input-field w-full h-64 font-mono text-sm" placeholder="ItemClassName,Price,Quantity"></textarea>
          </div>
        </div>
      </div>
    </div>
    <script>
      async function createTrader() {
        const name = document.getElementById('trader-name').value;
        const pos = {
          x: parseFloat(document.getElementById('pos-x').value) || 0,
          y: parseFloat(document.getElementById('pos-y').value) || 0,
          z: parseFloat(document.getElementById('pos-z').value) || 0
        };
        const orientation = parseFloat(document.getElementById('orientation').value) || 0;
        const itemsText = document.getElementById('trader-items').value;
        const items = itemsText.split('\\n').filter(l => l.trim()).map(l => {
          const parts = l.split(',');
          return { class: parts[0], price: parseFloat(parts[1]) || 0, quantity: parseInt(parts[2]) || 1 };
        });
        try {
          await window.api.createTrader(name, { position: pos, orientation, items });
          alert('Trader created');
        } catch (error) {
          alert('Creation failed');
        }
      }
    </script>
  `;
}

