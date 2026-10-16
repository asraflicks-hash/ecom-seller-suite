// test_search_providers.cjs
const handle = 'digital_web.in';

async function testAll() {
  const tests = [
    {
      name: 'Google',
      url: `https://www.google.com/search?q=site%3Ainstagram.com%2F${handle}`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36' }
    },
    {
      name: 'Brave',
      url: `https://search.brave.com/search?q=site%3Ainstagram.com%2F${handle}`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    },
    {
      name: 'Mojeek',
      url: `https://www.mojeek.com/search?q=site%3Ainstagram.com%2F${handle}`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    },
    {
      name: 'Qwant',
      url: `https://api.qwant.com/v3/search/web?q=site%3Ainstagram.com%2F${handle}&count=5&locale=en_US`,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    }
  ];

  for (const t of tests) {
    try {
      const res = await fetch(t.url, { headers: t.headers, signal: AbortSignal.timeout(6000) });
      console.log(`[${t.name}] Status:`, res.status);
      if (res.ok) {
        const text = await res.text();
        const fMatch = text.match(/([0-9,KMkm\.]+)\s*followers/i);
        console.log(`   Followers:`, fMatch ? fMatch[0] : 'none', 'len:', text.length);
      }
    } catch (e) {
      console.log(`[${t.name}] Error:`, e.message);
    }
  }
}

testAll();
