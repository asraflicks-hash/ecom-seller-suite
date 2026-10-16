// test_10_providers.cjs
const handle = 'digital_web.in';

const endpoints = [
  { name: 'Dumpor', url: `https://dumpor.io/v/${handle}` },
  { name: 'Pixwox', url: `https://www.pixwox.com/profile/${handle}/` },
  { name: 'InstaNavigation', url: `https://instanavigation.com/user-profile/${handle}` },
  { name: 'StoriesDown', url: `https://storiesdown.com/users/${handle}` },
  { name: 'AnonIG', url: `https://anonstories.com/profile/${handle}` },
  { name: 'GreatFon', url: `https://greatfon.io/v/${handle}` },
  { name: 'Gramhir', url: `https://gramhir.com/profile/${handle}` },
  { name: 'InStalker', url: `https://instalkr.com/${handle}/` },
  { name: 'Picuki (desktop UA)', url: `https://www.picuki.com/profile/${handle}` },
  { name: 'Imginn', url: `https://imginn.com/${handle}` }
];

async function run() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(6000)
      });
      console.log(`[${res.status}] ${ep.name} (len: ${(await res.clone().text()).length})`);
      if (res.status === 200) {
        const html = await res.text();
        const fMatch = html.match(/([0-9,KMkm\.]+)\s*followers/i);
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        console.log(`  -> Title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
        console.log(`  -> Followers: ${fMatch ? fMatch[1] : 'N/A'}`);
      }
    } catch (e) {
      console.log(`[ERR] ${ep.name}: ${e.message}`);
    }
  }
}
run();
