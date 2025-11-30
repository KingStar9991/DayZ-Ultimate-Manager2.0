// frontend/src/app.js
// Tiny front-end glue: connects buttons and displays basic info.

document.getElementById('btnSimulate').addEventListener('click', async () => {
  try {
    await fetch('http://127.0.0.1:3214/api/simulate-update', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({who: 'user', ts: Date.now()})
    });
  } catch (e) {
    appendConsole('Error calling simulate: ' + (e.message || e));
  }
});

document.getElementById('btnOpenExplorer').addEventListener('click', () => {
  // electron bridge will handle this; guard for browser
  if (window.titanicBridge && window.titanicBridge.openExplorer) {
    window.titanicBridge.openExplorer('data/servers');
  } else {
    appendConsole('Explorer open: please run inside Electron');
  }
});

function appendConsole(line) {
  const el = document.getElementById('console');
  el.innerText += '\\n' + line;
  el.scrollTop = el.scrollHeight;
}

window.addEventListener('load', () => {
  appendConsole('Frontend loaded.');
});
