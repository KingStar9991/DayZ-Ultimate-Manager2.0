export default async function XMLValidatorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">XML Validator</h1>
        <div class="flex gap-3">
          <button onclick="selectFile()" class="btn-primary">Select File</button>
          <button onclick="validate()" class="btn-secondary">Validate</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div class="mb-4">
          <div class="text-sm text-gray-400 mb-2" id="file-path">No file selected</div>
          <textarea id="xml-content" class="code-editor w-full h-64 font-mono text-sm" placeholder="Paste XML content or select a file..."></textarea>
        </div>
        <div id="validation-results" class="space-y-2">
          <div class="text-center text-gray-400 py-4">Click "Validate" to check XML</div>
        </div>
      </div>
    </div>
    <script>
      let currentPath = null;
      async function selectFile() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFile({
            filters: [{ name: 'XML Files', extensions: ['xml'] }]
          });
          if (result?.filePaths?.[0]) {
            currentPath = result.filePaths[0];
            document.getElementById('file-path').textContent = currentPath;
            try {
              const response = await window.api.request(\`/api/utility/file?path=\${encodeURIComponent(currentPath)}\`);
              document.getElementById('xml-content').value = response.content || '';
            } catch (error) {
              alert('Failed to load file');
            }
          }
        }
      }
      async function validate() {
        const content = document.getElementById('xml-content').value;
        if (!content) {
          alert('Enter XML content');
          return;
        }
        const container = document.getElementById('validation-results');
        container.innerHTML = '<div class="text-gray-400">Validating...</div>';
        try {
          const result = await window.api.validateXML(currentPath || '');
          if (result.valid) {
            container.innerHTML = '<div class="text-green-400">✓ XML is valid</div>';
          } else {
            container.innerHTML = \`
              <div class="text-red-400 mb-2">✗ XML is invalid</div>
              \${(result.errors || []).map(e => \`<div class="text-red-400 text-sm">\${e}</div>\`).join('')}
            \`;
          }
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Validation failed: ' + error.message + '</div>';
        }
      }
    </script>
  `;
}

