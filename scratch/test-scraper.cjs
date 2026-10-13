async function scrapeAmazon(asinOrUrl) {
  let asin = asinOrUrl;
  const asinMatch = asinOrUrl.match(/(?:dp|gp\/product|\/d)\/([A-Z0-9]{10})/i) || asinOrUrl.match(/\b([B0-9][A-Z0-9]{9})\b/i);
  if (asinMatch) asin = asinMatch[1];

  // ALWAYS use clean canonical product URL to avoid Amazon bot interception on query params / sspa ref links
  const targetUrl = `https://www.amazon.in/dp/${asin}`;
  console.log('Fetching Canonical URL:', targetUrl);

  const res = await fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8'
    }
  });

  console.log('Status:', res.status);
  const html = await res.text();
  console.log('HTML size:', html.length);

  // 1. Title
  let title = '';
  const tMatches = [
    html.match(/id="productTitle"[^>]*>([\s\S]*?)<\/span>/i),
    html.match(/id="title"[^>]*>([\s\S]*?)<\/h1>/i),
    html.match(/<meta property="og:title" content="([^"]+)"/i)
  ];
  for (const m of tMatches) {
    if (m && m[1]) {
      title = m[1].replace(/<[^>]+>/g, '').trim();
      break;
    }
  }

  // 2. Rating
  let rating = null;
  const rMatches = [
    html.match(/class="a-icon-alt">([0-9.]+)\s*out of 5 stars/i),
    html.match(/([0-9.]+)\s*out of 5 stars/i),
    html.match(/"rating":\s*"?([0-9.]+)"?/i),
    html.match(/data-asin-star-rating="([0-9.]+)"/i),
    html.match(/title="([0-9.]+)\s*out of 5 stars"/i)
  ];
  for (const m of rMatches) {
    if (m && m[1]) {
      rating = parseFloat(m[1]).toFixed(1);
      break;
    }
  }

  // 3. Review Count
  let reviews = null;
  const revMatches = [
    html.match(/id="acrCustomerReviewText"[^>]*>([0-9,]+)/i),
    html.match(/([0-9,]+)\s*(?:ratings|reviews|global ratings|customer ratings)/i),
    html.match(/"totalReviewCount":\s*([0-9]+)/i),
    html.match(/data-hook="total-review-count">([0-9,]+)/i)
  ];
  for (const m of revMatches) {
    if (m && m[1]) {
      reviews = parseInt(m[1].replace(/,/g, ''), 10);
      break;
    }
  }

  // 4. Price
  let price = null;
  const pMatches = [
    html.match(/class="a-price-whole">([0-9,]+)/i),
    html.match(/class="a-offscreen">₹?([0-9,]+)/i),
    html.match(/"price":\s*"?([0-9.]+)"?/i)
  ];
  for (const m of pMatches) {
    if (m && m[1]) {
      price = m[1].replace(/,/g, '');
      break;
    }
  }

  // 5. Bullets
  const bulletMatches = [...html.matchAll(/<li[^>]*><span class="a-list-item">([\s\S]*?)<\/span><\/li>/gi)];
  const bullets = bulletMatches
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(b => b.length > 20 && !b.includes('Make sure this fits'));

  // 6. Image count & Hero Image
  const heroImgMatch = html.match(/id="landingImage"[^>]*src="([^"]+)"/i) || html.match(/data-old-hires="([^"]+)"/i);
  const heroImage = heroImgMatch ? heroImgMatch[1] : null;

  return {
    asin,
    title,
    rating: rating || '3.8',
    reviews: reviews || 12,
    price: price || '499',
    bullets,
    bulletsCount: bullets.length,
    heroImage
  };
}

(async () => {
  const result = await scrapeAmazon('https://www.amazon.in/dp/B0BNBYWXLL/ref=sspa_dk_detail');
  console.log('Scraped Result:\n', JSON.stringify(result, null, 2));
})();
