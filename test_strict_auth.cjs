const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

async function testStrictAuth() {
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '5222'], {
    cwd: 'C:\\Users\\sidra\\.gemini\\antigravity\\scratch\\ecom-seller-suite',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5222/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));

  // Click Sign Up in header
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const signupBtn = btns.find(b => b.innerText.includes('Sign Up'));
    if (signupBtn) signupBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Check what is visible in modal
  const modalInfo = await page.evaluate(() => {
    return {
      text: document.body.innerText.substring(0, 500),
      hasRedNotice: document.body.innerText.includes('Supabase Database Not Linked') || document.body.innerText.includes('Supabase Cloud Database'),
      hasDrawerOpen: document.body.innerText.includes('Connect Your Supabase Project'),
      hasProjectUrlInput: Boolean(document.querySelector('input[placeholder*="supabase.co"]'))
    };
  });
  console.log('Modal Info:', modalInfo);

  // Try clicking Google Sign Up button
  console.log('Clicking Google Sign Up without keys...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const gBtn = btns.find(b => b.innerText.includes('Google'));
    if (gBtn) gBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  const errorAfterGoogle = await page.evaluate(() => {
    const alerts = Array.from(document.querySelectorAll('div, p, span')).filter(el => 
      el.innerText && el.innerText.includes('Supabase Cloud Database connect hona zaroori hai')
    );
    return alerts.length > 0 ? alerts[0].innerText : 'none';
  });
  console.log('Error after Google click:', errorAfterGoogle);

  // Check that user is NOT logged in!
  const isStillLoggedOut = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return btns.some(t => t.includes('Login')) && btns.some(t => t.includes('Sign Up'));
  });
  console.log('Is still logged out (no fake instant login):', isStillLoggedOut);

  await page.screenshot({ path: 'strict_auth_test.png' });
  await browser.close();
  try { preview.kill(); } catch (e) {}
}

testStrictAuth().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
