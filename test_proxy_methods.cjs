// test_proxy_methods.cjs
async function testProxies() {
  const handle = 'digital_web.in';
  console.log('Testing handle:', handle);

  // 1. Jina AI Reader
  console.log('\n--- 1. Jina AI Reader ---');
  try {
    const res = await fetch(`https://r.jina.ai/https://www.instagram.com/${handle}/`, {
      headers: {
        'Accept': 'text/plain',
        'X-No-Cache': 'true'
      },
      signal: AbortSignal.timeout(10000)
    });
    console.log('Jina status:', res.status);
    const text = await res.text();
    console.log('Jina text snippet (first 600 chars):\n', text.slice(0, 600));
  } catch (e) {
    console.log('Jina error:', e.message);
  }

  // 2. Picuki
  console.log('\n--- 2. Picuki ---');
  try {
    const res = await fetch(`https://www.picuki.com/profile/${handle}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });
    console.log('Picuki status:', res.status);
    const html = await res.text();
    console.log('Picuki html len:', html.length);
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    console.log('Picuki title:', titleMatch ? titleMatch[1] : 'none');
    const followers = html.match(/class="followed_by"[^>]*>([^<]+)/i) || html.match(/([0-9,KMkm\.]+)\s*followers/i);
    console.log('Picuki followers:', followers ? followers[1] : 'none');
    const avatar = html.match(/class="profile-avatar"[^>]*src="([^"]+)"/i) || html.match(/<img[^>]*class="[^"]*avatar[^"]*"[^>]*src="([^"]+)"/i);
    console.log('Picuki avatar:', avatar ? avatar[1] : 'none');
  } catch (e) {
    console.log('Picuki error:', e.message);
  }

  // 3. AllOrigins Proxy to Instagram
  console.log('\n--- 3. AllOrigins Proxy ---');
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.instagram.com/${handle}/`)}`, {
      signal: AbortSignal.timeout(8000)
    });
    console.log('AllOrigins status:', res.status);
    const html = await res.text();
    console.log('AllOrigins html len:', html.length);
    const meta = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
    console.log('AllOrigins meta:', meta ? meta[1] : 'none');
  } catch (e) {
    console.log('AllOrigins error:', e.message);
  }
}

testProxies();
