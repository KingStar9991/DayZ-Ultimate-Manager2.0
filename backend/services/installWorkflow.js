/**
 * backend/services/installWorkflow.js
 * High-level workflow to download+install workshop mod into server folder.
 * Uses steamCmdRunner and dependencyResolver.
 */

const path = require('path');
const fs = require('fs-extra');
const SteamCmdRunner = require('./steamCmdRunner');
const { scanModForDependencies } = require('./dependencyResolver');

async function installWorkshopModWithDeps({ steamCmdPath, workshopId, steamWorkshopPath, serverModsPath, onProgress }) {
  const runner = new SteamCmdRunner(steamCmdPath);
  onProgress && onProgress({ stage: 'start', workshopId });

  runner.on('progress', p => onProgress && onProgress({ type: 'progress', ...p }));
  runner.on('done', d => onProgress && onProgress({ type: 'done', ...d }));

  // stubbed: in real usage, ensure steamcmd downloaded the mod
  runner.downloadWorkshopItem(221100, workshopId, { validate: true });

  // wait for mod to appear
  const modFolder = path.join(steamWorkshopPath, 'steamapps', 'workshop', 'content', '221100', String(workshopId));
  // In stub: just return a fake success after a moment
  await new Promise(res => setTimeout(res, 3500));

  // fake detected name
  const detectedName = `mod_${workshopId}`;
  const dest = path.join(serverModsPath, `@${detectedName}`);
  await fs.ensureDir(dest);
  // Real code would copy files. Here we write a marker.
  await fs.writeFile(path.join(dest, '.installed'), `installed ${new Date().toISOString()}`);
  onProgress && onProgress({ stage: 'installed', mod: detectedName, dest });
  return { mod: detectedName, dest };
}

module.exports = { installWorkshopModWithDeps };
