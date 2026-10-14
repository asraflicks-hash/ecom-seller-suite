export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    let clean = targetUrl.trim();
    if (!/^https?:\/\//i.test(clean)) clean = 'https://' + clean;

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

    // 2. Extract from URL query params (q, query, place)
    if (!placeName) {
      try {
        const u = new URL(finalUrl);
        const qParam = u.searchParams.get('q') || u.searchParams.get('query') || u.searchParams.get('place');
        if (qParam) {
          const decoded = decodeURIComponent(qParam).replace(/\+/g, ' ').trim();
          if (!decoded.toLowerCase().startsWith('loc:') && !decoded.toLowerCase().startsWith('near:')) {
            placeName = decoded;
          }
        }
      } catch (e) {}
    }

    // 3. Fallback to clean title ONLY if not generic
    if (!placeName && !isGenericTitle) {
      placeName = title;
    }

    // 4. Extract Geo Coordinates if present in URL (@lat,lng)
    let coordinates = null;
    const coordMatch = finalUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (coordMatch) {
      coordinates = {
        lat: coordMatch[1],
        lng: coordMatch[2]
      };
    }

    // 5. Special entity detection: Sidra Motion
    let verifiedEntity = null;
    const combinedStr = `${clean} ${finalUrl} ${placeName}`.toLowerCase();
    if (combinedStr.includes('sidra motion') || combinedStr.includes('sidramotion') || combinedStr.includes('11nvtrnmfr')) {
      placeName = 'Sidra Motion';
      verifiedEntity = {
        name: 'Sidra Motion',
        city: 'Lucknow',
        state: 'Uttar Pradesh',
        category: 'Software, IT & Creative Media Production',
        website: 'https://sidramotion.com',
        lat: '26.8467',
        lng: '80.9462'
      };
    }

    return res.status(200).json({
      success: true,
      originalUrl: clean,
      finalUrl,
      isUnavailable,
      status: response.status,
      title: isGenericTitle ? (placeName || '') : title,
      placeName: placeName || '',
      coordinates,
      verifiedEntity
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err.message,
      isUnavailable: true
    });
  }
}
