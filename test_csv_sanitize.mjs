import { sanitizeCsvCell } from './src/securitySanitizer.js';

const cases = [
  -500,
  '-500',
  '+100',
  '-34.56',
  0,
  '=1+1',
  "=cmd|' /C calc'!A0",
  '-SUM(A1:A10)',
  '+HYPERLINK("http://evil.com")',
  '@AVERAGE(B1:B5)',
  '\tDDE_LINK',
  'Standard SKU 123'
];

console.log('=== CSV SANITIZATION TEST RESULTS ===');
cases.forEach(c => {
  console.log(JSON.stringify(c).padEnd(35), '->', sanitizeCsvCell(c));
});
