let pidusage = null;
try {
  pidusage = require('pidusage');
} catch (error) {
  console.warn('pidusage not available, using fallback stats');
}
const si = require('systeminformation');
const fs = require('fs-extra');
const path = require('path');

let serverProcess = null;
let monitorInterval = null;

function startServer(serverPath, args = []) {
  const { spawn } = require('child_process');
  
  if (serverProcess) {
    return { success: false, message: 'Server already running' };
  }

  try {
    serverProcess = spawn(serverPath, args, {
      cwd: path.dirname(serverPath),
      stdio: 'pipe',
      shell: true
    });

    serverProcess.on('exit', (code) => {
      serverProcess = null;
      console.log(`Server process exited with code ${code}`);
    });

    return { success: true, pid: serverProcess.pid };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function stopServer() {
  if (!serverProcess) {
    return { success: false, message: 'Server not running' };
  }

  try {
    serverProcess.kill('SIGTERM');
    serverProcess = null;
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

function getServerStatus() {
  return {
    running: serverProcess !== null,
    pid: serverProcess?.pid || null
  };
}

async function getServerStats() {
  const stats = {
    cpu: 0,
    memory: 0,
    uptime: 0,
    timestamp: new Date().toISOString()
  };

  if (serverProcess && serverProcess.pid) {
    try {
      if (pidusage) {
        const usage = await pidusage(serverProcess.pid);
        stats.cpu = usage.cpu;
        stats.memory = usage.memory;
      } else {
        // Fallback: use process stats if pidusage unavailable
        const proc = require('child_process');
        stats.cpu = 0; // Will be estimated from system load
        stats.memory = 0; // Will be estimated
      }
      stats.uptime = process.uptime();
    } catch (error) {
      console.error('Error getting server stats:', error);
    }
  }

  try {
    const systemStats = await si.currentLoad();
    stats.systemCpu = systemStats.currentLoad;
    
    const memStats = await si.mem();
    stats.systemMemory = {
      total: memStats.total,
      used: memStats.used,
      free: memStats.free,
      percent: (memStats.used / memStats.total) * 100
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
  }

  return stats;
}

function monitorServer(wss) {
  if (monitorInterval) {
    clearInterval(monitorInterval);
  }

  monitorInterval = setInterval(async () => {
    const stats = await getServerStats();
    const status = getServerStatus();
    
    wss.broadcast({
      type: 'server-stats',
      data: {
        ...stats,
        ...status
      }
    }, 'server-stats');
  }, 2000);
}

module.exports = {
  startServer,
  stopServer,
  getServerStatus,
  getServerStats,
  monitorServer
};


