// api/resolve-gmb.js - Hardened Serverless Resolver for Google Maps / GMB
// Protected with:
// 1. SSRF Guard (Whitelisted Google domains only, private IPs blocked)
// 2. IP Rate Limiting (30 reqs/min)
// 3. Input Sanitization & Max Length Limit (max 500 chars)
// 4. Same-Origin / Trusted Origin CORS enforcement

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestCounts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipRequestCounts.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
    ipRequestCounts.set(ip, record);
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  ipRequestCounts.set(ip, record);
  return true;
}

export default async function handler(req, res) {
  // 1. Origin verification
  const origin = req.headers.origin || '';
  const allowedOrigins = ['https://www.sellersuitepro.online', 'https://sellersuitepro.online', 'http://localhost:5173', 'http://localhost:3000'];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.sellersuitepro.online');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') return res.status(200).end();

  // 2. Rate Limiting by client IP
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || '127.0.0.1';
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Rate limit is 30 requests per minute.' });
  }

  const targetUrl = req.query.url;
  if (!targetUrl || typeof targetUrl !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid url parameter' });
  }

  // 3. Input size limit
  if (targetUrl.length > 500) {
    return res.status(400).json({ error: 'URL exceeds maximum length of 500 characters' });
  }

  try {
    let clean = targetUrl.trim();
    if (!/^https?:\/\//i.test(clean)) clean = 'https://' + clean;

    const parsed = new URL(clean);
    const host = parsed.hostname.toLowerCase();

    // 4. SSRF Defense: Allow ONLY legitimate Google Maps / GMB domain patterns
    const ALLOWED_GOOGLE_DOMAINS = [
      'google.com',
      'www.google.com',
      'google.co.in',
      'www.google.co.in',
      'maps.google.com',
      'maps.google.co.in',
      'maps.app.goo.gl',
      'goo.gl',
      'g.page',
      'share.google'
    ];

    const isAllowedHost = ALLOWED_GOOGLE_DOMAINS.some(d => host === d || host.endsWith('.' + d));
    const isPrivateIp = /^(localhost|127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|169\.254\.|::1|0\.0\.0\.0)/i.test(host);

    if (!isAllowedHost || isPrivateIp) {
      return res.status(403).json({ 
        error: 'Forbidden. This resolver exclusively processes verified Google Maps, GMB, or Google Places URLs.' 
      });
    }

    const response = await fetch(clean, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-IN,en-GB,en-US;q=0.9,hi;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });

    const finalUrl = response.url || clean;
    const html = await response.text();
    const isUnavailable = html.includes('Something went wrong') || 
                          html.includes('isn’t available') || 
                          html.includes('is not available') || 
                          html.includes('Dynamic Link Not Found') ||
                          response.status === 404;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';
    title = title.replace(/\s*-\s*Google\s*Maps$/i, '').trim();

    // Blacklist generic Google titles
    const GENERIC_GOOGLE_TITLES = [
      'google search',
      'google maps',
      'google',
      'before you continue to google',
      'google account',
      'share.google',
      'dynamic link not found',
      'error 404',
      'not found',
      'redirect'
    ];
    const isGenericTitle = !title || GENERIC_GOOGLE_TITLES.some(g => title.toLowerCase().trim() === g || title.toLowerCase().includes('google search'));

    let placeName = '';

    // 1. Extract from /place/ path
    const placeMatch = finalUrl.match(/\/place\/([^\/@?]+)/);
    if (placeMatch && placeMatch[1]) {
      placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ').trim();
    }

    // 2. Extract from /maps/search/ or query
    if (!placeName) {
      const qMatch = finalUrl.match(/[?&]q=([^&]+)/);
      if (qMatch && qMatch[1]) {
        const candidate = decodeURIComponent(qMatch[1]).replace(/\+/g, ' ').trim();
        if (!candidate.includes('http') && !candidate.includes('goo.gl')) {
          placeName = candidate;
        }
      }
    }

    // Extract coordinates if present
    let lat = null;
    let lng = null;
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      lat = coordMatch[1];
      lng = coordMatch[2];
    }

    return res.status(200).json({
      success: true,
      originalUrl: targetUrl,
      finalUrl,
      title: isGenericTitle ? '' : title,
      placeName,
      lat,
      lng,
      isUnavailable
    });
  } catch (err) {
    return res.status(500).json({ error: 'Unable to resolve target URL', details: err.message });
  }
}
