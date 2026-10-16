const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const preConsentRequests = [];
  const postConsentRequests = [];
  let consentAccepted = false;

  page.on('request', req => {
    const url = req.url();
    const entry = { url, type: req.resourceType(), method: req.method() };
    if (!consentAccepted) {
      preConsentRequests.push(entry);
    } else {
      postConsentRequests.push(entry);
    }
  });

  console.log('--- STEP 1: NAVIGATING WITHOUT CONSENT (CLEAN STATE) ---');
  await page.goto('https://www.sellersuitepro.online/?_test=' + Date.now(), { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 4000));

  console.log(`\n=== RAW EVIDENCE: PRE-CONSENT NETWORK REQUESTS (${preConsentRequests.length} total) ===`);
  const adRequestsPre = preConsentRequests.filter(r => 
    r.url.includes('google') || r.url.includes('doubleclick') || r.url.includes('adtraffic') || r.url.includes('pagead')
  );
  console.log('AdSense / Third-Party Ad Requests BEFORE Consent:');
  console.log(adRequestsPre.length === 0 ? '>>> ZERO (0) AD REQUESTS FIRED. 100% BLOCKED BEFORE CONSENT.' : adRequestsPre);

  // List all distinct domains contacted pre-consent
  const preDomains = [...new Set(preConsentRequests.map(r => new URL(r.url).hostname))];
  console.log('All Hostnames contacted pre-consent:', preDomains);

  console.log('\n--- STEP 2: CLICKING "GOT IT & ACCEPT" ON PRIVACY BANNER ---');
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const acceptBtn = btns.find(b => b.innerText && b.innerText.includes('Got It & Accept'));
    if (acceptBtn) {
      acceptBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Got It & Accept":', clicked);

  consentAccepted = true;
  await new Promise(r => setTimeout(r, 4000));

  console.log(`\n=== RAW EVIDENCE: POST-CONSENT NETWORK REQUESTS (${postConsentRequests.length} total) ===`);
  const adRequestsPost = postConsentRequests.filter(r => 
    r.url.includes('google') || r.url.includes('doubleclick') || r.url.includes('adtraffic') || r.url.includes('pagead')
  );
  console.log('AdSense / Third-Party Ad Requests AFTER Consent:');
  if (adRequestsPost.length > 0) {
    console.log(`>>> ${adRequestsPost.length} requests dynamically loaded after explicit consent:`);
    adRequestsPost.slice(0, 10).forEach(r => console.log(`  [${r.type}] ${r.url.substring(0, 90)}...`));
  } else {
    console.log('No ad requests (or blocked by client config)');
  }

  await browser.close();
})();
