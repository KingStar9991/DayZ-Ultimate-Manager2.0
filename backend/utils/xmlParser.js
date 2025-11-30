const fs = require('fs');
const xml2js = require('xml2js');

function parseXmlString(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, { explicitArray: false }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
  });
}

async function parseTypesXmlFile(filePath) {
  const xml = fs.readFileSync(filePath, 'utf8');
  return await parseXmlString(xml);
}

// Example: extract some spawn data - you will customize for DayZ types format
function extractItemsFromTypes(parsed) {
  // placeholder: return empty list
  return [];
}

module.exports = { parseXmlString, parseTypesXmlFile, extractItemsFromTypes };
