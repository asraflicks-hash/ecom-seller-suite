// test_digital_variants.cjs
const variants = [
  'digital-web.in',
  'digital_web.in',
  'digitalweb.in',
  'digital_web_in',
  'digitalweb_in',
  'digital.web.in',
  'digitalweb'
];

async function check() {
  for (const h of variants) {
    try {
      const res = await fetch(`https://www.instagram.com/${h}/`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        }
      });
      const html = await res.text();
      const metaDesc = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i) ||
                       html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
      const ogImg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
      
      console.log(`\nHandle: ${h} => Status ${res.status}`);
      if (metaDesc) console.log(`  Desc: ${metaDesc[1]}`);
      else console.log('  No meta description');
      if (ogImg) console.log(`  Img: ${ogImg[1].slice(0, 80)}...`);
    } catch (e) {
      console.log(`Handle ${h} error:`, e.message);
    }
  }
}
check();
