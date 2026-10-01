// Run from the folder containing index.html:
//   node update-index.js
// Optional: node update-index.js other-file.html
//
// What it does:
//  1. Removes the "At Fak'ugesi" session block (and partner credits) from all 3 artist cards
//  2. Moves the Featured Artists section between the Director's message and the Spotlight
//  3. Makes the artist names bold purple

const fs = require('fs');

const file = process.argv[2] || 'index.html';
let html = fs.readFileSync(file, 'utf8');

if (html.includes('featured-tweaks')) {
  console.log('Already updated.');
  process.exit(0);
}

const SECOND = '<!-- SECOND SPOTLIGHT -->';
const F_START = '<!-- FEATURED ARTISTS -->';

if (!html.includes(SECOND) || !html.includes(F_START)) {
  console.error('Could not find the expected markers in ' + file);
  process.exit(1);
}

fs.writeFileSync(file + '.bak', html);

// 1) Remove session blocks from the artist cards
html = html.replace(/\s*<div class="featured-session">[\s\S]*?<\/div>\s*(?=<\/article>)/g, '\n      ');

// 2) Cut the featured section out of its current position
const start = html.indexOf(F_START);
const end = html.indexOf('</section>', start) + '</section>'.length;
const featured = html.slice(start, end);
html = html.slice(0, start) + html.slice(end);

// 3) Split the spotlight section: Director's message | Featured | Spotlight
html = html.replace(
  SECOND,
  '</div>\n</section>\n\n' +
  featured + '\n\n' +
  '<!-- SPOTLIGHT -->\n' +
  '<section class="spotlight-section spotlight-section-2 reveal">\n' +
  '  <div class="spotlight-inner">\n\n    ' + SECOND
);

// 4) Style tweaks
const css = `<style id="featured-tweaks">
  .featured-name{color:#8b5cf6;font-weight:700;}
  .featured-body{margin-bottom:0;}
  /* Spotlight now sits in its own section, so drop the divider/spacing it had inside the first one */
  .spotlight-section-2 .spotlight-second{margin-top:0;padding-top:0;border-top:none;}
</style>
`;
html = html.replace('</head>', css + '</head>');

fs.writeFileSync(file, html);
console.log('Done. Backup saved as ' + file + '.bak');