export default async function ServerConfigPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Server.cfg Editor</h1>
        <div class="flex gap-3">
          <button onclick="selectConfigFile()" class="btn-primary">Load Config File</button>
          <button onclick="saveConfig()" class="btn-secondary">Save</button>
          <button onclick="validateConfig()" class="btn-secondary">Validate</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 glass-panel p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold">Configuration</h2>
            <div class="text-sm text-gray-400" id="config-path">No file loaded</div>
          </div>
          <textarea id="config-editor" class="code-editor w-full h-96 font-mono text-sm" placeholder="Load a server.cfg file to edit..."></textarea>
        </div>

        <div class="space-y-4">
          <div class="glass-panel p-4">
            <h3 class="font-bold mb-3">Quick Settings</h3>
            <div class="space-y-3">
              <div>
                <label class="block text-sm text-gray-400 mb-1">Hostname</label>
                <input type="text" id="quick-hostname" class="input-field w-full" placeholder="My DayZ Server">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Max Players</label>
                <input type="number" id="quick-maxplayers" class="input-field w-full" value="60" min="1" max="120">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Port</label>
                <input type="number" id="quick-port" class="input-field w-full" value="2302" min="1024" max="65535">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Query Port</label>
                <input type="number" id="quick-queryport" class="input-field w-full" value="2303" min="1024" max="65535">
              </div>
              <div>
                <label class="block text-sm text-gray-400 mb-1">Steam Port</label>
                <input type="number" id="quick-steamport" class="input-field w-full" value="2304" min="1024" max="65535">
              </div>
              <button onclick="applyQuickSettings()" class="btn-primary w-full">Apply Quick Settings</button>
            </div>
          </div>

          <div class="glass-panel p-4">
            <h3 class="font-bold mb-3">Common Parameters</h3>
            <div class="space-y-2 text-sm">
              <button onclick="insertParameter('serverTimeAcceleration=1')" class="btn-secondary w-full text-left text-xs">Time Acceleration</button>
              <button onclick="insertParameter('serverNightTimeAcceleration=1')" class="btn-secondary w-full text-left text-xs">Night Time Acceleration</button>
              <button onclick="insertParameter('serverNightTimeAcceleration=4')" class="btn-secondary w-full text-left text-xs">Night Time Acceleration (4x)</button>
              <button onclick="insertParameter('serverTimePersistent=1')" class="btn-secondary w-full text-left text-xs">Persistent Time</button>
              <button onclick="insertParameter('serverMaxViewDistance=2500')" class="btn-secondary w-full text-left text-xs">Max View Distance</button>
              <button onclick="insertParameter('serverMinViewDistance=1000')" class="btn-secondary w-full text-left text-xs">Min View Distance</button>
              <button onclick="insertParameter('serverMaxStreamingDistance=5000')" class="btn-secondary w-full text-left text-xs">Max Streaming Distance</button>
            </div>
          </div>
        </div>
      </div>

      <div id="config-validation" class="glass-panel p-4 hidden">
        <h3 class="font-bold mb-2">Validation Results</h3>
        <div id="validation-results"></div>
      </div>
    </div>

    <script>
      let currentConfigPath = null;

      async function selectConfigFile() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [
              { name: 'Config Files', extensions: ['cfg'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });
          if (result && result.filePaths && result.filePaths.length > 0) {
            await loadConfigFile(result.filePaths[0]);
          }
        } else {
          const path = prompt('Enter config file path:');
          if (path) {
            await loadConfigFile(path);
          }
        }
      }

      async function loadConfigFile(path) {
        try {
          const config = await window.api.getServerConfig(path);
          document.getElementById('config-editor').value = config.content || '';
          document.getElementById('config-path').textContent = path;
          currentConfigPath = path;
          
          // Extract quick settings
          const lines = (config.content || '').split('\\n');
          lines.forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
              const key = match[1].trim();
              const value = match[2].trim();
              if (key === 'hostname') document.getElementById('quick-hostname').value = value;
              if (key === 'maxPlayers') document.getElementById('quick-maxplayers').value = value;
              if (key === 'port') document.getElementById('quick-port').value = value;
              if (key === 'queryPort') document.getElementById('quick-queryport').value = value;
              if (key === 'steamPort') document.getElementById('quick-steamport').value = value;
            }
          });
        } catch (error) {
          alert('Failed to load config file: ' + error.message);
        }
      }

      async function saveConfig() {
        if (!currentConfigPath) {
          alert('Please load a config file first');
          return;
        }

        const content = document.getElementById('config-editor').value;
        try {
          await window.api.saveServerConfig(currentConfigPath, content);
          alert('Config saved successfully');
        } catch (error) {
          alert('Failed to save config: ' + error.message);
        }
      }

      async function validateConfig() {
        const content = document.getElementById('config-editor').value;
        const validation = document.getElementById('config-validation');
        const results = document.getElementById('validation-results');
        
        validation.classList.remove('hidden');
        results.innerHTML = '<div class="text-gray-400">Validating...</div>';

        try {
          const response = await window.api.request('/api/config/validate', {
            method: 'POST',
            body: { content, type: 'servercfg' }
          });

          if (response.valid) {
            results.innerHTML = '<div class="text-green-400">✓ Configuration is valid</div>';
          } else {
            const errors = (response.errors || []).map(e => 
              \`<div class="text-red-400 mb-1">✗ \${escapeHtml(e)}</div>\`
            ).join('');
            results.innerHTML = errors;
          }
        } catch (error) {
          results.innerHTML = \`<div class="text-red-400">Validation failed: \${error.message}</div>\`;
        }
      }

      function applyQuickSettings() {
        const editor = document.getElementById('config-editor');
        let content = editor.value;
        
        const settings = {
          hostname: document.getElementById('quick-hostname').value,
          maxPlayers: document.getElementById('quick-maxplayers').value,
          port: document.getElementById('quick-port').value,
          queryPort: document.getElementById('quick-queryport').value,
          steamPort: document.getElementById('quick-steamport').value
        };

        Object.entries(settings).forEach(([key, value]) => {
          if (value) {
            const regex = new RegExp(\`^(\${key}=).*$\`, 'm');
            if (regex.test(content)) {
              content = content.replace(regex, \`\${key}=\${value}\`);
            } else {
              content += \`\\n\${key}=\${value}\`;
            }
          }
        });

        editor.value = content;
      }

      function insertParameter(param) {
        const editor = document.getElementById('config-editor');
        const cursorPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, cursorPos);
        const textAfter = editor.value.substring(cursorPos);
        
        editor.value = textBefore + param + '\\n' + textAfter;
        editor.focus();
        editor.setSelectionRange(cursorPos + param.length + 1, cursorPos + param.length + 1);
      }

      function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
      }
    </script>
  `;
}

