# PowerShell script to install dependencies with workarounds for native modules
Write-Host "Installing DayZ Ultimate Manager dependencies..." -ForegroundColor Cyan
Write-Host "This script will work around native module build issues." -ForegroundColor Yellow

# Clean up any existing node_modules issues
Write-Host "`nCleaning up..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
}

# Install dependencies, skipping native build scripts
Write-Host "`nInstalling dependencies (skipping native builds)..." -ForegroundColor Yellow
$env:npm_config_build_from_source = "false"
npm install --ignore-scripts

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Installation complete!" -ForegroundColor Green
    Write-Host "`nNote: Native modules were skipped. The app will work with fallback implementations." -ForegroundColor Yellow
    Write-Host "To test: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️  Installation had issues. Trying alternative method..." -ForegroundColor Yellow
    
    # Try installing without optional dependencies
    npm install --no-optional --ignore-scripts
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✅ Installation complete (with limitations)!" -ForegroundColor Green
    } else {
        Write-Host "`n❌ Installation failed. Please install Visual Studio Build Tools:" -ForegroundColor Red
        Write-Host "   https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2022" -ForegroundColor Yellow
        Write-Host "   Select 'Desktop development with C++' workload" -ForegroundColor Yellow
    }
}

