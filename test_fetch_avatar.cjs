// test_fetch_avatar.cjs
const fs = require('fs');

async function testFetchAvatar() {
  const res = await fetch('https://www.instagram.com/digital_web.in/embed/', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  
  // Find profile_pic_url
  const match = text.match(/profile_pic_url\\?":\s*\\?"([^"]+?)\\?"/);
  if (!match) {
    console.log('No profile_pic_url found');
    return;
  }
  
  let rawUrl = match[1];
  let cleanUrl = rawUrl
    .split('\\/').join('/')
    .replace(/\\u0026/g, '&')
    .replace(/\\u0025/g, '%')
    .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\\/g, '');

  console.log('Clean Unescaped URL:\n', cleanUrl);

  const imgRes = await fetch(cleanUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  });

  console.log('Image fetch response status:', imgRes.status);
  console.log('Content-Type:', imgRes.headers.get('content-type'));
  
  if (imgRes.ok) {
    const buffer = Buffer.from(await imgRes.arrayBuffer());
    console.log('Image size in bytes:', buffer.length);
    fs.writeFileSync('test_avatar_digital_web.jpg', buffer);
    console.log('SUCCESS! Real avatar image downloaded and saved to test_avatar_digital_web.jpg');
  } else {
    console.log('Failed with status:', imgRes.status);
  }
}

testFetchAvatar();
