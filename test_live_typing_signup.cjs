const puppeteer = require('puppeteer-core');

async function testLiveRealSignupWithTyping() {
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

  const uniqueId = Math.floor(Math.random() * 89999 + 10000);
  const testEmail = `seller.tester.${uniqueId}@gmail.com`;
  console.log('Testing typing with email:', testEmail);

  // Type into fields using page.type
  await page.type('input[placeholder="e.g. Ramesh Kumar"]', 'Vikram Sharma', { delay: 20 });
  await page.type('input[placeholder="+91 98765 43210"]', '+91 9876543210', { delay: 20 });
  await page.type('input[placeholder="e.g. Urban Trends"]', 'Sharma Retail Hub', { delay: 20 });
  await page.type('input[placeholder="seller@example.com"]', testEmail, { delay: 20 });
  await page.type('input[placeholder="Min 6 chars"]', 'StrongSellerPass2026!', { delay: 20 });
  await page.type('input[placeholder="Re-enter"]', 'StrongSellerPass2026!', { delay: 20 });

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'live_signup_typed.png' });

  // Click submit
  console.log('Submitting live form to Supabase...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText.includes('Create Account & Start Workstation'));
    if (submitBtn) submitBtn.click();
  });

  // Wait for Supabase response
  await new Promise(r => setTimeout(r, 4500));
  await page.screenshot({ path: 'live_signup_result.png' });

  const finalState = await page.evaluate(() => {
    const alertSuccess = document.querySelector('[style*="rgba(37, 211, 102"]');
    const alertError = document.querySelector('[style*="rgba(239, 68, 68"]');
    return {
      success: alertSuccess ? alertSuccess.innerText : null,
      error: alertError ? alertError.innerText : null,
      bodyText: document.body.innerText.substring(0, 400)
    };
  });

  console.log('Supabase Live Result:', finalState);
  await browser.close();
}

testLiveRealSignupWithTyping().catch(console.error);
