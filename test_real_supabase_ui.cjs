const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');

async function testRealUi() {
  const preview = spawn('npx.cmd', ['vite', 'preview', '--port', '5233'], {
    cwd: 'C:\\Users\\sidra\\.gemini\\antigravity\\scratch\\ecom-seller-suite',
    shell: true,
    stdio: 'ignore'
  });

  await new Promise(r => setTimeout(r, 2000));

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:5233/', { waitUntil: 'networkidle2', timeout: 20000 });
  await new Promise(r => setTimeout(r, 1000));

  // Click Sign Up
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const sBtn = btns.find(b => b.innerText.includes('Sign Up'));
    if (sBtn) sBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));

  const statusPill = await page.evaluate(() => {
    return document.body.innerText.includes('Supabase Cloud Database Connected');
  });
  console.log('Is Supabase Cloud Database Connected visible:', statusPill);

  await page.screenshot({ path: 'real_supabase_modal_connected.png' });
  await browser.close();
  try { preview.kill(); } catch (e) {}
}

testRealUi().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
