const puppeteer = require('puppeteer-core');

async function testLiveLogin() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click Login in header
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginBtn = buttons.find(b => b.innerText.trim() === 'Login');
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  console.log('Typing credentials for seller.suite.test99@gmail.com ...');
  await page.type('input[placeholder="seller@example.com"]', 'seller.suite.test99@gmail.com', { delay: 20 });
  await page.type('input[placeholder="••••••••"]', 'Password99@Secure2026', { delay: 20 });

  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: 'live_login_typed.png' });

  console.log('Clicking Sign In with Supabase...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText.includes('Sign In with Supabase'));
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 4000));
  await page.screenshot({ path: 'live_login_success.png' });

  const finalCheck = await page.evaluate(() => {
    const modal = document.querySelector('[style*="zIndex: 99999"]');
    return {
      modalOpen: !!modal,
      storageUser: localStorage.getItem('sidra_user_email'),
      storageAuth: localStorage.getItem('sidra_auth_unlocked'),
      storageAuthType: localStorage.getItem('sidra_auth_type')
    };
  });

  console.log('Login Result:', finalCheck);
  await browser.close();
}

testLiveLogin().catch(console.error);
