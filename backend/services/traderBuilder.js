const fs = require('fs-extra');
const path = require('path');
const xmlTools = require('./xmlTools');

class TraderBuilder {
  async createTrader(traderName, config) {
    const traderDir = path.join(process.cwd(), 'data', 'traders', traderName);
    await fs.ensureDir(traderDir);
    
    const traderData = {
      name: traderName,
      position: config.position || [0, 0, 0],
      items: config.items || [],
      categories: config.categories || [],
      currency: config.currency || 'Money',
      ...config
    };
    
    await fs.writeJSON(path.join(traderDir, 'config.json'), traderData, { spaces: 2 });
    
    return { success: true, path: traderDir };
  }

  async buildTraderXML(traderPath) {
    const configPath = path.join(traderPath, 'config.json');
    
    if (!await fs.pathExists(configPath)) {
      throw new Error('Trader config.json not found');
    }
    
    const config = await fs.readJSON(configPath);
    
    const xmlData = {
      trader: {
        name: config.name,
        position: {
          x: config.position[0],
          y: config.position[1],
          z: config.position[2]
        },
        items: {
          item: config.items.map(item => ({
            classname: item.classname,
            price: item.price,
            quantity: item.quantity || -1,
            quality: item.quality || 1.0
          }))
        }
      }
    };
    
    const xmlPath = path.join(traderPath, 'trader.xml');
    await xmlTools.saveXML(xmlPath, xmlData, 'trader');
    
    return { success: true, path: xmlPath };
  }

  async calculatePrices(items, baseMultiplier = 1.0) {
    // Simple price calculation based on item classname and rarity
    const priceMap = {
      'AKM': 5000,
      'M4A1': 6000,
      'SVD': 8000,
      'Food': 100,
      'Drink': 50,
      'Medical': 200
    };
    
    return items.map(item => {
      let basePrice = priceMap[item.classname] || 100;
      
      // Apply multipliers
      basePrice *= baseMultiplier;
      if (item.quality) {
        basePrice *= item.quality;
      }
      
      return {
        ...item,
        calculatedPrice: Math.round(basePrice)
      };
    });
  }

  async listTraders() {
    const tradersDir = path.join(process.cwd(), 'data', 'traders');
    
    if (!await fs.pathExists(tradersDir)) {
      return [];
    }
    
    const dirs = await fs.readdir(tradersDir);
    const traders = [];
    
    for (const dir of dirs) {
      const configPath = path.join(tradersDir, dir, 'config.json');
      if (await fs.pathExists(configPath)) {
        const config = await fs.readJSON(configPath);
        traders.push({
          name: dir,
          ...config
        });
      }
    }
    
    return traders;
  }
}

module.exports = new TraderBuilder();


