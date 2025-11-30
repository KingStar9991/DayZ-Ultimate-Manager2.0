export default async function AutoRestartPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Automated Restarts</h1>
        <button onclick="createSchedule()" class="btn-primary">Create Schedule</button>
      </div>
      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Restart Schedules</h2>
        <div id="restart-schedules" class="space-y-3">
          <div class="text-center text-gray-400 py-8">No restart schedules configured</div>
        </div>
      </div>
    </div>
    <script>
      async function loadSchedules() {
        try {
          const schedules = await window.api.getSchedules();
          const restartSchedules = (schedules || []).filter(s => s.type === 'restart');
          renderSchedules(restartSchedules);
        } catch (error) {
          console.error('Failed to load schedules');
        }
      }
      function renderSchedules(schedules) {
        const container = document.getElementById('restart-schedules');
        if (schedules.length === 0) {
          container.innerHTML = '<div class="text-center text-gray-400 py-8">No restart schedules configured</div>';
          return;
        }
        container.innerHTML = schedules.map(s => \`
          <div class="glass-card p-4">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-medium">\${s.name || 'Untitled'}</div>
                <div class="text-sm text-gray-400">Schedule: \${s.schedule}</div>
              </div>
              <span class="px-2 py-1 rounded text-xs \${s.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}">\${s.enabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>
        \`).join('');
      }
      function createSchedule() {
        router.navigate('/scheduler');
      }
      loadSchedules();
    </script>
  `;
}

