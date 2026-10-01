#!/usr/bin/env node
/**
 * remove-logo-overlay.js
 *
 * Run from the project root:
 *     node remove-logo-overlay.js            (apply)
 *     node remove-logo-overlay.js --dry-run  (just list what would change)
 *
 * Removes the "white wash" over the partner carousel logos on every HTML page
 * that has one. Two things cause it:
 *   1. .prog-carousel-outer has a mask-image gradient that fades the logos to
 *      transparent (white) at the left/right edges. index.html already cancels
 *      it, but other pages don't.
 *   2. .prog-partner-logo img is set to opacity:0.75, which washes logos out
 *      toward the white background until hovered.
 *
 * The script adds a <style id="fug-no-logo-overlay"> block before </body>
 * (so it comes after every other rule). Safe to re-run: an existing block is
 * replaced.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry-run');
const SKIP_DIRS = new Set(['node_modules', '.git', '.github', '.vercel', '.vscode']);
const MARKER_RE = /<style id="fug-no-logo-overlay">[\s\S]*?<\/style>\s*/i;

const SNIPPET = `<style id="fug-no-logo-overlay">
  /* No edge fade over the carousels */
  .prog-partners-section .prog-carousel-outer{
    -webkit-mask-image:none !important;
    mask-image:none !important;
  }
  .prog-partners-section .prog-carousel-outer::before,
  .prog-partners-section .prog-carousel-outer::after{
    display:none !important;
    content:none !important;
  }
  /* Full-strength logos, no washed-out opacity */
  .prog-partners-section .prog-partner-logo img{
    opacity:1 !important;
  }
</style>
`;

function walk(dir, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(path.join(dir, entry.name), out);
    } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

let changed = 0, skipped = 0, noBody = 0;

for (const file of walk(ROOT, [])) {
  const rel = path.relative(ROOT, file);
  const html = fs.readFileSync(file, 'utf8');

  if (!html.includes('prog-carousel-track')) { skipped++; continue; }

  const cleaned = html.replace(MARKER_RE, '');
  const idx = cleaned.lastIndexOf('</body>');
  if (idx === -1) { console.warn('  ! no </body> found, skipped: ' + rel); noBody++; continue; }

  const next = cleaned.slice(0, idx) + SNIPPET + cleaned.slice(idx);
  if (next === html) { console.log('  = already up to date: ' + rel); continue; }

  console.log((DRY ? '  ~ would update: ' : '  + updated: ') + rel);
  if (!DRY) fs.writeFileSync(file, next, 'utf8');
  changed++;
}

console.log('\n' + (DRY ? 'Dry run: ' : 'Done: ') + changed + ' file(s) ' +
  (DRY ? 'would be ' : '') + 'updated, ' + skipped + ' without a partners carousel' +
  (noBody ? ', ' + noBody + ' skipped (no </body>)' : '') + '.');