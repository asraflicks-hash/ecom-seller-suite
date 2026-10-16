const puppeteer = require('puppeteer-core');

async function testLiveAuthModal() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // Find and click the Login or Sign Up button in header
  const clicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const authBtn = buttons.find(b => b.innerText.includes('Sign Up') || b.innerText.includes('Login'));
    if (authBtn) {
      authBtn.click();
      return authBtn.innerText;
    }
    return null;
  });

  console.log('Clicked button:', clicked);
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: 'live_auth_modal_open.png' });

  const modalInfo = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('div'));
    const modal = divs.find(d => d.innerText && (d.innerText.includes('Create Seller Account') || d.innerText.includes('Login to Seller Suite')));
    if (!modal) return { exists: false };
    const text = modal.innerText;
    const inputs = Array.from(modal.querySelectorAll('input')).map(i => ({
      type: i.type,
      placeholder: i.placeholder,
      name: i.name
    }));
    const buttons = Array.from(modal.querySelectorAll('button')).map(b => b.innerText.trim());
    return {
      exists: true,
      textContainsConnected: text.includes('Supabase Cloud Database Connected') || text.includes('Supabase Connected') || text.includes('kitjqhhbsqusqmofabzq'),
      inputs,
      buttons,
      modalTextSnippets: text.substring(0, 300)
    };
  });

  console.log('Modal Info on Live:', JSON.stringify(modalInfo, null, 2));

  await browser.close();
}

testLiveAuthModal().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
