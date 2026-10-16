const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

async function main() {
  console.log('Starting preview server on port 5199...');
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '5199'], {
    cwd: 'C:\\Users\\sidra\\.gemini\\antigravity\\scratch\\ecom-seller-suite',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('Launching Chrome...');
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

  console.log('Navigating to http://localhost:5199/ (WITHOUT setting any session flag)...');
  await page.goto('http://localhost:5199/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 2000));

  const pageTitle = await page.title();
  const rootTextLength = await page.evaluate(() => document.getElementById('root')?.innerText?.length || 0);
  const authButtons = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return {
      hasLogin: btns.some(t => t.includes('Login')),
      hasSignUp: btns.some(t => t.includes('Sign Up') || t.includes('Register')),
      totalButtons: btns.length
    };
  });

  await page.screenshot({ path: 'fresh_load_screenshot.png' });
  console.log('Result -> Title:', pageTitle, '| Root innerText length:', rootTextLength, '| AuthButtons:', authButtons);
  console.log('Console Errors count:', errors.length);
  if (errors.length > 0) {
    console.log('Errors:', errors);
  }

  await browser.close();
  try {
    preview.kill();
  } catch (e) {}
}

main().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
