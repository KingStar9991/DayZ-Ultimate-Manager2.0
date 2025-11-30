export default async function AdvancedConfigPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Advanced Config Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadConfig()" class="btn-primary">Load Config</button>
          <button onclick="saveConfig()" class="btn-secondary">Save</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="mb-4">
          <input type="text" id="config-path" class="input-field w-full font-mono text-sm" placeholder="Config file path">
        </div>
        <textarea id="config-editor" class="code-editor w-full h-96 font-mono text-sm" placeholder="Load a config file to edit..."></textarea>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="glass-panel p-4">
          <h3 class="font-bold mb-3">Server Flags</h3>
          <div class="space-y-2 text-sm">
            <button onclick="insertFlag('-profiles=ServerProfile')" class="btn-secondary w-full text-left text-xs">-profiles</button>
            <button onclick="insertFlag('-config=serverDZ.cfg')" class="btn-secondary w-full text-left text-xs">-config</button>
            <button onclick="insertFlag('-port=2302')" class="btn-secondary w-full text-left text-xs">-port</button>
            <button onclick="insertFlag('-dologs')" class="btn-secondary w-full text-left text-xs">-dologs</button>
            <button onclick="insertFlag('-adminlog')" class="btn-secondary w-full text-left text-xs">-adminlog</button>
            <button onclick="insertFlag('-netlog')" class="btn-secondary w-full text-left text-xs">-netlog</button>
            <button onclick="insertFlag('-freezecheck')" class="btn-secondary w-full text-left text-xs">-freezecheck</button>
          </div>
        </div>
        <div class="glass-panel p-4">
          <h3 class="font-bold mb-3">Parameters</h3>
          <div class="space-y-2 text-sm">
            <button onclick="insertParameter('serverTimeAcceleration=1')" class="btn-secondary w-full text-left text-xs">Time Acceleration</button>
            <button onclick="insertParameter('serverNightTimeAcceleration=1')" class="btn-secondary w-full text-left text-xs">Night Acceleration</button>
            <button onclick="insertParameter('serverTimePersistent=1')" class="btn-secondary w-full text-left text-xs">Persistent Time</button>
            <button onclick="insertParameter('serverMaxViewDistance=2500')" class="btn-secondary w-full text-left text-xs">Max View Distance</button>
            <button onclick="insertParameter('serverMinViewDistance=1000')" class="btn-secondary w-full text-left text-xs">Min View Distance</button>
            <button onclick="insertParameter('serverMaxStreamingDistance=5000')" class="btn-secondary w-full text-left text-xs">Max Streaming</button>
            <button onclick="insertParameter('serverMaxAllowedFilePatching=0')" class="btn-secondary w-full text-left text-xs">File Patching</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentPath = null;

      async function loadConfig() {
        const path = document.getElementById('config-path').value || prompt('Enter config path:');
        if (!path) return;
        currentPath = path;
        try {
          const config = await window.api.getServerConfig(path);
          document.getElementById('config-editor').value = config.content || '';
        } catch (error) {
          alert('Failed to load config: ' + error.message);
        }
      }

      async function saveConfig() {
        if (!currentPath) {
          currentPath = document.getElementById('config-path').value || prompt('Enter config path:');
          if (!currentPath) return;
        }
        const content = document.getElementById('config-editor').value;
        try {
          await window.api.saveServerConfig(currentPath, content);
          alert('Config saved');
        } catch (error) {
          alert('Failed to save: ' + error.message);
        }
      }

      function insertFlag(flag) {
        const editor = document.getElementById('config-editor');
        editor.value += (editor.value ? '\\n' : '') + flag;
      }

      function insertParameter(param) {
        const editor = document.getElementById('config-editor');
        editor.value += (editor.value ? '\\n' : '') + param;
      }
    </script>
  `;
}

