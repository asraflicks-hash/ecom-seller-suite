const fs = require('fs');
const code = fs.readFileSync('./node_modules/@imgly/background-removal/dist/index.cjs', 'utf8');
const matches = code.match(/https?:\/\/[^\s"'`)]+/g) || [];
console.log('URLs in @imgly/background-removal:');
const unique = [...new Set(matches)];
unique.forEach(u => console.log(' -', u));
