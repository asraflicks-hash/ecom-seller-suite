// test_scrape_instagram.cjs
const https = require('https');

async function testFetch(url, headers = {}) {
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(6000) });
    console.log(`[${res.status}] ${url}`);
    const text = await res.text();
    return { status: res.status, text };
  } catch (err) {
    console.log(`[ERR] ${url}: ${err.message}`);
    return null;
  }
}

async function run() {
  const handle = 'digital-web.in';
  console.log('Testing handle:', handle);

  // 1. Instagram Web API
  console.log('\n--- 1. Instagram API ---');
  await testFetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${handle}`, {
    'x-ig-app-id': '936619743392459',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Sec-Fetch-Site': 'same-origin'
  });

  // 2. Googlebot User Agent to instagram.com
  console.log('\n--- 2. Googlebot UA to instagram.com ---');
  const res2 = await testFetch(`https://www.instagram.com/${handle}/`, {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  });
  if (res2 && res2.text) {
    console.log('Length:', res2.text.length);
    const meta = res2.text.match(/<meta[^>]+>/g) || [];
    console.log('Meta tags:', meta.filter(m => m.includes('description') || m.includes('og:image') || m.includes('og:title')));
  }

  // 3. Instagram Public Web Viewers / Mirrors:
  // e.g. Picnob / Dumpor, Imginn, StoriesIG, GreatFon
  console.log('\n--- 3. Public Web Viewers ---');
  await testFetch(`https://www.picnob.com/profile/${handle}/`, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  await testFetch(`https://imginn.com/${handle}/`, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
  await testFetch(`https://greatfon.io/v/${handle}`, {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });
}

run();
