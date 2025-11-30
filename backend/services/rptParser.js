const fs = require('fs-extra');
const path = require('path');

class RPTParser {
  parseRPT(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      
      const errors = [];
      const warnings = [];
      const info = [];
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Error patterns
        if (line.match(/error|Error|ERROR|Exception|FATAL/i)) {
          errors.push({
            line: lineNum,
            content: line.trim(),
            type: 'error'
          });
        }
        // Warning patterns
        else if (line.match(/warning|Warning|WARNING|WARN/i)) {
          warnings.push({
            line: lineNum,
            content: line.trim(),
            type: 'warning'
          });
        }
        // Info patterns
        else if (line.match(/info|Info|INFO|Log/i)) {
          info.push({
            line: lineNum,
            content: line.trim(),
            type: 'info'
          });
        }
      });
      
      return {
        totalLines: lines.length,
        errors: errors.slice(0, 1000), // Limit to prevent huge responses
        warnings: warnings.slice(0, 1000),
        info: info.slice(0, 500),
        summary: {
          errorCount: errors.length,
          warningCount: warnings.length,
          infoCount: info.length
        }
      };
    } catch (error) {
      throw new Error(`Failed to parse RPT file: ${error.message}`);
    }
  }

  parseCrashDump(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      
      const crashInfo = {
        timestamp: null,
        version: null,
        exception: null,
        stackTrace: [],
        modules: []
      };
      
      const lines = content.split('\n');
      
      lines.forEach((line) => {
        // Extract timestamp
        const timestampMatch = line.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
        if (timestampMatch) {
          crashInfo.timestamp = timestampMatch[1];
        }
        
        // Extract version
        const versionMatch = line.match(/Version:?\s*([\d.]+)/i);
        if (versionMatch) {
          crashInfo.version = versionMatch[1];
        }
        
        // Extract exception
        const exceptionMatch = line.match(/Exception:?\s*(.+)/i);
        if (exceptionMatch) {
          crashInfo.exception = exceptionMatch[1].trim();
        }
        
        // Stack trace
        if (line.includes('at ') || line.includes('0x')) {
          crashInfo.stackTrace.push(line.trim());
        }
      });
      
      return crashInfo;
    } catch (error) {
      throw new Error(`Failed to parse crash dump: ${error.message}`);
    }
  }

  getRecentLogs(logDir, limit = 100) {
    try {
      const files = fs.readdirSync(logDir)
        .filter(f => f.endsWith('.rpt') || f.endsWith('.log'))
        .map(f => ({
          name: f,
          path: path.join(logDir, f),
          stats: fs.statSync(path.join(logDir, f))
        }))
        .sort((a, b) => b.stats.mtime - a.stats.mtime)
        .slice(0, limit);
      
      return files.map(f => ({
        name: f.name,
        path: f.path,
        size: f.stats.size,
        modified: f.stats.mtime,
        type: f.name.endsWith('.rpt') ? 'rpt' : 'log'
      }));
    } catch (error) {
      throw new Error(`Failed to read log directory: ${error.message}`);
    }
  }
}

module.exports = new RPTParser();


