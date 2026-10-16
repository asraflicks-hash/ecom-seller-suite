const puppeteer = require('puppeteer-core');
const path = require('path');

async function testLive() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = require('fs').existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  const logs = [];

  page.on('console', msg => {
    logs.push(`[${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push('PAGE_ERROR: ' + err.toString());
  });

  try {
    console.log('Navigating to https://www.sellersuitepro.online ...');
    await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));

    await page.screenshot({ path: 'live_screenshot.png' });
    console.log('Screenshot saved to live_screenshot.png');
  } catch (err) {
    console.error('Navigation error:', err);
  }

  console.log('\n--- BROWSER CONSOLE ERRORS (' + errors.length + ') ---');
  errors.forEach(e => console.log('ERROR:', e));

  console.log('\n--- ALL CONSOLE LOGS ---');
  logs.slice(-20).forEach(l => console.log(l));

  await browser.close();
}

testLive();
