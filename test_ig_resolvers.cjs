// test_ig_resolvers.cjs
const handle = 'digital_web.in';

async function testAll() {
  // 1. Picuki
  try {
    const res = await fetch(`https://www.picuki.com/profile/${handle}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Picuki status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const fMatch = text.match(/([0-9,KMkm\.]+)\s*<span>followers/i) || text.match(/class="followed_by"[^>]*>([^<]+)/i);
      console.log('Picuki followers:', fMatch ? fMatch[1] : 'none');
    }
  } catch (e) {
    console.log('Picuki err:', e.message);
  }

  // 2. Pixwox / Dumpor
  try {
    const res = await fetch(`https://www.pixwox.com/profile/${handle}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Pixwox status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const fMatch = text.match(/([0-9,KMkm\.]+)\s*<span>Followers/i) || text.match(/name="description"[^>]*content="([^"]+)"/i);
      console.log('Pixwox followers:', fMatch ? fMatch[1] : 'none');
    }
  } catch (e) {
    console.log('Pixwox err:', e.message);
  }

  // 3. Imginn
  try {
    const res = await fetch(`https://imginn.com/${handle}/`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(6000)
    });
    console.log('Imginn status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const fMatch = text.match(/([0-9,KMkm\.]+)\s*Followers/i) || text.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
      console.log('Imginn followers:', fMatch ? fMatch[1] : 'none');
    }
  } catch (e) {
    console.log('Imginn err:', e.message);
  }

  // 4. AllOrigins proxy to Instagram embed
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.instagram.com/${handle}/embed/`)}`, {
      signal: AbortSignal.timeout(8000)
    });
    console.log('Allorigins status:', res.status);
    if (res.ok) {
      const json = await res.json();
      const fMatch = json.contents?.match(/"followers_count":\s*([0-9]+)/);
      console.log('Allorigins embed followers:', fMatch ? fMatch[1] : 'none');
    }
  } catch (e) {
    console.log('Allorigins err:', e.message);
  }

  // 5. CodeTabs proxy to Instagram embed
  try {
    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(`https://www.instagram.com/${handle}/embed/`)}`, {
      signal: AbortSignal.timeout(8000)
    });
    console.log('CodeTabs status:', res.status);
    if (res.ok) {
      const text = await res.text();
      const fMatch = text.match(/followers_count[^\,]+/i);
      console.log('CodeTabs embed followers:', fMatch ? fMatch[0] : 'none');
    }
  } catch (e) {
    console.log('CodeTabs err:', e.message);
  }
}

testAll();
