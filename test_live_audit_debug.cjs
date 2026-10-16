// test_live_audit_debug.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1350 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('dialog', d => { console.log('DIALOG:', d.message()); d.dismiss(); });

  console.log('Opening page...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2' });

  // Accept cookies immediately
  await page.evaluate(() => {
    localStorage.setItem('sidra_owner_logged_in', 'true');
    localStorage.setItem('cookie_consent', 'true');
    const btns = Array.from(document.querySelectorAll('button'));
    const acceptBtn = btns.find(b => b.textContent && b.textContent.includes('Got It & Accept'));
    if (acceptBtn) acceptBtn.click();
    
    // Switch to tab 9
    const tab = btns.find(b => b.textContent && b.textContent.includes('9. Social Doctor'));
    if (tab) tab.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  // Type handle
  const input = await page.$('input[placeholder*="username"]');
  console.log('Found input:', !!input);
  if (input) {
    await input.click({ clickCount: 3 });
    await input.type('digital-web.in', { delay: 30 });
  }

  // Click audit
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('AI Scan & Deep Audit'));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked audit button:', clicked);

  // Poll for 15s to see when auditData appears
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 500));
    const status = await page.evaluate(() => {
      const live = Array.from(document.querySelectorAll('*')).find(el => el.textContent && el.textContent.includes('100% LIVE VERIFIED'));
      const isScanning = Array.from(document.querySelectorAll('*')).some(el => el.textContent && el.textContent.includes('Scanning Profile'));
      return { hasLiveVerified: !!live, isScanning };
    });
    if (status.hasLiveVerified) {
      console.log('Audit completed with LIVE VERIFIED!');
      break;
    }
  }

  // Dismiss any lingering cookie banner
  await page.evaluate(() => {
    const cookieBanner = Array.from(document.querySelectorAll('div')).find(d => d.textContent && d.textContent.includes('Privacy & Cookie Consent'));
    if (cookieBanner) cookieBanner.remove();
  });

  // Scroll to the audit card perfectly
  await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent && h.textContent.includes('digital-web.in'));
    if (heading) {
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
      window.scrollBy({ top: -80 });
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const screenshotPath = path.join(__dirname, 'live_social_audit_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved screenshot to:', screenshotPath);

  const artifactDir = path.join('C:', 'Users', 'sidra', '.gemini', 'antigravity', 'brain', 'ee97af74-487e-4d33-9fc2-5283824a73de');
  const artifactDest = path.join(artifactDir, 'live_social_audit_verified.png');
  fs.copyFileSync(screenshotPath, artifactDest);
  console.log('Copied to artifacts directory:', artifactDest);

  await browser.close();
}

test().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
