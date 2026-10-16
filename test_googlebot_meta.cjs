// test_googlebot_meta.cjs
async function testGooglebot() {
  const uas = [
    'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    'Twitterbot/1.0',
    'WhatsApp/2.21.12.21 A'
  ];

  for (const ua of uas) {
    const res = await fetch('https://www.instagram.com/digital_web.in/', {
      headers: {
        'User-Agent': ua,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log(ua.slice(0, 20), 'status:', res.status);
    const text = await res.text();
    const desc = text.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i) ||
                 text.match(/<meta[^>]+content="([^"]+)"[^>]+name="description"/i);
    console.log('Description:', desc ? desc[1] : 'none');
  }
}
testGooglebot();
