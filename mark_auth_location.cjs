const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function highlightAuth() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 558 });

  const rawBuf = fs.readFileSync('C:/Users/sidra/.gemini/antigravity/brain/ee97af74-487e-4d33-9fc2-5283824a73de/.user_uploaded/media_1792090811102_6fbed122.png');
  const base64 = rawBuf.toString('base64');

  const html = `
  <!DOCTYPE html>
  <html>
  <body style="margin:0; padding:0; background:#000; overflow:hidden;">
    <div style="position:relative; width:1024px; height:558px;">
      <img src="data:image/png;base64,${base64}" style="width:1024px; height:558px; display:block;" />
      
      <!-- Red circle around Auth -->
      <div style="position:absolute; left:32px; top:316px; width:80px; height:24px; border:3px solid #ff0055; border-radius:8px; box-shadow:0 0 15px #ff0055, inset 0 0 10px rgba(255,0,85,0.3);"></div>
      
      <!-- Arrow pointing to Auth -->
      <div style="position:absolute; left:125px; top:310px; background:#ff0055; color:#ffffff; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-weight:800; font-size:14px; padding:6px 14px; border-radius:8px; box-shadow:0 4px 20px rgba(255,0,85,0.7); z-index:999; display:flex; align-items:center; gap:8px;">
        <span>👈 YEH RAHA "Auth" [BETA] (ISPAR CLICK KAREIN)</span>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(html);
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: 'C:/Users/sidra/.gemini/antigravity/brain/ee97af74-487e-4d33-9fc2-5283824a73de/auth_location_marked.png' });
  await browser.close();
  console.log('Marked screenshot created successfully!');
}

highlightAuth().catch(console.error);
