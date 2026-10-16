const puppeteer = require('puppeteer-core');

async function testMobileInteractions() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });

  await page.goto('https://www.sellersuitepro.online/', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Click Menu button
  console.log('Testing Menu button in mobile header...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.innerText && b.innerText.includes('Menu'));
    if (menuBtn) menuBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: 'mobile_menu_drawer_open.png' });

  // Close menu drawer
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const closeBtn = btns.find(b => b.innerText && b.innerText.includes('Close') || b.querySelector('svg'));
    // Or tap top-right X
    const allButtons = document.querySelectorAll('button');
    for (let b of allButtons) {
      if (b.innerText === '✕' || b.getAttribute('aria-label') === 'Close' || (b.innerHTML && b.innerHTML.includes('lucide-x'))) {
        b.click();
        break;
      }
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 2. Click Alerts (5) in mobile active hero row
  console.log('Testing Alerts (5) button in mobile hero row...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const alertBtn = btns.find(b => b.innerText && b.innerText.includes('Alerts (5)'));
    if (alertBtn) alertBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'mobile_alerts_modal_open.png' });

  console.log('Mobile tests completed!');
  await browser.close();
}

testMobileInteractions().catch(console.error);
