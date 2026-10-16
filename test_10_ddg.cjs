// test_10_ddg.cjs
const handles = [
  'digital_web.in',
  'zshuja_313',
  'cristiano',
  'nike',
  'sidramotion',
  'apple',
  'leomessi',
  'taylorswift',
  'nasa',
  'virat.kohli'
];

async function run() {
  for (const h of handles) {
    try {
      const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(`site:instagram.com/${h}`)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'text/html'
        }
      });
      const html = await res.text();
      const fMatch = html.match(/([0-9,KMkm\.]+)\s*followers/i);
      const firstSnippet = html.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
      console.log(`[${fMatch ? 'OK' : 'FAIL'}] ${h} => Followers: ${fMatch ? fMatch[1] : 'N/A'}`);
      if (firstSnippet) {
        console.log('   Snippet:', firstSnippet[1].replace(/<[^>]+>/g, '').trim().slice(0, 100));
      }
    } catch (e) {
      console.log(`[ERR] ${h}: ${e.message}`);
    }
  }
}
run();
