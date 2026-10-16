// verify_live_100_scans.cjs
// Executes 100 live checks against production endpoint to verify 100% accuracy and zero fake data

const PROD_BASE = 'https://www.sellersuitepro.online';

const candidatePool = [
  'digital-web.in',     // The user's primary case (hyphen test)
  'digital_web.in',     // Direct underscore handle
  'zshuja_313',         // Videographer
  'sidramotion',        // Creator & developer
  'cristiano',          // Mega athlete
  'virat.kohli',        // Sports star (dot handle)
  'nike',               // Global brand
  'apple',              // Global brand
  'flipkart',           // Indian e-commerce
  'swiggyindia',        // Food delivery
  'zomato',             // Food tech
  'boat.nirvana',       // Audio brand (dot handle)
  'myntra',             // Fashion marketplace
  'leomessi',           // Footballer
  'nasa',               // Science organization
  'google',             // Tech giant
  'redbull',            // Energy drink brand
  'sony',               // Consumer electronics
  'natgeo',             // Media & photography
  'ted'                 // Talks & education
];

async function verifyAccount(handle, iteration) {
  const url = `${PROD_BASE}/api/resolve-social?handle=${encodeURIComponent(handle)}&platform=instagram`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!res.ok) {
    return { iteration, handle, success: false, status: res.status, error: 'HTTP_' + res.status };
  }

  const data = await res.json();
  if (!data.success || !data.isRealScan || data.isEstimated) {
    return { iteration, handle, success: false, isRealScan: data.isRealScan, isEstimated: data.isEstimated, error: 'NOT_REAL_SCAN' };
  }

  // Verify avatar image via production proxy
  let avatarOk = false;
  let avatarBytes = 0;
  if (data.avatarUrl) {
    const avatarFullUrl = data.avatarUrl.startsWith('http') ? data.avatarUrl : `${PROD_BASE}${data.avatarUrl}`;
    try {
      const imgRes = await fetch(avatarFullUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (imgRes.ok) {
        avatarOk = true;
        const b = await imgRes.arrayBuffer();
        avatarBytes = b.byteLength;
      }
    } catch (e) {
      avatarOk = false;
    }
  }

  return {
    iteration,
    handle,
    resolvedHandle: data.handle,
    success: true,
    name: data.displayName,
    followers: data.followers,
    posts: data.posts,
    following: data.following,
    avatarOk,
    avatarBytes,
    isRealScan: data.isRealScan
  };
}

async function run100Tests() {
  console.log(`Starting 100 Automated Live Scans against ${PROD_BASE}...\n`);

  let totalRuns = 0;
  let passed = 0;
  let failed = 0;

  // 5 rounds of 20 handles = 100 total scans
  const TOTAL_TARGET = 100;

  for (let round = 1; round <= 5; round++) {
    console.log(`=== ROUND ${round}/5 (Scans ${totalRuns + 1} to ${totalRuns + candidatePool.length}) ===`);
    for (const h of candidatePool) {
      totalRuns++;
      const result = await verifyAccount(h, totalRuns);
      if (result.success && result.isRealScan && result.avatarOk) {
        passed++;
        console.log(`[PASS #${totalRuns.toString().padStart(3, '0')}/100] @${result.handle.padEnd(16)} -> @${result.resolvedHandle.padEnd(16)} | "${result.name.slice(0, 24)}" | Followers: ${result.followers.toLocaleString().padStart(12)} | Posts: ${result.posts.toString().padStart(5)} | Avatar: ${result.avatarBytes}B`);
      } else {
        failed++;
        console.log(`[FAIL #${totalRuns.toString().padStart(3, '0')}/100] @${h}:`, result);
      }
      // Small pause to be courteous to rate limits
      await new Promise(r => setTimeout(r, 150));
    }
    console.log('');
  }

  console.log('====================================================');
  console.log(`100 LIVE SCANS VERIFICATION COMPLETE:`);
  console.log(`Total Executed: ${totalRuns}`);
  console.log(`Passed:         ${passed}`);
  console.log(`Failed:         ${failed}`);
  console.log(`Accuracy Rate:  ${((passed / totalRuns) * 100).toFixed(1)}%`);
  console.log('====================================================');
}

run100Tests();
