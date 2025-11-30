// frontend/src/wsClient.js
(function () {
  const url = 'ws://127.0.0.1:3214';
  let ws;
  function setup() {
    try {
      ws = new WebSocket(url);
      ws.onopen = () => append('WS connected');
      ws.onmessage = (m) => {
        try {
          const d = JSON.parse(m.data);
          append('WS: ' + JSON.stringify(d));
          if (d.type === 'fs-event') {
            updateServersList();
          }
        } catch(e) {
          append('WS parse error');
        }
      };
      ws.onclose = () => {
        append('WS closed. retry in 3s'); setTimeout(setup, 3000);
      };
    } catch(e) { append('WS setup failed: '+e.message); }
  }
  function append(s) {
    const el = document.getElementById('console');
    if (!el) return;
    el.innerText += '\\n' + s;
    el.scrollTop = el.scrollHeight;
  }
  async function updateServersList() {
    // quick: read data/servers folder via backend? for now placeholder
    const listEl = document.getElementById('serversList');
    listEl.innerHTML = '<li>imported-server (placeholder)</li>';
  }
  setup();
  window.__du_ws = { ws };
})();
