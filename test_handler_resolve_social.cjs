// test_handler_resolve_social.cjs
async function test() {
  const handler = (await import('./api/resolve-social.js')).default;

  const handles = [
    'digital-web.in',
    'zshuja_313',
    'sidramotion',
    'cristiano',
    'virat.kohli'
  ];

  for (const h of handles) {
    let statusCode = 200;
    let jsonResult = null;
    const req = {
      headers: { origin: 'https://www.sellersuitepro.online' },
      query: { handle: h, platform: 'instagram' },
      method: 'GET'
    };
    const res = {
      setHeader() {},
      status(c) { statusCode = c; return this; },
      json(d) { jsonResult = d; return this; },
      end() { return this; }
    };

    await handler(req, res);
    console.log(`[API RESOLVE] @${h} ->`, {
      statusCode,
      success: jsonResult?.success,
      handle: jsonResult?.handle,
      name: jsonResult?.displayName,
      followers: jsonResult?.followers,
      following: jsonResult?.following,
      posts: jsonResult?.posts,
      avatarUrl: jsonResult?.avatarUrl?.slice(0, 50) + '...',
      isRealScan: jsonResult?.isRealScan
    });
  }
}

test();
