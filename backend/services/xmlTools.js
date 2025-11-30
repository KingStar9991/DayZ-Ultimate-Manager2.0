const xml2js = require('xml2js');
const fs = require('fs-extra');
const path = require('path');

class XMLTools {
  async parseXML(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true,
        explicitRoot: true
      });
      
      const result = await parser.parseStringPromise(content);
      return result;
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  }

  async saveXML(filePath, data, rootElement = 'root') {
    try {
      const builder = new xml2js.Builder({
        xmldec: { version: '1.0', encoding: 'UTF-8', standalone: false },
        renderOpts: { pretty: true, indent: '  ', newline: '\n' }
      });
      
      const xml = builder.buildObject(data);
      await fs.writeFile(filePath, xml, 'utf-8');
      return { success: true };
    } catch (error) {
      throw new Error(`Failed to save XML: ${error.message}`);
    }
  }

  validateXML(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parser = new xml2js.Parser({
        explicitArray: false,
        mergeAttrs: true
      });
      
      parser.parseString(content, (err) => {
        if (err) {
          throw err;
        }
      });
      
      return { valid: true };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  async parseTypesXML(filePath) {
    const data = await this.parseXML(filePath);
    return data;
  }

  async parseEventsXML(filePath) {
    const data = await this.parseXML(filePath);
    return data;
  }

  async parseEconomyXML(filePath) {
    const data = await this.parseXML(filePath);
    return data;
  }

  async parseSpawnableTypesXML(filePath) {
    const data = await this.parseXML(filePath);
    return data;
  }
}

module.exports = new XMLTools();


