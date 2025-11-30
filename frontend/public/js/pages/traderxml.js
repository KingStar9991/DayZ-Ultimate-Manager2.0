export default async function TraderXMLPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Trader XML Builder</h1>
        <div class="flex gap-3">
          <button onclick="selectTraderFolder()" class="btn-primary">Select Trader Folder</button>
          <button onclick="buildXML()" class="btn-secondary">Build XML</button>
        </div>
      </div>
      <div class="glass-panel p-6">
        <div class="text-sm text-gray-400 mb-4" id="trader-path">No folder selected</div>
        <div id="xml-output" class="code-editor p-4 font-mono text-sm max-h-96 overflow-y-auto">
          <div class="text-gray-400">Select a trader folder and click "Build XML"</div>
        </div>
      </div>
    </div>
    <script>
      async function selectTraderFolder() {
        if (window.electronAPI) {
          const result = await window.electronAPI.selectFolder();
          if (result?.filePaths?.[0]) {
            document.getElementById('trader-path').textContent = result.filePaths[0];
          }
        }
      }
      async function buildXML() {
        const path = document.getElementById('trader-path').textContent;
        if (path === 'No folder selected') {
          alert('Select a folder first');
          return;
        }
        try {
          const xml = await window.api.buildTraderXML(path);
          document.getElementById('xml-output').textContent = xml.content || '';
        } catch (error) {
          alert('Build failed');
        }
      }
    </script>
  `;
}

