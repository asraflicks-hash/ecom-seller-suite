const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

  console.log('Using browser at:', executablePath);

  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    console.log('Navigating to live production URL...');
    await page.goto('https://www.sellersuitepro.online/?t=' + Date.now(), { waitUntil: 'networkidle2', timeout: 35000 });

    // Wait 2s for all animations and initial states
    await new Promise(r => setTimeout(r, 2000));

    // Screenshot homepage
    await page.screenshot({ path: 'live_prod_wizard_visible.png', fullPage: false });
    console.log('Saved live_prod_wizard_visible.png');

    // Find and click the "Create New Listing" button
    const buttons = await page.$$('button');
    let clicked = false;
    for (const btn of buttons) {
      const text = await page.evaluate(el => el.innerText, btn);
      if (text && text.includes('Create New Listing')) {
        console.log('Found button with text:', text.trim().replace(/\n/g, ' '));
        await btn.click();
        clicked = true;
        break;
      }
    }

    if (clicked) {
      await new Promise(r => setTimeout(r, 1500));
      await page.screenshot({ path: 'live_prod_modal_open_english.png', fullPage: false });
      console.log('Saved live_prod_modal_open_english.png');

      const modalText = await page.evaluate(() => {
        const modal = document.querySelector('div[role="dialog"]') || document.body;
        return modal.innerText;
      });

      console.log('--- MODAL TEXT SAMPLE ---');
      console.log(modalText.substring(0, 400));
    } else {
      console.log('Button not clicked, checking body text...');
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('Includes Create New Listing:', bodyText.includes('Create New Listing'));
    }

  } catch (err) {
    console.error('Error in verification:', err);
  } finally {
    await browser.close();
  }
})();
