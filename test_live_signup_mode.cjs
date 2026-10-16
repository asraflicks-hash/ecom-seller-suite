const puppeteer = require('puppeteer-core');

async function testLiveSignUpModal() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Click Sign Up button in header
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const signupBtn = buttons.find(b => b.innerText.trim() === 'Sign Up');
    if (signupBtn) signupBtn.click();
  });

  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: 'live_signup_modal_open.png' });

  const modalDetails = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input')).map(i => ({
      type: i.type,
      placeholder: i.placeholder,
      value: i.value
    }));
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    const text = document.body.innerText;
    return {
      inputs,
      hasRegisterAccountTitle: text.includes('Create Seller Account'),
      buttons
    };
  });

  console.log('Register Account Modal state:', JSON.stringify(modalDetails, null, 2));

  await browser.close();
}

testLiveSignUpModal().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
