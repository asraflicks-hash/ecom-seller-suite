// test_embed.cjs
async function test() {
  const handle = 'digital_web.in';
  const res = await fetch(`https://www.instagram.com/${handle}/embed/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  console.log('Embed status:', res.status);
  const text = await res.text();
  console.log('Embed length:', text.length);
  const title = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Embed title:', title ? title[1] : 'none');
  const img = text.match(/<img[^>]+src="([^">]+)"[^>]*>/gi);
  console.log('Images found:', img ? img.slice(0, 3) : 'none');
}
test();
