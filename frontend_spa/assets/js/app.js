const pages = {
  dashboard: 'assets/js/pages/dashboard.html',
  server: 'assets/js/pages/server.html',
  mods: 'assets/js/pages/mods.html',
  logs: 'assets/js/pages/logs.html',
  economy: 'assets/js/pages/economy.html',
  trader: 'assets/js/pages/trader.html',
  mapgroups: 'assets/js/pages/mapgroups.html',
  settings: 'assets/js/pages/settings.html'
};

function el(q){return document.querySelector(q)}
function elAll(q){return Array.from(document.querySelectorAll(q))}

async function loadPage(name){
  const url = pages[name]||pages['dashboard'];
  const res = await fetch(url);
  const html = await res.text();
  el('#content').innerHTML = html;
  el('#page-title').textContent = name[0].toUpperCase()+name.slice(1);
  if(window.pageInit && typeof window.pageInit === 'function') window.pageInit(name);
}

function setActiveNav(name){
  elAll('.nav-btn').forEach(b=>{
    b.classList.toggle('active', b.dataset.page === name);
  });
}

document.addEventListener('click', e=>{
  const btn = e.target.closest('.nav-btn');
  if(btn){
    const p = btn.dataset.page;
    history.pushState({p},'',#);
    setActiveNav(p); loadPage(p);
  }
});

window.addEventListener('popstate', ()=>{
  const p = location.hash.replace('#','') || 'dashboard';
  setActiveNav(p); loadPage(p);
});

const initial = location.hash.replace('#','') || 'dashboard';
setActiveNav(initial);
loadPage(initial);

setInterval(()=>{
  const s = document.getElementById('srv-status');
  if(s) s.textContent = (Math.random()>0.6)?'online':'offline';
},4000);
