const https = require('https');

async function testFetch(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    console.log('HTML length:', html.length);
    
    // Check for captcha
    if (html.includes('Enter the characters you see below') || html.includes('api-services-support@amazon.com')) {
      console.log('Amazon bot captcha detected');
    }

    // Rating
    const r1 = html.match(/class="a-icon-alt">([0-9.]+)\s+out of 5 stars/i);
    const r2 = html.match(/([0-9.]+)\s+out of 5 stars/i);
    const r3 = html.match(/"rating":\s*"?([0-9.]+)"?/i);
    const r4 = html.match(/data-asin="([^"]+)"/i);
    
    console.log('Rating matches:', { r1: r1?.[1], r2: r2?.[1], r3: r3?.[1] });

    // Review count
    const rev1 = html.match(/id="acrCustomerReviewText"[^>]*>([0-9,]+)\s*(?:ratings|reviews)/i);
    const rev2 = html.match(/([0-9,]+)\s+customer reviews/i);
    console.log('Reviews:', { rev1: rev1?.[1], rev2: rev2?.[1] });

    // Title
    const t1 = html.match(/id="productTitle"[^>]*>([\s\S]*?)<\/span>/i);
    console.log('Title:', t1?.[1]?.trim());

  } catch (err) {
    console.error('Fetch err:', err);
  }
}

testFetch('https://www.amazon.in/dp/B0BNBYWXLL');
