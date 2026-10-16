// test_embed_iframe_headers.cjs
async function testIframeHeaders() {
  const url = 'https://www.instagram.com/digital_web.in/embed/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
      'Sec-Ch-Ua-Mobile': '?0',
      'Sec-Ch-Ua-Platform': '"Windows"',
      'Sec-Fetch-Dest': 'iframe',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'cross-site',
      'Referer': 'https://www.sellersuitepro.online/',
      'Upgrade-Insecure-Requests': '1'
    }
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Len:', text.length);
  const title = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', title ? title[1] : 'none');
  const fMatch = text.match(/\\?"followers_count\\?":\s*([0-9]+)/);
  console.log('Followers match:', fMatch ? fMatch[1] : 'none');
}

testIframeHeaders();
