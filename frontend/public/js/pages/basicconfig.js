export default async function BasicConfigPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Basic Config Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadConfig()" class="btn-primary">Load Config</button>
          <button onclick="saveConfig()" class="btn-secondary">Save</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Server Settings</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Hostname</label>
              <input type="text" id="hostname" class="input-field w-full" placeholder="My DayZ Server">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Max Players</label>
              <input type="number" id="maxplayers" class="input-field w-full" value="60" min="1" max="120">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Port</label>
              <input type="number" id="port" class="input-field w-full" value="2302" min="1024" max="65535">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Query Port</label>
              <input type="number" id="queryport" class="input-field w-full" value="2303" min="1024" max="65535">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Steam Port</label>
              <input type="number" id="steamport" class="input-field w-full" value="2304" min="1024" max="65535">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Password (Optional)</label>
              <input type="password" id="password" class="input-field w-full" placeholder="Leave empty for no password">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Admin Password</label>
              <input type="password" id="adminpassword" class="input-field w-full" placeholder="Required for admin access">
            </div>
          </div>
        </div>

        <div class="glass-panel p-6">
          <h2 class="text-xl font-bold mb-4">Persistence & World</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Persistence</label>
              <select id="persistence" class="input-field w-full">
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Persistence Path</label>
              <input type="text" id="persistencepath" class="input-field w-full font-mono text-sm" placeholder="storage_1">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Mission</label>
              <input type="text" id="mission" class="input-field w-full" placeholder="dayzOffline.chernarusplus">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Mission Path</label>
              <input type="text" id="missionpath" class="input-field w-full font-mono text-sm" placeholder="mpmissions/dayzOffline.chernarusplus">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Server Config</label>
              <input type="text" id="servercfg" class="input-field w-full font-mono text-sm" placeholder="serverDZ.cfg">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">BattlEye</label>
              <select id="battleye" class="input-field w-full">
                <option value="1">Enabled</option>
                <option value="0">Disabled</option>
              </select>
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Server Time Acceleration</label>
              <input type="number" id="timeaccel" class="input-field w-full" value="1" step="0.1" min="0.1" max="10">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Night Time Acceleration</label>
              <input type="number" id="nightaccel" class="input-field w-full" value="1" step="0.1" min="0.1" max="10">
            </div>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h2 class="text-xl font-bold mb-4">Preview</h2>
        <div class="code-editor p-4 font-mono text-sm max-h-64 overflow-y-auto" id="config-preview">
          <!-- Preview will be generated here -->
        </div>
      </div>
    </div>

    <script>
      let currentConfigPath = null;

      function updatePreview() {
        const preview = document.getElementById('config-preview');
        const config = {
          hostname: document.getElementById('hostname').value,
          maxPlayers: document.getElementById('maxplayers').value,
          port: document.getElementById('port').value,
          queryPort: document.getElementById('queryport').value,
          steamPort: document.getElementById('steamport').value,
          password: document.getElementById('password').value,
          adminPassword: document.getElementById('adminpassword').value,
          persistence: document.getElementById('persistence').value,
          persistencePath: document.getElementById('persistencepath').value,
          mission: document.getElementById('mission').value,
          missionPath: document.getElementById('missionpath').value,
          serverCfg: document.getElementById('servercfg').value,
          battlEye: document.getElementById('battleye').value,
          timeAccel: document.getElementById('timeaccel').value,
          nightAccel: document.getElementById('nightaccel').value
        };

        const lines = [];
        if (config.hostname) lines.push(\`hostname="\${config.hostname}"\`);
        if (config.maxPlayers) lines.push(\`maxPlayers=\${config.maxPlayers}\`);
        if (config.port) lines.push(\`port=\${config.port}\`);
        if (config.queryPort) lines.push(\`queryPort=\${config.queryPort}\`);
        if (config.steamPort) lines.push(\`steamPort=\${config.steamPort}\`);
        if (config.password) lines.push(\`password="\${config.password}"\`);
        if (config.adminPassword) lines.push(\`adminPassword="\${config.adminPassword}"\`);
        if (config.persistence !== undefined) lines.push(\`persistence=\${config.persistence}\`);
        if (config.persistencePath) lines.push(\`persistencePath="\${config.persistencePath}"\`);
        if (config.mission) lines.push(\`mission="\${config.mission}"\`);
        if (config.missionPath) lines.push(\`missionPath="\${config.missionPath}"\`);
        if (config.serverCfg) lines.push(\`serverCfg="\${config.serverCfg}"\`);
        if (config.battlEye !== undefined) lines.push(\`BattlEye=\${config.battlEye}\`);
        if (config.timeAccel) lines.push(\`serverTimeAcceleration=\${config.timeAccel}\`);
        if (config.nightAccel) lines.push(\`serverNightTimeAcceleration=\${config.nightAccel}\`);

        preview.textContent = lines.join('\\n') || 'No configuration set';
      }

      async function loadConfig() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [
              { name: 'Config Files', extensions: ['cfg'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });
          if (result && result.filePaths && result.filePaths.length > 0) {
            currentConfigPath = result.filePaths[0];
            try {
              const config = await window.api.getServerConfig(currentConfigPath);
              parseConfig(config.content || '');
            } catch (error) {
              alert('Failed to load config: ' + error.message);
            }
          }
        }
      }

      function parseConfig(content) {
        const lines = content.split('\\n');
        lines.forEach(line => {
          const match = line.match(/^([^=]+)=["']?([^"']+)["']?$/);
          if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            const element = document.getElementById(key.toLowerCase().replace(/([A-Z])/g, '$1').toLowerCase());
            if (element) element.value = value;
          }
        });
        updatePreview();
      }

      async function saveConfig() {
        if (!currentConfigPath) {
          const path = prompt('Enter config file path:');
          if (!path) return;
          currentConfigPath = path;
        }

        updatePreview();
        const content = document.getElementById('config-preview').textContent;
        
        try {
          await window.api.saveServerConfig(currentConfigPath, content);
          alert('Config saved successfully');
        } catch (error) {
          alert('Failed to save config: ' + error.message);
        }
      }

      // Update preview on any change
      document.querySelectorAll('input, select').forEach(el => {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      });

      updatePreview();
    </script>
  `;
}

