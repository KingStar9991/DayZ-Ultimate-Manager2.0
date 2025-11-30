export default async function TypesXMLPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">types.xml Editor</h1>
        <div class="flex gap-3">
          <button onclick="loadTypesXML()" class="btn-primary">Load File</button>
          <button onclick="saveTypesXML()" class="btn-secondary">Save</button>
          <button onclick="validateXML()" class="btn-secondary">Validate</button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 glass-panel p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-bold">XML Content</h2>
            <div class="text-sm text-gray-400" id="file-path">No file loaded</div>
          </div>
          <textarea id="xml-editor" class="code-editor w-full h-96 font-mono text-sm" placeholder="Load a types.xml file to edit..."></textarea>
        </div>

        <div class="space-y-4">
          <div class="glass-panel p-4">
            <h3 class="font-bold mb-3">Quick Actions</h3>
            <div class="space-y-2">
              <button onclick="addType()" class="btn-secondary w-full text-left text-sm">Add Type</button>
              <button onclick="searchTypes()" class="btn-secondary w-full text-left text-sm">Search Types</button>
              <button onclick="exportTypes()" class="btn-secondary w-full text-left text-sm">Export Types</button>
            </div>
          </div>

          <div class="glass-panel p-4">
            <h3 class="font-bold mb-3">Statistics</h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Total Types</span>
                <span class="font-medium" id="type-count">0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Categories</span>
                <span class="font-medium" id="category-count">0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Nominal</span>
                <span class="font-medium" id="nominal-count">0</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Lifetime</span>
                <span class="font-medium" id="lifetime-count">0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="add-type-modal" class="hidden fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="glass-panel p-6 max-w-md w-full m-4">
          <h2 class="text-xl font-bold mb-4">Add Type</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm text-gray-400 mb-2">Name</label>
              <input type="text" id="type-name" class="input-field w-full" placeholder="ItemName">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Nominal</label>
              <input type="number" id="type-nominal" class="input-field w-full" value="1" min="0">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Lifetime</label>
              <input type="number" id="type-lifetime" class="input-field w-full" value="21600" min="0">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Restock</label>
              <input type="number" id="type-restock" class="input-field w-full" value="3600" min="0">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Min</label>
              <input type="number" id="type-min" class="input-field w-full" value="0" min="0">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">QuantMin</label>
              <input type="number" id="type-quantmin" class="input-field w-full" value="-1" min="-1">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">QuantMax</label>
              <input type="number" id="type-quantmax" class="input-field w-full" value="-1" min="-1">
            </div>
            <div>
              <label class="block text-sm text-gray-400 mb-2">Cost</label>
              <input type="number" id="type-cost" class="input-field w-full" value="100" min="0">
            </div>
            <div class="flex gap-3">
              <button onclick="insertType()" class="btn-primary flex-1">Add</button>
              <button onclick="closeAddType()" class="btn-secondary">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <script>
      let currentFilePath = null;

      async function loadTypesXML() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [
              { name: 'XML Files', extensions: ['xml'] },
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
          const response = await window.api.getTypesXML(path);
          document.getElementById('xml-editor').value = response.content || '';
          document.getElementById('file-path').textContent = path;
          currentFilePath = path;
          updateStatistics();
        } catch (error) {
          alert('Failed to load file: ' + error.message);
        }
      }

      async function saveTypesXML() {
        if (!currentFilePath) {
          alert('Please load a file first');
          return;
        }

        const content = document.getElementById('xml-editor').value;
        try {
          await window.api.saveTypesXML(currentFilePath, content);
          alert('File saved successfully');
        } catch (error) {
          alert('Failed to save file: ' + error.message);
        }
      }

      async function validateXML() {
        const content = document.getElementById('xml-editor').value;
        try {
          const result = await window.api.validateXML(currentFilePath || '');
          if (result.valid) {
            alert('XML is valid');
          } else {
            alert('XML validation errors: ' + (result.errors || []).join(', '));
          }
        } catch (error) {
          alert('Validation failed: ' + error.message);
        }
      }

      function addType() {
        document.getElementById('add-type-modal').classList.remove('hidden');
      }

      function closeAddType() {
        document.getElementById('add-type-modal').classList.add('hidden');
      }

      function insertType() {
        const editor = document.getElementById('xml-editor');
        const name = document.getElementById('type-name').value;
        const nominal = document.getElementById('type-nominal').value;
        const lifetime = document.getElementById('type-lifetime').value;
        const restock = document.getElementById('type-restock').value;
        const min = document.getElementById('type-min').value;
        const quantmin = document.getElementById('type-quantmin').value;
        const quantmax = document.getElementById('type-quantmax').value;
        const cost = document.getElementById('type-cost').value;

        if (!name) {
          alert('Please enter a type name');
          return;
        }

        const typeXML = \`    <type name="\${name}" nominal="\${nominal}" lifetime="\${lifetime}" restock="\${restock}" min="\${min}" quantmin="\${quantmin}" quantmax="\${quantmax}" cost="\${cost}"/>\`;

        const content = editor.value;
        const insertPos = content.lastIndexOf('</types>');
        if (insertPos !== -1) {
          editor.value = content.substring(0, insertPos) + '\\n' + typeXML + '\\n' + content.substring(insertPos);
        } else {
          editor.value += '\\n' + typeXML;
        }

        closeAddType();
        updateStatistics();
      }

      function searchTypes() {
        const search = prompt('Enter type name to search:');
        if (search) {
          const editor = document.getElementById('xml-editor');
          const content = editor.value;
          const index = content.toLowerCase().indexOf(search.toLowerCase());
          if (index !== -1) {
            editor.focus();
            editor.setSelectionRange(index, index + search.length);
          } else {
            alert('Type not found');
          }
        }
      }

      function exportTypes() {
        const content = document.getElementById('xml-editor').value;
        const blob = new Blob([content], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'types.xml';
        a.click();
      }

      function updateStatistics() {
        const content = document.getElementById('xml-editor').value;
        const typeMatches = content.match(/<type/g) || [];
        const categoryMatches = content.match(/<category/g) || [];
        
        document.getElementById('type-count').textContent = typeMatches.length;
        document.getElementById('category-count').textContent = categoryMatches.length;
      }

      document.getElementById('xml-editor').addEventListener('input', updateStatistics);
    </script>
  `;
}

