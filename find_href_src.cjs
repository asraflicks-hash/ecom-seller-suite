const fs = require('fs');
const path = require('path');

function search(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.git', 'dist'].includes(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) search(full);
    else if (/\.(jsx?|tsx?)$/.test(e.name)) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      lines.forEach((l, i) => {
        if (/href=\{[^"']+\}/.test(l) || /src=\{[^"']+\}/.test(l)) {
          console.log(`${full}:${i+1}: ${l.trim()}`);
        }
      });
    }
  }
}

console.log('=== SEARCH FOR DYNAMIC href={...} and src={...} IN JSX ===');
search('src');
