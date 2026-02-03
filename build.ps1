# 成果物名を変数にする
$distName = "hatebu-mute-extension.xpi"

# 古いファイルを消して新しく固める
if (Test-Path $distName) { Remove-Item $distName }
Get-ChildItem -Path . -Exclude ".git*", "*.zip", "*.xpi", ".gitignore", "build.ps1" | Compress-Archive -DestinationPath $distName

Write-Host "Build complete: $distName" -ForegroundColor Green
