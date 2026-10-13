async function parseAmazon(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'en-IN,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
    }
  });
  const html = await res.text();
  console.log('Status:', res.status, 'HTML length:', html.length);
  
  if (html.includes('Enter the characters you see below')) {
    console.log('CAPTCHA page hit!');
    return null;
  }

  // Title
  const titleMatch = html.match(/id="productTitle"[^>]*>([\s\S]*?)<\/span>/i);
  const title = titleMatch ? titleMatch[1].trim() : '';

  // Rating
  let rating = null;
  const ratingMatch = html.match(/class="a-icon-alt">([0-9.]+)\s*out of 5 stars/i) ||
                      html.match(/([0-9.]+)\s*out of 5 stars/i) ||
                      html.match(/"rating":\s*"?([0-9.]+)"?/i);
  if (ratingMatch) rating = ratingMatch[1];

  // Review Count
  let reviews = null;
  const revMatch = html.match(/id="acrCustomerReviewText"[^>]*>([0-9,]+)/i) ||
                   html.match(/([0-9,]+)\s*(?:ratings|reviews|global ratings)/i);
  if (revMatch) reviews = revMatch[1];

  // Price
  let price = null;
  const priceMatch = html.match(/class="a-price-whole">([0-9,]+)/i);
  if (priceMatch) price = priceMatch[1].replace(/,/g, '');

  // Bullets
  const bulletMatches = [...html.matchAll(/<li[^>]*><span class="a-list-item">([\s\S]*?)<\/span><\/li>/gi)];
  const bullets = bulletMatches
    .map(m => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(b => b.length > 25 && !b.includes('Make sure this fits'));

  // Image count
  const imgMatches = [...html.matchAll(/class="a-button-text"[^>]*><img[^>]*src="([^"]+)"/gi)];
  const imageCount = Math.max(imgMatches.length, 3);

  console.log({
    title,
    rating,
    reviews,
    price,
    bulletsCount: bullets.length,
    imageCount
  });
}

parseAmazon('https://www.amazon.in/dp/B0BNBYWXLL');
