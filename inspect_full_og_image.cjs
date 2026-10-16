// inspect_full_og_image.cjs
async function test() {
  const res = await fetch(`https://www.instagram.com/digital_web.in/`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
  });
  const html = await res.text();
  const ogImg = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
  if (!ogImg) {
    console.log('No og:image found');
    return;
  }
  const rawUrl = ogImg[1];
  const cleanUrl = rawUrl.replace(/&amp;/g, '&');
  console.log('Clean URL:', cleanUrl);

  const imgRes = await fetch(cleanUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
  });
  console.log('Image fetch status:', imgRes.status);
  console.log('Content-Type:', imgRes.headers.get('content-type'));
  console.log('Content-Length:', imgRes.headers.get('content-length'));
}
test();
