const fs = require('fs');
let html = '';
try {
  html = fs.readFileSync('test_dom.html', 'utf16le');
} catch (e) {
  html = fs.readFileSync('test_dom.html', 'utf8');
}
console.log('Total characters:', html.length);
console.log('Has id="root":', html.includes('id="root"'));
console.log('Has Supabase:', html.includes('Supabase') || html.includes('SUPABASE'));
console.log('Has Login:', html.includes('Login'));
console.log('Has Sign Up:', html.includes('Sign Up'));

// Let's find what is inside id="root"
const rootIdx = html.indexOf('id="root"');
if (rootIdx !== -1) {
  console.log('Root snippet:', html.substring(rootIdx, rootIdx + 500));
}
