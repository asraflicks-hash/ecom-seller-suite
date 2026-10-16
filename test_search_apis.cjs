// test_search_apis.cjs
async function testSearch() {
  const handle = 'digital_web.in';
  console.log(`Testing search endpoints for: ${handle}`);

  // 1. DuckDuckGo HTML
  console.log('\n--- 1. DuckDuckGo HTML ---');
  try {
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:instagram.com/${handle}`)}`;
    const res = await fetch(ddgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('DDG status:', res.status);
    const html = await res.text();
    console.log('DDG length:', html.length);
    const snippetMatch = html.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi);
    if (snippetMatch) {
      snippetMatch.slice(0, 3).forEach((s, i) => console.log(`Snippet[${i}]:`, s.replace(/<[^>]+>/g, '').trim()));
    } else {
      console.log('No snippets found');
    }
  } catch (e) {
    console.log('DDG error:', e.message);
  }

  // 2. Bing Web Search
  console.log('\n--- 2. Bing Search ---');
  try {
    const bingUrl = `https://www.bing.com/search?q=${encodeURIComponent(`site:instagram.com/${handle}`)}`;
    const res = await fetch(bingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('Bing status:', res.status);
    const html = await res.text();
    console.log('Bing length:', html.length);
    const captionMatch = html.match(/class="b_caption"[^>]*>([\s\S]*?)<\/div>/gi);
    if (captionMatch) {
      captionMatch.slice(0, 3).forEach((c, i) => console.log(`Bing Caption[${i}]:`, c.replace(/<[^>]+>/g, '').trim()));
    } else {
      console.log('No Bing captions found');
    }
  } catch (e) {
    console.log('Bing error:', e.message);
  }

  // 3. Yahoo Search
  console.log('\n--- 3. Yahoo Search ---');
  try {
    const yahooUrl = `https://search.yahoo.com/search?p=${encodeURIComponent(`site:instagram.com/${handle}`)}`;
    const res = await fetch(yahooUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    console.log('Yahoo status:', res.status);
    const html = await res.text();
    console.log('Yahoo length:', html.length);
    const compText = html.match(/class="compText[^"]*"[^>]*>([\s\S]*?)<\/div>/gi);
    if (compText) {
      compText.slice(0, 3).forEach((c, i) => console.log(`Yahoo CompText[${i}]:`, c.replace(/<[^>]+>/g, '').trim()));
    }
  } catch (e) {
    console.log('Yahoo error:', e.message);
  }
}

testSearch();
