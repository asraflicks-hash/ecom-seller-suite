// api/avatar-proxy.js - Secure Edge Image Proxy for Social Profile Avatars
// Safely proxies profile photos from social CDNs (Instagram, Facebook, Google, YouTube, Twitter)
// avoiding browser hotlink blocks, CORS issues, and missing Referer errors.

export default async function handler(req, res) {
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://www.sellersuitepro.online',
    'https://sellersuitepro.online',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.sellersuitepro.online');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.query.url;
  if (!rawUrl || typeof rawUrl !== 'string') {
    return res.status(400).send('Missing url parameter');
  }

  let targetUrl;
  try {
    targetUrl = new URL(rawUrl);
  } catch (e) {
    return res.status(400).send('Invalid url parameter');
  }

  // Security allowlist: only proxy allowed social CDN domains
  const allowedHosts = [
    'cdninstagram.com',
    'fbcdn.net',
    'instagram.com',
    'googleusercontent.com',
    'ggpht.com',
    'yt3.ggpht.com',
    'twimg.com',
    'licdn.com',
    'dicebear.com'
  ];

  const host = targetUrl.hostname.toLowerCase();
  const isAllowed = allowedHosts.some(allowed => host === allowed || host.endsWith('.' + allowed));

  if (!isAllowed) {
    return res.status(403).send('Forbidden: host not in allowed proxy list');
  }

  try {
    const upstreamRes = await fetch(targetUrl.href, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(7000)
    });

    if (!upstreamRes.ok) {
      return res.status(upstreamRes.status).send('Upstream image error');
    }

    const contentType = upstreamRes.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await upstreamRes.arrayBuffer());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800');

    return res.status(200).send(buffer);
  } catch (err) {
    console.error('Avatar proxy error:', err.message);
    return res.status(502).send('Error fetching upstream avatar');
  }
}
