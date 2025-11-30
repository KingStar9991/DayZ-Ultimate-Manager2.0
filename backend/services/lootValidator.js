const xmlTools = require('./xmlTools');
const fs = require('fs-extra');
const path = require('path');

class LootValidator {
  async validateEconomy(missionPath) {
    const errors = [];
    const warnings = [];
    
    try {
      const economyPath = path.join(missionPath, 'db', 'cfgEconomyCore.xml');
      
      if (!await fs.pathExists(economyPath)) {
        errors.push('cfgEconomyCore.xml not found');
        return { valid: false, errors, warnings };
      }
      
      const economy = await xmlTools.parseEconomyXML(economyPath);
      
      // Validate structure
      if (!economy.economy) {
        errors.push('Invalid economy structure');
      }
      
      // Check for common issues
      if (economy.economy?.categories) {
        const categories = Array.isArray(economy.economy.categories.category) 
          ? economy.economy.categories.category 
          : [economy.economy.categories.category].filter(Boolean);
        
        categories.forEach((cat, idx) => {
          if (!cat.name) {
            warnings.push(`Category ${idx} missing name`);
          }
        });
      }
      
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        itemCount: this.countItems(economy)
      };
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { valid: false, errors, warnings };
    }
  }

  countItems(economy) {
    let count = 0;
    
    if (economy.economy?.categories) {
      const categories = Array.isArray(economy.economy.categories.category)
        ? economy.economy.categories.category
        : [economy.economy.categories.category].filter(Boolean);
      
      categories.forEach(cat => {
        if (cat.items?.item) {
          const items = Array.isArray(cat.items.item) ? cat.items.item : [cat.items.item];
          count += items.length;
        }
      });
    }
    
    return count;
  }

  async validateTypesXML(missionPath) {
    const errors = [];
    const warnings = [];
    
    try {
      const typesPath = path.join(missionPath, 'db', 'types.xml');
      
      if (!await fs.pathExists(typesPath)) {
        errors.push('types.xml not found');
        return { valid: false, errors, warnings };
      }
      
      const types = await xmlTools.parseTypesXML(typesPath);
      
      // Validate structure
      if (!types.types) {
        errors.push('Invalid types structure');
      }
      
      return {
        valid: errors.length === 0,
        errors,
        warnings,
        typeCount: this.countTypes(types)
      };
    } catch (error) {
      errors.push(`Validation error: ${error.message}`);
      return { valid: false, errors, warnings };
    }
  }

  countTypes(types) {
    if (!types.types?.type) return 0;
    const typeArray = Array.isArray(types.types.type) ? types.types.type : [types.types.type];
    return typeArray.length;
  }
}

module.exports = new LootValidator();


