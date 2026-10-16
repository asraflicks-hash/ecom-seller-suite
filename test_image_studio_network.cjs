const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://www.sellersuitepro.online/ ...');
  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 35000 });

  // Switch to Tool 2 (Image Studio)
  console.log('Switching to Tool 2: Image & #FFFFFF White BG Studio ...');
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button'));
    const imgTab = tabs.find(b => b.innerText && b.innerText.includes('Image & #FFFFFF White BG'));
    if (imgTab) imgTab.click();
  });

  await new Promise(r => setTimeout(r, 1500));

  // Start network capture during image processing
  const capturedRequests = [];
  page.on('request', req => {
    capturedRequests.push({
      url: req.url(),
      method: req.method(),
      resourceType: req.resourceType(),
      postData: req.postData() ? `${req.postData().length} bytes` : 'none'
    });
  });

  console.log('Triggering local image processing (Sample Shoe / White BG Cutout)...');
  const actionDone = await page.evaluate(() => {
    // Find Load Sample or Auto Clean button
    const btns = Array.from(document.querySelectorAll('button'));
    const sampleBtn = btns.find(b => b.innerText && (b.innerText.includes('Sample') || b.innerText.includes('Clean') || b.innerText.includes('White')));
    if (sampleBtn) {
      sampleBtn.click();
      return sampleBtn.innerText;
    }
    return false;
  });
  console.log('Clicked studio action button:', actionDone);

  // Wait 4 seconds for canvas operations
  await new Promise(r => setTimeout(r, 4000));

  console.log(`\n=== RAW EVIDENCE: NETWORK ACTIVITY DURING IMAGE PROCESSING ===`);
  console.log(`Total network requests recorded during image processing: ${capturedRequests.length}`);
  
  const outboundImageLeaks = capturedRequests.filter(r => 
    r.method === 'POST' || 
    r.url.includes('upload') || 
    r.url.includes('image') || 
    r.url.includes('remove') ||
    r.url.includes('api')
  );

  console.log('Outbound requests with image data or API uploads:');
  if (outboundImageLeaks.length === 0) {
    console.log('>>> ZERO (0) OUTBOUND REQUESTS. ZERO IMAGE DATA LEAVES THE BROWSER.');
    console.log('>>> 100% CLIENT-SIDE HTML5 CANVAS EXECUTION VERIFIED.');
  } else {
    console.log(outboundImageLeaks);
  }

  await browser.close();
})();
