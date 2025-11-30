@echo off
cd /d %~dp0\..
echo === Auto Release Script ===
echo 1) bumping version
node scripts/auto-version.js

echo 2) commit + tag + push
call scripts\auto-tag.bat

echo 3) Triggering GitHub Actions (by pushing tag) - CI will build & publish installer.
echo Done. Wait for GitHub Actions to build the release and attach installer.
pause
