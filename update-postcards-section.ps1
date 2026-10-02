# update-postcards-section.ps1  (run from the fakugesi-2026 project root)
$ErrorActionPreference = 'Stop'

$path = Join-Path $PSScriptRoot 'index.html'
if (-not (Test-Path $path)) { throw "index.html not found next to this script." }

$utf8 = New-Object System.Text.UTF8Encoding($false)
$html = [System.IO.File]::ReadAllText($path, $utf8)

if ($html.Contains('id="postcards-own-section"')) { throw "These changes have already been applied." }
if (-not $html.Contains('</head>')) { throw "Could not find </head>." }

$cssNew = @'
<style id="postcards-own-section">
  /* Postcards: own white section, 3 images across the screen */
  .postcards-section{background:#ffffff;padding:56px 0;position:relative;overflow:hidden;}
  .postcards-section .postcards-carousel{margin-top:0;}
  .postcards-section .postcards-track{gap:16px;}
  .postcards-section .postcards-track img{
    flex:0 0 auto;
    width:calc((100vw - 32px) / 3) !important;   /* 3 images + 2 gaps = full width */
    height:auto !important;
    display:block;
  }
  @media(max-width:768px){
    .postcards-section{padding:36px 0;}
    .postcards-section .postcards-track{gap:12px;}
    .postcards-section .postcards-track img{width:calc((100vw - 12px) / 2) !important;} /* 2 across on phones */
  }
</style>
'@

# Find the carousel block that currently sits inside the Spotlight section
$rx = [regex]'(?s)[ \t]*<div class="postcards-carousel">.*?</div>\s*</div>(\s*</section>)'
$m = $rx.Match($html)
if (-not $m.Success) { throw "Could not find the postcards carousel inside the Spotlight section." }

# Backup
$stamp  = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path $PSScriptRoot "index.backup-$stamp.html"
Copy-Item $path $backup

# Pull out the carousel block (without the closing </section>)
$closeLen  = $m.Groups[1].Length
$block     = $m.Value.Substring(0, $m.Value.Length - $closeLen).TrimEnd()

# Replace: Spotlight section closes right after its inner content, then new white section follows
$replacement = "`r`n</section>`r`n`r`n<!-- POSTCARDS -->`r`n<section class=`"postcards-section`">`r`n" + $block + "`r`n</section>"
$html = $html.Substring(0, $m.Index) + $replacement + $html.Substring($m.Index + $m.Length)

# CSS
$html = $html.Replace('</head>', $cssNew + "`r`n</head>")

[System.IO.File]::WriteAllText($path, $html, $utf8)

Write-Host ""
Write-Host "Done. Postcards now sit in their own white section (3 across)." -ForegroundColor Green
Write-Host "Backup saved as: $backup"