// inspect_ig_html.cjs
async function run() {
  const handle = 'digital-web.in';
  const res = await fetch(`https://www.instagram.com/${handle}/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
    }
  });
  const html = await res.text();
  console.log('HTML length:', html.length);
  
  // Search for follower count or bio or ld+json or profile_pic
  const ldJson = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  console.log('LD+JSON count:', ldJson ? ldJson.length : 0);
  if (ldJson) {
    ldJson.forEach((j, i) => console.log(`ld+json[${i}]:`, j.slice(0, 300)));
  }

  // Search for user data in scripts
  const scriptsWithUser = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)]
    .map(m => m[1])
    .filter(s => s.includes('profile_pic_url') || s.includes('edge_followed_by') || s.includes('follower_count') || s.includes('biography'));
  console.log('Scripts with user data:', scriptsWithUser.length);
  if (scriptsWithUser.length > 0) {
    console.log('First 500 chars of user script:', scriptsWithUser[0].slice(0, 500));
  }

  // Let's search for "digital-web" in html
  const idx = html.indexOf('digital-web');
  console.log('Index of digital-web in html:', idx);
  if (idx !== -1) {
    console.log('Snippet around digital-web:\n', html.slice(Math.max(0, idx - 100), idx + 300));
  }
}
run();
