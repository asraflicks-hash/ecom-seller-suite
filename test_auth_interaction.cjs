const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

async function testAuthInteraction() {
  console.log('Starting preview server...');
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '5211'], {
    cwd: 'C:\\Users\\sidra\\.gemini\\antigravity\\scratch\\ecom-seller-suite',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2500));

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

  console.log('Visiting preview on port 5211...');
  await page.goto('http://localhost:5211/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1500));

  // Check if ErrorBoundary triggered on initial load
  let recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('Initial load - Recovery visible:', recoveryVisible);

  // Click Login button
  console.log('Clicking Login button in header...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loginBtn = btns.find(b => b.innerText.trim().startsWith('Login') || b.innerText.trim().includes('Login'));
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('After Login click - Recovery visible:', recoveryVisible);

  const isModalOpen = await page.evaluate(() => {
    return document.body.innerText.includes('Seller Account Login') ||
           document.body.innerText.includes('Welcome Back') ||
           document.body.innerText.includes('Supabase Cloud Auth');
  });
  console.log('Is Auth Modal open and visible:', isModalOpen);

  await page.screenshot({ path: 'login_modal_working.png' });

  // Click Sign Up tab inside modal
  console.log('Switching to Sign Up tab...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const signupTab = btns.find(b => b.innerText.includes('New Seller Registration') || b.innerText.includes('Sign Up'));
    if (signupTab) signupTab.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  recoveryVisible = await page.evaluate(() => document.body.innerText.includes('Workstation Recovery Active'));
  console.log('After Sign Up switch - Recovery visible:', recoveryVisible);

  await page.screenshot({ path: 'signup_modal_working.png' });

  console.log('All errors caught during test:', errors);

  await browser.close();
  try {
    preview.kill();
  } catch (e) {}
}

testAuthInteraction().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
