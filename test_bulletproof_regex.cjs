// test_bulletproof_regex.cjs
async function test() {
  const res = await fetch('https://www.instagram.com/digital_web.in/embed/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const text = await res.text();

  const fMatch = text.match(/followers_count[^\d]+(\d+)/);
  const pMatch = text.match(/posts_count[^\d]+(\d+)/);
  const picMatch = text.match(/profile_pic_url[^\:]+:\s*\\*"([^"]+?)\\*"/);
  
  // Exclude full_name_heading_tag
  const nameMatch = text.match(/\\?"full_name\\?":\s*\\*"(.*?)(?<!\\\\)\\*"/);
  const verifiedMatch = text.match(/is_verified[^\:]+:\s*(true|false)/);

  let cleanPic = '';
  if (picMatch) {
    cleanPic = picMatch[1]
      .split('\\/').join('/')
      .replace(/\\u0026/g, '&')
      .replace(/\\u0025/g, '%')
      .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\\\/g, '');
  }

  let cleanName = '';
  if (nameMatch) {
    cleanName = nameMatch[1].split('\\/').join('/').replace(/\\\\/g, '');
  }

  console.log('Followers:', fMatch ? Number(fMatch[1]) : 'NOT FOUND');
  console.log('Posts:', pMatch ? Number(pMatch[1]) : 'NOT FOUND');
  console.log('Name:', cleanName || 'NOT FOUND');
  console.log('Pic:', cleanPic.slice(0, 70) + '...');
  console.log('Verified:', verifiedMatch ? verifiedMatch[1] === 'true' : false);
}
test();
