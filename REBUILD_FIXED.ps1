# Rebuild the app with the electron-updater fix
Write-Host "Rebuilding DayZ Ultimate Manager with fixes..." -ForegroundColor Cyan

# Close any running instances
Write-Host "`nClosing any running instances..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.ProcessName -like "*DayZ*" -or $_.ProcessName -like "*electron*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Remove old build
Write-Host "`nRemoving old build..." -ForegroundColor Yellow
if (Test-Path "dist\DayZ Ultimate Manager-win32-x64") {
    Remove-Item -Recurse -Force "dist\DayZ Ultimate Manager-win32-x64" -ErrorAction SilentlyContinue
}
if (Test-Path "dist\win-unpacked") {
    Remove-Item -Recurse -Force "dist\win-unpacked" -ErrorAction SilentlyContinue
}
Start-Sleep -Seconds 1

# Rebuild
Write-Host "`nBuilding new version..." -ForegroundColor Yellow
npm run pack:win

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Build successful!" -ForegroundColor Green
    Write-Host "`nYour fixed .exe is at:" -ForegroundColor Cyan
    Write-Host "  dist\win-unpacked\DayZ Ultimate Manager.exe" -ForegroundColor White
    Write-Host "`nOr:" -ForegroundColor Cyan
    Write-Host "  dist\DayZ Ultimate Manager-win32-x64\DayZ Ultimate Manager.exe" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Build had issues. Please:" -ForegroundColor Yellow
    Write-Host "  1. Close File Explorer windows showing the dist folder" -ForegroundColor Yellow
    Write-Host "  2. Close any running DayZ Manager instances" -ForegroundColor Yellow
    Write-Host "  3. Run this script again" -ForegroundColor Yellow
}

