// test_search_engines.cjs
async function testSearchEngines() {
  const handle = 'digital_web.in';

  // 1. Bing
  try {
    const url = `https://www.bing.com/search?q=site%3Ainstagram.com%2F${handle}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
      }
    });
    console.log('Bing status:', res.status);
    const text = await res.text();
    const fMatch = text.match(/([0-9,KMkm\.]+)\s*followers/i);
    console.log('Bing followers:', fMatch ? fMatch[0] : 'none');
  } catch (e) {
    console.log('Bing error:', e.message);
  }

  // 2. Yahoo
  try {
    const url = `https://search.yahoo.com/search?p=site%3Ainstagram.com%2F${handle}`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log('Yahoo status:', res.status);
    const text = await res.text();
    const fMatch = text.match(/([0-9,KMkm\.]+)\s*followers/i);
    console.log('Yahoo followers:', fMatch ? fMatch[0] : 'none');
  } catch (e) {
    console.log('Yahoo error:', e.message);
  }

  // 3. DuckDuckGo API (instant answer)
  try {
    const url = `https://api.duckduckgo.com/?q=instagram+${handle}&format=json`;
    const res = await fetch(url);
    console.log('DDG API status:', res.status);
    const json = await res.json();
    console.log('DDG API Abstract:', json.AbstractText ? json.AbstractText.slice(0, 100) : 'none');
  } catch (e) {
    console.log('DDG API error:', e.message);
  }

  // 4. Instagram oEmbed (Official Meta endpoint)
  try {
    const url = `https://api.instagram.com/oembed/?url=https://www.instagram.com/${handle}/`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('Meta oEmbed status:', res.status);
    const json = await res.json();
    console.log('Meta oEmbed result:', json);
  } catch (e) {
    console.log('Meta oEmbed error:', e.message);
  }
}

testSearchEngines();
