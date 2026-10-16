// test_ig_mobile_api.cjs
async function testMobile() {
  const handles = ['digital_web.in', 'nike', 'sidramotion', 'zshuja_313'];
  for (const handle of handles) {
    console.log(`\nTesting mobile API for: ${handle}`);
    
    // Test 1: i.instagram.com with mobile headers
    try {
      const res = await fetch(`https://i.instagram.com/api/v1/users/web_profile_info/?username=${handle}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 289.0.0.25.109',
          'x-ig-app-id': '936619743392459',
          'x-asbd-id': '198387',
          'accept': '*/*',
          'origin': 'https://www.instagram.com',
          'referer': `https://www.instagram.com/${handle}/`
        }
      });
      console.log('Mobile API status:', res.status);
      if (res.ok) {
        const json = await res.json();
        const user = json.data?.user;
        console.log('User found!:', {
          username: user?.username,
          full_name: user?.full_name,
          followers: user?.edge_followed_by?.count,
          following: user?.edge_follow?.count,
          posts: user?.edge_owner_to_timeline_media?.count,
          bio: user?.biography?.slice(0, 80),
          avatar: user?.profile_pic_url_hd || user?.profile_pic_url
        });
        continue;
      }
    } catch (e) {
      console.log('Mobile API error:', e.message);
    }

    // Test 2: corsproxy.io
    try {
      const target = `https://www.instagram.com/${handle}/`;
      const res2 = await fetch(`https://corsproxy.io/?${encodeURIComponent(target)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
      });
      console.log('corsproxy status:', res2.status);
      if (res2.ok) {
        const html = await res2.text();
        const metaDesc = html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i) ||
                         html.match(/<meta[^>]*property="og:description"[^>]*content="([^"]*)"/i);
        const ogImg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
        console.log('corsproxy metaDesc:', metaDesc ? metaDesc[1] : 'none');
        console.log('corsproxy ogImg:', ogImg ? ogImg[1].slice(0, 80) : 'none');
      }
    } catch (e) {
      console.log('corsproxy error:', e.message);
    }
  }
}
testMobile();
