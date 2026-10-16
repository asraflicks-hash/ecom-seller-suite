// capture_clean_showcase.cjs
const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\sidra\\.gemini\\antigravity\\brain\\ee97af74-487e-4d33-9fc2-5283824a73de';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('https://www.sellersuitepro.online?t=' + Date.now(), { waitUntil: 'networkidle2' });

  // Dismiss cookie banner if present
  try {
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const acceptBtn = btns.find(b => b.innerText.includes('Got It & Accept'));
      if (acceptBtn) acceptBtn.click();
    });
    await sleep(500);
  } catch (e) {}

  // Open Create New Listing
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const target = btns.find(b => b.innerText.includes('AI Scan & Create Listing') || b.innerText.includes('Create New Listing'));
    if (target) target.click();
  });
  await sleep(1000);

  // Advance to Step 2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next Step') || b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(800);

  // Capture Step 2 clean
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step2_ai_scanner.png') });

  // Click Leather Wallet Preset
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wallet = btns.find(b => b.innerText.includes('Leather Wallet'));
    if (wallet) wallet.click();
  });
  await sleep(600);

  // Scan Photo & Generate Complete Listing
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scanBtn = btns.find(b => b.innerText.includes('Scan Photo & Generate Complete Listing'));
    if (scanBtn) scanBtn.click();
  });

  await page.waitForFunction(() => {
    return document.body.innerText.includes('AI Visual Scan & Listing Synthesis Complete') ||
           document.body.innerText.includes('View Complete Listings Now');
  }, { timeout: 15000 });

  await sleep(800);

  // Scroll modal body down to show scan result card
  await page.evaluate(() => {
    const scrollables = Array.from(document.querySelectorAll('div')).filter(d => {
      const style = window.getComputedStyle(d);
      return style.overflowY === 'auto';
    });
    if (scrollables.length > 0) {
      scrollables[scrollables.length - 1].scrollTop = 450;
    }
  });
  await sleep(600);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step2_scan_result_scrolled.png') });

  // Navigate to Step 4
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const viewBtn = btns.find(b => b.innerText.includes('View Complete Listings Now'));
    if (viewBtn) viewBtn.click();
  });
  await sleep(1200);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step4_amazon.png') });

  // Scroll down in Step 4 to show Search Terms 249-byte bar, Image Plan, and Pricing Math
  await page.evaluate(() => {
    const scrollables = Array.from(document.querySelectorAll('div')).filter(d => {
      const style = window.getComputedStyle(d);
      return style.overflowY === 'auto';
    });
    if (scrollables.length > 0) {
      scrollables[scrollables.length - 1].scrollTop = 480;
    }
  });
  await sleep(600);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step4_searchterms_imageplan_pricing.png') });

  // Switch to Flipkart in Step 4
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const fk = btns.find(b => b.innerText.includes('Flipkart'));
    if (fk) fk.click();
  });
  await sleep(600);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step4_flipkart.png') });

  // Switch to Meesho in Step 4
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const meesho = btns.find(b => b.innerText.includes('Meesho'));
    if (meesho) meesho.click();
  });
  await sleep(600);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step4_meesho.png') });

  // Advance to Step 5 (Copy-Paste Export Checklist)
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText.includes('Next Step'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(1000);

  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'clean_step5_copypaste_export.png') });

  console.log('=== ALL CLEAN SCREENSHOTS CAPTURED ===');
  await browser.close();
}

capture().catch(err => {
  console.error('Capture failed:', err);
  process.exit(1);
});
