export default async function EventsXMLPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">events.xml Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadEventsXML()" class="btn-primary">Load File</button>
          <button onclick="saveEventsXML()" class="btn-secondary">Save</button>
          <button onclick="validateXML()" class="btn-secondary">Validate</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 glass-panel p-6">
          <div class="text-sm text-gray-400 mb-4" id="file-path">No file loaded</div>
          <textarea id="xml-editor" class="code-editor w-full h-96 font-mono text-sm" placeholder="Load an events.xml file to edit..."></textarea>
        </div>
        <div class="glass-panel p-4">
          <h3 class="font-bold mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <button onclick="addEvent()" class="btn-secondary w-full text-left text-sm">Add Event</button>
            <button onclick="searchEvents()" class="btn-secondary w-full text-left text-sm">Search Events</button>
            <button onclick="exportXML()" class="btn-secondary w-full text-left text-sm">Export XML</button>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentPath = null;

      async function loadEventsXML() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [{ name: 'XML Files', extensions: ['xml'] }]
          });
          if (result?.filePaths?.[0]) {
            await loadFile(result.filePaths[0]);
          }
        }
      }

      async function loadFile(path) {
        try {
          const response = await window.api.getEventsXML(path);
          document.getElementById('xml-editor').value = response.content || '';
          document.getElementById('file-path').textContent = path;
          currentPath = path;
        } catch (error) {
          alert('Failed to load: ' + error.message);
        }
      }

      async function saveEventsXML() {
        if (!currentPath) {
          alert('Load a file first');
          return;
        }
        const content = document.getElementById('xml-editor').value;
        try {
          await window.api.saveEventsXML(currentPath, content);
          alert('Saved');
        } catch (error) {
          alert('Save failed: ' + error.message);
        }
      }

      async function validateXML() {
        const content = document.getElementById('xml-editor').value;
        try {
          const result = await window.api.validateXML(currentPath || '');
          alert(result.valid ? 'Valid' : 'Invalid: ' + result.errors.join(', '));
        } catch (error) {
          alert('Validation failed');
        }
      }

      function addEvent() {
        const name = prompt('Event name:');
        if (!name) return;
        const editor = document.getElementById('xml-editor');
        const eventXML = \`    <event name="\${name}">
        <nominal>1</nominal>
        <lifetime>21600</lifetime>
        <restock>3600</restock>
        <min>0</min>
        <quantmin>-1</quantmin>
        <quantmax>-1</quantmax>
        <cost>100</cost>
    </event>\`;
        const content = editor.value;
        const insertPos = content.lastIndexOf('</events>');
        editor.value = insertPos !== -1 
          ? content.substring(0, insertPos) + '\\n' + eventXML + '\\n' + content.substring(insertPos)
          : content + '\\n' + eventXML;
      }

      function searchEvents() {
        const search = prompt('Search:');
        if (search) {
          const editor = document.getElementById('xml-editor');
          const index = editor.value.toLowerCase().indexOf(search.toLowerCase());
          if (index !== -1) {
            editor.focus();
            editor.setSelectionRange(index, index + search.length);
          }
        }
      }

      function exportXML() {
        const content = document.getElementById('xml-editor').value;
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.xml';
        a.click();
      }
    </script>
  `;
}

