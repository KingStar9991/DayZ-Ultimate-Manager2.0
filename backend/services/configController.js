const fs = require('fs-extra');
const path = require('path');

class ConfigController {
  async readServerCfg(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const config = {};
      
      const lines = content.split('\n');
      lines.forEach(line => {
        line = line.trim();
        if (line && !line.startsWith('//') && !line.startsWith('#')) {
          const match = line.match(/^(\w+)\s*=\s*(.+)$/);
          if (match) {
            const key = match[1];
            let value = match[2].trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
              value = value.slice(1, -1);
            }
            
            config[key] = value;
          }
        }
      });
      
      return config;
    } catch (error) {
      throw new Error(`Failed to read server.cfg: ${error.message}`);
    }
  }

  async saveServerCfg(filePath, config) {
    try {
      let content = '';
      
      for (const [key, value] of Object.entries(config)) {
        const stringValue = typeof value === 'string' ? `"${value}"` : value;
        content += `${key}=${stringValue}\n`;
      }
      
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to save server.cfg: ${error.message}`);
    }
  }

  async readInitC(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return { content, lines: content.split('\n').length };
    } catch (error) {
      throw new Error(`Failed to read init.c: ${error.message}`);
    }
  }

  async saveInitC(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf-8');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to save init.c: ${error.message}`);
    }
  }

  async getBattlEyeFiles(battlEyePath) {
    try {
      if (!await fs.pathExists(battlEyePath)) {
        return [];
      }
      
      const files = await fs.readdir(battlEyePath);
      return files.map(f => ({
        name: f,
        path: path.join(battlEyePath, f),
        stats: fs.statSync(path.join(battlEyePath, f))
      }));
    } catch (error) {
      throw new Error(`Failed to read BattlEye folder: ${error.message}`);
    }
  }
}

module.exports = new ConfigController();


