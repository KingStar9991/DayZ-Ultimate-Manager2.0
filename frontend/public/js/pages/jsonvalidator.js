export default async function JSONValidatorPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">JSON Validator</h1>
        <button onclick="validate()" class="btn-primary">Validate</button>
      </div>
      <div class="glass-panel p-6">
        <textarea id="json-content" class="code-editor w-full h-96 font-mono text-sm" placeholder="Paste JSON content..."></textarea>
        <div id="validation-results" class="mt-4">
          <div class="text-center text-gray-400 py-4">Click "Validate" to check JSON</div>
        </div>
      </div>
    </div>
    <script>
      async function validate() {
        const content = document.getElementById('json-content').value;
        if (!content) {
          alert('Enter JSON content');
          return;
        }
        const container = document.getElementById('validation-results');
        container.innerHTML = '<div class="text-gray-400">Validating...</div>';
        try {
          const result = await window.api.validateJSON(content);
          if (result.valid) {
            container.innerHTML = '<div class="text-green-400">✓ JSON is valid</div>';
          } else {
            container.innerHTML = \`
              <div class="text-red-400 mb-2">✗ JSON is invalid</div>
              <div class="text-red-400 text-sm">\${result.error || 'Unknown error'}</div>
            \`;
          }
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Validation failed: ' + error.message + '</div>';
        }
      }
    </script>
  `;
}

