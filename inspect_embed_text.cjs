// inspect_embed_text.cjs
async function test() {
  const handle = 'digital_web.in';
  const res = await fetch(`https://www.instagram.com/${handle}/embed/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  console.log('Includes followers?', text.includes('followers') || text.includes('Followers'));
  console.log('Includes profile_pic?', text.includes('profile_pic'));
  console.log('Includes digital_web?', text.includes('digital_web'));
  
  // Search for JSON or script content
  const scripts = [...text.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  console.log('Scripts count:', scripts.length);
  for (const s of scripts) {
    if (s.includes('digital_web') || s.includes('profile') || s.includes('avatar') || s.includes('Followers')) {
      console.log('Relevant script snippet (300 chars):', s.slice(0, 300));
    }
  }
}
test();
