// api/generate-listing.js - Serverless Multi-Marketplace Compliant Listing Generator
// Produces tailored listings for Amazon India, Flipkart, Meesho & D2C respecting exact platform rule sets

const RATE_LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_MINUTE = 10;
const ipRequestCounts = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const record = ipRequestCounts.get(ip) || { count: 0, resetTime: now + (RATE_LIMIT_WINDOW_SECONDS * 1000) };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + (RATE_LIMIT_WINDOW_SECONDS * 1000);
    ipRequestCounts.set(ip, record);
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return false;
  }
  record.count += 1;
  ipRequestCounts.set(ip, record);
  return true;
}

// Byte length helper for UTF-8 byte calculation
function getUtf8Bytes(str) {
  if (!str) return 0;
  return Buffer.byteLength(str, 'utf8');
}

// Clean and trim keywords to fit byte limits with zero punctuation
function sanitizeSearchTerms(rawKeywords, maxBytes = 249, excludeBrand = '') {
  if (!rawKeywords) return '';
  const brandLower = (excludeBrand || '').toLowerCase().trim();
  
  // Split on commas, spaces, punctuation
  const tokens = (Array.isArray(rawKeywords) ? rawKeywords.join(' ') : String(rawKeywords))
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && t !== brandLower);

  // De-duplicate while preserving order
  const seen = new Set();
  const unique = [];
  for (const t of tokens) {
    if (!seen.has(t)) {
      seen.add(t);
      unique.push(t);
    }
  }

  // Accumulate words until byte limit is reached
  let result = '';
  for (const word of unique) {
    const candidate = result ? `${result} ${word}` : word;
    if (getUtf8Bytes(candidate) <= maxBytes) {
      result = candidate;
    } else {
      break;
    }
  }
  return result;
}

// Calculate Marketplace Profit & Pricing Recommendations using Seller Suite Pro formulas
function calculateMarketplacePricing(platform, spNum, mrpNum, cogsNum) {
  const sp = spNum || (mrpNum ? Math.round(mrpNum * 0.6) : 699);
  const cg = cogsNum || Math.round(sp * 0.35);

  let feePct = 15;
  let forwardShipping = 65;
  let reverseShipping = 75;
  let rtoPct = 18;
  let closingFee = 25;

  if (platform === 'flipkart') {
    feePct = 13.5;
    forwardShipping = 60;
    reverseShipping = 70;
    rtoPct = 20;
    closingFee = 20;
  } else if (platform === 'meesho') {
    feePct = 0; // 0% commission on Meesho
    forwardShipping = 65;
    reverseShipping = 75;
    rtoPct = 26; // higher RTO in Tier 3 COD
    closingFee = 0;
  } else if (platform === 'shopify') {
    feePct = 2.5; // Payment gateway
    forwardShipping = 50;
    reverseShipping = 60;
    rtoPct = 10;
    closingFee = 0;
  }

  const marketplaceFee = (sp * feePct) / 100 + closingFee;
  const deliveredProfit = sp - cg - forwardShipping - marketplaceFee;
  const rtoLossPerUnit = forwardShipping + reverseShipping;

  const deliveredOrders = 100 - rtoPct;
  const rtoOrders = rtoPct;
  const totalDeliveredProfit = deliveredOrders * deliveredProfit;
  const totalRtoLoss = rtoOrders * rtoLossPerUnit;
  const netEarnings100Orders = totalDeliveredProfit - totalRtoLoss;
  const netProfitPerOrder = Math.round(netEarnings100Orders / 100);
  const netMarginPct = sp > 0 ? Math.round((netProfitPerOrder / sp) * 100) : 0;

  // Formula to achieve 20% net margin:
  // netProfit = 0.20 * SP
  // Solve for recommended SP:
  const denom = (1 - rtoPct / 100) * (1 - feePct / 100) - 0.20;
  const recommendedSp = denom > 0 
    ? Math.round((cg + forwardShipping + (rtoPct / 100) * rtoLossPerUnit + closingFee) / denom)
    : Math.round(sp * 1.15);

  return {
    sellingPrice: sp,
    estimatedFeePct: feePct,
    estimatedClosingFee: closingFee,
    estimatedShipping: forwardShipping,
    estimatedRtoRate: rtoPct,
    netProfitPerOrder,
    netMarginPct,
    recommendedSellingPrice: Math.max(recommendedSp, sp)
  };
}

// Generate platform specific package
function generatePlatformListing(platform, details, competitorKeywords = []) {
  const brand = (details.brand || 'Vibrant Brand').trim();
  const product = (details.title || details.productName || 'Premium Utility Essential').trim();
  const model = (details.model || '').trim();
  const color = (details.color || 'Jet Black').trim();
  const size = (details.size || 'Standard').trim();
  const material = (details.material || 'Heavy-Duty Grade Material').trim();
  const pack = (details.packSize || 'Pack of 1').trim();
  const target = (details.targetCustomer || 'Daily Modern Use').trim();
  const customFeatures = Array.isArray(details.features) ? details.features.filter(Boolean) : [];

  const rawKeywords = [
    ...(details.selectedKeywords || []),
    ...competitorKeywords.map(k => typeof k === 'string' ? k : k.keyword),
    color, material, product, model
  ].filter(Boolean);

  let title = '';
  let bullets = [];
  let description = '';
  let searchTerms = '';
  let browseNode = '';
  let lqsScore = 95;
  const lqsDeductions = [];

  const pricing = calculateMarketplacePricing(
    platform, 
    Number(details.sp), 
    Number(details.mrp), 
    Number(details.cogs)
  );

  // 1. AMAZON INDIA
  if (platform === 'amazon') {
    // Formula: [Brand] + [Model] + [Product] + [Specs/Material] + [Color] + [Pack]
    const titleParts = [brand, model, product, material, color, pack].filter(Boolean);
    title = titleParts.join(' - ');
    if (title.length > 195) {
      title = `${brand} ${product} (${material}, ${color}, ${pack})`.substring(0, 195);
    }

    bullets = [
      `[SUPERIOR ${material.toUpperCase()} BUILD]: Crafted with reinforced high-density ${material.toLowerCase()} ensuring long-lasting durability, wear resistance, and structural stability for demanding daily routines.`,
      `[ERGONOMIC & SLEEK FIT]: Designed with balanced contours and convenient ${size} form factor, offering effortless handling and portability across ${target.toLowerCase()} environments.`,
      `[PERFORMANCE ASSURED]: Precision-engineered components provide seamless functionality and consistent output without degradation over repeated cycles.`,
      `[AUTHENTIC ${color.toUpperCase()} FINISH]: Styled in an attractive ${color} shade with scratch-resistant coating, adding an aesthetic modern look to your essentials.`,
      `[COMPLETE VALUE PACK]: Includes ${pack} in secure protective packaging with user guidance and customer satisfaction support directly from ${brand}.`
    ];

    if (customFeatures.length > 0) {
      bullets[1] = `[KEY FEATURE BENEFIT]: ${customFeatures[0]}. Engineered to optimize speed and efficiency.`;
      if (customFeatures[1]) {
        bullets[2] = `[SMART FUNCTIONALITY]: ${customFeatures[1]}. Built for hassle-free operation.`;
      }
    }

    description = `${brand} brings you the next-generation ${product}, precision manufactured for discerning buyers who refuse to compromise on quality and endurance. Built using verified ${material}, this ${color} edition in ${size} dimensions combines sleek ergonomics with dependable heavy-duty reliability.\n\nWhether utilized for ${target.toLowerCase()} or everyday domestic tasks, the ${pack} format provides optimal utility. Every piece undergoes thorough factory quality inspection to ensure pristine condition upon unboxing. Pair with standard domestic setups for seamless integration.`;

    searchTerms = sanitizeSearchTerms(rawKeywords, 249, brand);
    browseNode = `${details.category || 'Home & Kitchen'} > Daily Essentials > ${product.split(' ')[0] || 'Accessories'}`;
    
    // Check Amazon limits
    if (getUtf8Bytes(searchTerms) > 249) {
      lqsScore -= 10;
      lqsDeductions.push('Search terms exceeded 249 bytes limit');
    }
  }

  // 2. FLIPKART
  else if (platform === 'flipkart') {
    // Formula: [Brand] + [Product Name] + [Key Spec/Model] + (Color/Size)
    title = `${brand} ${product} ${model} (${color}, ${pack})`.trim();
    if (title.length > 140) {
      title = `${brand} ${product} (${color})`.substring(0, 140);
    }

    bullets = [
      `Premium ${material} construction with scratch-resistant finish`,
      `Ergonomic ${size} design suitable for ${target.toLowerCase()}`,
      `High endurance rating built for Indian conditions`,
      `Attractive ${color} finish with genuine manufacturer support`,
      `Ready to use: ${pack} included in box`
    ];

    if (customFeatures[0]) bullets[0] = customFeatures[0].substring(0, 115);
    if (customFeatures[1]) bullets[1] = customFeatures[1].substring(0, 115);

    description = `Upgrade to the authentic ${brand} ${product}. Designed with focus on longevity, convenience, and superior value. Features top-tier ${material} construction, convenient ${size} proportions, and vibrant ${color} aesthetics. Perfect choice for everyday value shoppers on Flipkart.`;

    // Comma separated tags
    const cleanTags = sanitizeSearchTerms(rawKeywords, 150, brand).split(' ').filter(Boolean);
    searchTerms = cleanTags.slice(0, 10).join(', ');
    browseNode = `${details.category || 'Lifestyle & Utility'} / ${product}`;
  }

  // 3. MEESHO
  else if (platform === 'meesho') {
    // Catchy short title <= 100 chars
    title = `${product} - ${color} (${pack})`.trim();
    if (title.length > 95) {
      title = title.substring(0, 95);
    }

    bullets = [
      `Fabric / Material: High Quality ${material}`,
      `Size / Dimensions: ${size}`,
      `Color: ${color} | Combo: ${pack}`
    ];

    description = `Best quality ${product} in trending ${color} color. Premium ${material} material, very durable and lightweight. Easy to use for ${target.toLowerCase()}. Fast delivery and safe packing.\n\nNet Quantity: ${pack}\nCountry of Origin: India\nSold by verified seller.`;

    const meeshoWords = sanitizeSearchTerms(rawKeywords, 100, '').split(' ').slice(0, 6);
    searchTerms = meeshoWords.join(', ');
    browseNode = details.category || 'Trending Catalog';
  }

  // 4. MYNTRA / AJIO / FASHION
  else if (platform === 'myntra' || platform === 'ajio') {
    title = `${brand} ${color} ${product} in ${material}`.trim().substring(0, 110);
    bullets = [
      `Crafted in breathable and resilient ${material}`,
      `Modern regular fit with comfortable ${size} specifications`,
      `Rich deep ${color} dye with color-lock technology`,
      `Ideal for casual outings and versatile styling`
    ];
    description = `Infuse contemporary aesthetic into your collection with this ${product} from ${brand}. Constructed using high-grade ${material}, this ${color} piece offers unrestricted movement and effortless appeal.`;
    searchTerms = sanitizeSearchTerms(rawKeywords, 120, brand);
    browseNode = 'Apparel & Fashion';
  }

  // 5. SHOPIFY / D2C
  else {
    title = `${brand} ${product} | ${customFeatures[0] || 'Engineered for Performance'} (${color})`;
    if (title.length > 70) {
      title = `${brand} ${product} - ${color}`.substring(0, 70);
    }
    bullets = [
      `⭐ <strong>High Durability:</strong> Engineered from ${material} for maximum lifespan.`,
      `🚀 <strong>Modern Utility:</strong> Ergonomically tuned for ${target.toLowerCase()}.`,
      `🛡️ <strong>Direct Brand Assurance:</strong> 100% genuine guaranteed with hassle-free returns.`,
      `✨ <strong>Signature Colorway:</strong> Finished in stylish ${color}.`,
      `📦 <strong>Ready to Ship:</strong> ${pack} shipped in eco-friendly protective packaging.`
    ];
    description = `<h3>The Better Way to Experience ${product}</h3><p>Designed by ${brand}, our new ${product} redefines everyday reliability. Handcrafted with superior ${material} and tailored in a minimalist ${color} hue.</p><ul><li>True to size: ${size}</li><li>Pack contents: ${pack}</li><li>Zero risk 7-day domestic replacement warranty</li></ul>`;
    searchTerms = `${product}, ${brand}, ${color}, ${material}, online shopping India`;
    browseNode = 'D2C Store Catalog';
  }

  // Image plan recommendations
  const imagePlan = [
    {
      shotNumber: 1,
      title: 'Hero Main Slot',
      requirement: 'Pure White Background (#FFFFFF)',
      description: `Product centered, pure white #FFFFFF seamless crop, product occupies 85%+ of frame. No props, no watermarks, no packaging in slot 1.`,
      resolution: platform === 'amazon' ? '2000 x 2000 px (300 DPI Ultra Zoom)' : '1600 x 1600 px'
    },
    {
      shotNumber: 2,
      title: 'Dimension & Scale Graphic',
      requirement: 'Measurement Callouts',
      description: `Visual indicators displaying height, width, and ${size} dimensions with an everyday object or model hand for visual scale reference.`,
      resolution: '1600 x 1600 px'
    },
    {
      shotNumber: 3,
      title: 'Material & Tech Breakdown',
      requirement: 'Infographic Overlay',
      description: `Close-up macro shot showing ${material} texture and stitching with 3 pointer callout icons detailing durability features.`,
      resolution: '1600 x 1600 px'
    },
    {
      shotNumber: 4,
      title: 'Lifestyle / In-Use Action',
      requirement: 'Real World Context',
      description: `Natural warm lighting photo depicting product in practical use by ${target.toLowerCase()} in a realistic Indian home or office setting.`,
      resolution: '1600 x 1600 px'
    },
    {
      shotNumber: 5,
      title: 'Packaging & In-The-Box Contents',
      requirement: 'Unboxing Transparency',
      description: `All items included in ${pack} neatly displayed outside the box with MRP, HSN, and compliance label visible.`,
      resolution: '1600 x 1600 px'
    }
  ];

  // Keyword intent mapping (Title, Bullets, Backend Terms)
  const allUsedWords = new Set();
  const keywordIntentMapping = rawKeywords.slice(0, 12).map((kw, idx) => {
    const kwStr = typeof kw === 'string' ? kw : kw.keyword;
    const lower = (kwStr || '').toLowerCase();
    let location = 'Backend Terms';
    if (title.toLowerCase().includes(lower)) {
      location = 'Title (Highest Indexing Weight)';
    } else if (bullets.some(b => b.toLowerCase().includes(lower))) {
      location = 'Bullet Points (High Intent)';
    }
    allUsedWords.add(lower);
    return {
      keyword: kwStr,
      indexedIn: location,
      rankPriority: idx < 3 ? 'P1 Primary' : idx < 7 ? 'P2 Secondary' : 'P3 Discovery'
    };
  });

  return {
    platform,
    title,
    titleChars: title.length,
    titleBytes: getUtf8Bytes(title),
    bullets,
    description,
    descriptionChars: description.length,
    searchTerms,
    searchTermsBytes: getUtf8Bytes(searchTerms),
    browseNode,
    imagePlan,
    keywordIntentMapping,
    lqsScore,
    lqsDeductions,
    pricing,
    complianceBadge: `Optimized as per ${platform.toUpperCase()} listing rules`
  };
}

export default async function handler(req, res) {
  // CORS & Security Headers
  const origin = (req.headers.origin || '').toLowerCase();
  const allowedOrigins = [
    'https://www.sellersuitepro.online',
    'https://sellersuitepro.online',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost',
    'capacitor://localhost'
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'CORS Access Denied: Unauthorized origin.' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin || 'https://www.sellersuitepro.online');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST method is accepted.' });
  }

  // Rate Limiting
  const clientIp = req.headers['x-real-ip'] || 
                   req.headers['x-vercel-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a minute before generating more listings.' 
    });
  }

  const { productDetails = {}, targetMarketplaces = ['amazon'], competitorKeywords = [] } = req.body || {};

  if (!productDetails.title && !productDetails.productName) {
    return res.status(400).json({ error: 'Please provide at least a Product Name or Title.' });
  }

  const selectedPlatforms = Array.isArray(targetMarketplaces) && targetMarketplaces.length > 0 
    ? targetMarketplaces 
    : ['amazon'];

  try {
    const results = {};
    for (const platform of selectedPlatforms) {
      results[platform] = generatePlatformListing(platform, productDetails, competitorKeywords);
    }

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      generatedCount: selectedPlatforms.length,
      listings: results,
      note: 'All listings formatted according to official marketplace character limits, byte counters, and title syntax.'
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Failed to generate compliant marketplace listings',
      details: err.message
    });
  }
}
