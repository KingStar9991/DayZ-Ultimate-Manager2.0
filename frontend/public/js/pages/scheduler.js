export default async function SchedulerPage() {
  const schedules = await window.api.getSchedules().catch(() => []);
  
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Auto Restart Scheduler</h1>
        <button onclick="showCreateSchedule()" class="btn-primary">Create Schedule</button>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Active Schedules</h2>
        <div id="schedule-list" class="space-y-3">
          ${schedules.length === 0 ? `
            <div class="text-center text-gray-400 py-8">No schedules configured</div>
          ` : schedules.map(schedule => `
            <div class="glass-card p-4" data-schedule-id="${schedule.id}">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span class="px-2 py-1 rounded ${schedule.enabled ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'} text-xs font-medium">
                      ${schedule.enabled ? 'ENABLED' : 'DISABLED'}
                    </span>
                    <span class="font-medium">${schedule.name || 'Untitled Schedule'}</span>
                    <span class="text-sm text-gray-400">${schedule.type || 'restart'}</span>
                  </div>
                  <div class="text-sm text-gray-400">
                    <div>Schedule: ${formatSchedule(schedule.schedule)}</div>
                    <div>Next Run: ${schedule.nextRun ? formatDate(schedule.nextRun) : 'N/A'}</div>
                    ${schedule.lastRun ? `<div>Last Run: ${formatDate(schedule.lastRun)}</div>` : ''}
                  </div>
                </div>
                <div class="flex gap-2">
                  <button onclick="toggleSchedule('${schedule.id}')" class="btn-secondary text-sm">
                    ${schedule.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button onclick="editSchedule('${schedule.id}')" class="btn-secondary text-sm">Edit</button>
                  <button onclick="deleteSchedule('${schedule.id}')" class="text-red-400 hover:text-red-300 text-sm">Delete</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <div id="create-schedule-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="glass-panel p-6 max-w-md w-full m-4">
          <h2 class="text-xl font-bold mb-4">Create Schedule</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Schedule Name</label>
              <input type="text" id="schedule-name" class="input-field w-full" placeholder="Daily Restart">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Schedule Type</label>
              <select id="schedule-type" class="input-field w-full">
                <option value="restart">Server Restart</option>
                <option value="backup">Backup</option>
                <option value="mod-update">Mod Update</option>
                <option value="command">Custom Command</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Schedule Pattern</label>
              <select id="schedule-pattern" class="input-field w-full" onchange="updateSchedulePreview()">
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="custom">Custom (Cron)</option>
              </select>
            </div>
            <div id="schedule-time-inputs">
              <div>
                <label class="block text-sm text-gray-400 mb-2">Time</label>
                <input type="time" id="schedule-time" class="input-field w-full" value="03:00" onchange="updateSchedulePreview()">
              </div>
              <div id="schedule-day-input" class="mt-2">
                <label class="block text-sm text-gray-400 mb-2">Day of Week</label>
                <select id="schedule-day" class="input-field w-full" onchange="updateSchedulePreview()">
                  <option value="0">Sunday</option>
                  <option value="1">Monday</option>
                  <option value="2">Tuesday</option>
                  <option value="3">Wednesday</option>
                  <option value="4">Thursday</option>
                  <option value="5">Friday</option>
                  <option value="6">Saturday</option>
                </select>
              </div>
            </div>
            <div id="schedule-cron-input" class="hidden">
              <label class="block text-sm text-gray-400 mb-2">Cron Expression</label>
              <input type="text" id="schedule-cron" class="input-field w-full font-mono" placeholder="0 3 * * *" onchange="updateSchedulePreview()">
              <div class="text-xs text-gray-400 mt-1">Format: minute hour day month weekday</div>
            </div>
            <div class="glass-card p-3">
              <div class="text-sm text-gray-400 mb-1">Preview</div>
              <div class="font-mono text-sm" id="schedule-preview">0 3 * * * (Daily at 3:00 AM)</div>
            </div>
            <div>
              <label class="flex items-center gap-2">
                <input type="checkbox" id="schedule-enabled" checked>
                <span class="text-sm">Enable schedule immediately</span>
              </label>
            </div>
            <div class="flex gap-3">
              <button onclick="saveSchedule()" class="btn-primary flex-1">Create</button>
              <button onclick="closeCreateSchedule()" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      function formatDate(date) {
        return new Date(date).toLocaleString();
      }

      function formatSchedule(schedule) {
        if (typeof schedule === 'string') {
          return schedule;
        }
        return JSON.stringify(schedule);
      }

      function updateSchedulePreview() {
        const pattern = document.getElementById('schedule-pattern').value;
        const preview = document.getElementById('schedule-preview');
        
        if (pattern === 'custom') {
          const cron = document.getElementById('schedule-cron').value || '0 3 * * *';
          preview.textContent = cron + ' (Custom cron expression)';
        } else if (pattern === 'daily') {
          const time = document.getElementById('schedule-time').value;
          const [hours, minutes] = time.split(':');
          preview.textContent = \`\${minutes} \${hours} * * * (Daily at \${time})\`;
        } else if (pattern === 'weekly') {
          const time = document.getElementById('schedule-time').value;
          const day = document.getElementById('schedule-day').value;
          const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const [hours, minutes] = time.split(':');
          preview.textContent = \`\${minutes} \${hours} * * \${day} (Weekly on \${days[day]} at \${time})\`;
        }
      }

      function showCreateSchedule() {
        document.getElementById('create-schedule-modal').classList.remove('hidden');
        updateSchedulePreview();
      }

      function closeCreateSchedule() {
        document.getElementById('create-schedule-modal').classList.add('hidden');
      }

      document.getElementById('schedule-pattern').addEventListener('change', function() {
        const pattern = this.value;
        const timeInputs = document.getElementById('schedule-time-inputs');
        const cronInput = document.getElementById('schedule-cron-input');
        const dayInput = document.getElementById('schedule-day-input');
        
        if (pattern === 'custom') {
          timeInputs.classList.add('hidden');
          cronInput.classList.remove('hidden');
        } else {
          timeInputs.classList.remove('hidden');
          cronInput.classList.add('hidden');
          if (pattern === 'daily') {
            dayInput.classList.add('hidden');
          } else {
            dayInput.classList.remove('hidden');
          }
        }
        updateSchedulePreview();
      });

      async function saveSchedule() {
        const name = document.getElementById('schedule-name').value;
        const type = document.getElementById('schedule-type').value;
        const pattern = document.getElementById('schedule-pattern').value;
        const enabled = document.getElementById('schedule-enabled').checked;
        
        let schedule;
        if (pattern === 'custom') {
          schedule = document.getElementById('schedule-cron').value;
        } else if (pattern === 'daily') {
          const time = document.getElementById('schedule-time').value;
          const [hours, minutes] = time.split(':');
          schedule = \`\${minutes} \${hours} * * *\`;
        } else if (pattern === 'weekly') {
          const time = document.getElementById('schedule-time').value;
          const day = document.getElementById('schedule-day').value;
          const [hours, minutes] = time.split(':');
          schedule = \`\${minutes} \${hours} * * \${day}\`;
        }

        if (!name || !schedule) {
          alert('Please fill in all required fields');
          return;
        }

        try {
          await window.api.createSchedule(type, schedule, enabled);
          alert('Schedule created successfully');
          closeCreateSchedule();
          router.navigate('/scheduler');
        } catch (error) {
          alert('Failed to create schedule: ' + error.message);
        }
      }

      async function toggleSchedule(id) {
        try {
          const schedules = await window.api.getSchedules();
          const schedule = schedules.find(s => s.id === id);
          if (schedule) {
            await window.api.createSchedule(schedule.type, schedule.schedule, !schedule.enabled);
            router.navigate('/scheduler');
          }
        } catch (error) {
          alert('Failed to toggle schedule: ' + error.message);
        }
      }

      async function editSchedule(id) {
        alert('Edit functionality coming soon');
      }

      async function deleteSchedule(id) {
        if (!confirm('Are you sure you want to delete this schedule?')) {
          return;
        }

        try {
          await window.api.deleteSchedule(id);
          alert('Schedule deleted successfully');
          router.navigate('/scheduler');
        } catch (error) {
          alert('Failed to delete schedule: ' + error.message);
        }
      }
    </script>
  `;
}

