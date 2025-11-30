export default async function TraderPricePage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Trader Price Calculator</h1>
        <button onclick="calculatePrices()" class="btn-primary">Calculate</button>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <label class="block text-sm text-gray-400 mb-2">Price Multiplier</label>
          <input type="number" id="multiplier" class="input-field w-32" value="1" step="0.1" min="0.1">
        </div>
        <textarea id="items-input" class="input-field w-full h-48 font-mono text-sm" placeholder="ItemClassName,BasePrice"></textarea>
        <div id="results" class="mt-4 space-y-2"></div>
      </div>
    </div>
    <script>
      async function calculatePrices() {
        const multiplier = parseFloat(document.getElementById('multiplier').value) || 1;
        const itemsText = document.getElementById('items-input').value;
        const items = itemsText.split('\\n').filter(l => l.trim()).map(l => {
          const parts = l.split(',');
          return { class: parts[0], basePrice: parseFloat(parts[1]) || 0 };
        });
        try {
          const results = await window.api.calculatePrices(items, multiplier);
          const container = document.getElementById('results');
          container.innerHTML = results.map(r => \`
            <div class="glass-card p-3">
              <div class="font-mono text-sm">\${r.class}</div>
              <div class="text-sm text-gray-400">Base: \${r.basePrice} → Calculated: \${r.calculatedPrice}</div>
            </div>
          \`).join('');
        } catch (error) {
          alert('Calculation failed');
        }
      }
    </script>
  `;
}

