const puppeteer = require('puppeteer-core');

async function testSocialScan() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));
  page.on('dialog', async dialog => {
    console.log('DIALOG DETECTED:', dialog.message());
    await dialog.dismiss();
  });

  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('sidra_privacy_consent', 'true');
    localStorage.setItem('sidra_dpdp_notice_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to tab 'social-doctor'
  const navBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Social Doctor'));
  });
  if (navBtn) await navBtn.click();
  await new Promise(r => setTimeout(r, 1000));

  // Find the handle input field
  const inputHandle = await page.$('input[placeholder*="username" i], input[placeholder*="handle" i]');
  if (!inputHandle) {
    console.error('Handle input not found!');
    await browser.close();
    return;
  }

  // Focus and type 'famashhadii' like a real user
  await inputHandle.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await inputHandle.type('famashhadii', { delay: 50 });
  console.log('Typed famashhadii into input field');

  // Find and click the Scan button
  const scanBtn = await page.evaluateHandle(() => {
    return Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AI Scan') || b.innerText.includes('Deep Audit'));
  });
  console.log('Clicking scan button...');
  await scanBtn.click();

  // Monitor the scan progression for 15 seconds
  for (let s = 1; s <= 15; s++) {
    await new Promise(r => setTimeout(r, 1000));
    const state = await page.evaluate(() => {
      const isSpinning = document.querySelector('.spin') !== null;
      const scanBtnText = Array.from(document.querySelectorAll('button')).map(b => b.innerText).find(t => t.includes('Scanning') || t.includes('AI Scan'));
      const subMsg = Array.from(document.querySelectorAll('div, span')).map(e => e.innerText).find(t => t && t.includes('Calculating Dead Follower'));
      const resultsFound = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(e => e.innerText && e.innerText.includes('Follower Health & Organic Ratio'));
      return { isSpinning, scanBtnText, subMsg, resultsFound };
    });
    console.log(`[Second ${s}]`, JSON.stringify(state));
    if (state.resultsFound) {
      console.log('Scan completed successfully with results!');
      break;
    }
  }

  await page.screenshot({ path: 'test_famashhadii_scan_capture.png' });
  await browser.close();
}

testSocialScan().catch(console.error);
