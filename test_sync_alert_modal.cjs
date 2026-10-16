const puppeteer = require('puppeteer-core');

async function testSyncAlertModal() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const pageErrors = [];
  page.on('pageerror', err => {
    console.error('PAGE ERROR DETECTED:', err.message);
    pageErrors.push(err.message);
  });
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  console.log('Navigating to live production...');
  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  console.log('Clicking Sync & Alerts button...');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const syncBtn = btns.find(b => b.innerText && b.innerText.includes('Sync & Alerts'));
    if (syncBtn) {
      syncBtn.click();
      return true;
    }
    return false;
  });

  console.log('Sync & Alerts button found and clicked:', clicked);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'sync_alerts_live_verified.png' });

  const modalRendered = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasSyncTitle: text.includes('Marketplace Sync') || text.includes('Multi-Channel Sync') || text.includes('Amazon') || text.includes('Flipkart'),
      hasWorkstationCrash: text.includes('Workstation Recovery Active') || text.includes('Minified React error #130'),
      bodySnippet: text.slice(0, 300)
    };
  });

  console.log('Modal render result:', modalRendered);
  console.log('Total page errors caught:', pageErrors.length);

  await browser.close();
}

testSyncAlertModal().catch(console.error);
