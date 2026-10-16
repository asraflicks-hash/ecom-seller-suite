const puppeteer = require('puppeteer-core');

async function testDesktopLocked() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'desktop_view_locked_verified.png' });
  console.log('Desktop screenshot taken');

  await browser.close();
}

testDesktopLocked().catch(console.error);
