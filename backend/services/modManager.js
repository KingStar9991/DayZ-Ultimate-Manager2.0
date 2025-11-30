const fs = require('fs-extra');
const path = require('path');
const steamcmd = require('./steamcmd');

class ModManager {
  async listMods(modsPath) {
    try {
      if (!await fs.pathExists(modsPath)) {
        return [];
      }
      
      const mods = [];
      const entries = await fs.readdir(modsPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name.startsWith('@')) {
          const modPath = path.join(modsPath, entry.name);
          const metaPath = path.join(modPath, 'meta.cpp');
          
          let modInfo = {
            name: entry.name,
            path: modPath,
            enabled: true,
            workshopId: null,
            version: null
          };
          
          if (await fs.pathExists(metaPath)) {
            const metaContent = await fs.readFile(metaPath, 'utf-8');
            const workshopMatch = metaContent.match(/publishedid\s*=\s*(\d+)/i);
            const nameMatch = metaContent.match(/name\s*=\s*"([^"]+)"/i);
            
            if (workshopMatch) {
              modInfo.workshopId = workshopMatch[1];
            }
            if (nameMatch) {
              modInfo.name = nameMatch[1];
            }
          }
          
          mods.push(modInfo);
        }
      }
      
      return mods;
    } catch (error) {
      throw new Error(`Failed to list mods: ${error.message}`);
    }
  }

  async scanConflicts(modsPath) {
    const mods = await this.listMods(modsPath);
    const conflicts = [];
    
    // Check for duplicate classnames
    const classnames = new Map();
    
    for (const mod of mods) {
      const configPath = path.join(mod.path, 'config.cpp');
      if (await fs.pathExists(configPath)) {
        try {
          const content = await fs.readFile(configPath, 'utf-8');
          const classnameMatches = content.matchAll(/class\s+(\w+)/g);
          
          for (const match of classnameMatches) {
            const className = match[1];
            if (classnames.has(className)) {
              conflicts.push({
                type: 'classname',
                className,
                mods: [classnames.get(className), mod.name]
              });
            } else {
              classnames.set(className, mod.name);
            }
          }
        } catch (error) {
          // Skip if can't read
        }
      }
    }
    
    return conflicts;
  }

  async updateMod(workshopId, modsPath) {
    const modDir = path.join(modsPath, `@${workshopId}`);
    await fs.ensureDir(modDir);
    
    return await steamcmd.updateMod(workshopId, modDir);
  }

  async downloadMod(workshopId, modsPath) {
    const modDir = path.join(modsPath, `@${workshopId}`);
    await fs.ensureDir(modDir);
    
    return await steamcmd.downloadMod(workshopId, modDir);
  }

  async getLoadOrder(serverCfgPath) {
    try {
      if (!await fs.pathExists(serverCfgPath)) {
        return [];
      }
      
      const content = await fs.readFile(serverCfgPath, 'utf-8');
      const modMatch = content.match(/mods\s*=\s*"([^"]+)"/);
      
      if (modMatch) {
        return modMatch[1].split(';').filter(Boolean);
      }
      
      return [];
    } catch (error) {
      throw new Error(`Failed to read load order: ${error.message}`);
    }
  }

  async setLoadOrder(serverCfgPath, modList) {
    try {
      let content = await fs.readFile(serverCfgPath, 'utf-8');
      
      const modString = modList.join(';');
      if (content.includes('mods=')) {
        content = content.replace(/mods\s*=\s*"[^"]+"/, `mods="${modString}"`);
      } else {
        content += `\nmods="${modString}"`;
      }
      
      await fs.writeFile(serverCfgPath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to set load order: ${error.message}`);
    }
  }
}

module.exports = new ModManager();


