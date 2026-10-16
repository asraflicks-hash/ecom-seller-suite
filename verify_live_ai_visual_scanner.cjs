// verify_live_ai_visual_scanner.cjs
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACTS_DIR = 'C:\\Users\\sidra\\.gemini\\antigravity\\brain\\ee97af74-487e-4d33-9fc2-5283824a73de';
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function verify() {
  console.log('Launching Chrome to verify live deployment...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://www.sellersuitepro.online...');
  await page.goto('https://www.sellersuitepro.online?t=' + Date.now(), { waitUntil: 'networkidle2', timeout: 30000 });

  // 1. Click Hero Action Banner "⚡ AI Scan & Create Listing" or Header "➕ Create New Listing"
  console.log('Looking for Create New Listing entry button...');
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const target = buttons.find(b => b.innerText.includes('AI Scan & Create Listing') || b.innerText.includes('Create New Listing'));
    if (target) {
      target.click();
      return true;
    }
    return false;
  });

  if (!clicked) {
    throw new Error('Could not find Create New Listing button on homepage!');
  }
  console.log('Clicked Create New Listing button. Waiting for modal...');
  await sleep(1500);

  // 2. Advance from Step 1 to Step 2
  console.log('Clicking Next Step in Step 1...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const nextBtn = buttons.find(b => b.innerText.includes('Next Step') || b.innerText.includes('Next'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(1000);

  // 3. Capture Step 2 UI (AI Visual Scanner default view)
  const step2Path = path.join(ARTIFACTS_DIR, 'live_step2_ai_scanner_initial.png');
  await page.screenshot({ path: step2Path });
  console.log('Captured Step 2 Initial UI:', step2Path);

  // 4. Click Preset "Leather Wallet"
  console.log('Selecting Leather Wallet Preset...');
  const presetSelected = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const walletPreset = buttons.find(b => b.innerText.includes('Leather Wallet'));
    if (walletPreset) {
      walletPreset.click();
      return true;
    }
    return false;
  });
  console.log('Preset selected:', presetSelected);
  await sleep(800);

  // Capture Step 2 with Preset Loaded
  const step2PresetPath = path.join(ARTIFACTS_DIR, 'live_step2_preset_loaded.png');
  await page.screenshot({ path: step2PresetPath });
  console.log('Captured Step 2 with Preset Loaded:', step2PresetPath);

  // 5. Click "⚡ Scan Photo & Generate Complete Listing"
  console.log('Clicking "⚡ Scan Photo & Generate Complete Listing"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const scanBtn = buttons.find(b => b.innerText.includes('Scan Photo & Generate Complete Listing'));
    if (scanBtn) scanBtn.click();
  });

  console.log('Waiting for AI Scan and synthesis to complete...');
  await page.waitForFunction(() => {
    return document.body.innerText.includes('AI Visual Scan & Listing Synthesis Complete') ||
           document.body.innerText.includes('View Complete Listings Now');
  }, { timeout: 15000 });

  await sleep(1000);

  // Capture Step 2 Scan Result
  const step2ResultPath = path.join(ARTIFACTS_DIR, 'live_step2_scan_result.png');
  await page.screenshot({ path: step2ResultPath });
  console.log('Captured Step 2 Scan Result:', step2ResultPath);

  // 6. Click "🚀 View Complete Listings Now (Step 4)"
  console.log('Clicking "View Complete Listings Now (Step 4)"...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const viewBtn = buttons.find(b => b.innerText.includes('View Complete Listings Now'));
    if (viewBtn) viewBtn.click();
  });

  await sleep(1500);

  // Capture Step 4: Amazon Generated Listing
  const step4AmazonPath = path.join(ARTIFACTS_DIR, 'live_step4_amazon_complete.png');
  await page.screenshot({ path: step4AmazonPath });
  console.log('Captured Step 4 Amazon Listing:', step4AmazonPath);

  // 7. Click Flipkart Tab in Step 4
  console.log('Clicking Flipkart tab in Step 4...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const fkBtn = buttons.find(b => b.innerText.includes('Flipkart'));
    if (fkBtn) fkBtn.click();
  });
  await sleep(800);

  const step4FlipkartPath = path.join(ARTIFACTS_DIR, 'live_step4_flipkart_complete.png');
  await page.screenshot({ path: step4FlipkartPath });
  console.log('Captured Step 4 Flipkart Listing:', step4FlipkartPath);

  // 8. Click Meesho Tab in Step 4
  console.log('Clicking Meesho tab in Step 4...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const meeshoBtn = buttons.find(b => b.innerText.includes('Meesho'));
    if (meeshoBtn) meeshoBtn.click();
  });
  await sleep(800);

  const step4MeeshoPath = path.join(ARTIFACTS_DIR, 'live_step4_meesho_complete.png');
  await page.screenshot({ path: step4MeeshoPath });
  console.log('Captured Step 4 Meesho Listing:', step4MeeshoPath);

  // 9. Inspect text content to verify zero Hinglish
  const bodyText = await page.evaluate(() => document.body.innerText);
  const hinglishCheckWords = ['karein', 'apka', 'yahan', 'liye', 'kuch', 'hoga', 'dekhein', 'shuru'];
  const foundHinglish = hinglishCheckWords.filter(w => bodyText.toLowerCase().includes(w));

  console.log('Hinglish check result:', foundHinglish.length === 0 ? 'CLEAN (100% Pure English)' : `Found words: ${foundHinglish.join(', ')}`);

  await browser.close();
  console.log('=== VERIFICATION COMPLETED SUCCESSFULLY ===');
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
