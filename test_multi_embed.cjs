// test_multi_embed.cjs
const handles = [
  'digital_web.in',
  'zshuja_313',
  'sidramotion',
  'virat.kohli',
  'nike',
  'apple',
  'nasa',
  'cristiano',
  'leomessi',
  'flipkart',
  'google'
];

async function testHandle(h) {
  try {
    const res = await fetch(`https://www.instagram.com/${h}/embed/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const text = await res.text();
    
    // Regex allowing optional backslashes before quotes
    const followers = text.match(/\\?"followers_count\\?":\s*([0-9]+)/);
    const posts = text.match(/\\?"posts_count\\?":\s*([0-9]+)/);
    const name = text.match(/\\?"full_name\\?":\s*\\?"([^\\"]+)\\?"/);
    const pic = text.match(/\\?"profile_pic_url\\?":\s*\\?"([^"]+?)\\?"/);
    const verified = text.match(/\\?"is_verified\\?":\s*(true|false)/);
    const bioMatch = text.match(/\\?"biography\\?":\s*\\?"([^"]+?)\\?"/);

    let cleanPic = pic ? pic[1].replace(/\\([\\\/])/g, '$1').replace(/\\u0026/g, '&') : null;

    console.log(h, '->', {
      status: res.status,
      followers: followers ? Number(followers[1]) : 'NOT FOUND',
      posts: posts ? Number(posts[1]) : 'NOT FOUND',
      name: name ? name[1] : 'NOT FOUND',
      pic: cleanPic ? cleanPic.slice(0, 60) + '...' : 'NOT FOUND',
      verified: verified ? verified[1] === 'true' : false
    });
  } catch (e) {
    console.log(h, 'ERROR:', e.message);
  }
}

async function run() {
  for (const h of handles) {
    await testHandle(h);
  }
}
run();
