// api/scan-reference.js - Serverless Competitor & Reference Product Scraper & Auditor
// Strictly avoids leaking raw errors; provides graceful fallbacks for captcha / anti-bot challenges

const RATE_LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_MINUTE = 15;
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

// Banned or discouraged words across Amazon, Flipkart, and Meesho
const BANNED_WORDS = [
  'free shipping', 'free delivery', 'guarantee', 'guaranteed', 'warranty', 'best', 
  'sale', 'discount', 'cheap', 'lowest price', 'top rated', 'offer', '#1', 
  '100% authentic', 'money back', 'satisfaction guaranteed', 'exclusive', 
  'free gift', 'wholesale', 'whatsapp', 'call for price', 'phone number', 'contact us'
];

// Helper: Extract marketplace identifier from URL
function detectMarketplace(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const host = parsed.hostname.toLowerCase();
    if (host.includes('amazon')) return 'amazon';
    if (host.includes('flipkart')) return 'flipkart';
    if (host.includes('meesho')) return 'meesho';
    if (host.includes('myntra')) return 'myntra';
    if (host.includes('ajio')) return 'ajio';
    if (host.includes('nykaa')) return 'nykaa';
    if (host.includes('jiomart')) return 'jiomart';
    if (host.includes('shopify') || host.includes('myshopify')) return 'shopify';
    return 'other';
  } catch {
    return 'other';
  }
}

// Helper: Extract ASIN / PID from URL structure
function extractIdFromUrl(urlStr, marketplace) {
  try {
    if (marketplace === 'amazon') {
      const asinMatch = urlStr.match(/\/(?:dp|gp\/product)\/([A-Z0-9]{10})/i);
      if (asinMatch) return { type: 'ASIN', id: asinMatch[1].toUpperCase() };
    }
    if (marketplace === 'flipkart') {
      const pidMatch = urlStr.match(/pid=([A-Z0-9]+)/i);
      if (pidMatch) return { type: 'FSN/PID', id: pidMatch[1] };
    }
    if (marketplace === 'meesho') {
      const meeshoMatch = urlStr.match(/\/p\/([a-z0-9]+)/i);
      if (meeshoMatch) return { type: 'MeeshoID', id: meeshoMatch[1] };
    }
  } catch {
    // ignore
  }
  return null;
}

// Helper: Clean raw HTML text
function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// Helper: Run Flaw Audit on extracted listing
function auditListing(extracted, marketplace) {
  const flaws = [];
  const improvements = [];
  let score = 100;

  const title = extracted.title || '';
  const bullets = extracted.bullets || [];
  const description = extracted.description || '';

  // 1. Title Audit
  if (!title) {
    flaws.push({
      field: 'title',
      severity: 'high',
      issue: 'No title detected or title is empty.',
      fix: 'Use standard [Brand] + [Product Name] + [Key Specs] structure.'
    });
    score -= 30;
  } else {
    // Length check
    if (marketplace === 'amazon' && title.length > 200) {
      flaws.push({
        field: 'title',
        severity: 'high',
        issue: `Title length (${title.length} chars) exceeds Amazon's 200 character limit.`,
        fix: 'Trim redundant descriptors and keep under 200 characters.'
      });
      score -= 15;
    } else if (marketplace === 'flipkart' && title.length > 150) {
      flaws.push({
        field: 'title',
        severity: 'medium',
        issue: `Title length (${title.length} chars) exceeds Flipkart's 150 character limit.`,
        fix: 'Shorten title for mobile app visibility.'
      });
      score -= 10;
    } else if (marketplace === 'meesho' && title.length > 100) {
      flaws.push({
        field: 'title',
        severity: 'medium',
        issue: `Title length (${title.length} chars) is too long for Meesho mobile feed (recommended <= 100).`,
        fix: 'Use concise, catchy title with primary color and pack info.'
      });
      score -= 10;
    }

    // Banned words check
    const lowerTitle = title.toLowerCase();
    const foundBanned = BANNED_WORDS.filter(w => lowerTitle.includes(w));
    if (foundBanned.length > 0) {
      flaws.push({
        field: 'title',
        severity: 'high',
        issue: `Title contains discouraged/banned promotional terms: "${foundBanned.join(', ')}".`,
        fix: 'Remove promotional claims to prevent search suppression by marketplace algorithms.'
      });
      score -= 20;
    }

    // Repetitive keyword stuffing
    const words = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const counts = {};
    words.forEach(w => counts[w] = (counts[w] || 0) + 1);
    const repeated = Object.keys(counts).filter(w => counts[w] > 2);
    if (repeated.length > 0) {
      flaws.push({
        field: 'title',
        severity: 'medium',
        issue: `Potential keyword stuffing: "${repeated.join(', ')}" repeated ${counts[repeated[0]]} times in title.`,
        fix: 'Eliminate duplicate words and use natural attribute phrasing.'
      });
      score -= 10;
    }
  }

  // 2. Bullet Points Audit
  if (marketplace === 'amazon') {
    if (bullets.length < 5) {
      flaws.push({
        field: 'bullets',
        severity: 'medium',
        issue: `Only ${bullets.length} bullet points found. Amazon recommends exactly 5 complete bullets.`,
        fix: 'Expand to 5 structured bullets covering Benefit, Build, Specs, Compatibility, and Package Contents.'
      });
      score -= 15;
    }
    const hasHeaderHooks = bullets.some(b => /^[\[A-Z\s]{4,}\]?:/i.test(b.trim()));
    if (!hasHeaderHooks && bullets.length > 0) {
      flaws.push({
        field: 'bullets',
        severity: 'low',
        issue: 'Bullets lack capitalized benefit header hooks (e.g. "[RAPID COOLING]: ...").',
        fix: 'Format each bullet starting with capitalized benefit in brackets.'
      });
      score -= 5;
    }
  } else if (marketplace === 'flipkart') {
    if (bullets.length < 4) {
      flaws.push({
        field: 'bullets',
        severity: 'low',
        issue: `Only ${bullets.length} highlights found. Flipkart benefits from 4-5 key features.`,
        fix: 'Add punchy 1-line highlights under 120 characters each.'
      });
      score -= 10;
    }
  }

  // 3. Description Audit
  if (!description || description.length < 50) {
    flaws.push({
      field: 'description',
      severity: 'medium',
      issue: 'Product description is missing or very short.',
      fix: 'Add a rich 2-3 paragraph overview describing real-world utility.'
    });
    score -= 10;
  }

  // 4. Proposed Improvements
  improvements.push(`Apply official ${marketplace.toUpperCase()} title formula ([Brand] + [Model] + [Key Specs] + [Color/Pack]).`);
  improvements.push(`Format 5 high-converting bullet points with capitalized benefit hooks.`);
  improvements.push(`Generate exact 249-byte backend search terms (duplicate-free, comma-free for Amazon).`);
  improvements.push(`Include pure white #FFFFFF main image plan with 85%+ frame fill.`);

  return {
    score: Math.max(20, Math.min(100, score)),
    flaws,
    improvements
  };
}

// Helper: Extract competitor keywords from title and text
function extractKeywords(title, text) {
  const combined = `${title || ''} ${text || ''}`.toLowerCase();
  const stopWords = new Set([
    'with', 'this', 'that', 'from', 'have', 'more', 'your', 'will', 'also', 'made',
    'easy', 'best', 'good', 'free', 'item', 'pack', 'size', 'only', 'very', 'just',
    'over', 'each', 'into', 'under', 'these', 'about', 'other', 'which', 'their'
  ]);

  const cleanWords = combined
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w));

  const freqMap = {};
  cleanWords.forEach(w => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });

  const sorted = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  return sorted.map(([kw, count], idx) => ({
    keyword: kw,
    frequency: count,
    intent: idx < 4 ? 'High Intent' : idx < 9 ? 'Attribute' : 'Discovery',
    recommended: true
  }));
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
    return res.status(405).json({ error: 'Only POST method is allowed.' });
  }

  // Rate Limiting
  const clientIp = req.headers['x-real-ip'] || 
                   req.headers['x-vercel-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded. Please wait a moment before scanning another product link.' 
    });
  }

  const { url, rawText, manualMarketplace } = req.body || {};

  // If rawText fallback is provided by the seller
  if (rawText && typeof rawText === 'string' && rawText.trim().length > 10) {
    const text = rawText.trim();
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const title = lines[0]?.substring(0, 200) || 'Reference Product';
    const bullets = lines.slice(1, 6).map(l => l.replace(/^[-•*]\s*/, ''));
    const detectedMp = manualMarketplace || (url ? detectMarketplace(url) : 'amazon');

    const extracted = {
      title,
      brand: 'Competitor / Reference',
      price: { mrp: '', sp: '' },
      bullets: bullets.length > 0 ? bullets : ['Key product feature & functionality highlighted.'],
      description: lines.slice(6).join(' ') || text.substring(0, 500),
      specs: {},
      category: 'General',
      images: []
    };

    const audit = auditListing(extracted, detectedMp);
    const competitorKeywords = extractKeywords(title, text);

    return res.status(200).json({
      success: true,
      mode: 'raw-text-parsed',
      marketplace: detectedMp,
      extracted,
      audit,
      competitorKeywords,
      fallbackRequired: false
    });
  }

  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    return res.status(400).json({
      error: 'Invalid product URL. Please provide a valid HTTP/HTTPS link.'
    });
  }

  const marketplace = detectMarketplace(url);
  const identifierInfo = extractIdFromUrl(url, marketplace);

  try {
    // Attempt standard fetch with realistic browser headers
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6500);

    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-IN,en-GB,en;q=0.9',
      'Cache-Control': 'no-cache'
    };

    let html = '';
    let isBlocked = false;

    try {
      const response = await fetch(url, {
        headers: fetchHeaders,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        html = await response.text();
        // Check for common anti-bot/captcha responses
        if (
          html.includes('api-services-support@amazon.com') || 
          html.includes('To discuss automated access to Amazon data') ||
          html.includes('Type the characters you see in this image') ||
          html.includes('Robot Check') ||
          html.length < 1500
        ) {
          isBlocked = true;
        }
      } else {
        isBlocked = true;
      }
    } catch {
      isBlocked = true;
    }

    // If blocked by anti-bot, gracefully construct what we can from URL and invite user fallback
    if (isBlocked || !html) {
      // Derive title from URL path slug if available
      let derivedTitle = '';
      try {
        const pathSegments = new URL(url).pathname.split('/').filter(Boolean);
        const slug = pathSegments.find(s => s.includes('-') && !s.startsWith('dp') && !s.startsWith('gp'));
        if (slug) {
          derivedTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
      } catch {
        // ignore
      }

      const extracted = {
        title: derivedTitle || (identifierInfo ? `${marketplace.toUpperCase()} Item ${identifierInfo.id}` : 'Reference Product'),
        brand: 'Reference Brand',
        price: { mrp: '', sp: '' },
        bullets: [
          'High durability & reliable build quality',
          'Ergonomic design suitable for Indian daily utility',
          'Standard domestic compatibility and dimensions'
        ],
        description: 'Reference product specs extracted from URL structure.',
        specs: identifierInfo ? { [identifierInfo.type]: identifierInfo.id } : {},
        category: 'eCommerce Listing',
        images: []
      };

      const audit = auditListing(extracted, marketplace);
      const competitorKeywords = extractKeywords(extracted.title, '');

      return res.status(200).json({
        success: true,
        mode: 'anti-bot-fallback',
        marketplace,
        identifier: identifierInfo,
        notice: 'Marketplace anti-bot protection prevented full page scrape. We extracted available URL identifiers. You can refine with the text paste box below.',
        extracted,
        audit,
        competitorKeywords,
        fallbackRequired: true
      });
    }

    // Parse HTML content (RegExp / standard DOM string extraction)
    let title = '';
    let brand = '';
    const bullets = [];
    let description = '';
    let mrp = '';
    let sp = '';
    const images = [];

    // Title parsing
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i) ||
                       html.match(/id="productTitle"[^>]*>([^<]+)<\/span>/i) ||
                       html.match(/class="B_NuCI"[^>]*>([^<]+)<\/span>/i);
    if (titleMatch) {
      title = cleanText(titleMatch[1]).replace(/\s*:\s*Amazon\.in.*$/i, '').replace(/\s*:\s*Flipkart.*$/i, '');
    }

    // Bullets parsing (Amazon & Flipkart)
    const bulletRegex = /<li[^>]*><span class="a-list-item"[^>]*>([^<]+)<\/span><\/li>/gi;
    let bMatch;
    while ((bMatch = bulletRegex.exec(html)) !== null && bullets.length < 6) {
      const bText = cleanText(bMatch[1]);
      if (bText && bText.length > 10 && !bText.toLowerCase().includes('customer reviews')) {
        bullets.push(bText);
      }
    }

    // Price parsing
    const priceMatch = html.match(/class="a-price-whole"[^>]*>([^<]+)<\/span>/i) ||
                       html.match(/class="_30jeq3 _16Jk6d"[^>]*>₹?([^<]+)<\/div>/i);
    if (priceMatch) {
      sp = priceMatch[1].replace(/,/g, '').trim();
    }

    // Image parsing (OpenGraph / primary)
    const ogImageMatch = html.match(/property="og:image"\s+content="([^"]+)"/i) ||
                         html.match(/id="landingImage"\s+data-old-hires="([^"]+)"/i);
    if (ogImageMatch) {
      images.push(ogImageMatch[1]);
    }

    // Description
    const metaDescMatch = html.match(/name="description"\s+content="([^"]+)"/i);
    if (metaDescMatch) {
      description = cleanText(metaDescMatch[1]);
    }

    const extracted = {
      title: title || 'Scanned Reference Product',
      brand: brand || 'Reference Brand',
      price: { mrp, sp },
      bullets: bullets.length > 0 ? bullets : ['Key functional specifications and features.'],
      description: description || 'Complete product overview.',
      specs: identifierInfo ? { [identifierInfo.type]: identifierInfo.id } : {},
      category: 'General',
      images
    };

    const audit = auditListing(extracted, marketplace);
    const competitorKeywords = extractKeywords(title, bullets.join(' '));

    return res.status(200).json({
      success: true,
      mode: 'live-scraped',
      marketplace,
      identifier: identifierInfo,
      extracted,
      audit,
      competitorKeywords,
      fallbackRequired: false
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      mode: 'error-handled-fallback',
      marketplace,
      identifier: identifierInfo,
      notice: 'Unable to connect to reference host. You can paste the product text directly.',
      extracted: {
        title: 'Reference Product',
        brand: '',
        price: { mrp: '', sp: '' },
        bullets: [],
        description: '',
        specs: {},
        category: 'eCommerce Listing',
        images: []
      },
      audit: {
        score: 60,
        flaws: [{ field: 'general', severity: 'low', issue: 'Live URL was unreachable', fix: 'Paste text or details manually' }],
        improvements: ['We will generate compliant listing based on your inputs.']
      },
      competitorKeywords: [],
      fallbackRequired: true
    });
  }
}
