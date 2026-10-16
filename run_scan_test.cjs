const puppeteer = require('puppeteer-core');

async function main() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));

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

  // Select category 'Digital Creator / Content Creator'
  await page.evaluate(() => {
    const categoryBtn = Array.from(document.querySelectorAll('button, div')).find(e => e.innerText && e.innerText.includes('Software Company'));
    if (categoryBtn) categoryBtn.click();
  });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('div, button, li')).find(e => e.innerText && e.innerText.includes('Digital Creator / Content Creator'));
    if (item) item.click();
  });
  await new Promise(r => setTimeout(r, 500));

  // Find input field
  const inputs = await page.$$('input');
  let targetInput = null;
  for (const inp of inputs) {
    const ph = await page.evaluate(el => el.placeholder, inp);
    if (ph && (ph.includes('username') || ph.includes('handle'))) {
      targetInput = inp;
      break;
    }
  }

  if (!targetInput) {
    console.error('Target input not found!');
    await browser.close();
    return;
  }

  await targetInput.click({ clickCount: 3 });
  await page.keyboard.press('Backspace');
  await targetInput.type('famashhadii', { delay: 30 });
  console.log('Typed famashhadii successfully');

  // Find scan button
  const buttons = await page.$$('button');
  let scanBtn = null;
  for (const b of buttons) {
    const text = await page.evaluate(el => el.innerText, b);
    if (text && (text.includes('AI Scan') || text.includes('Deep Audit'))) {
      scanBtn = b;
      break;
    }
  }

  if (!scanBtn) {
    console.error('Scan button not found!');
    await browser.close();
    return;
  }

  console.log('Clicking scan button...');
  await scanBtn.click();

  for (let i = 1; i <= 12; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const info = await page.evaluate(() => {
      const isSpinning = document.querySelector('.spin') !== null;
      const progressText = Array.from(document.querySelectorAll('div, span')).map(e => e.innerText).find(t => t && t.includes('Calculating Dead Follower'));
      const hasResults = Array.from(document.querySelectorAll('h1, h2, h3, div')).some(e => e.innerText && e.innerText.includes('Follower Health & Organic Ratio'));
      return { isSpinning, progressText: !!progressText, hasResults };
    });
    console.log(`Sec ${i}:`, JSON.stringify(info));
    if (info.hasResults) {
      console.log('Results loaded successfully!');
      break;
    }
  }

  await page.screenshot({ path: 'live_scan_execution_final.png' });
  await browser.close();
}

main().catch(console.error);
