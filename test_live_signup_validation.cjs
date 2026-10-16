const puppeteer = require('puppeteer-core');

async function testValidation() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click Sign Up button in header
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const signupBtn = buttons.find(b => b.innerText.trim() === 'Sign Up');
    if (signupBtn) signupBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  // Click "Create Account & Start Workstation" without filling inputs
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText.includes('Create Account & Start Workstation'));
    if (submitBtn) submitBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  const errorText = await page.evaluate(() => {
    const errorEl = document.querySelector('[style*="background: rgba(239, 68, 68"]');
    return errorEl ? errorEl.innerText : null;
  });

  console.log('Validation Error Text displayed:', errorText);

  await page.screenshot({ path: 'live_validation_error.png' });
  await browser.close();
}

testValidation().catch(console.error);
