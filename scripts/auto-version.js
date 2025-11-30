<!-- add inside <body> where appropriate -->
<div id="updater" style="border:1px solid #444;padding:12px;margin:12px;border-radius:8px;background:#0f1720;color:#d1d5db">
  <h3>Auto-updater</h3>
  <div id="updateStatus">Status: idle</div>
  <div id="updateInfo" style="margin:8px 0;"></div>
  <progress id="updateProgress" max="100" value="0" style="width:100%; display:none"></progress>
  <div style="margin-top:8px">
    <button id="btnCheck">Check for updates</button>
    <button id="btnDownload" disabled>Download update</button>
    <button id="btnInstall" disabled>Install update</button>
  </div>
</div>

<script>
  const { ipcRenderer } = require('electron') || {};
  const status = document.getElementById('updateStatus');
  const info = document.getElementById('updateInfo');
  const progress = document.getElementById('updateProgress');
  const btnCheck = document.getElementById('btnCheck');
  const btnDownload = document.getElementById('btnDownload');
  const btnInstall = document.getElementById('btnInstall');

  function setIdle() {
    status.innerText = 'Status: idle';
    info.innerText = '';
    progress.style.display = 'none';
    progress.value = 0;
    btnDownload.disabled = true;
    btnInstall.disabled = true;
  }

  btnCheck.onclick = async () => {
    status.innerText = 'Status: checking...';
    const r = await window.apiCheckForUpdates?.() ?? (ipcRenderer ? await ipcRenderer.invoke('check-for-updates') : { ok:false });
    if (!r.ok) {
      status.innerText = 'Status: check failed';
      info.innerText = r.error || 'check failed';
      setTimeout(setIdle, 4000);
    } else {
      status.innerText = 'Status: check triggered (see notifications)';
    }
  };

  btnDownload.onclick = async () => {
    status.innerText = 'Status: downloading...';
    progress.style.display = 'block';
    const r = ipcRenderer ? await ipcRenderer.invoke('download-update') : { ok:false };
    if (!r.ok) { status.innerText = 'Download failed'; info.innerText = r.error || ''; setTimeout(setIdle,4000); }
  };

  btnInstall.onclick = async () => {
    status.innerText = 'Installing...';
    const r = ipcRenderer ? await ipcRenderer.invoke('install-update') : { ok:false };
    if (!r.ok) { status.innerText = 'Install failed'; info.innerText = r.error || ''; setTimeout(setIdle,4000); }
  };

  // Listen to update events from main process
  if (ipcRenderer) {
    ipcRenderer.on('update-event', (ev, payload) => {
      switch((payload && payload.type) || '') {
        case 'checking': status.innerText = 'Status: checking for updates'; break;
        case 'available':
          status.innerText = 'Status: update available';
          info.innerText = JSON.stringify(payload.info || {});
          btnDownload.disabled = false;
          break;
        case 'not-available':
          status.innerText = 'Status: no updates';
          info.innerText = '';
          setTimeout(setIdle, 3000);
          break;
        case 'progress':
          status.innerText = 'Status: downloading';
          progress.style.display = 'block';
          progress.value = Math.round((payload.progress && payload.progress.percent) || 0);
          break;
        case 'downloaded':
          status.innerText = 'Status: downloaded';
          btnInstall.disabled = false;
          break;
        case 'error':
          status.innerText = 'Status: error';
          info.innerText = payload.error || 'unknown error';
          break;
      }
    });
  }

  setIdle();
</script>
