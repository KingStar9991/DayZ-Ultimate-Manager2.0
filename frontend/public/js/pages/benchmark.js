export default async function BenchmarkPage() {
  return `
    <div class="p-6 space-y-6 animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold text-white">Server Performance Benchmarks</h1>
        <button onclick="runBenchmark()" class="btn-primary">Run Benchmark</button>
      </div>
      <div class="glass-panel p-6">
        <div id="benchmark-results" class="space-y-4">
          <div class="text-center text-gray-400 py-8">Click "Run Benchmark" to start performance testing</div>
        </div>
      </div>
    </div>
    <script>
      async function runBenchmark() {
        const container = document.getElementById('benchmark-results');
        container.innerHTML = '<div class="text-gray-400">Running benchmark...</div>';
        try {
          const results = await window.api.getBenchmark();
          container.innerHTML = \`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="glass-card p-4">
                <div class="text-sm text-gray-400 mb-1">CPU Score</div>
                <div class="text-3xl font-bold">\${results.cpuScore || 0}</div>
              </div>
              <div class="glass-card p-4">
                <div class="text-sm text-gray-400 mb-1">Memory Score</div>
                <div class="text-3xl font-bold">\${results.memoryScore || 0}</div>
              </div>
              <div class="glass-card p-4">
                <div class="text-sm text-gray-400 mb-1">Disk Score</div>
                <div class="text-3xl font-bold">\${results.diskScore || 0}</div>
              </div>
            </div>
            <div class="glass-card p-4 mt-4">
              <div class="font-medium mb-2">Overall Score</div>
              <div class="text-2xl font-bold">\${results.overallScore || 0}</div>
            </div>
          \`;
        } catch (error) {
          container.innerHTML = '<div class="text-red-400">Benchmark failed</div>';
        }
      }
    </script>
  `;
}

