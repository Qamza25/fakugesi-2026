# move-postcards-under-evans.ps1  (run from the fakugesi-2026 project root)
$ErrorActionPreference = 'Stop'

$path = Join-Path $PSScriptRoot 'index.html'
if (-not (Test-Path $path)) { throw "index.html not found next to this script." }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [System.IO.File]::ReadAllText($path, $utf8)

if ($html.Contains('id="postcards-under-evans"')) { throw "These changes have already been applied." }
if (-not $html.Contains('</head>')) { throw "Could not find </head>." }

$anchor = '<!-- OTHER TWO: existing card format -->'
if (-not $html.Contains($anchor)) { throw "Could not find the Renzo/Dagmar cards anchor." }

# Find the standalone postcards section and capture the carousel inside it
$rx = [regex]'(?s)[ \t]*<!-- POSTCARDS -->\s*<section class="postcards-section">\s*(<div class="postcards-carousel">.*?</div>\s*</div>)\s*</section>[ \t]*\r?\n?'
$m = $rx.Match($html)
if (-not $m.Success) { throw "Could not find the standalone postcards section." }
$carousel = $m.Groups[1].Value

$cssNew = @'
<style id="postcards-under-evans">
  /* Evans block: no divider line, the postcards band sits right under it */
  .featured-lead{border-bottom:none !important;padding-bottom:0 !important;}

  /* White postcards band, full width of the navy section (cancels the section side padding) */
  .postcards-in-featured{margin:0 calc(-1 * var(--band)) 56px;}
  @media(max-width:1024px){.postcards-in-featured{margin:0 -48px 40px;}}
  @media(max-width:768px){.postcards-in-featured{margin:0 -20px 36px;}}
</style>
'@

# Backup
$stamp  = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $PSScriptRoot "index.backup-$stamp.html"
Copy-Item $path $backup

# 1. Remove the standalone section
$html = $rx.Replace($html, '', 1)

# 2. Insert the carousel between Evans and the two cards
$newBlock = "<!-- POSTCARDS (under Evans) -->`r`n    <div class=`"postcards-section postcards-in-featured`">`r`n      " + $carousel + "`r`n    </div>`r`n`r`n    "
$html = $html.Replace($anchor, $newBlock + $anchor)

# 3. CSS
$html = $html.Replace('</head>', $cssNew + "`r`n</head>")

[System.IO.File]::WriteAllText($path, $html, $utf8)

Write-Host ""
Write-Host "Done. Postcards now sit under Evans in Featured Artists." -ForegroundColor Green
Write-Host "Backup saved as: $backup"