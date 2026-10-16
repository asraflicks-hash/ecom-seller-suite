const puppeteer = require('puppeteer-core');

async function testModal() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));

  // Find and click Login button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginBtn = btns.find(b => b.innerText.includes('Login'));
    if (loginBtn) loginBtn.click();
  });

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: 'auth_modal_screenshot.png' });

  const modalPresent = await page.evaluate(() => {
    return document.body.innerText.includes('Supabase Cloud Auth') || 
           document.body.innerText.includes('Seller Account Login') ||
           document.body.innerText.includes('Sign In to Seller Suite Pro');
  });

  console.log('Modal visible:', modalPresent);
  await browser.close();
}

testModal().catch(console.error);
