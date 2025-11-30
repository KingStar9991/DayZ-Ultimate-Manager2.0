# DayZ Ultimate Manager 2.0

A complete, production-ready Electron desktop application for managing DayZ servers with a modern GTX panel style UI and macOS dark glass aesthetic.

## Features

### 🎯 Complete Feature Set

**60+ Fully Implemented Pages:**

#### General Management
- Dashboard with real-time stats
- Server Status monitoring
- Live Player List
- Performance Monitor (CPU/RAM graphs)
- Logs Viewer with filtering
- Crash Log Analyzer
- Backup Manager
- Auto Restart Scheduler
- File Browser (SFTP-like)

#### Server Configuration Tools
- Server.cfg Editor
- Basic Config Editor
- Advanced Config Editor
- init.c Editor with syntax highlighting
- BattlEye Folder Editor

#### DayZ Mission/Loot Tools
- types.xml Editor
- events.xml Editor
- cfgEconomyCore.xml Editor
- spawnabletypes.xml Editor
- Economy Backup & Restore
- MapGroups Editor
- MapGroupPos Editor
- CE Tool Visual Map (2D grid heatmap)
- Loot Economy Validator

#### Mod Management Tools
- SteamCMD Mod Downloader
- Mod Updater
- Mod Conflict Scanner
- Mod Load Order Manager
- Mod Enable/Disable Toggles
- Full @mod Folder Inspector
- Client/Server Key Manager

#### Trader/Economy Tools
- Trader Configuration Creator
- Trader Price Calculator
- Trader XML Builder
- NPC Trader Spawn Tool
- Item Class Database Viewer
- Item Statistics Inspector

#### Player Administration Tools
- Online Players Manager
- Kick/Ban Panel
- Player Inventory Viewer
- Player Teleport / Set Position
- Player Log History Viewer

#### Map / World Tools
- 2D Map Viewer
- Coordinate Helper
- Object Spawner UI
- Basebuilding Object Preview
- Animal/Zombie Spawn Editor
- Weather Controller
- Time of Day Editor

#### Automation Features
- Automated Backups
- Automated Server Restarts
- WebSocket Live Stats Feed
- Log Streaming to UI
- Auto Mod Updates on Schedule

#### Utility Tools
- XML Validator
- JSON Validator
- Script Syntax Validator
- Folder Path Checker
- Server Performance Benchmarks
- RPT Parser with Warnings/Errors Breakdown
- Economy Sanity Checker

## Architecture

### Multi-Process Architecture
- **Electron Main Process** (`electron/main.js`) - Window management, auto-updater
- **Backend Server** (`backend/server.js`) - Express REST API + WebSocket server
- **Renderer Frontend** (`frontend/public/`) - Modern SPA with router

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6+), TailwindCSS, Custom Router
- **Backend**: Node.js, Express, WebSocket (ws)
- **Desktop**: Electron 28+
- **Build**: electron-builder
- **Auto-Updates**: electron-updater

## Installation

```bash
npm install
```

## Development

```bash
# Start backend server and Electron app
npm run dev

# Start backend only
npm run backend

# Start Electron only (requires backend running)
npm run electron-dev
```

## Building

```bash
# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows .exe installer
npm run build:linux   # Linux .AppImage
npm run build:mac     # macOS .dmg
```

## Project Structure

```
DayZ-Ultimate-Manager2.0/
├── electron/              # Electron main process
│   ├── main.js           # Main window & IPC handlers
│   ├── preload.js        # Context bridge
│   └── updater.js        # Auto-updater logic
├── backend/               # Backend server
│   ├── server.js         # Express server entry
│   ├── websocket.js      # WebSocket server
│   ├── routes/           # API route handlers
│   │   ├── server.js
│   │   ├── config.js
│   │   ├── logs.js
│   │   ├── mods.js
│   │   ├── loot.js
│   │   ├── trader.js
│   │   ├── player.js
│   │   ├── map.js
│   │   ├── automation.js
│   │   └── utility.js
│   └── services/         # Business logic
│       ├── serverMonitor.js
│       ├── steamcmd.js
│       ├── rptParser.js
│       ├── xmlTools.js
│       ├── lootValidator.js
│       ├── traderBuilder.js
│       └── modManager.js
├── frontend/
│   └── public/
│       ├── index.html    # Main HTML entry
│       ├── css/
│       │   └── tailwind.css
│       └── js/
│           ├── app.js    # App initialization
│           ├── router.js # Client-side router
│           ├── api.js    # API client
│           └── pages/    # All 60+ page modules
│               ├── dashboard.js
│               ├── serverstatus.js
│               ├── players.js
│               └── ... (58+ more pages)
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## API Endpoints

### Server Management
- `GET /api/server/status` - Get server status
- `POST /api/server/start` - Start server
- `POST /api/server/stop` - Stop server
- `GET /api/server/stats` - Get server statistics

### Configuration
- `GET /api/config/server` - Get server config
- `POST /api/config/server` - Save server config
- `GET /api/config/init` - Get init.c
- `POST /api/config/init` - Save init.c

### Logs
- `GET /api/logs/rpt` - Get RPT logs
- `GET /api/logs/crash` - Get crash logs
- `GET /api/logs/list` - List log files

### Mods
- `GET /api/mods/list` - List installed mods
- `POST /api/mods/download` - Download mod
- `POST /api/mods/update` - Update mod
- `GET /api/mods/conflicts` - Scan conflicts
- `GET /api/mods/loadorder` - Get load order
- `POST /api/mods/loadorder` - Set load order

### Loot/Economy
- `GET /api/loot/types` - Get types.xml
- `POST /api/loot/types` - Save types.xml
- `GET /api/loot/events` - Get events.xml
- `POST /api/loot/events` - Save events.xml
- `GET /api/loot/economy` - Get economy.xml
- `POST /api/loot/economy` - Save economy.xml
- `POST /api/loot/validate` - Validate loot economy

### Trader
- `POST /api/trader/create` - Create trader
- `POST /api/trader/build` - Build trader XML
- `POST /api/trader/calculate` - Calculate prices
- `GET /api/trader/list` - List traders

### Player
- `GET /api/player/online` - Get online players
- `POST /api/player/kick` - Kick player
- `POST /api/player/ban` - Ban player
- `GET /api/player/inventory/:id` - Get inventory
- `POST /api/player/teleport` - Teleport player

### Map
- `GET /api/map/heatmap` - Get heatmap data
- `POST /api/map/spawn` - Spawn object
- `POST /api/map/weather` - Set weather
- `POST /api/map/time` - Set time

### Automation
- `GET /api/automation/schedules` - Get schedules
- `POST /api/automation/schedules` - Create schedule
- `DELETE /api/automation/schedules/:id` - Delete schedule
- `POST /api/automation/backup` - Create backup
- `GET /api/automation/backups` - List backups
- `POST /api/automation/backup/restore` - Restore backup

### Utility
- `POST /api/utility/validate/xml` - Validate XML
- `POST /api/utility/validate/json` - Validate JSON
- `POST /api/utility/validate/script` - Validate script
- `POST /api/utility/check/path` - Check path
- `GET /api/utility/benchmark` - Run benchmark

## WebSocket Events

- `server-stats` - Real-time server statistics
- `log-stream` - Real-time log streaming
- `player-update` - Player join/leave events

## UI Design

### GTX Panel Style + macOS Dark Glass
- Translucent panels with backdrop blur
- Dark theme (#0a0a0a background)
- SF Pro / SF Mono fonts
- Smooth animations and transitions
- Responsive grid layouts
- Custom scrollbars

### Color Scheme
- Background: `#0a0a0a`
- Panels: `rgba(20, 20, 20, 0.8)` with blur
- Accent: `#007AFF` (macOS blue)
- Borders: `rgba(255, 255, 255, 0.1)`

## Auto-Updater

The application includes electron-updater configured for:
- GitHub releases
- Automatic update checks
- Update notifications
- One-click updates

## Requirements

- Node.js 18+
- npm or yarn
- Windows 10+, macOS 10.15+, or Linux

## License

MIT

## Support

For issues, feature requests, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for the DayZ server administration community**
