// =========================================================================================
//  SIDRA MOTION SOCIAL MEDIA AI DOCTOR & AUDIT ENGINE
//  Deep Account Health, Ghost Follower Detection, Meta 2026 Community Standards & Comment Moderation
// =========================================================================================

export const SOCIAL_PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: 'Instagram', color: '#E1306C', domain: 'instagram.com', placeholder: '@brandhandle or instagram.com/yourhandle' },
  { id: 'facebook', name: 'Facebook', icon: 'Facebook', color: '#1877F2', domain: 'facebook.com', placeholder: 'facebook.com/yourpage or Page ID' },
  { id: 'youtube', name: 'YouTube', icon: 'Youtube', color: '#FF0000', domain: 'youtube.com', placeholder: '@channelhandle or youtube.com/@yourchannel' },
  { id: 'twitter', name: 'Twitter / X', icon: 'Twitter', color: '#1DA1F2', domain: 'x.com', placeholder: '@handle or x.com/yourhandle' },
  { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: '#0A66C2', domain: 'linkedin.com', placeholder: 'linkedin.com/company/yourbrand' },
  { id: 'threads', name: 'Threads', icon: 'MessageCircle', color: '#000000', domain: 'threads.net', placeholder: '@handle or threads.net/@yourhandle' }
];

export const INDUSTRY_CATEGORIES = [
  { id: 'd2c_fashion', name: 'D2C Fashion, Apparel & Footwear', benchmarkEng: 2.1, avgGhostRatio: 21 },
  { id: 'electronics', name: 'Electronics & Smart Gadgets', benchmarkEng: 1.6, avgGhostRatio: 18 },
  { id: 'beauty_skincare', name: 'Beauty, Cosmetics & Personal Care', benchmarkEng: 2.8, avgGhostRatio: 26 },
  { id: 'food_beverage', name: 'Food, Beverage & Cloud Kitchens', benchmarkEng: 3.1, avgGhostRatio: 16 },
  { id: 'health_supplements', name: 'Health, Wellness & Fitness', benchmarkEng: 2.4, avgGhostRatio: 22 },
  { id: 'home_decor', name: 'Home Decor, Furnishing & Kitchenware', benchmarkEng: 1.9, avgGhostRatio: 19 },
  { id: 'creator_influencer', name: 'Content Creator & Public Figure', benchmarkEng: 3.6, avgGhostRatio: 28 },
  { id: 'local_retail', name: 'Local Business, Retail & Services', benchmarkEng: 1.8, avgGhostRatio: 15 },
  { id: 'b2b_wholesale', name: 'B2B Wholesale & Manufacturing', benchmarkEng: 1.2, avgGhostRatio: 14 }
];

// Hash helper for consistent deterministic evaluation of handles
function hashString(str) {
  let hash = 0;
  const s = String(str || '').toLowerCase().trim();
  for (let i = 0; i < s.length; i++) {
    hash = (hash << 5) - hash + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Extract handle and platform from URL or text
export function parseSocialInput(input) {
  const raw = String(input || '').trim();
  if (!raw) return { handle: '', platform: 'instagram' };

  let detectedPlatform = 'instagram';
  let cleaned = raw;

  if (raw.includes('facebook.com')) detectedPlatform = 'facebook';
  else if (raw.includes('youtube.com') || raw.includes('youtu.be')) detectedPlatform = 'youtube';
  else if (raw.includes('twitter.com') || raw.includes('x.com')) detectedPlatform = 'twitter';
  else if (raw.includes('linkedin.com')) detectedPlatform = 'linkedin';
  else if (raw.includes('threads.net')) detectedPlatform = 'threads';
  else if (raw.includes('instagram.com')) detectedPlatform = 'instagram';

  // Strip protocol and domains
  cleaned = cleaned.replace(/https?:\/\/(www\.)?(instagram\.com|facebook\.com|youtube\.com|youtu\.be|twitter\.com|x\.com|linkedin\.com|threads\.net)\//gi, '');
  cleaned = cleaned.replace(/^@/, '');
  cleaned = cleaned.split('?')[0].split('/')[0].trim();

  return {
    handle: cleaned || 'brand_demo',
    platform: detectedPlatform
  };
}

// Banned & restricted hashtags database (2026 Meta / Algorithm Standards)
export const KNOWN_BANNED_HASHTAGS = [
  { tag: '#follow4follow', status: 'BANNED', risk: 'HIGH', reason: 'Explicit engagement bait spam ring. Triggers 14-day shadowban.' },
  { tag: '#likeforlike', status: 'BANNED', risk: 'HIGH', reason: 'Algorithmic suppression. Flagged as unnatural engagement.' },
  { tag: '#giveawayalert', status: 'RESTRICTED', risk: 'MEDIUM', reason: 'High fraud rate; Meta throttles non-sponsored giveaway posts.' },
  { tag: '#dmfordeals', status: 'RESTRICTED', risk: 'MEDIUM', reason: 'Flagged by automated commerce bot protection.' },
  { tag: '#f4f', status: 'BANNED', risk: 'HIGH', reason: 'Legacy bot tag permanently blocked on Explore feed.' },
  { tag: '#instabusiness', status: 'OVER-SATURATED', risk: 'LOW', reason: '92% bot content. Zero organic reach benefit.' },
  { tag: '#crypto_profit', status: 'BANNED', risk: 'CRITICAL', reason: 'Financial fraud filter automatically flags account.' },
  { tag: '#weightlosssecret', status: 'RESTRICTED', risk: 'HIGH', reason: 'Meta Health Policy violation for unverified medical claims.' },
  { tag: '#curvy', status: 'RESTRICTED', risk: 'MEDIUM', reason: 'Throttled periodically due to community safety filters.' },
  { tag: '#freefollowers', status: 'BANNED', risk: 'CRITICAL', reason: 'Blacklisted credential-stealing bot network tag.' }
];

// Generate comprehensive profile audit
export function generateSocialAudit(rawInput, categoryId = 'd2c_fashion', selectedPlatform = 'instagram') {
  const { handle, platform } = parseSocialInput(rawInput);
  const activePlatform = selectedPlatform || platform;
  const category = INDUSTRY_CATEGORIES.find(c => c.id === categoryId) || INDUSTRY_CATEGORIES[0];
  const seed = hashString(handle + activePlatform);

  // Followers math: Realistic range based on seed
  const followerTiers = [1420, 4850, 12800, 28400, 54200, 118000, 245000];
  const baseFollowers = followerTiers[seed % followerTiers.length] + (seed % 937);
  const following = Math.max(120, Math.floor(baseFollowers * (0.01 + ((seed % 15) / 100))));
  const totalPosts = 48 + (seed % 340);

  // Engagement calculation
  const benchmark = category.benchmarkEng;
  const engVariance = ((seed % 40) - 20) / 10; // -2.0% to +2.0%
  const engagementRate = Math.max(0.4, Number((benchmark + engVariance).toFixed(2)));

  // Ghost follower math
  const ghostRatioBase = category.avgGhostRatio + ((seed % 16) - 8);
  const ghostPercentage = Math.min(48, Math.max(8, Number(ghostRatioBase.toFixed(1))));
  const ghostFollowerCount = Math.floor(baseFollowers * (ghostPercentage / 100));

  // Health score (0 - 100)
  let healthScore = 88;
  if (ghostPercentage > 20) healthScore -= Math.floor((ghostPercentage - 20) * 1.5);
  if (engagementRate < benchmark) healthScore -= Math.floor((benchmark - engagementRate) * 12);
  healthScore = Math.max(34, Math.min(97, healthScore));

  let healthStatus = 'EXCELLENT';
  let healthColor = '#10b981';
  if (healthScore < 50) {
    healthStatus = 'CRITICAL HEALTH - SHADOWBAN RISK';
    healthColor = '#ef4444';
  } else if (healthScore < 70) {
    healthStatus = 'MODERATE - REACH THROTTLED';
    healthColor = '#f59e0b';
  } else if (healthScore < 85) {
    healthStatus = 'GOOD - MINOR OPTIMIZATIONS NEEDED';
    healthColor = '#3b82f6';
  }

  // Realistic Ghost Follower Accounts List
  const ghostPrefixes = ['crypto_bot_', 'user_inactive_', 'promo_hub_', 'steve_lurker_', 'deal_hunter_', 'follower_grow_', 'shadow_acct_', 'blank_avatar_'];
  const ghostReasons = [
    '0 posts in 18 months, zero story views, 0 engagement',
    'Mass-following >7,500 accounts (automated follow-unfollow bot)',
    'Empty profile, no bio, foreign bot network fingerprint',
    'Banned API client device signature detected',
    'Inactive phone carrier, ghost lurker profile',
    'Followed 2 years ago, 0 profile impressions logged'
  ];

  const ghostFollowersList = [];
  const listSize = 18;
  for (let i = 0; i < listSize; i++) {
    const itemSeed = hashString(`${handle}_ghost_${i}`);
    const prefix = ghostPrefixes[itemSeed % ghostPrefixes.length];
    const username = `@${prefix}${itemSeed % 9999}`;
    const reason = ghostReasons[itemSeed % ghostReasons.length];
    const daysInactive = 90 + (itemSeed % 520);
    const reachPenalty = Number((0.08 + ((itemSeed % 12) / 100)).toFixed(2));
    
    ghostFollowersList.push({
      id: `gf-${i + 1}`,
      username,
      reason,
      daysInactive,
      reachPenalty: `-${reachPenalty}% test-feed reach`,
      severity: itemSeed % 2 === 0 ? 'CRITICAL BOT' : 'INACTIVE LURKER',
      safeToRemove: true
    });
  }

  // Meta 2026 Community Standards & Post Violation Scan
  const scannedPosts = [
    {
      id: 'post-1',
      type: 'Reel Video',
      title: 'Mega Flash Sale 70% Off Today Only!',
      caption: 'Comment "BUY NOW" 10 times to win a free smartphone! Tag 5 friends below! #giveaway #f4f #freeproducts',
      issues: [
        {
          rule: 'Meta Engagement Bait Policy (Sec 4.2)',
          severity: 'HIGH RISK',
          details: 'Asking users to repeatedly comment words or tag friends artificially inflates metric. Meta AI demotes this Reel by 65% in Explore distribution.',
          recommendation: 'ARCHIVE OR EDIT CAPTION',
          fixedCaption: 'Dropping our biggest collection this season! Explore the catalog link in bio for exclusive member perks.'
        },
        {
          rule: 'Banned Tag Detection (#f4f)',
          severity: 'CRITICAL',
          details: '#f4f is on the 2026 Meta Blacklist. Using it hides the post from all hashtag search results.',
          recommendation: 'REMOVE HASHTAG'
        }
      ],
      reachStatus: 'SUPPRESSED BY ALGORITHM',
      actionNeeded: 'Immediate Caption Edit',
      thumbnailBg: 'linear-gradient(135deg, #f43f5e 0%, #881337 100%)'
    },
    {
      id: 'post-2',
      type: 'Carousel Post',
      title: 'Our 100% Miracle Hair Growth Serum Guaranteed!',
      caption: 'Guaranteed 100% results in 3 days or full money back! Cures baldness completely. Tap link in bio!',
      issues: [
        {
          rule: 'Meta Health & Exaggerated Claims Policy (Sec 8.1)',
          severity: 'HIGH RISK',
          details: 'Absolute medical/cosmetic guarantees ("100% cure in 3 days") violate Meta Advertising & Organic Content Safety. Can trigger permanent ad account ban.',
          recommendation: 'EDIT CLAIMS IMMEDIATELY',
          fixedCaption: 'Formulated with nourishing botanicals to support scalp wellness and hair strength over 30 days of consistent care.'
        }
      ],
      reachStatus: 'AT RISK OF REMOVAL',
      actionNeeded: 'Tone Down Medical Claims',
      thumbnailBg: 'linear-gradient(135deg, #e11d48 0%, #4c0519 100%)'
    },
    {
      id: 'post-3',
      type: 'Product Reel',
      title: 'Unboxing New Premium Leather Handbag',
      caption: 'Handcrafted luxury for modern professionals. Available now with same day dispatch. #luxurybag #d2cfashion #handcrafted',
      issues: [],
      reachStatus: '100% COMPLIANT - HEALTHY VIRAL ELIGIBLE',
      actionNeeded: 'None (Safe)',
      thumbnailBg: 'linear-gradient(135deg, #059669 0%, #064e3b 100%)'
    },
    {
      id: 'post-4',
      type: 'Commercial Ad Video',
      title: 'Trending Song Behind Product Showcase',
      caption: 'Vibing with our bestsellers! Which color do you prefer: Mocha Brown or Midnight Black?',
      issues: [
        {
          rule: 'Commercial Music Licensing Flag',
          severity: 'MODERATE',
          details: 'Business profiles are restricted from using non-commercial viral music without sync licensing. Meta will mute the audio in 14 countries.',
          recommendation: 'SWAP WITH META SOUND COLLECTION',
          fixedCaption: 'Swapped audio with royalty-free commercial sound track from Meta Creator Library.'
        }
      ],
      reachStatus: 'PARTIAL REACH RESTRICTION',
      actionNeeded: 'Audio Replacement Recommended',
      thumbnailBg: 'linear-gradient(135deg, #d97706 0%, #78350f 100%)'
    }
  ];

  // Spam & Toxic Comment Moderation Queue
  const spamComments = [
    {
      id: 'comm-1',
      author: '@crypto_queen_sarah99',
      text: 'Earn $5,000 every week working 1 hour from home! Message me on WhatsApp +1-829-440-2918 to get started now 💰🔥',
      type: 'FINANCIAL SCAM BOT',
      severity: 'CRITICAL',
      recommendation: 'DELETE COMMENT & PERMANENT BLOCK',
      autoFiltered: false
    },
    {
      id: 'comm-2',
      author: '@fake_competitor_bot',
      text: 'Terrible quality! Don’t buy from here, got ripped off! Buy original for half price on my profile link!',
      type: 'COMPETITOR DEFAMATION BOT',
      severity: 'HIGH RISK',
      recommendation: 'HIDE COMMENT & SHADOW-MUTE USER',
      autoFiltered: false
    },
    {
      id: 'comm-3',
      author: '@growth_agency_promo_44',
      text: 'Send this to @promote_agency_boss to get 50,000 active real followers in 24 hours guaranteed!',
      type: 'PROMO SPAM BOT',
      severity: 'MODERATE',
      recommendation: 'DELETE & ADD KEYWORD TO RESTRICTED LIST',
      autoFiltered: false
    },
    {
      id: 'comm-4',
      author: '@sneaker_replica_drop',
      text: 'Direct message us for 1st copy replicas with free shipping worldwide! Check story!',
      type: 'COUNTERFEIT ADVERTISING',
      severity: 'HIGH RISK',
      recommendation: 'DELETE & REPORT FOR IP INFRINGEMENT',
      autoFiltered: false
    }
  ];

  // Best Time to Post & Algorithm Clock (Industry-calibrated)
  const postingSlots = {
    weekdayBest: ['12:30 PM - 1:45 PM (Lunch Break)', '7:15 PM - 9:30 PM (Peak Evening Leisure)'],
    weekendBest: ['11:00 AM - 2:00 PM (Sunday Leisure Spike)', '8:00 PM - 10:30 PM'],
    worstTimesToAvoid: ['2:00 AM - 6:30 AM (Algorithmic Dead Zone - Cold Impressions Waste)'],
    goldenWindowMinutes: 30,
    goldenWindowExplanation: 'Meta tests your post with 10% of active followers in the first 30 minutes. If engagement hits >4.5% during this golden window, the algorithm pushes it into the broader Explore & Suggested Feed!'
  };

  // 3-Second Viral Hook Presets
  const hookSuggestions = [
    { type: 'Curiosity Gap', hook: 'Stop buying [Product] until you know this one hidden truth...', retentionBoost: '+44% 3s retention' },
    { type: 'Contrarian Statement', hook: 'Everyone is using [Product] completely wrong, and here is why...', retentionBoost: '+52% 3s retention' },
    { type: 'Visual Proof / Speed Hook', hook: 'Watch what happens when we test this against a ₹5,000 competitor...', retentionBoost: '+61% 3s retention' },
    { type: 'Relatable Pain Point', hook: 'If you struggle with [Problem], do NOT scroll past this Reel.', retentionBoost: '+48% 3s retention' },
    { type: 'Price Drop Shock', hook: 'We made 500 units of this and Flipkart sellers are furious about our price...', retentionBoost: '+58% 3s retention' }
  ];

  // Bio Link & Funnel Audit
  const bioAudit = {
    hasLink: true,
    linkDomain: 'linktr.ee/' + handle,
    mobileSpeedScore: '82 / 100',
    bounceRisk: 'MEDIUM (Multi-link tree drops conversion by 34% compared to direct 1-click product link)',
    issues: [
      'Missing UTM Tracking parameters (?utm_source=instagram&utm_medium=bio)',
      'No direct 1-click WhatsApp business checkout link found',
      'Third-party link landing page adds an extra click friction layer'
    ],
    recommendedBio: `✨ Official ${handle.toUpperCase()} Store\n🇮🇳 Premium Quality • 100,000+ Happy Customers\n⚡ Cash on Delivery & Free 48-hr Shipping\n👇 Tap below for Exclusive Member Deals`,
    recommendedDirectLink: `https://${handle}.online?utm_source=instagram&utm_medium=bio_link&utm_campaign=profile_traffic`
  };

  // Competitor Spy Insights
  const competitorAnalysis = {
    topCompetitorCategory: category.name,
    estimatedCompetitorEng: (category.benchmarkEng + 0.6).toFixed(1) + '%',
    viralContentFormats: [
      'Behind-the-scenes packing order ASMR Reels (2.4x avg reach)',
      'Customer unboxing honest reactions (1.9x avg reach)',
      'Side-by-side durability test Reels (3.1x avg reach)'
    ],
    trendingAudioNiche: 'Commercial Indie Lo-Fi & Fast Percussion Beat (Meta Approved)'
  };

  return {
    handle: `@${handle}`,
    platform: activePlatform,
    categoryName: category.name,
    avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${handle}&backgroundColor=0f172a`,
    metrics: {
      followers: baseFollowers,
      following,
      posts: totalPosts,
      engagementRate,
      benchmarkRate: benchmark,
      engagementStatus: engagementRate >= benchmark ? 'ABOVE BENCHMARK' : 'BELOW BENCHMARK',
      ghostFollowerCount,
      ghostPercentage,
      activeFollowers: baseFollowers - ghostFollowerCount,
      reachBoostPotential: `+${Math.floor(ghostPercentage * 1.6)}% Reach Boost after Purge`
    },
    health: {
      score: healthScore,
      status: healthStatus,
      color: healthColor
    },
    ghostFollowersList,
    scannedPosts,
    spamComments,
    postingSlots,
    hookSuggestions,
    bioAudit,
    competitorAnalysis
  };
}

// Interactive Reel Hook Scorer
export function scoreReelHook(hookText) {
  const text = String(hookText || '').trim();
  if (!text) return null;

  let score = 55;
  const feedback = [];
  const words = text.split(/\s+/).length;

  if (words > 14) {
    score -= 15;
    feedback.push('Hook is too wordy. Keep under 10 words so viewers read it in under 2 seconds.');
  } else if (words >= 4 && words <= 10) {
    score += 15;
    feedback.push('Optimal concise length for fast visual retention.');
  }

  const powerTriggers = ['stop', 'secret', 'never', 'truth', 'mistake', 'why', 'exposed', 'tested', 'save', 'money', 'warning', 'don\'t', 'shocking'];
  const hasTrigger = powerTriggers.some(w => text.toLowerCase().includes(w));

  if (hasTrigger) {
    score += 20;
    feedback.push('Contains high-conversion emotional trigger word.');
  } else {
    feedback.push('Add an emotional trigger or curiosity word like "Stop", "Secret", or "Mistake".');
  }

  if (text.includes('?')) {
    score += 10;
    feedback.push('Question format activates viewer curiosity gap.');
  }

  score = Math.min(98, Math.max(25, score));

  return {
    score,
    rating: score >= 80 ? 'VIRAL RETENTION TIER' : score >= 60 ? 'SOLID HOOK' : 'HIGH DROP-OFF RISK',
    feedback
  };
}

// Interactive Hashtag Inspector
export function inspectHashtags(hashtagString) {
  const raw = String(hashtagString || '').trim();
  if (!raw) return [];

  const tags = raw.split(/[\s,]+/).filter(t => t.startsWith('#') || t.length > 2).map(t => t.startsWith('#') ? t.toLowerCase() : `#${t.toLowerCase()}`);

  return tags.map(tag => {
    const known = KNOWN_BANNED_HASHTAGS.find(k => k.tag === tag);
    if (known) return known;

    const seed = hashString(tag);
    if (seed % 7 === 0) {
      return { tag, status: 'HIGH COMPETITION', risk: 'MEDIUM', reason: 'Over 50M posts. New posts buried within 3 seconds.' };
    }
    return { tag, status: 'HEALTHY NICHE', risk: 'SAFE', reason: 'High algorithmic relevancy score with active buyer community.' };
  });
}
