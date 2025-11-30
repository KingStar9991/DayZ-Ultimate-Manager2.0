export default async function ScriptValidatorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Script Syntax Validator</h1>
        <button onclick="validate()" class="btn-primary">Validate</button>
      </div>
      <div class="glass-panel p-6">
        <textarea id="script-content" class="code-editor w-full h-96 font-mono text-sm" placeholder="Paste script content..."></textarea>
        <div id="validation-results" class="mt-4">
          <div class="text-center text-gray-400 py-4">Click "Validate" to check script syntax</div>
        </div>
      </div>
    </div>
    <script>
      async function validate() {
        const content = document.getElementById('script-content').value;
        if (!content) {
          alert('Enter script content');
          return;
        }
        const container = document.getElementById('validation-results');
        container.innerHTML = '<div class="text-gray-400">Validating...</div>';
        try {
          const result = await window.api.validateScript(content);
          if (result.valid) {
            container.innerHTML = '<div class="text-green-400">✓ Script syntax is valid</div>';
          } else {
            container.innerHTML = \`
              <div class="text-red-400 mb-2">✗ Script has errors</div>
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

