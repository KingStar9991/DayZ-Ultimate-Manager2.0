// UI Engine: simple router & loader
const root = document.getElementById('app-root');
const pages = {
  dashboard: () => `<div class="page"><h2>Dashboard</h2><div id="widgets"></div></div>`,
  server: () => `<div class="page"><h2>Server</h2></div>`,
  mods: () => `<div class="page"><h2>Mods</h2></div>`,
  logs: () => `<div class="page"><h2>Logs</h2></div>`
};

function navTo(p){ history.pushState({p},'',`#${p}`); render(); }

function render(){
  const p = location.hash.replace('#','') || 'dashboard';
  root.innerHTML = `
    <div class="shell">
      <aside class="side"><button onclick="navTo('dashboard')">Dashboard</button><button onclick="navTo('server')">Server</button><button onclick="navTo('mods')">Mods</button><button onclick="navTo('logs')">Logs</button></aside>
      <main class="main">${pages[p]()}</main>
    </div>`;
}
window.addEventListener('popstate', render);
render();