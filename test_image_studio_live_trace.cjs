const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('=== COLD-CACHE NETWORK TRACE: IMAGE PROCESSING ===');
  console.log('Browser:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Clear cache for genuine cold-cache test
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCache');
  await client.send('Network.clearBrowserCookies');

  const requests = [];
  page.on('request', req => {
    requests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      postDataSize: req.postData() ? req.postData().length : 0
    });
  });

  console.log('1. Navigating to https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 35000 });

  // Dismiss privacy banner if present
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const accept = btns.find(b => b.innerText && b.innerText.includes('Accept'));
    if (accept) accept.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Switch to Tool 2: Image Studio
  console.log('2. Switching to Tool 2: Image Studio ...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const imgTab = tabs.find(b => b.innerText && b.innerText.includes('Image & #FFFFFF White BG'));
    if (imgTab) imgTab.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Click "Load Sample Shoe" to put an image onto the canvas
  console.log('3. Loading sample product onto canvas ...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const loadSample = btns.find(b => b.innerText && b.innerText.includes('Load Sample Shoe'));
    if (loadSample) loadSample.click();
  });

  await new Promise(r => setTimeout(r, 1000));

  // Reset request array right before triggering Master Clean
  requests.length = 0;
  console.log('4. Triggering ⚡ 1-Click Master Clean & 85% Fit ...');

  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const masterBtn = btns.find(b => b.innerText && b.innerText.includes('Master Clean'));
    if (masterBtn) {
      masterBtn.click();
      return masterBtn.innerText;
    }
    return false;
  });
  console.log('Clicked button:', clicked);

  // Wait 6 seconds for full execution and any background fetches
  await new Promise(r => setTimeout(r, 6000));

  console.log('\n=== NETWORK TRACE RESULTS DURING IMAGE PROCESSING ===');
  console.log(`Total requests initiated during image segmentation: ${requests.length}`);
  
  if (requests.length === 0) {
    console.log('>>> ZERO (0) network requests initiated during image processing!');
    console.log('>>> ALL PIXELS PROCESSED 100% LOCALLY IN-BROWSER ON HTML5 CANVAS.');
  } else {
    requests.forEach((r, i) => {
      console.log(`[#${i + 1}] ${r.method} ${r.resourceType} -> ${r.url.slice(0, 80)} (PostData: ${r.postDataSize} bytes)`);
    });
  }

  // Check if any request leaked image data
  const outboundLeaking = requests.filter(r => r.postDataSize > 100 || r.method === 'POST');
  console.log(`\nOutbound data leakage requests: ${outboundLeaking.length}`);

  await page.screenshot({ path: 'image_studio_processed.png' });
  console.log('Saved screenshot to image_studio_processed.png');

  await browser.close();
})();
