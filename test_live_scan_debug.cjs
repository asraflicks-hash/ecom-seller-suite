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
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('sidra_privacy_consent', 'true');
    localStorage.setItem('sidra_dpdp_notice_dismissed', 'true');
  });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Navigate to tab 'social-doctor'
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Social Doctor'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Enter handle 'famashhadii'
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input'));
    const handleInput = inputs.find(i => i.placeholder && i.placeholder.toLowerCase().includes('famashhadii') || (i.value === '' && i.type === 'text'));
    // Or find input next to "PROFILE HANDLE OR LINK"
    const labels = Array.from(document.querySelectorAll('label, div, span'));
    const label = labels.find(l => l.innerText && l.innerText.includes('PROFILE HANDLE'));
    let target = null;
    if (label && label.parentElement) {
      target = label.parentElement.querySelector('input');
    }
    if (!target) {
      target = inputs.find(i => i.placeholder && (i.placeholder.includes('mrbeast') || i.placeholder.includes('username') || i.placeholder.includes('handle')));
    }
    if (target) {
      console.log('Found input with placeholder:', target.placeholder);
      target.value = 'famashhadii';
      target.dispatchEvent(new Event('input', { bubbles: true }));
      target.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      console.log('No input found, inputs total:', inputs.length);
    }
  });

  // Click Scan button
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('AI Scan') || b.innerText.includes('Deep Audit'));
    if (btn) {
      console.log('Found scan button:', btn.innerText);
      btn.click();
    } else {
      console.log('Scan button not found');
    }
  });

  console.log('Clicked scan! Waiting for results or errors...');
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await page.evaluate(() => {
      const isScanning = document.querySelector('.spin') !== null;
      const progressText = Array.from(document.querySelectorAll('span, div')).map(e => e.innerText).find(t => t && t.includes('Calculating Dead Follower'));
      const hasResults = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(e => e.innerText && e.innerText.includes('Follower Health & Organic Ratio'));
      return { isScanning, progressText: !!progressText, hasResults };
    });
    console.log('Second', i + 1, status);
    if (status.hasResults) {
      console.log('SUCCESS! Results loaded on second', i + 1);
      break;
    }
  }

  await page.screenshot({ path: 'puppeteer_social_scan_result.png' });
  await browser.close();
}

testSocialScan().catch(console.error);
