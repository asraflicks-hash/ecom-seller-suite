const puppeteer = require('puppeteer-core');

async function verifyLive() {
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

  console.log('Visiting live production https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const pageTitle = await page.title();
  const info = await page.evaluate(() => {
    const textLen = document.getElementById('root')?.innerText?.length || 0;
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return {
      textLen,
      hasLogin: btns.some(t => t.includes('Login')),
      hasSignUp: btns.some(t => t.includes('Sign Up') || t.includes('Register')),
      totalButtons: btns.length
    };
  });

  await page.screenshot({ path: 'live_prod_screenshot.png' });
  console.log('Live Prod Verified! Title:', pageTitle, 'Info:', info);
  console.log('Console Errors:', errors);

  await browser.close();
}

verifyLive().catch(err => {
  console.error('Live check error:', err);
  process.exit(1);
});
