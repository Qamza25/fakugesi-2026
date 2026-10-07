# remove-get-involved-links.ps1  (run from the fakugesi-2026 root folder)
$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$utf8 = New-Object System.Text.UTF8Encoding($false)
$opt  = [System.Text.RegularExpressions.RegexOptions]::Singleline -bor [System.Text.RegularExpressions.RegexOptions]::IgnoreCase

$backupDir = Join-Path $root '_get-involved-backup'
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null

$skip = '\\(\.git|\.vercel|\.vscode|node_modules|images|fonts|_[^\\]*backup[^\\]*)\\'

$files = Get-ChildItem -Path $root -Recurse -File -Include *.html,*.js |
         Where-Object { ($_.FullName.Substring($root.Length) + '\') -notmatch $skip }

# 1. Cards: <a class="inv-card" href="get-involved.html...">...</a>  ->  <div class="inv-card">...</div>
$cardPattern = '<a\s+class="inv-card"[^>]*href="get-involved\.html[^"]*"[^>]*>(.*?)</a>'
# 2. <li> that only wraps a get-involved link
$liPattern   = '<li[^>]*>\s*<a\b[^>]*href=["'']get-involved\.html[^"'']*["''][^>]*>.*?</a>\s*</li>'
# 3. Any remaining get-involved anchor
$aPattern    = '<a\b[^>]*href=["'']get-involved\.html[^"'']*["''][^>]*>.*?</a>'

foreach ($f in $files) {
  $text = [System.IO.File]::ReadAllText($f.FullName, $utf8)
  if ($text -notmatch 'get-involved\.html') { continue }

  $new = [regex]::Replace($text, $cardPattern, '<div class="inv-card">$1</div>', $opt)
  $new = [regex]::Replace($new, $liPattern, '', $opt)
  $new = [regex]::Replace($new, $aPattern, '', $opt)

  if ($new -ne $text) {
    $rel  = $f.FullName.Substring($root.Length).TrimStart('\')
    $dest = Join-Path $backupDir $rel
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Copy-Item $f.FullName $dest -Force
    [System.IO.File]::WriteAllText($f.FullName, $new, $utf8)
    Write-Host "UPDATED  $rel" -ForegroundColor Green
  }
}

# Final scan for anything left over
Write-Host "`nRemaining references to get-involved.html:" -ForegroundColor Cyan
$left = Get-ChildItem -Path $root -Recurse -File -Include *.html,*.js |
        Where-Object { ($_.FullName.Substring($root.Length) + '\') -notmatch $skip } |
        Select-String -Pattern 'get-involved\.html'
if ($left) {
  $left | ForEach-Object { Write-Host ("  {0}:{1}  {2}" -f $_.Path.Substring($root.Length).TrimStart('\'), $_.LineNumber, $_.Line.Trim()) -ForegroundColor Yellow }
  Write-Host "Those need a manual look (usually link lists inside nav.js / footer.js)." -ForegroundColor Yellow
} else {
  Write-Host "  None. All clear." -ForegroundColor Green
}
Write-Host "`nBackups in: $backupDir" -ForegroundColor Cyan