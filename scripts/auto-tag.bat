@echo off
REM Read version from package.json
for /f "tokens=2 delims=: " %%v in ('findstr /R /C:"\"version\"" package.json') do set ver=%%v
set ver=%ver:~2,-2%
echo Tagging v%ver%
git add package.json
git commit -m "chore: bump version to v%ver%" || echo commit skipped
git tag v%ver%
git push origin main
git push --tags
echo Done.
pause
