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
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(8000)
    });

    const finalUrl = response.url || clean;
    const html = await response.text();
    const isUnavailable = html.includes('Something went wrong') || html.includes('isn’t available') || html.includes('is not available') || response.status === 404;

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : '';
    title = title.replace(/\s*-\s*Google\s*Maps$/i, '').trim();

    // Extract Place Name from final redirected URL if google maps
    let placeName = '';
    const placeMatch = finalUrl.match(/\/place\/([^\/@]+)/);
    if (placeMatch && placeMatch[1]) {
      placeName = decodeURIComponent(placeMatch[1]).replace(/\+/g, ' ');
    } else if (title && !title.toLowerCase().includes('share.google') && !title.toLowerCase().includes('google maps')) {
      placeName = title;
    }

    return res.status(200).json({
      success: true,
      originalUrl: clean,
      finalUrl,
      isUnavailable,
      status: response.status,
      title,
      placeName
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      error: err.message,
      isUnavailable: true
    });
  }
}
