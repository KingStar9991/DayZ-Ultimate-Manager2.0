# PowerShell script to create a desktop shortcut for DayZ Ultimate Manager

$exePath = Join-Path $PSScriptRoot "dist\DayZ Ultimate Manager-win32-x64\DayZ Ultimate Manager.exe"
$desktop = [Environment]::GetFolderPath("Desktop")
$shortcutPath = Join-Path $desktop "DayZ Ultimate Manager.lnk"

if (Test-Path $exePath) {
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = $exePath
    $shortcut.WorkingDirectory = Split-Path $exePath
    $shortcut.Description = "DayZ Ultimate Manager - Server Management Suite"
    $shortcut.IconLocation = $exePath
    $shortcut.Save()
    
    Write-Host "✅ Desktop shortcut created successfully!" -ForegroundColor Green
    Write-Host "   Location: $shortcutPath" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error: Could not find the executable at:" -ForegroundColor Red
    Write-Host "   $exePath" -ForegroundColor Yellow
    Write-Host "`nPlease run 'npm run pack:win' first to build the application." -ForegroundColor Yellow
}

