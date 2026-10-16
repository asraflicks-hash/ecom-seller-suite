const puppeteer = require('puppeteer-core');

async function testWithStorage() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => {
    errors.push('PAGE_ERROR: ' + err.toString());
  });

  // Set mock localStorage items before loading
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('sidra_auth_unlocked', 'true');
    localStorage.setItem('sidra_auth_type', 'unlocked');
    localStorage.setItem('sidra_user_name', 'Sidra Motion');
    localStorage.setItem('sidra_user_email', 'contact@sidramotion.com');
    localStorage.setItem('sidra_user_phone', '9876543210');
    localStorage.setItem('sidra_user_city', 'Delhi');
    localStorage.setItem('sidra_has_password', 'true');
    localStorage.setItem('sidra_authorized_keys', JSON.stringify(['SM26-MASTER-ADMIN-KEY']));
    localStorage.setItem('ssp_social_audit_usage', JSON.stringify({ date: '2026-10-15', count: 3 }));
  });

  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  const rootHtml = await page.evaluate(() => document.getElementById('root')?.innerHTML || '');
  console.log('Root HTML length:', rootHtml.length);
  console.log('Errors:', errors);

  await page.screenshot({ path: 'test_with_storage.png' });
  await browser.close();
}

testWithStorage();
