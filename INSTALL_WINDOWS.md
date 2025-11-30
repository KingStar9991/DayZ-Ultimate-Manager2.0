# Windows Installation Guide

## Quick Fix for npm install Errors

If you're getting errors about `node-pty` or Visual Studio Build Tools, follow these steps:

### Option 1: Install Without Native Modules (Recommended)

```powershell
# Remove problematic packages
npm uninstall node-pty

# Install dependencies, skipping native builds
npm install --ignore-scripts

# If pidusage fails, install it separately with prebuilt binaries
npm install pidusage --ignore-scripts
```

### Option 2: Install Visual Studio Build Tools

If you need full native module support:

1. Download and install [Visual Studio Build Tools](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022)
2. During installation, select:
   - **Desktop development with C++** workload
   - **Windows 10/11 SDK**
3. Restart your terminal/PowerShell
4. Run: `npm install`

### Option 3: Use the Installation Script

Run the provided PowerShell script:

```powershell
.\install-deps.ps1
```

## What Was Fixed

- ✅ Removed `node-pty` (not used in the application)
- ✅ Made `pidusage` optional with graceful fallback
- ✅ Created installation script for easier setup

## Verify Installation

After installation, test the app:

```powershell
npm run dev
```

The app should start even if some native modules failed to build. Performance monitoring may be limited, but all other features will work.

