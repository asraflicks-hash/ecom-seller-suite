// extract_embed_data.cjs
async function test() {
  const handle = 'digital_web.in';
  const res = await fetch(`https://www.instagram.com/${handle}/embed/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  
  // Find profile_pic occurrences
  let idx = 0;
  while ((idx = text.indexOf('profile_pic', idx)) !== -1) {
    console.log('\n--- profile_pic match ---');
    console.log(text.slice(Math.max(0, idx - 50), idx + 250));
    idx += 11;
  }

  // Find followers occurrences
  idx = 0;
  while ((idx = text.indexOf('follower', idx)) !== -1) {
    console.log('\n--- follower match ---');
    console.log(text.slice(Math.max(0, idx - 50), idx + 150));
    idx += 8;
  }
}
test();
