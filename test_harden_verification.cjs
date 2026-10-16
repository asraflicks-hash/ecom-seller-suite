const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({ 
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  console.log('Navigating to https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 35000 });

  console.log('Page Title:', await page.title());

  await page.screenshot({ path: 'live_harden_check1.png' });
  console.log('Captured live_harden_check1.png');

  // Check if privacy banner exists
  const bannerText = await page.evaluate(() => {
    const el = Array.from(document.querySelectorAll('div')).find(d => 
      d.innerText && d.innerText.includes('Privacy Notice') && d.innerText.includes('DPDP Act')
    );
    return el ? el.innerText.substring(0, 150) : null;
  });
  console.log('Consent banner found:', bannerText ? 'YES' : 'NO');
  if (bannerText) console.log('Banner text preview:', bannerText);

  // Check footer buttons
  const footerLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('footer button')).map(b => b.innerText);
  });
  console.log('Footer buttons:', footerLinks);

  // Click Privacy Policy button in footer
  const clicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('footer button'));
    const privBtn = btns.find(b => b.innerText.includes('Privacy Policy'));
    if (privBtn) {
      privBtn.click();
      return true;
    }
    return false;
  });
  console.log('Clicked Privacy Policy button:', clicked);

  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'live_privacy_modal_open.png' });
  console.log('Captured live_privacy_modal_open.png');

  const modalHeadings = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h3')).map(h => h.innerText);
  });
  console.log('Modal headings on screen:', modalHeadings);

  // Check tabs inside the modal
  const modalTabs = await page.evaluate(() => {
    const tabBtns = Array.from(document.querySelectorAll('button')).filter(b => 
      ['Privacy Policy (DPDP)', 'Terms of Use', 'Marketplace Disclaimer', 'Right to Erasure', 'Grievance Officer'].some(t => b.innerText && b.innerText.includes(t))
    );
    return tabBtns.map(b => b.innerText);
  });
  console.log('Legal modal tabs available:', modalTabs);

  console.log('Browser errors logged:', errors.filter(e => !e.includes('favicon')));
  await browser.close();
})();
