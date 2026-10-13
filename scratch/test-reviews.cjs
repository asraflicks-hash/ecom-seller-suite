const fs = require('fs');

async function testReviews() {
  const res = await fetch('https://www.amazon.in/dp/B0BNBYWXLL', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  
  // Search for ratings or review count text
  const idx = html.indexOf('2.7 out of 5 stars');
  if (idx !== -1) {
    console.log('Snippet around rating:\n', html.substring(idx - 200, idx + 400));
  } else {
    console.log('Not found');
  }

  // Also search for customer review count
  const matches = [...html.matchAll(/([0-9,]+)\s*(?:ratings|reviews|global ratings|customer ratings)/gi)];
  console.log('Review matches:', matches.slice(0, 10).map(m => m[0]));
}

testReviews();
