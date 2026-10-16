// test_real_ig_handles.cjs
const handles = ['zshuja_313', 'cristiano', 'nike', 'sidramotion'];

async function testHandle(handle) {
  console.log(`\n=== Testing ${handle} ===`);
  const uas = [
    { name: 'Googlebot', ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' },
    { name: 'Facebookbot', ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)' },
    { name: 'Twitterbot', ua: 'Twitterbot/1.0' },
    { name: 'WhatsApp', ua: 'WhatsApp/2.21.12.21 A' }
  ];

  for (const { name, ua } of uas) {
    try {
      const res = await fetch(`https://www.instagram.com/${handle}/`, {
        headers: {
          'User-Agent': ua,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9'
        }
      });
      const html = await res.text();
      const metaDesc = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i) ||
                       html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
      const ogImg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
                    html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
      
      console.log(`${name}: status=${res.status}, htmlLen=${html.length}`);
      if (metaDesc) console.log(`  Desc: ${metaDesc[1]}`);
      if (ogImg) console.log(`  Image: ${ogImg[1].slice(0, 100)}...`);
      if (metaDesc || ogImg) break;
    } catch (e) {
      console.log(`${name}: error=${e.message}`);
    }
  }
}

async function run() {
  for (const h of handles) {
    await testHandle(h);
  }
}
run();
