const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

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
    await new Promise(r => setTimeout(r, 2000));

    // Evaluate all elements with text "Create New Listing"
    const elements = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('button, div[role="button"]'));
      return all
        .filter(el => el.innerText && el.innerText.includes('Create New Listing'))
        .map(el => ({ tag: el.tagName, text: el.innerText.trim().replace(/\n/g, ' ') }));
    });
    console.log('Elements matching "Create New Listing":', elements);

    // Click specifically the navigation tab button "Create New Listing"
    console.log('Clicking the flagship navigation tab button...');
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const target = btns.find(b => b.innerText && b.innerText.includes('Create New Listing') && b.innerText.includes('AI WIZARD'));
      if (target) {
        target.click();
        return true;
      }
      // fallback to any button
      const fallback = btns.find(b => b.innerText && b.innerText.includes('Create New Listing'));
      if (fallback) {
        fallback.click();
        return true;
      }
      return false;
    });

    console.log('Clicked target:', clicked);
    await new Promise(r => setTimeout(r, 1500));

    await page.screenshot({ path: 'live_wizard_modal_opened.png', fullPage: false });
    console.log('Saved live_wizard_modal_opened.png');

    // Check modal contents
    const modalInfo = await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('h2, h3, h4')).map(h => h.innerText);
      const visibleTexts = Array.from(document.querySelectorAll('span, p, button')).map(el => el.innerText).filter(t => t && t.length > 3);
      return {
        headings,
        sampleTexts: visibleTexts.slice(0, 30)
      };
    });

    console.log('Headings currently visible:', modalInfo.headings);
    console.log('Sample texts:', modalInfo.sampleTexts);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await browser.close();
  }
})();
