// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  initializeSidebar();
  initializeSystemInfo();
  setupRoutes();
});

function initializeSidebar() {
  const sidebar = document.getElementById('sidebar');
  
  const menuItems = [
    { path: '/', icon: '🏠', label: 'Dashboard' },
    { path: '/server-status', icon: '🖥️', label: 'Server Status' },
    { path: '/players', icon: '👥', label: 'Live Player List' },
    { path: '/performance', icon: '📊', label: 'Performance Monitor' },
    { path: '/logs', icon: '📝', label: 'Logs Viewer' },
    { path: '/crash-logs', icon: '💥', label: 'Crash Log Analyzer' },
    { path: '/backups', icon: '💾', label: 'Backup Manager' },
    { path: '/scheduler', icon: '⏰', label: 'Auto Restart Scheduler' },
    { path: '/file-browser', icon: '📁', label: 'File Browser' },
    { path: '/server-config', icon: '⚙️', label: 'Server.cfg Editor' },
    { path: '/basic-config', icon: '🔧', label: 'Basic Config' },
    { path: '/advanced-config', icon: '🔨', label: 'Advanced Config' },
    { path: '/init-c', icon: '📄', label: 'init.c Editor' },
    { path: '/battleye', icon: '🛡️', label: 'BattlEye Editor' },
    { path: '/types-xml', icon: '📦', label: 'types.xml Editor' },
    { path: '/events-xml', icon: '🎯', label: 'events.xml Editor' },
    { path: '/economy-xml', icon: '💰', label: 'cfgEconomyCore.xml' },
    { path: '/spawnable-types', icon: '🎲', label: 'spawnabletypes.xml' },
    { path: '/economy-backup', icon: '💼', label: 'Economy Backup' },
    { path: '/mapgroups', icon: '🗺️', label: 'MapGroups Editor' },
    { path: '/mapgroup-pos', icon: '📍', label: 'MapGroupPos Editor' },
    { path: '/ce-tool', icon: '🔥', label: 'CE Tool Visual Map' },
    { path: '/loot-validator', icon: '✅', label: 'Loot Economy Validator' },
    { path: '/mods', icon: '📚', label: 'Mod Manager' },
    { path: '/mod-updater', icon: '🔄', label: 'Mod Updater' },
    { path: '/mod-conflicts', icon: '⚠️', label: 'Mod Conflict Scanner' },
    { path: '/mod-loadorder', icon: '📋', label: 'Mod Load Order' },
    { path: '/mod-toggle', icon: '🔀', label: 'Mod Enable/Disable' },
    { path: '/mod-inspector', icon: '🔍', label: 'Mod Folder Inspector' },
    { path: '/keys', icon: '🔑', label: 'Client/Server Keys' },
    { path: '/trader-create', icon: '🏪', label: 'Trader Creator' },
    { path: '/trader-price', icon: '💵', label: 'Trader Price Calculator' },
    { path: '/trader-xml', icon: '📋', label: 'Trader XML Builder' },
    { path: '/trader-spawn', icon: '👤', label: 'NPC Trader Spawn' },
    { path: '/item-database', icon: '🗃️', label: 'Item Class Database' },
    { path: '/item-stats', icon: '📈', label: 'Item Statistics' },
    { path: '/player-manager', icon: '👤', label: 'Online Players' },
    { path: '/kick-ban', icon: '🚫', label: 'Kick/Ban Panel' },
    { path: '/player-inventory', icon: '🎒', label: 'Player Inventory' },
    { path: '/player-teleport', icon: '🚀', label: 'Player Teleport' },
    { path: '/player-logs', icon: '📜', label: 'Player Log History' },
    { path: '/map-viewer', icon: '🗺️', label: '2D Map Viewer' },
    { path: '/coordinates', icon: '🧭', label: 'Coordinate Helper' },
    { path: '/object-spawner', icon: '🎁', label: 'Object Spawner' },
    { path: '/basebuilding', icon: '🏗️', label: 'Basebuilding Preview' },
    { path: '/spawn-editor', icon: '🐺', label: 'Animal/Zombie Spawn' },
    { path: '/weather', icon: '🌤️', label: 'Weather Controller' },
    { path: '/time-editor', icon: '🕐', label: 'Time of Day Editor' },
    { path: '/auto-backup', icon: '💾', label: 'Automated Backups' },
    { path: '/auto-restart', icon: '🔄', label: 'Automated Restarts' },
    { path: '/xml-validator', icon: '✓', label: 'XML Validator' },
    { path: '/json-validator', icon: '✓', label: 'JSON Validator' },
    { path: '/script-validator', icon: '✓', label: 'Script Validator' },
    { path: '/path-checker', icon: '🔍', label: 'Folder Path Checker' },
    { path: '/benchmark', icon: '⚡', label: 'Performance Benchmarks' },
    { path: '/rpt-parser', icon: '📊', label: 'RPT Parser' },
    { path: '/economy-sanity', icon: '🧠', label: 'Economy Sanity Check' }
  ];
  
  sidebar.innerHTML = menuItems.map(item => `
    <div class="sidebar-item" data-path="${item.path}" onclick="router.navigate('${item.path}')">
      <span class="text-xl">${item.icon}</span>
      <span class="font-medium">${item.label}</span>
    </div>
  `).join('');
}

function initializeSystemInfo() {
  window.addEventListener('server-stats', (event) => {
    const stats = event.detail;
    
    const cpuEl = document.getElementById('cpu-usage');
    const ramEl = document.getElementById('ram-usage');
    const serverEl = document.getElementById('server-status');
    
    if (cpuEl && stats.systemCpu !== undefined) {
      cpuEl.textContent = `${stats.systemCpu.toFixed(1)}%`;
    }
    
    if (ramEl && stats.systemMemory) {
      const ramPercent = stats.systemMemory.percent || 0;
      ramEl.textContent = `${ramPercent.toFixed(1)}%`;
    }
    
    if (serverEl && stats.running !== undefined) {
      serverEl.textContent = stats.running ? 'Online' : 'Offline';
      serverEl.className = stats.running ? 'text-green-400' : 'text-red-400';
    }
  });
  
  // Get app version
  if (window.electronAPI) {
    window.electronAPI.getVersion().then(version => {
      const versionEl = document.getElementById('app-version');
      if (versionEl) {
        versionEl.textContent = `v${version}`;
      }
    });
  }
}

function setupRoutes() {
  // Import and register all pages
  importPage('/').then(page => router.register('/', page));
  importPage('/server-status').then(page => router.register('/server-status', page));
  importPage('/players').then(page => router.register('/players', page));
  importPage('/performance').then(page => router.register('/performance', page));
  importPage('/logs').then(page => router.register('/logs', page));
  importPage('/crash-logs').then(page => router.register('/crash-logs', page));
  importPage('/backups').then(page => router.register('/backups', page));
  importPage('/scheduler').then(page => router.register('/scheduler', page));
  importPage('/file-browser').then(page => router.register('/file-browser', page));
  importPage('/server-config').then(page => router.register('/server-config', page));
  importPage('/basic-config').then(page => router.register('/basic-config', page));
  importPage('/advanced-config').then(page => router.register('/advanced-config', page));
  importPage('/init-c').then(page => router.register('/init-c', page));
  importPage('/battleye').then(page => router.register('/battleye', page));
  importPage('/types-xml').then(page => router.register('/types-xml', page));
  importPage('/events-xml').then(page => router.register('/events-xml', page));
  importPage('/economy-xml').then(page => router.register('/economy-xml', page));
  importPage('/spawnable-types').then(page => router.register('/spawnable-types', page));
  importPage('/economy-backup').then(page => router.register('/economy-backup', page));
  importPage('/mapgroups').then(page => router.register('/mapgroups', page));
  importPage('/mapgroup-pos').then(page => router.register('/mapgroup-pos', page));
  importPage('/ce-tool').then(page => router.register('/ce-tool', page));
  importPage('/loot-validator').then(page => router.register('/loot-validator', page));
  importPage('/mods').then(page => router.register('/mods', page));
  importPage('/mod-updater').then(page => router.register('/mod-updater', page));
  importPage('/mod-conflicts').then(page => router.register('/mod-conflicts', page));
  importPage('/mod-loadorder').then(page => router.register('/mod-loadorder', page));
  importPage('/mod-toggle').then(page => router.register('/mod-toggle', page));
  importPage('/mod-inspector').then(page => router.register('/mod-inspector', page));
  importPage('/keys').then(page => router.register('/keys', page));
  importPage('/trader-create').then(page => router.register('/trader-create', page));
  importPage('/trader-price').then(page => router.register('/trader-price', page));
  importPage('/trader-xml').then(page => router.register('/trader-xml', page));
  importPage('/trader-spawn').then(page => router.register('/trader-spawn', page));
  importPage('/item-database').then(page => router.register('/item-database', page));
  importPage('/item-stats').then(page => router.register('/item-stats', page));
  importPage('/player-manager').then(page => router.register('/player-manager', page));
  importPage('/kick-ban').then(page => router.register('/kick-ban', page));
  importPage('/player-inventory').then(page => router.register('/player-inventory', page));
  importPage('/player-teleport').then(page => router.register('/player-teleport', page));
  importPage('/player-logs').then(page => router.register('/player-logs', page));
  importPage('/map-viewer').then(page => router.register('/map-viewer', page));
  importPage('/coordinates').then(page => router.register('/coordinates', page));
  importPage('/object-spawner').then(page => router.register('/object-spawner', page));
  importPage('/basebuilding').then(page => router.register('/basebuilding', page));
  importPage('/spawn-editor').then(page => router.register('/spawn-editor', page));
  importPage('/weather').then(page => router.register('/weather', page));
  importPage('/time-editor').then(page => router.register('/time-editor', page));
  importPage('/auto-backup').then(page => router.register('/auto-backup', page));
  importPage('/auto-restart').then(page => router.register('/auto-restart', page));
  importPage('/xml-validator').then(page => router.register('/xml-validator', page));
  importPage('/json-validator').then(page => router.register('/json-validator', page));
  importPage('/script-validator').then(page => router.register('/script-validator', page));
  importPage('/path-checker').then(page => router.register('/path-checker', page));
  importPage('/benchmark').then(page => router.register('/benchmark', page));
  importPage('/rpt-parser').then(page => router.register('/rpt-parser', page));
  importPage('/economy-sanity').then(page => router.register('/economy-sanity', page));
}

async function importPage(path) {
  try {
    const pageName = path === '/' ? 'dashboard' : path.slice(1).replace(/-/g, '');
    const module = await import(`/js/pages/${pageName}.js`);
    return module.default || module;
  } catch (error) {
    console.error(`Failed to load page ${path}:`, error);
    return () => '<div class="p-6"><h2 class="text-2xl font-bold mb-4">Page Not Found</h2><p>This page is not yet implemented.</p></div>';
  }
}
