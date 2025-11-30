export default async function InitCPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">init.c Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadInitC()" class="btn-primary">Load File</button>
          <button onclick="saveInitC()" class="btn-secondary">Save</button>
          <button onclick="validateScript()" class="btn-secondary">Validate</button>
        </div>
      </div>

      <div class="glass-panel p-6">
        <div class="mb-4 flex items-center justify-between">
          <div class="text-sm text-gray-400" id="file-path">No file loaded</div>
          <div class="flex gap-2">
            <button onclick="formatCode()" class="btn-secondary text-sm">Format</button>
            <button onclick="showSnippets()" class="btn-secondary text-sm">Snippets</button>
          </div>
        </div>
        <textarea id="initc-editor" class="code-editor w-full h-[600px] font-mono text-sm" placeholder="Load an init.c file to edit..."></textarea>
      </div>

      <div id="snippets-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="glass-panel p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-y-auto">
          <h2 class="text-xl font-bold mb-4">Code Snippets</h2>
          <div class="space-y-3">
            <div>
              <div class="text-sm font-medium mb-1">Basic Event Handler</div>
              <button onclick="insertSnippet('eventHandler')" class="btn-secondary w-full text-left text-xs font-mono">Insert</button>
            </div>
            <div>
              <div class="text-sm font-medium mb-1">Player Connect</div>
              <button onclick="insertSnippet('playerConnect')" class="btn-secondary w-full text-left text-xs font-mono">Insert</button>
            </div>
            <div>
              <div class="text-sm font-medium mb-1">Player Disconnect</div>
              <button onclick="insertSnippet('playerDisconnect')" class="btn-secondary w-full text-left text-xs font-mono">Insert</button>
            </div>
            <div>
              <div class="text-sm font-medium mb-1">Server Update</div>
              <button onclick="insertSnippet('serverUpdate')" class="btn-secondary w-full text-left text-xs font-mono">Insert</button>
            </div>
            <button onclick="closeSnippets()" class="btn-secondary w-full mt-4">Close</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentPath = null;
      const snippets = {
        eventHandler: \`void OnEvent(EventType eventType, Param params) {
    switch (eventType) {
        case EventType.PLAYER_CONNECT:
            // Handle player connect
            break;
        case EventType.PLAYER_DISCONNECT:
            // Handle player disconnect
            break;
    }
}\`,
        playerConnect: \`void OnPlayerConnect(PlayerBase player) {
    Print("[Server] Player connected: " + player.GetIdentity().GetName());
}\`,
        playerDisconnect: \`void OnPlayerDisconnect(PlayerBase player) {
    Print("[Server] Player disconnected: " + player.GetIdentity().GetName());
}\`,
        serverUpdate: \`void OnUpdate(float delta_time) {
    // Server update logic
}\`
      };

      async function loadInitC() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [
              { name: 'C Files', extensions: ['c'] },
              { name: 'All Files', extensions: ['*'] }
            ]
          });
          if (result && result.filePaths && result.filePaths.length > 0) {
            await loadFile(result.filePaths[0]);
          }
        }
      }

      async function loadFile(path) {
        try {
          const response = await window.api.getInitC(path);
          document.getElementById('initc-editor').value = response.content || '';
          document.getElementById('file-path').textContent = path;
          currentPath = path;
        } catch (error) {
          alert('Failed to load file: ' + error.message);
        }
      }

      async function saveInitC() {
        if (!currentPath) {
          alert('Please load a file first');
          return;
        }
        const content = document.getElementById('initc-editor').value;
        try {
          await window.api.saveInitC(currentPath, content);
          alert('File saved successfully');
        } catch (error) {
          alert('Failed to save: ' + error.message);
        }
      }

      async function validateScript() {
        const content = document.getElementById('initc-editor').value;
        try {
          const result = await window.api.validateScript(content);
          if (result.valid) {
            alert('Script is valid');
          } else {
            alert('Validation errors: ' + (result.errors || []).join(', '));
          }
        } catch (error) {
          alert('Validation failed: ' + error.message);
        }
      }

      function formatCode() {
        // Basic formatting - indent lines
        const editor = document.getElementById('initc-editor');
        const lines = editor.value.split('\\n');
        let indent = 0;
        const formatted = lines.map(line => {
          const trimmed = line.trim();
          if (trimmed.endsWith('{')) {
            const result = '    '.repeat(indent) + trimmed;
            indent++;
            return result;
          } else if (trimmed.startsWith('}')) {
            indent = Math.max(0, indent - 1);
            return '    '.repeat(indent) + trimmed;
          }
          return '    '.repeat(indent) + trimmed;
        }).join('\\n');
        editor.value = formatted;
      }

      function showSnippets() {
        document.getElementById('snippets-modal').classList.remove('hidden');
      }

      function closeSnippets() {
        document.getElementById('snippets-modal').classList.add('hidden');
      }

      function insertSnippet(key) {
        const editor = document.getElementById('initc-editor');
        const cursorPos = editor.selectionStart;
        const textBefore = editor.value.substring(0, cursorPos);
        const textAfter = editor.value.substring(cursorPos);
        editor.value = textBefore + snippets[key] + '\\n\\n' + textAfter;
        closeSnippets();
      }
    </script>
  `;
}

