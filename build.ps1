# 成果物名のベース
$baseName = "hatebu-mute-extension"

# 古い成果物を削除
if (Test-Path "$baseName.zip") { Remove-Item "$baseName.zip" }
if (Test-Path "$baseName.xpi") { Remove-Item "$baseName.xpi" }

# 除外リスト
$excludeList = @(".git*", "*.zip", "*.xpi", ".gitignore", "build.ps1")

# まずはzipを作成
Get-ChildItem -Path . -Exclude $excludeList | Compress-Archive -DestinationPath "$baseName.zip"

# 作成したzipをコピーして拡張子をxpiに変える（中身は同じなのでこれが最速）
Copy-Item "$baseName.zip" "$baseName.xpi"

Write-Host "Build complete: $baseName.zip & $baseName.xpi" -ForegroundColor Green