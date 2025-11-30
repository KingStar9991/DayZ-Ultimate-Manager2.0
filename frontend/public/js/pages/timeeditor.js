export default async function TimeEditorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Time of Day Editor</h1>
        <button onclick="setTime()" class="btn-primary">Set Time</button>
      </div>
      <div class="glass-panel p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm text-gray-400 mb-2">Hour (0-23)</label>
            <input type="number" id="time-hour" class="input-field w-full" value="12" min="0" max="23">
            <label class="block text-sm text-gray-400 mb-2 mt-4">Minute (0-59)</label>
            <input type="number" id="time-minute" class="input-field w-full" value="0" min="0" max="59">
          </div>
          <div>
            <label class="block text-sm text-gray-400 mb-2">Presets</label>
            <div class="space-y-2">
              <button onclick="setTimePreset(6, 0)" class="btn-secondary w-full text-left text-sm">Dawn (6:00)</button>
              <button onclick="setTimePreset(12, 0)" class="btn-secondary w-full text-left text-sm">Noon (12:00)</button>
              <button onclick="setTimePreset(18, 0)" class="btn-secondary w-full text-left text-sm">Dusk (18:00)</button>
              <button onclick="setTimePreset(0, 0)" class="btn-secondary w-full text-left text-sm">Midnight (0:00)</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <script>
      function setTimePreset(hour, minute) {
        document.getElementById('time-hour').value = hour;
        document.getElementById('time-minute').value = minute;
      }
      async function setTime() {
        const hour = parseInt(document.getElementById('time-hour').value) || 12;
        const minute = parseInt(document.getElementById('time-minute').value) || 0;
        try {
          await window.api.setTime(hour, minute);
          alert('Time set');
        } catch (error) {
          alert('Failed to set time');
        }
      }
    </script>
  `;
}

