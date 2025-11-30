# sample helper to create folders and set easiest env vars
$root = (Get-Location).Path
New-Item -Path "$root\data" -ItemType Directory -Force
New-Item -Path "$root\backups" -ItemType Directory -Force
New-Item -Path "$root\servers\1\serverfiles" -ItemType Directory -Force
Write-Host "Created data, backups and servers/1/serverfiles (empty)."
Write-Host "If you want to run steamcmd scripts, set STEAMCMD_PATH environment variable or edit scripts/install_workshop.bat"
