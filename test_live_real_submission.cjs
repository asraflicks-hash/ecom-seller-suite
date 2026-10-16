const puppeteer = require('puppeteer-core');

async function testLiveRealSignup() {
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

  // Click Sign Up in header
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const signupBtn = buttons.find(b => b.innerText.trim() === 'Sign Up');
    if (signupBtn) signupBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Fill in fields
  const uniqueId = Math.floor(Math.random() * 89999 + 10000);
  const testEmail = `seller.tester.${uniqueId}@gmail.com`;
  console.log('Testing with email:', testEmail);

  await page.evaluate((email) => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const nameInput = inputs.find(i => i.placeholder.includes('Ramesh Kumar'));
    const phoneInput = inputs.find(i => i.placeholder.includes('+91'));
    const storeInput = inputs.find(i => i.placeholder.includes('Urban Trends'));
    const emailInput = inputs.find(i => i.placeholder.includes('seller@example.com'));
    const pwdInputs = inputs.filter(i => i.type === 'password');

    if (nameInput) {
      nameInput.value = 'Vikram Sharma';
      nameInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (phoneInput) {
      phoneInput.value = '+91 9876543210';
      phoneInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (storeInput) {
      storeInput.value = 'Sharma Retail Hub';
      storeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (emailInput) {
      emailInput.value = email;
      emailInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (pwdInputs[0]) {
      pwdInputs[0].value = 'StrongSellerPass2026!';
      pwdInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    }
    if (pwdInputs[1]) {
      pwdInputs[1].value = 'StrongSellerPass2026!';
      pwdInputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, testEmail);

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'live_signup_filled.png' });

  // Click submit button
  console.log('Clicking Create Account...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText.includes('Create Account & Start Workstation'));
    if (submitBtn) submitBtn.click();
  });

  // Wait for network response from Supabase
  await new Promise(r => setTimeout(r, 4500));

  await page.screenshot({ path: 'live_signup_submitted.png' });

  const resultStatus = await page.evaluate(() => {
    return {
      bodySnippet: document.body.innerText.substring(0, 500),
      userNameInHeader: document.querySelector('header')?.innerText || ''
    };
  });

  console.log('Result after submit:', resultStatus);
  await browser.close();
}

testLiveRealSignup().catch(console.error);
