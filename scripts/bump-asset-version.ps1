# Cập nhật VERSION và gắn ?v= vào mọi link CSS/JS trong file HTML.
# Mỗi lần chạy (cùng ngày) tự tăng: 20260516.1 → 20260516.2 → …
#
# Chạy từ thư mục GingasNew:
#   .\scripts\bump-asset-version.ps1
#   .\scripts\bump-asset-version.ps1 -Version 20260516.5
#   .\scripts\bump-asset-version.ps1 -ResetToday   # bắt đầu lại .1 trong ngày

param(
  [string]$Version,
  [switch]$ResetToday
)

$root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$versionFile = Join-Path $root "VERSION"
$today = Get-Date -Format "yyyyMMdd"
$current = ""
if (Test-Path $versionFile) {
  $current = ([System.IO.File]::ReadAllText($versionFile)).Trim()
}

function Get-NextVersionForToday {
  param([string]$Today, [string]$Current, [bool]$Reset)

  if ($Reset) {
    return "$Today.1"
  }

  if ($Current -match "^$([regex]::Escape($Today))\.(\d+)$") {
    $n = [int]$Matches[1] + 1
    return "$Today.$n"
  }

  if ($Current -eq $Today) {
    return "$Today.2"
  }

  return "$Today.1"
}

if ($Version) {
  $newVersion = $Version.Trim()
} else {
  $newVersion = Get-NextVersionForToday -Today $today -Current $current -Reset:$ResetToday
}

Set-Content -Path $versionFile -Value $newVersion -NoNewline
Write-Host "VERSION = $newVersion (truoc: $current)"

Get-ChildItem -Path $root -Recurse -Filter *.html | ForEach-Object {
  $c = [System.IO.File]::ReadAllText($_.FullName)
  $c = $c -replace '\?v=[^"&]+', ''
  $c = $c -replace 'href="((?:\.\./)?css/[^"?]+\.css)"', "href=`"`$1?v=$newVersion`""
  $c = $c -replace 'src="((?:\.\./)?js/(?:main|site-config)\.js)"', "src=`"`$1?v=$newVersion`""
  [System.IO.File]::WriteAllText($_.FullName, $c)
}

Write-Host "Done. Commit VERSION + *.html"
