// capture_live_social_audit.cjs
const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function capture() {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1100 });

  page.on('dialog', async dialog => {
    console.log('Dialog message:', dialog.message());
    await dialog.dismiss();
  });

  console.log('Navigating to live production site...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 35000 });

  // 1. Accept cookie consent
  await page.evaluate(() => {
    localStorage.setItem('sidra_owner_logged_in', 'true');
    const btns = Array.from(document.querySelectorAll('button'));
    const acceptBtn = btns.find(b => b.textContent && b.textContent.includes('Got It & Accept'));
    if (acceptBtn) acceptBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // 2. Click "9. Social Doctor & Audit" tab specifically
  console.log('Switching to 9. Social Doctor & Audit tab...');
  const tabClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.textContent && b.textContent.includes('9. Social Doctor'));
    if (target) {
      target.scrollIntoView({ behavior: 'instant', block: 'center' });
      target.click();
      return true;
    }
    return false;
  });
  console.log('Tab clicked:', tabClicked);
  await new Promise(r => setTimeout(r, 1500));

  // 3. Find handle input and type digital-web.in natively
  console.log('Entering handle digital-web.in...');
  const inputEl = await page.$('input[placeholder*="username"]');
  if (inputEl) {
    await inputEl.scrollIntoView();
    await inputEl.click({ clickCount: 3 });
    await inputEl.type('digital-web.in', { delay: 40 });
    console.log('Typed digital-web.in successfully');
  } else {
    console.warn('Could not find input element by placeholder');
  }
  await new Promise(r => setTimeout(r, 500));

  // 4. Click ONLY the "AI Scan & Deep Audit" button
  console.log('Clicking "AI Scan & Deep Audit" button...');
  const auditClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const btn = btns.find(b => b.textContent && b.textContent.trim().includes('AI Scan & Deep Audit'));
    if (btn) {
      btn.scrollIntoView({ behavior: 'instant', block: 'center' });
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Audit button clicked:', auditClicked);

  // 5. Wait explicitly for the LIVE VERIFIED badge to appear
  console.log('Waiting for LIVE VERIFIED badge to render in DOM...');
  try {
    await page.waitForFunction(() => {
      return document.body.innerText.includes('LIVE VERIFIED') || document.body.innerText.includes('ESTIMATED');
    }, { timeout: 15000 });
    console.log('Audit result rendered successfully!');
  } catch (e) {
    console.warn('Wait timed out, proceeding to capture whatever is on screen:', e.message);
  }

  // 6. Center the audit profile card
  await page.evaluate(() => {
    const badge = Array.from(document.querySelectorAll('span, div')).find(el => 
      el.textContent && el.textContent.includes('LIVE VERIFIED')
    );
    if (badge) {
      badge.scrollIntoView({ behavior: 'instant', block: 'center' });
    } else {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find(el => 
        el.textContent && el.textContent.includes('digital_web.in')
      );
      if (heading) heading.scrollIntoView({ behavior: 'instant', block: 'center' });
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  const screenshotPath = path.join(__dirname, 'live_social_audit_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  // Copy to artifacts directory
  const artifactDir = path.join('C:', 'Users', 'sidra', '.gemini', 'antigravity', 'brain', 'ee97af74-487e-4d33-9fc2-5283824a73de');
  const artifactDest = path.join(artifactDir, 'live_social_audit_verified.png');
  fs.copyFileSync(screenshotPath, artifactDest);
  console.log('Copied to artifacts directory:', artifactDest);

  await browser.close();
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
