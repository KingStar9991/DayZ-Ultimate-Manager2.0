
const pages = {
  dashboard: 'assets/js/pages/dashboard.html',
  server: 'assets/js/pages/server.html',
  mods: 'assets/js/pages/mods.html',
  logs: 'assets/js/pages/logs.html',
  economy: 'assets/js/pages/economy.html',
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
  if(window.pageInit) try { window.pageInit(name) } catch(e){ console.warn(e) }
}
function setActiveNav(name){ elAll('.nav-btn').forEach(b=>{ b.classList.toggle('active', b.dataset.page === name); }); }
document.addEventListener('click', e=>{ const btn = e.target.closest('.nav-btn'); if(btn){ const p = btn.dataset.page; history.pushState({p},'',`#${p}`); setActiveNav(p); loadPage(p); } });
window.addEventListener('popstate', ()=>{ const p = location.hash.replace('#','') || 'dashboard'; setActiveNav(p); loadPage(p); });
const initial = location.hash.replace('#','') || 'dashboard'; setActiveNav(initial); loadPage(initial);
async function pollStatus(){ try{ const r = await fetch('/api/status'); const j = await r.json(); const s = el('#srv-status'); if(s) s.textContent = j.server?.online ? 'online' : 'offline'; }catch(e){} }
setInterval(pollStatus, 5000); pollStatus();
