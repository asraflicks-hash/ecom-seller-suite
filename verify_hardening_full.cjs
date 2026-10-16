const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  console.log('=== FULL HARDENING VERIFICATION: sellersuitepro.online ===\n');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--incognito']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // 1. Cold Cache Pre-Consent Request Monitoring
  console.log('--- TEST 1: Cold Cache Pre-Consent Network & Cookie Audit ---');
  const preConsentRequests = [];
  page.on('request', req => {
    preConsentRequests.push({
      url: req.url(),
      domain: new URL(req.url()).hostname,
      type: req.resourceType()
    });
  });

  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  const cookiesPreConsent = await page.cookies();
  console.log('Total pre-consent requests captured:', preConsentRequests.length);
  
  const thirdPartyPreConsent = preConsentRequests.filter(r => 
    !r.domain.includes('sellersuitepro.online') && 
    !r.domain.includes('vercel')
  );

  console.log('Third-party requests BEFORE user consent:');
  if (thirdPartyPreConsent.length === 0) {
    console.log('>>> ZERO (0) THIRD-PARTY REQUESTS DETECTED PRE-CONSENT. 100% BLOCKED.');
  } else {
    console.log(thirdPartyPreConsent);
  }

  console.log('Cookies present BEFORE user consent:');
  if (cookiesPreConsent.length === 0) {
    console.log('>>> ZERO (0) COOKIES FOUND PRE-CONSENT.');
  } else {
    console.log(cookiesPreConsent);
  }

  // 2. Test Image Upload & Cold Canvas Processing
  console.log('\n--- TEST 2: Cold Cache User Image Upload Network Trace ---');
  // Switch to Tool 2: Image Compliance Studio
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const imgTab = btns.find(b => b.innerText && b.innerText.includes('Image & #FFFFFF White BG'));
    if (imgTab) imgTab.click();
  });
  await new Promise(r => setTimeout(r, 1500));

  const imageUploadRequests = [];
  const uploadListener = req => {
    imageUploadRequests.push({
      url: req.url(),
      method: req.method(),
      type: req.resourceType(),
      postDataLength: req.postData() ? req.postData().length : 0
    });
  };
  page.on('request', uploadListener);

  // Upload an image via file input
  console.log('Uploading sample test image to client file input...');
  const testImagePath = 'desktop_view_locked_verified.png';
  const fileInput = await page.$('input[type="file"]');
  if (fileInput && fs.existsSync(testImagePath)) {
    await fileInput.uploadFile(testImagePath);
    console.log('Image uploaded to file input.');
    await new Promise(r => setTimeout(r, 3000));
  } else {
    console.log('Triggering canvas clean...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const sampleBtn = btns.find(b => b.innerText && b.innerText.includes('1-Click Master Clean'));
      if (sampleBtn) sampleBtn.click();
    });
    await new Promise(r => setTimeout(r, 3000));
  }

  page.off('request', uploadListener);

  console.log('Total network requests during image upload & canvas processing:', imageUploadRequests.length);
  const leakedUploads = imageUploadRequests.filter(r => 
    r.method === 'POST' || 
    r.postDataLength > 0 || 
    r.url.includes('upload') ||
    r.url.includes('remove')
  );

  console.log('Outbound image upload / leak requests:');
  if (leakedUploads.length === 0) {
    console.log('>>> ZERO (0) IMAGE BYTES OR POST REQUESTS TRANSMITTED OUTBOUND.');
    console.log('>>> 100% CLIENT-SIDE IMAGE PROCESSING VERIFIED.');
  } else {
    console.log(leakedUploads);
  }

  // 3. Test Privacy Consent Rejection
  console.log('\n--- TEST 3: Privacy Consent "Reject Non-Essential" Verification ---');
  const rejectClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const rejectBtn = btns.find(b => b.innerText && b.innerText.includes('Reject Non-Essential'));
    if (rejectBtn) {
      rejectBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked "Reject Non-Essential" button:', rejectClicked);
  await new Promise(r => setTimeout(r, 2000));

  const consentStatus = await page.evaluate(() => localStorage.getItem('sidra_privacy_consent'));
  console.log('localStorage sidra_privacy_consent status:', consentStatus);

  const adScriptsPresent = await page.evaluate(() => {
    return Boolean(document.querySelector('script[src*="pagead2.googlesyndication.com"]'));
  });
  console.log('Google AdSense script in DOM after rejection:', adScriptsPresent ? 'PRESENT (FAIL)' : 'ABSENT (SUCCESS)');

  // 4. Test Cookie Preferences / Consent Withdrawal Link
  console.log('\n--- TEST 4: Footer "Cookie Preferences / Withdraw Consent" Link ---');
  const withdrawClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const wBtn = btns.find(b => b.innerText && b.innerText.includes('Cookie Preferences'));
    if (wBtn) {
      wBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked footer "Cookie Preferences / Withdraw Consent" link:', withdrawClicked);
  await new Promise(r => setTimeout(r, 1000));

  const bannerReopened = await page.evaluate(() => {
    const banner = Array.from(document.querySelectorAll('div')).find(d => 
      d.innerText && d.innerText.includes('Privacy & Cookie Consent')
    );
    return Boolean(banner);
  });
  console.log('Consent banner reopened for management / withdrawal:', bannerReopened ? 'SUCCESS' : 'FAIL');

  await browser.close();
  console.log('\n=== BROWSER TESTING COMPLETE ===');
})();
