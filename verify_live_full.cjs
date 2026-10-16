const puppeteer = require('puppeteer-core');

async function checkLive() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    errors.push(err.toString());
  });

  console.log('Navigating to live https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  let recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('1. Initial Load - Recovery visible:', recoveryVisible);

  await page.screenshot({ path: 'live_fixed_home.png' });

  // Click Login button
  console.log('2. Clicking Login button in header...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginBtn = btns.find(b => b.innerText.trim().includes('Login'));
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('3. After Login click - Recovery visible:', recoveryVisible);

  const modalText = await page.evaluate(() => {
    return {
      hasLoginModal: document.body.innerText.includes('Login to Seller Suite'),
      hasGoogleBtn: document.body.innerText.includes('Continue with Google')
    };
  });
  console.log('4. Modal state:', modalText);

  await page.screenshot({ path: 'live_fixed_login_modal.png' });

  // Click Sign Up tab
  console.log('5. Clicking Sign Up tab inside modal...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const signupBtn = btns.find(b => b.innerText.includes('Sign Up (Naya Khata)'));
    if (signupBtn) signupBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('6. After Sign Up click - Recovery visible:', recoveryVisible);

  const signupText = await page.evaluate(() => {
    return {
      hasSignupModal: document.body.innerText.includes('Create Seller Account'),
      hasGoogleSignup: document.body.innerText.includes('Sign Up with Google')
    };
  });
  console.log('7. Sign Up state:', signupText);

  await page.screenshot({ path: 'live_fixed_signup_modal.png' });

  console.log('8. Total console errors:', errors);
  await browser.close();
}

checkLive().catch(err => {
  console.error('Live check error:', err);
  process.exit(1);
});
