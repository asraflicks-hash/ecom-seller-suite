// test_public_proxies.cjs
const target = 'https://www.instagram.com/digital_web.in/embed/';

async function testProxies() {
  const proxies = [
    `https://corsproxy.io/?url=${encodeURIComponent(target)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(target)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(target)}`,
    `https://thingproxy.freeboard.io/fetch/${target}`,
    `https://proxy.cors.sh/${target}`
  ];

  for (const p of proxies) {
    try {
      const res = await fetch(p, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        signal: AbortSignal.timeout(6000)
      });
      console.log(p.slice(0, 30), 'status:', res.status);
      if (res.ok) {
        const text = await res.text();
        const f = text.match(/followers_count[^\,]+/i);
        console.log('   Followers:', f ? f[0] : 'none', 'len:', text.length);
      }
    } catch (e) {
      console.log(p.slice(0, 30), 'error:', e.message);
    }
  }
}

testProxies();
