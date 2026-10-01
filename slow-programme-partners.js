#!/usr/bin/env node
/**
 * slow-programme-partners.js
 *
 * Run from the project root:
 *     node slow-programme-partners.js            (apply)
 *     node slow-programme-partners.js --dry-run  (just list what would change)
 *
 * What it does
 * ------------
 * Walks every .html file under the current folder (skipping node_modules, .git,
 * .github, .vercel, .vscode) and, in each file that has a .prog-carousel-track,
 * injects a tiny <script id="fug-partner-pace"> just before </body>.
 *
 * Why runtime instead of a fixed number?
 * The Programme Partners strip has ~90 logos while Media / Support have ~40,
 * and every carousel uses `translateX(-50%)` over the same 40s. So the
 * Programme track covers far more pixels in the same time = it looks much
 * faster. The injected script measures the Media/Support track on the page,
 * works out its real speed in px/s, and sets the Programme animation-duration
 * so it travels at exactly that speed (desktop and mobile logo sizes both
 * handled, re-calculated on resize).
 *
 * Safe to re-run: an existing <script id="fug-partner-pace"> is replaced.
 */

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const DRY = process.argv.includes('--dry-run');
const SKIP_DIRS = new Set(['node_modules', '.git', '.github', '.vercel', '.vscode']);
const MARKER_RE = /<script id="fug-partner-pace">[\s\S]*?<\/script>\s*/i;

const SNIPPET = `<script id="fug-partner-pace">
/* Match Programme Partners scroll speed to Media / Support partners */
(function () {
  function setPace() {
    var tracks = document.querySelectorAll('.prog-carousel-track');
    if (!tracks.length) return;

    var ref = [], prog = [];
    tracks.forEach(function (t) {
      var sec = t.closest('.prog-partners-section');
      if (sec && (sec.classList.contains('media-partners-section') ||
                  sec.classList.contains('supporting-partners-section'))) ref.push(t);
      else prog.push(t);
    });
    if (!prog.length) return;

    /* Reference speed (px/s) from the Media/Support track; fallback if absent */
    var speed = window.innerWidth <= 768 ? 64 : 90;
    if (ref.length) {
      var r = ref[0];
      var dur = parseFloat(getComputedStyle(r).animationDuration) || 40;
      var w = r.scrollWidth || r.offsetWidth;
      if (w && dur) speed = (w / 2) / dur;
    }

    prog.forEach(function (t) {
      var w = t.scrollWidth || t.offsetWidth;
      if (!w) return;
      t.style.animationDuration = ((w / 2) / speed).toFixed(1) + 's';
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setPace);
  else setPace();
  window.addEventListener('load', setPace);

  var rt;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(setPace, 200); });
})();
</script>
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
  let html = fs.readFileSync(file, 'utf8');

  if (!html.includes('prog-carousel-track')) { skipped++; continue; }

  // Remove previous injection (idempotent)
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