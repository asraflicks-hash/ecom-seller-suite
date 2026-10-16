const puppeteer = require('puppeteer-core');

async function verifyLivePrivacy() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));

  console.log('Navigating to live production https://www.sellersuitepro.online ...');
  await page.goto('https://www.sellersuitepro.online', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Click Login
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginBtn = buttons.find(b => b.innerText.trim() === 'Login');
    if (loginBtn) loginBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: 'live_private_login.png' });

  // Check login modal contents
  const loginAudit = await page.evaluate(() => {
    const text = document.body.innerText;
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return {
      hasApiKeyButton: buttons.some(b => b.includes('Project API Keys') || b.includes('Hide Config')),
      hasGoogleButton: buttons.some(b => b.includes('Google')),
      hasDisconnectButton: buttons.some(b => b.includes('Disconnect')),
      hasProjectUrlExposed: text.includes('kitjqhhbsqusqmofabzq'),
      hasSqlExposed: text.includes('PostgreSQL Database Schema') || text.includes('CREATE TABLE public.profiles')
    };
  });
  console.log('Login Privacy Audit:', loginAudit);

  // 2. Click Register Account
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const regBtn = buttons.find(b => b.innerText.includes('Register Account'));
    if (regBtn) regBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({ path: 'live_private_signup.png' });

  const signupAudit = await page.evaluate(() => {
    const text = document.body.innerText;
    const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
    return {
      hasGoogleButton: buttons.some(b => b.includes('Google')),
      hasApiKeyButton: buttons.some(b => b.includes('Project API Keys')),
      hasProjectUrlExposed: text.includes('kitjqhhbsqusqmofabzq')
    };
  });
  console.log('Signup Privacy Audit:', signupAudit);

  // 3. Test real login with the confirmed account
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const loginTab = buttons.find(b => b.innerText.trim() === 'Sign In');
    if (loginTab) loginTab.click();
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('Testing live login with confirmed account...');
  await page.type('input[placeholder="seller@example.com"]', 'seller.suite.test99@gmail.com', { delay: 20 });
  await page.type('input[placeholder="••••••••"]', 'Password99@Secure2026', { delay: 20 });
  await new Promise(r => setTimeout(r, 500));

  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const submitBtn = buttons.find(b => b.innerText.includes('Sign In to Workstation'));
    if (submitBtn) submitBtn.click();
  });

  await new Promise(r => setTimeout(r, 3500));

  await page.screenshot({ path: 'live_private_logged_in.png' });

  const finalCheck = await page.evaluate(() => {
    const headerText = document.querySelector('header')?.innerText || document.body.innerText.substring(0, 500);
    return {
      storageUser: localStorage.getItem('sidra_user_email'),
      storageAuth: localStorage.getItem('sidra_auth_unlocked'),
      storageAuthType: localStorage.getItem('sidra_auth_type'),
      headerContainsUser: headerText.includes('seller.suite.test99')
    };
  });

  console.log('Final Live Verified Result:', finalCheck);

  await browser.close();
}

verifyLivePrivacy().catch(console.error);
