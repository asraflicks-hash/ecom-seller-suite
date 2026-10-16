// api/ai-proxy.js - Hardened Server-Side AI/LLM Proxy
// Enforces:
// 1. Zero client-side API key leaks (keys stored exclusively in Vercel server environment)
// 2. Persistent rate limiting (Upstash/Vercel KV REST integration with graceful fallback)
// 3. Strict daily generation & spending cap (max 500 requests/day)
// 4. Strict CORS origin verification (rejects unauthorized third-party origins)
// 5. Input payload validation & abuse checks (max 2,000 chars, min 3 chars)

const RATE_LIMIT_WINDOW_SECONDS = 60;
const MAX_REQUESTS_PER_MINUTE = 10;
const MAX_DAILY_REQUESTS = 500;

// In-memory sliding window fallback
const ipRequestCounts = new Map();
let dailyRequestCount = 0;
let currentDay = new Date().toISOString().slice(0, 10);

async function checkPersistentRateLimit(ip) {
  const today = new Date().toISOString().slice(0, 10);
  if (today !== currentDay) {
    currentDay = today;
    dailyRequestCount = 0;
  }

  // 1. Upstash Redis / Vercel KV REST Integration if configured
  const kvUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const kvToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    try {
      const minuteKey = `ssp_ratelimit:${ip}:${Math.floor(Date.now() / (RATE_LIMIT_WINDOW_SECONDS * 1000))}`;
      const dayKey = `ssp_daily_cap:${today}`;

      // Pipeline INCR & EXPIRE
      const response = await fetch(`${kvUrl}/pipeline`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${kvToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify([
          ['INCR', minuteKey],
          ['EXPIRE', minuteKey, RATE_LIMIT_WINDOW_SECONDS],
          ['INCR', dayKey],
          ['EXPIRE', dayKey, 86400]
        ]),
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const results = await response.json();
        const minCount = results[0]?.result || 1;
        const dayCount = results[2]?.result || 1;

        if (dayCount > MAX_DAILY_REQUESTS) {
          return { allowed: false, reason: 'daily_cap_exceeded', limit: MAX_DAILY_REQUESTS };
        }
        if (minCount > MAX_REQUESTS_PER_MINUTE) {
          return { allowed: false, reason: 'minute_limit_exceeded', limit: MAX_REQUESTS_PER_MINUTE };
        }
        return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - minCount };
      }
    } catch (kvErr) {
      console.warn('Persistent KV rate limiter error, using memory fallback:', kvErr.message);
    }
  }

  // 2. Fallback in-memory rate limiter & daily cap
  if (dailyRequestCount >= MAX_DAILY_REQUESTS) {
    return { allowed: false, reason: 'daily_cap_exceeded', limit: MAX_DAILY_REQUESTS };
  }

  const now = Date.now();
  const record = ipRequestCounts.get(ip) || { count: 0, resetTime: now + (RATE_LIMIT_WINDOW_SECONDS * 1000) };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + (RATE_LIMIT_WINDOW_SECONDS * 1000);
    ipRequestCounts.set(ip, record);
    dailyRequestCount++;
    return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - 1 };
  }

  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return { allowed: false, reason: 'minute_limit_exceeded', limit: MAX_REQUESTS_PER_MINUTE };
  }

  record.count += 1;
  dailyRequestCount++;
  ipRequestCounts.set(ip, record);
  return { allowed: true, remaining: MAX_REQUESTS_PER_MINUTE - record.count };
}

export default async function handler(req, res) {
  // 1. Strict Origin Verification
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
    return res.status(403).json({ error: 'CORS Access Denied: Unauthorized request origin.' });
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
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  // 2. Client IP extraction & Rate limit check (prioritizes Vercel Edge / proxy headers)
  const clientIp = req.headers['x-real-ip'] || 
                   req.headers['x-vercel-forwarded-for']?.split(',')[0]?.trim() || 
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   req.socket?.remoteAddress || 
                   '127.0.0.1';
  const rateLimitResult = await checkPersistentRateLimit(clientIp);

  if (!rateLimitResult.allowed) {
    if (rateLimitResult.reason === 'daily_cap_exceeded') {
      return res.status(429).json({ 
        error: `Daily system AI threshold reached (${MAX_DAILY_REQUESTS} requests/day). Quota protection active.` 
      });
    }
    return res.status(429).json({ 
      error: `Rate limit exceeded. AI generation allows max ${MAX_REQUESTS_PER_MINUTE} requests per minute per IP.` 
    });
  }

  const { prompt, platform = 'amazon', brand = '', category = '', features = [] } = req.body || {};

  // 3. Payload size and abuse checks
  const rawInput = typeof prompt === 'string' ? prompt.trim() : JSON.stringify(req.body || '');
  if (!rawInput || rawInput.length < 3) {
    return res.status(400).json({ error: 'Input prompt is too short. Please provide a product title or description.' });
  }
  if (rawInput.length > 2000) {
    return res.status(400).json({ error: 'Input payload exceeds maximum allowed size of 2,000 characters.' });
  }

  // 4. Server-Side Execution with External AI Provider (if API key configured)
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  try {
    if (GEMINI_API_KEY) {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate Amazon/Flipkart/Meesho SEO listing. Product: ${rawInput}. Keep output concise and marketplace-compliant.` }] }],
          generationConfig: { maxOutputTokens: 500, temperature: 0.3 }
        }),
        signal: AbortSignal.timeout(9000)
      });
      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return res.status(200).json({ success: true, mode: 'llm-proxy', result: text });
        }
      }
    }

    // High-performance deterministic algorithmic generator (safe default)
    const cleanBrand = (brand || 'Premium Brand').trim();
    const cleanProd = rawInput.substring(0, 100).trim();
    const feats = Array.isArray(features) ? features.slice(0, 5) : [];

    const result = {
      title: `${cleanBrand} ${cleanProd} | High Durability & Reliable Performance (2026 Edition)`,
      bullets: [
        `⚡ HIGH PERFORMANCE: Engineered for dependable everyday longevity in ${category || 'general merchandise'}.`,
        `🚀 PREMIUM BUILD: Tested under rigorous quality standards for authentic build.`,
        `🛡️ BRAND WARRANTY: Backed by manufacturer customer support and hassle-free service.`,
        `✨ ERGONOMIC DESIGN: Sleek modern finish built for practical utility.`,
        `⭐ HIGH CUSTOMER RATING: Optimized for marketplace search relevance.`
      ],
      searchTerms: `${cleanBrand.toLowerCase()} ${cleanProd.toLowerCase()} top rated best offer`.substring(0, 245)
    };

    return res.status(200).json({ success: true, mode: 'algorithmic-proxy', result });
  } catch (err) {
    return res.status(500).json({ error: 'AI proxy processing error', details: err.message });
  }
}
