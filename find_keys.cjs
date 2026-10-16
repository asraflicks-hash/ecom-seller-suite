const fs = require('fs');

function inspectFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const matches = text.match(/localStorage\.(?:getItem|setItem)\(['"`]([^'"`]+)['"`]/g) || [];
  return matches.map(m => m.replace(/localStorage\.(?:getItem|setItem)\(['"`]/, '').replace(/['"`]/, ''));
}

const files = [
  'src/App.jsx',
  'src/AiListingRepairStudio.jsx',
  'src/MarketplaceSyncAndLqsAudit.jsx',
  'src/SocialMediaAuditStudio.jsx',
  'src/OmnichannelSeoSuite.jsx',
  'src/licenseManager.js'
];

const allKeys = new Set();
files.forEach(f => {
  inspectFile(f).forEach(k => allKeys.add(k));
});

console.log('Detected storage keys:', Array.from(allKeys));
