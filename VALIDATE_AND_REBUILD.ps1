# Complete validation and rebuild script for DayZ Ultimate Manager
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  DayZ Ultimate Manager - Validation & Rebuild" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan

# Step 1: Validate Code
Write-Host "`n[1/4] Validating code fixes..." -ForegroundColor Yellow

$mainJs = Get-Content "electron\main.js" -Raw
if ($mainJs -match "let autoUpdater = null" -and $mainJs -match "try \{" -and $mainJs -match "autoUpdater = require\('electron-updater'\)") {
    Write-Host "  ✓ electron-updater is optional" -ForegroundColor Green
} else {
    Write-Host "  ✗ electron-updater fix not found!" -ForegroundColor Red
    exit 1
}

if ($mainJs -match "if \(!isDev" -and $mainJs -match "autoUpdater\)") {
    Write-Host "  ✓ Auto-updater calls are guarded" -ForegroundColor Green
} else {
    Write-Host "  ✗ Auto-updater calls not guarded!" -ForegroundColor Red
    exit 1
}

# Check package.json
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
if ($packageJson.dependencies.'electron-updater') {
    Write-Host "  ✓ electron-updater in dependencies" -ForegroundColor Green
} else {
    Write-Host "  ✗ electron-updater not in dependencies!" -ForegroundColor Red
    exit 1
}

# Step 2: Check for running processes
Write-Host "`n[2/4] Checking for running processes..." -ForegroundColor Yellow
$running = Get-Process | Where-Object {$_.ProcessName -like "*DayZ*" -or $_.ProcessName -like "*electron*"}
if ($running) {
    Write-Host "  ⚠ Found running processes, closing..." -ForegroundColor Yellow
    $running | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
} else {
    Write-Host "  ✓ No conflicting processes" -ForegroundColor Green
}

# Step 3: Clean old builds
Write-Host "`n[3/4] Cleaning old builds..." -ForegroundColor Yellow
$folders = @("dist\DayZ Ultimate Manager-win32-x64", "dist\win-unpacked")
foreach ($folder in $folders) {
    if (Test-Path $folder) {
        try {
            Remove-Item -Recurse -Force $folder -ErrorAction Stop
            Write-Host "  ✓ Removed $folder" -ForegroundColor Green
        }
        catch {
            Write-Host "  ✗ Cannot remove $folder - File may be locked!" -ForegroundColor Red
            Write-Host "`n  ⚠ ACTION REQUIRED:" -ForegroundColor Yellow
            Write-Host "    1. Close ALL File Explorer windows" -ForegroundColor White
            Write-Host "    2. Close any running DayZ Manager apps" -ForegroundColor White
            Write-Host "    3. Run this script again" -ForegroundColor White
            Write-Host "`n  Or manually delete: $folder" -ForegroundColor Cyan
            exit 1
        }
    }
}
Start-Sleep -Seconds 1

# Step 4: Rebuild
Write-Host "`n[4/4] Building application..." -ForegroundColor Yellow
npm run pack:win

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n═══════════════════════════════════════════════════════════" -ForegroundColor Green
    Write-Host "  ✅ BUILD SUCCESSFUL!" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Green
    
    $exePath = "dist\DayZ Ultimate Manager-win32-x64\DayZ Ultimate Manager.exe"
    if (Test-Path $exePath) {
        Write-Host "`n📍 YOUR EXECUTABLE IS HERE:" -ForegroundColor Cyan
        Write-Host "   $((Get-Item $exePath).FullName)" -ForegroundColor White
        Write-Host "`n🚀 TO TEST:" -ForegroundColor Cyan
        Write-Host "   1. Navigate to: dist\DayZ Ultimate Manager-win32-x64\" -ForegroundColor White
        Write-Host "   2. Double-click: DayZ Ultimate Manager.exe" -ForegroundColor White
        Write-Host "`n💡 TIP: Right-click the .exe → Send to → Desktop (create shortcut)" -ForegroundColor Yellow
    } else {
        Write-Host "`n⚠️  Build completed but .exe not found at expected location" -ForegroundColor Yellow
        Write-Host "   Checking alternative locations..." -ForegroundColor Yellow
        Get-ChildItem -Path "dist" -Recurse -Filter "*.exe" | ForEach-Object {
            Write-Host "   Found: $($_.FullName)" -ForegroundColor Green
        }
    }
} else {
    Write-Host "`n❌ BUILD FAILED" -ForegroundColor Red
    Write-Host "   Check the error messages above" -ForegroundColor Yellow
    exit 1
}
