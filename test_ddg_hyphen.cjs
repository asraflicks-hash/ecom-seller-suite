// test_ddg_hyphen.cjs
async function test() {
  const query1 = `site:instagram.com/digital-web.in`;
  const query2 = `site:instagram.com "digital-web.in"`;
  const query3 = `site:instagram.com digital_web.in`;
  const query4 = `instagram digital-web.in`;

  for (const q of [query1, query2, query3, query4]) {
    const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(q)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html'
      }
    });
    const html = await res.text();
    const hasFollowers = html.match(/([0-9,KMkm\.]+)\s*followers/i);
    const firstSnippet = html.match(/class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i);
    console.log(`\nQuery: [${q}] => Followers found:`, hasFollowers ? hasFollowers[1] : 'NONE');
    if (firstSnippet) console.log('  Snippet:', firstSnippet[1].replace(/<[^>]+>/g, '').trim().slice(0, 150));
  }
}
test();
