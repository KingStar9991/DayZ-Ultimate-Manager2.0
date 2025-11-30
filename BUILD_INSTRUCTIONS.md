# Building DayZ Ultimate Manager as Standalone .exe

## Quick Build (Recommended)

```powershell
npm run pack:win
```

This will create:
- **Portable .exe**: `dist/DayZ Ultimate Manager-win32-x64/DayZ Ultimate Manager.exe` (double-click to run!)

## Alternative Build (with Installer)

```powershell
npm run build:win
```

This creates both:
- **Portable .exe**: `dist/DayZ Ultimate Manager-2.0.0-win-x64/DayZ Ultimate Manager.exe`
- **Installer**: `dist/DayZ Ultimate Manager Setup 2.0.0.exe` (installer version)

**Note**: The `build:win` command may fail on Windows due to code signing tool extraction issues. Use `pack:win` for a reliable build.

## Requirements

1. **Node.js** must be installed on the target machine (the .exe uses system Node.js to run the backend)
2. All dependencies installed: `npm install`

## Icon Setup

Replace `build/icon.ico` with your actual icon file (256x256 recommended).

## Building for Distribution

The portable .exe is self-contained except for requiring Node.js. For a fully standalone app that doesn't require Node.js, you would need to:

1. Bundle Node.js with the app
2. Use a tool like `pkg` or `nexe` to create a single executable
3. Or use Electron's built-in Node.js runtime

## Current Build Output

After building, you'll find:
- `dist/DayZ Ultimate Manager-2.0.0-win-x64/` - Portable folder with .exe
- `dist/DayZ Ultimate Manager Setup 2.0.0.exe` - Windows installer

The portable .exe can be copied anywhere and double-clicked to run.

