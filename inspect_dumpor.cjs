// inspect_dumpor.cjs
async function inspect() {
  const handle = 'digital_web.in';
  const url = `https://dumpor.io/v/${handle}`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  console.log('Dumpor length:', html.length);
  
  // Search for follower count, following, posts, avatar, bio, display name
  const metaDesc = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) ||
                   html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
  console.log('Meta description:', metaDesc ? metaDesc[1] : 'none');

  const ogImg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
                html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
  console.log('OG Image:', ogImg ? ogImg[1] : 'none');

  // Search for user stats in html
  const statsMatches = [...html.matchAll(/class="[^"]*(?:count|stat|number|follow|post|item)[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(Boolean);
  console.log('Stats matches snippet:', statsMatches.slice(0, 10));

  // Search for img tags in html
  const imgMatches = [...html.matchAll(/<img[^>]+src="([^">]+)"[^>]*>/gi)]
    .map(m => m[1])
    .filter(src => src.includes('cdn') || src.includes('profile') || src.includes('user') || src.includes('avatar'));
  console.log('Avatar/CDN image matches:', imgMatches.slice(0, 5));

  // Search for bio or name
  const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log('H1:', h1 ? h1[1].replace(/<[^>]+>/g, '').trim() : 'none');
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  console.log('H2:', h2 ? h2[1].replace(/<[^>]+>/g, '').trim() : 'none');
}
inspect();
