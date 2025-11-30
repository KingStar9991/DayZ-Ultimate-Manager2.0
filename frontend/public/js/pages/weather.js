export default async function WeatherPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Weather Controller</h1>
        <button onclick="applyWeather()" class="btn-primary">Apply Weather</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Fog Density (0-1)</label>
            <input type="range" id="fog-density" class="w-full" min="0" max="1" step="0.01" value="0.5" oninput="updateFogValue()">
            <div class="text-sm font-mono" id="fog-value">0.5</div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Rain Intensity (0-1)</label>
            <input type="range" id="rain-intensity" class="w-full" min="0" max="1" step="0.01" value="0" oninput="updateRainValue()">
            <div class="text-sm font-mono" id="rain-value">0</div>
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Wind Speed (0-1)</label>
            <input type="range" id="wind-speed" class="w-full" min="0" max="1" step="0.01" value="0.3" oninput="updateWindValue()">
            <div class="text-sm font-mono" id="wind-value">0.3</div>
          </div>
        </div>
        <div class="mt-6">
          <div class="text-sm text-gray-400 mb-2">Presets</div>
          <div class="flex flex-wrap gap-2">
            <button onclick="setPreset('clear')" class="btn-secondary text-sm">Clear</button>
            <button onclick="setPreset('foggy')" class="btn-secondary text-sm">Foggy</button>
            <button onclick="setPreset('rainy')" class="btn-secondary text-sm">Rainy</button>
            <button onclick="setPreset('stormy')" class="btn-secondary text-sm">Stormy</button>
          </div>
        </div>
      </div>
    </div>
    <script>
      function updateFogValue() {
        document.getElementById('fog-value').textContent = document.getElementById('fog-density').value;
      }
      function updateRainValue() {
        document.getElementById('rain-value').textContent = document.getElementById('rain-intensity').value;
      }
      function updateWindValue() {
        document.getElementById('wind-value').textContent = document.getElementById('wind-speed').value;
      }
      function setPreset(preset) {
        const presets = {
          clear: { fog: 0, rain: 0, wind: 0.1 },
          foggy: { fog: 0.8, rain: 0, wind: 0.2 },
          rainy: { fog: 0.3, rain: 0.7, wind: 0.5 },
          stormy: { fog: 0.5, rain: 1, wind: 1 }
        };
        const p = presets[preset];
        document.getElementById('fog-density').value = p.fog;
        document.getElementById('rain-intensity').value = p.rain;
        document.getElementById('wind-speed').value = p.wind;
        updateFogValue();
        updateRainValue();
        updateWindValue();
      }
      async function applyWeather() {
        const fog = parseFloat(document.getElementById('fog-density').value);
        const rain = parseFloat(document.getElementById('rain-intensity').value);
        const wind = parseFloat(document.getElementById('wind-speed').value);
        try {
          await window.api.setWeather(fog, rain, wind);
          alert('Weather applied');
        } catch (error) {
          alert('Failed to apply weather');
        }
      }
    </script>
  `;
}

