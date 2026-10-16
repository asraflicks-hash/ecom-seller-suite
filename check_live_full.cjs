const puppeteer = require('puppeteer-core');

async function testFull() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 2000));

  await page.evaluate(() => {
    const b = Array.from(document.querySelectorAll('button')).find(x => x.innerText.trim() === 'Login');
    if (b) b.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.type('input[placeholder="seller@example.com"]', 'seller.suite.test99@gmail.com', { delay: 20 });
  await page.type('input[placeholder="••••••••"]', 'Password99@Secure2026', { delay: 20 });

  console.log('Submitting login...');
  await page.evaluate(() => {
    const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Sign In to Workstation'));
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 5500));
  await page.screenshot({ path: 'logged_in_verified_full.png' });

  const check = await page.evaluate(() => {
    return {
      storageUser: localStorage.getItem('sidra_user_email'),
      storageAuth: localStorage.getItem('sidra_auth_unlocked'),
      bodySnippet: document.body.innerText.substring(0, 400)
    };
  });

  console.log('Final Result:', check);
  await browser.close();
}

testFull().catch(console.error);
