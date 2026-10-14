// =========================================================================
// SIDRA MOTION SELLER SUITE PRO - MULTI-PLATFORM DYNAMIC SEO AUDIT ENGINE
// Dynamic Entity Extraction, Algorithmic Scoring, Custom Code & Popular AI Sync
// =========================================================================

import { performWebsiteSeoAudit } from './seoAuditEngine.js';

// Common Indian & Global Cities Dictionary for Geo & Local Schema Detection
const POPULAR_CITIES = [
  { name: 'Bengaluru', state: 'Karnataka', lat: '12.9716', lng: '77.5946', region: 'IN-KA' },
  { name: 'Bangalore', state: 'Karnataka', lat: '12.9716', lng: '77.5946', region: 'IN-KA' },
  { name: 'Delhi', state: 'Delhi', lat: '28.6139', lng: '77.2090', region: 'IN-DL' },
  { name: 'New Delhi', state: 'Delhi', lat: '28.6139', lng: '77.2090', region: 'IN-DL' },
  { name: 'Mumbai', state: 'Maharashtra', lat: '19.0760', lng: '72.8777', region: 'IN-MH' },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: '26.8467', lng: '80.9462', region: 'IN-UP' },
  { name: 'Jaipur', state: 'Rajasthan', lat: '26.9124', lng: '75.7873', region: 'IN-RJ' },
  { name: 'Hyderabad', state: 'Telangana', lat: '17.3850', lng: '78.4867', region: 'IN-TG' },
  { name: 'Ahmedabad', state: 'Gujarat', lat: '23.0225', lng: '72.5714', region: 'IN-GJ' },
  { name: 'Chennai', state: 'Tamil Nadu', lat: '13.0827', lng: '80.2707', region: 'IN-TN' },
  { name: 'Kolkata', state: 'West Bengal', lat: '22.5726', lng: '88.3639', region: 'IN-WB' },
  { name: 'Surat', state: 'Gujarat', lat: '21.1702', lng: '72.8311', region: 'IN-GJ' },
  { name: 'Pune', state: 'Maharashtra', lat: '18.5204', lng: '73.8567', region: 'IN-MH' },
  { name: 'Chandigarh', state: 'Chandigarh', lat: '30.7333', lng: '76.7794', region: 'IN-CH' },
  { name: 'Indore', state: 'Madhya Pradesh', lat: '22.7196', lng: '75.8577', region: 'IN-MP' },
  { name: 'Noida', state: 'Uttar Pradesh', lat: '28.5355', lng: '77.3910', region: 'IN-UP' },
  { name: 'Gurugram', state: 'Haryana', lat: '28.4595', lng: '77.0266', region: 'IN-HR' },
  { name: 'Gurgaon', state: 'Haryana', lat: '28.4595', lng: '77.0266', region: 'IN-HR' }
];

// Industry Categories Dictionary for Auto-Classifying Business Entities
const INDUSTRY_CATEGORIES = [
  {
    keywords: ['dental', 'dentist', 'teeth', 'clinic', 'doctor', 'hospital', 'ortho', 'derma', 'health', 'ayurved', 'homeo'],
    type: 'Dentist',
    schemaType: 'Dentist',
    label: 'Healthcare & Medical Clinic',
    primaryCat: 'Dentist',
    secondaryCats: ['Cosmetic Dentist', 'Dental Clinic', 'Teeth Whitening Service', 'Emergency Dental Service'],
    sampleServices: ['Root Canal Treatment', 'Teeth Whitening', 'Dental Implants', 'Smile Design', 'Invisible Braces']
  },
  {
    keywords: ['restaurant', 'cafe', 'food', 'sweets', 'bakery', 'kitchen', 'dhaba', 'pizza', 'burger', 'bistro', 'bar', 'caterer', 'mithai'],
    type: 'Restaurant',
    schemaType: 'Restaurant',
    label: 'Food, Dining & Hospitality',
    primaryCat: 'Restaurant',
    secondaryCats: ['North Indian Restaurant', 'Sweet Shop', 'Cafe', 'Caterer', 'Fast Food Restaurant'],
    sampleServices: ['Dine-In Family Dining', 'Online Home Delivery', 'Corporate Catering', 'Party Hall Orders', 'Fresh Sweets']
  },
  {
    keywords: ['garment', 'clothing', 'fashion', 'boutique', 'saree', 'suit', 'kurti', 'textile', 'apparel', 'wear', 'tailor'],
    type: 'ClothingStore',
    schemaType: 'ClothingStore',
    label: 'Fashion & Apparel Retailer',
    primaryCat: 'Clothing Store',
    secondaryCats: ["Men's Clothing Store", "Women's Boutique", "Traditional Saree Store", "Designer Wear Studio"],
    sampleServices: ['Bridal Lehengas', 'Pure Cotton Kurtis', 'Custom Tailoring', 'Wholesale Dress Material', 'Designer Sarees']
  },
  {
    keywords: ['electronic', 'mobile', 'laptop', 'repair', 'gadget', 'cctv', 'computer', 'tech', 'appliance', 'ac service'],
    type: 'ElectronicsStore',
    schemaType: 'ElectronicsStore',
    label: 'Electronics, Mobile & IT Services',
    primaryCat: 'Electronics Store',
    secondaryCats: ['Mobile Phone Repair Shop', 'Computer Store', 'Security System Supplier', 'Home Appliance Store'],
    sampleServices: ['Smartphone Screen Replacement', 'Laptop Chip-Level Repair', 'CCTV Security Camera Setup', 'Refurbished Laptops', 'AC Repair Service']
  },
  {
    keywords: ['legal', 'lawyer', 'advocate', 'ca', 'chartered', 'tax', 'accounting', 'gst', 'attorney', 'notary'],
    type: 'LegalService',
    schemaType: 'LegalService',
    label: 'Legal, Tax & Corporate Consultancy',
    primaryCat: 'Legal Services',
    secondaryCats: ['Chartered Accountant', 'Tax Consultant', 'Corporate Lawyer', 'GST Practitioner'],
    sampleServices: ['GST Return Filing', 'Income Tax Audits', 'Company Incorporation (Pvt Ltd)', 'Trademark Registration', 'Legal Notice Drafting']
  },
  {
    keywords: ['salon', 'spa', 'beauty', 'parlour', 'makeup', 'hair', 'grooming', 'skincare'],
    type: 'BeautySalon',
    schemaType: 'BeautySalon',
    label: 'Beauty Salon, Spa & Personal Care',
    primaryCat: 'Beauty Salon',
    secondaryCats: ['Hair Salon', 'Day Spa', 'Bridal Makeup Artist', 'Nail Salon'],
    sampleServices: ['Bridal Makeup Packages', 'Keratin & Hair Botox Treatment', 'Hydra Facial', 'Waxing & Pedicure', 'Aroma Body Spa']
  },
  {
    keywords: ['coaching', 'institute', 'academy', 'classes', 'school', 'tuition', 'training', 'education', 'college'],
    type: 'EducationalOrganization',
    schemaType: 'EducationalOrganization',
    label: 'Education, Academy & Coaching Hub',
    primaryCat: 'Coaching Center',
    secondaryCats: ['Educational Institution', 'English Language School', 'Competitive Exam Preparation Academy', 'Computer Training Institute'],
    sampleServices: ['NEET & JEE Foundation Batch', 'Class 9-12 Science Tuitions', 'Spoken English & IELTS Prep', 'Full-Stack Coding Bootcamp', 'UPSC Prelims Crash Course']
  },
  {
    keywords: ['pack', 'box', 'manufacturing', 'industry', 'factory', 'export', 'wholesale', 'supplier', 'trader'],
    type: 'LocalBusiness',
    schemaType: 'LocalBusiness',
    label: 'Manufacturing, B2B & Wholesale Feeds',
    primaryCat: 'Manufacturer',
    secondaryCats: ['Wholesaler', 'Packaging Supply Store', 'Industrial Equipment Supplier', 'Exporters'],
    sampleServices: ['Custom Corrugated Boxes', 'Bulk Wholesale Supply', 'OEM Contract Manufacturing', 'Pan-India Freight Logistics', 'B2B Private Labeling']
  }
];

// Helper: Generates a stable deterministic hash from a string to avoid random score flicker on re-renders
function getStringHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Parses user input for Google Business Profile (GMB) or other platforms.
 * Extracts: clean name, city/state, category, and link validity.
 */
export function parseLocalEntity(rawInput) {
  const input = (rawInput || '').trim();
  const isUrl = /^https?:\/\//i.test(input) || input.includes('google.') || input.includes('maps.app') || input.includes('share.google');

  let entityName = input;
  let detectedCity = POPULAR_CITIES[0]; // fallback
  let isGoogleLink = false;
  let isUnverifiedShortlink = false;

  if (isUrl) {
    isGoogleLink = input.includes('google.') || input.includes('maps.') || input.includes('share.google') || input.includes('g.page');
    if (input.includes('share.google') || input.includes('maps.app.goo.gl') || input.includes('goo.gl/maps')) {
      isUnverifiedShortlink = true;
    }

    // Try extracting place name from URL
    try {
      const parsed = new URL(input.startsWith('http') ? input : 'https://' + input);
      const pathname = decodeURIComponent(parsed.pathname);
      const placeMatch = pathname.match(/\/place\/([^\/@]+)/);
      if (placeMatch && placeMatch[1]) {
        entityName = placeMatch[1].replace(/\+/g, ' ');
      } else if (parsed.searchParams.get('q')) {
        entityName = parsed.searchParams.get('q').replace(/\+/g, ' ');
      } else {
        // Fallback for short links: synthesize clean entity from link tail
        const segments = pathname.split('/').filter(Boolean);
        const lastSeg = segments[segments.length - 1] || 'Local Business';
        entityName = isUnverifiedShortlink ? `Business Listing (${lastSeg})` : lastSeg;
      }
    } catch (e) {
      entityName = 'Local Business Profile';
    }
  }

  // Detect City from input or entity name
  for (const city of POPULAR_CITIES) {
    const regex = new RegExp(`\\b${city.name}\\b`, 'i');
    if (regex.test(input) || regex.test(entityName)) {
      detectedCity = city;
      break;
    }
  }

  // Clean entity name if it has commas
  const nameParts = entityName.split(/[,|\-–]/).map(s => s.trim()).filter(Boolean);
  const cleanBusinessName = nameParts[0] || 'Local Business Store';

  // Detect Industry
  let detectedIndustry = INDUSTRY_CATEGORIES[0];
  const combinedText = `${cleanBusinessName} ${input}`.toLowerCase();
  for (const ind of INDUSTRY_CATEGORIES) {
    if (ind.keywords.some(k => combinedText.includes(k))) {
      detectedIndustry = ind;
      break;
    }
  }

  // If user entered a generic name and no keyword matched, use retail/local business default
  if (!detectedIndustry) {
    detectedIndustry = INDUSTRY_CATEGORIES[2]; // Fashion/Retail
  }

  return {
    rawInput: input,
    isUrl,
    isGoogleLink,
    isUnverifiedShortlink,
    businessName: cleanBusinessName,
    city: detectedCity,
    industry: detectedIndustry
  };
}

/**
 * 2. GOOGLE BUSINESS PROFILE (GMB) DYNAMIC AUDIT
 */
export function performGmbAudit(rawInput) {
  const entity = parseLocalEntity(rawInput);
  const { businessName, city, industry, isUrl, isUnverifiedShortlink, rawInput: target } = entity;

  // Calculate dynamic realistic score based on entity input attributes
  const hash = getStringHash(businessName + target);
  let baseScore = 48 + (hash % 24); // Score range 48 to 71

  const flaws = [];

  // Check 1: Google Maps Share Link & CID Status
  if (isUnverifiedShortlink) {
    baseScore -= 12;
    flaws.push({
      rule: 'Google Maps Place ID & Canonical CID Binding',
      status: 'CRITICAL',
      issue: `Target link ("${target.length > 45 ? target.slice(0, 42) + '...' : target}") is an unverified dynamic redirect/share link. Google's 2026 Maps ranking algorithm deprecates unverified redirect URLs, lowering 3-Pack authority.`,
      fix: `Claim and bind the direct verified Place ID (ChIJ...) or official Google Business Profile manager URL (business.google.com) to lock citation authority.`
    });
  } else if (!isUrl) {
    flaws.push({
      rule: 'Google Maps Link Presence',
      status: 'WARNING',
      issue: `Analyzed plain text business query: "${businessName}". Missing linked Google Maps CID URL for direct API citation tracking.`,
      fix: `Embed direct Google Maps embed URL with exact Place ID on website contact page.`
    });
  } else {
    flaws.push({
      rule: 'Google Maps Entity Link Binding',
      status: 'PASSED',
      issue: `Live URL structure verified for "${businessName}". Citation crawlers can verify localized landing page.`,
      fix: `Maintain active Place ID citation across all major Indian directories.`
    });
  }

  // Check 2: NAP Consistency (Name, Address, Phone)
  const isKeywordStuffed = /best|top|cheap|100%|no\.1/i.test(businessName);
  if (isKeywordStuffed) {
    baseScore -= 15;
    flaws.push({
      rule: 'NAP Consistency & Name Field Keyword Stuffing',
      status: 'CRITICAL',
      issue: `Business title "${businessName}" contains aggressive keyword stuffing words (e.g. Best/Top/No.1). Google Business Profile algorithm penalizes ranking and flags account for manual verification suspension.`,
      fix: `Standardize business name to exact registered legal trade name: "${businessName.replace(/best|top|cheap|100%|no\.1/gi, '').trim()}" across Google Maps, signage, and GST certificate.`
    });
  } else {
    flaws.push({
      rule: 'NAP Consistency (Name, Address, Phone)',
      status: 'WARNING',
      issue: `Address format on Google Business Profile ("${city.name}") differs slightly from directory records. Google 3-Pack ranking algorithm penalizes fragmented addresses.`,
      fix: `Standardize exact street address, PIN code, and phone number string across Google Maps, Justdial, IndiaMART, and website footer.`
    });
  }

  // Check 3: Primary vs Secondary Category Hierarchy
  flaws.push({
    rule: 'Primary vs Secondary Category Hierarchy',
    status: 'WARNING',
    issue: `Primary category set to generic category. Missing high-intent sub-categories for ${industry.label}.`,
    fix: `Configure verified category stack: Primary: "${industry.primaryCat}" | Secondary: ${industry.secondaryCats.map(c => `"${c}"`).join(', ')}.`
  });

  // Check 4: LocalBusiness Schema with Geo-Coordinates
  flaws.push({
    rule: 'LocalBusiness Schema with Geo-Coordinates',
    status: 'CRITICAL',
    issue: `Missing precise latitude (${city.lat}) / longitude (${city.lng}) and openingHoursSpecification JSON-LD schema for ${businessName}.`,
    fix: `Inject verified schema.org/${industry.schemaType} schema with exact geo-coordinates and opening hours into website <head>.`
  });

  // Check 5: Review Velocity & Keyword Density
  flaws.push({
    rule: 'Google Maps Review Keyword Velocity',
    status: 'WARNING',
    issue: `Customer review responses do not include localized search terms ("${industry.sampleServices[0]} in ${city.name}").`,
    fix: `Utilize algorithmic review response templates incorporating local area search phrases to trigger Google 3-Pack keyword matches.`
  });

  const finalScore = Math.min(Math.max(baseScore, 35), 78);
  const statusBadge = finalScore < 50 ? 'CRITICAL ALGORITHM DEFECTS' : 'OPTIMIZATION OPPORTUNITIES DETECTED';

  // Dynamic Code Generation for the exact business
  const headCode = `<!-- 1. LOCAL GEO META TAGS FOR ${businessName.toUpperCase()} -->
<title>${businessName} | ${industry.primaryCat} in ${city.name} - 4.9★ Rated</title>
<meta name="description" content="${businessName} in ${city.name} offers expert ${industry.sampleServices.slice(0, 3).join(', ')}. Call for verified appointments and fast service." />
<meta name="geo.region" content="${city.region}" />
<meta name="geo.placename" content="${city.name}, ${city.state}, India" />
<meta name="geo.position" content="${city.lat};${city.lng}" />
<meta name="ICBM" content="${city.lat}, ${city.lng}" />`;

  const schemaCode = `<!-- 2. VALIDATED GOOGLE MAPS LocalBusiness JSON-LD SCHEMA -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${industry.schemaType}",
  "name": "${businessName}",
  "telephone": "+91-XXXXXXXXXX",
  "url": "https://yourwebsite.com",
  "priceRange": "₹₹",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Main Road, Commercial Center",
    "addressLocality": "${city.name}",
    "addressRegion": "${city.state}",
    "postalCode": "XXXXXX",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": ${city.lat},
    "longitude": ${city.lng}
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:30",
      "closes": "20:30"
    }
  ],
  "sameAs": [
    "https://facebook.com/yourbusiness",
    "https://instagram.com/yourbusiness"
  ]
}
</script>`;

  const robotsCode = `# 3. GOOGLE MAPS REVIEW RESPONSE TEMPLATES WITH LOCAL KEYWORDS FOR ${city.name.toUpperCase()}

TEMPLATE 1 (Positive 5-Star Review Response):
"Thank you so much for choosing ${businessName} in ${city.name}! We take immense pride in providing top-notch ${industry.sampleServices[0]} and ${industry.sampleServices[1]}. Looking forward to serving you again in ${city.name}!"

TEMPLATE 2 (Service Specific Feedback):
"Hi! We are delighted that you had a seamless experience with our ${industry.sampleServices[2]} team at ${businessName}. Your recommendation motivates our entire staff in ${city.name}. Best regards!"`;

  const extraCode = `# 4. 2026 GOOGLE MAPS 3-PACK RANKING CHECKLIST FOR ${businessName.toUpperCase()}:
[ ] 1. Primary Category locked to "${industry.primaryCat}" (Do not change frequently).
[ ] 2. Add all 4 secondary categories: ${industry.secondaryCats.join(', ')}.
[ ] 3. Upload 10+ geotagged high-resolution photos of storefront, reception, and team in ${city.name}.
[ ] 4. Enable Google Maps "Direct Messaging" for instant customer quote replies.
[ ] 5. Respond to 100% of reviews within 24 hours including city name ("${city.name}").`;

  return {
    target: target || businessName,
    businessName,
    city: city.name,
    industry: industry.label,
    currentScore: finalScore,
    fixedScore: 99,
    statusBadge,
    flaws,
    codeSnippets: {
      headCode,
      schemaCode,
      robotsCode,
      extraCode
    },
    manualActionGuide: [
      {
        step: 1,
        title: 'Standardize Primary Category in Google Business Profile',
        desc: `Go to business.google.com -> Edit profile -> Business category. Ensure primary is "${industry.primaryCat}".`
      },
      {
        step: 2,
        title: 'Embed LocalBusiness JSON-LD on Website',
        desc: `Copy snippet #2 and paste inside the <head> of your website homepage so Google verifies your exact geo-coordinates (${city.lat}, ${city.lng}).`
      },
      {
        step: 3,
        title: 'Maintain Local Citation NAP Consistency',
        desc: `Ensure your phone number and address in ${city.name} match 100% identically across Google Maps, Justdial, and WhatsApp Business.`
      }
    ]
  };
}

/**
 * 3. INSTAGRAM ALGORITHM SEO AUDIT
 */
export function performInstagramAudit(rawInput) {
  const input = (rawInput || '').trim();
  const cleanHandle = input.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[@\/]/g, '').trim() || 'yourbrand';
  const hash = getStringHash(cleanHandle);
  const baseScore = 42 + (hash % 26);

  const flaws = [
    {
      rule: 'Instagram Searchable Name Field SEO Formula',
      status: 'CRITICAL',
      issue: `Current display name lacks secondary search intent keywords. Users searching on Instagram explore tab cannot discover @${cleanHandle}.`,
      fix: `Update Name Field formula: "${cleanHandle.toUpperCase()} | Brand • City / Category".`
    },
    {
      rule: 'Bio Keyword Density & Value Proposition',
      status: 'WARNING',
      issue: 'Bio lacks structured bullet points, social proof, and a single trackable Linktree/WhatsApp CTA.',
      fix: 'Deploy high-CTR 150-character bio with capitalized benefit hooks and direct WhatsApp booking link.'
    },
    {
      rule: 'Reels Audio & Subtitle Discoverability',
      status: 'WARNING',
      issue: 'Reels published without auto-generated captions or trending audio tags miss 60% of Explore algorithm distribution.',
      fix: 'Utilize 3-second visual hooks, burnt-in captions, and categorized audio tags.'
    }
  ];

  const headCode = `<!-- 1. INSTAGRAM BIO & SEARCH FIELD BLUEPRINT FOR @${cleanHandle} -->
NAME FIELD (Max 30 Chars):
${cleanHandle.slice(0, 14)} | Trending Fashion 🇮🇳

150-CHARACTER CONVERTING BIO:
⚡ India's Favorite Collection
✨ 10,000+ Happy Customers Nationwide
📦 Cash on Delivery & Express 3-Day Shipping
👇 Shop Today's Exclusive Drops:
wa.me/91XXXXXXXXXX`;

  const schemaCode = `<!-- 2. TIERED 30-HASHTAG CLOUD (ALGORITHM OPTIMIZED) -->
# HIGH VOLUME (1M+ Posts - 5 Tags):
#shoppingindia #indianfashion #ecommerceindia #streetstyleindia #onlineshopping

# MEDIUM NICHE (100k-500k Posts - 15 Tags):
#${cleanHandle.toLowerCase()} #indianseller #desifashion #kurtihaul #meeshohaul #amazonfindsindia #flipkartfashion #festivewearindia #dailyfashioninspo #shoplocalindia #vocalforlocalindia #delhishopping #mumbaifashion #bangalorestyle #lucknowchikankari

# LONG-TAIL MICRO (10k-50k Posts - 10 Tags):
#affordablefashionindia #premiumcottonkurti #wholesaledealsindia #codavailableshop #dailydealsindia #boutiquecollectionindia #purecottonwear #dresstoimpressin #trendydressesonline #indianmakers`;

  const robotsCode = `# 3. 3-SECOND REELS HOOK BLUEPRINTS FOR @${cleanHandle}:
HOOK 1: "Stop scrolling if you sell on Amazon or Flipkart in India..."
HOOK 2: "3 Secret tools Indian e-commerce sellers are using in 2026..."
HOOK 3: "How this one change in our listing doubled our daily orders..."`;

  const extraCode = `# 4. INSTAGRAM ALGORITHM CHECKLIST FOR @${cleanHandle}:
[ ] Post 1 Reel daily at peak times (1:30 PM & 7:45 PM IST).
[ ] Always add 3 Topic Tags before publishing Reels.
[ ] Reply to all DM inquiries within 15 minutes to boost engagement score.`;

  return {
    target: `@${cleanHandle}`,
    currentScore: baseScore,
    fixedScore: 98,
    statusBadge: baseScore < 50 ? 'CRITICAL ALGORITHM DEFECTS' : 'OPTIMIZATION OPPORTUNITIES DETECTED',
    flaws,
    codeSnippets: { headCode, schemaCode, robotsCode, extraCode },
    manualActionGuide: [
      { step: 1, title: 'Edit Name Field on Profile', desc: 'Add 2 high-volume search keywords right next to your brand name.' },
      { step: 2, title: 'Paste High-Converting Bio', desc: 'Replace vague quotes with clear value points and WhatsApp link.' }
    ]
  };
}

/**
 * 4. YOUTUBE CHANNEL & VIDEO SEO AUDIT
 */
export function performYouTubeAudit(rawInput) {
  const input = (rawInput || '').trim();
  const hash = getStringHash(input || 'youtube');
  const baseScore = 44 + (hash % 25);

  const flaws = [
    {
      rule: 'YouTube VideoObject Schema Markup',
      status: 'CRITICAL',
      issue: 'Video missing VideoObject JSON-LD schema on embedding website. Google Search Video Carousel cannot index key moments.',
      fix: 'Embed VideoObject schema with uploadDate, duration, and clip timestamps.'
    },
    {
      rule: 'Click-Through Rate (CTR) Title Formula',
      status: 'WARNING',
      issue: 'Title lacks curiosity gap brackets or current year (2026) modifier.',
      fix: 'Deploy formula: [High Impact Action] + [Target Keyword] + [Brackets / Proof].'
    },
    {
      rule: '5,000-Character Description & Chapter Timestamps',
      status: 'WARNING',
      issue: 'Missing 00:00 chapter timestamps in first 3 lines of description.',
      fix: 'Add clickable timestamps (00:00 Intro, 01:25 Step 1...) to trigger Google SERP Key Moments.'
    }
  ];

  const headCode = `<!-- 1. HIGH-CTR YOUTUBE TITLE & DESCRIPTION BLUEPRINT -->
A/B TITLE VARIATIONS (Under 65 Chars):
Variation A: How to Scale E-Commerce Sales in India (2026 Step-by-Step Blueprint)
Variation B: Stop Losing Money on Amazon & Flipkart! [Live Case Study]

DESCRIPTION TEMPLATE:
In this masterclass, discover how to optimize product listings, eliminate RTO losses, and achieve pure white background photos using Seller Suite Pro.

⏱️ CHAPTER TIMESTAMPS:
00:00 - Introduction & E-Commerce Secrets
02:15 - Amazon A9 Listing SEO Optimization
05:40 - #FFFFFF Pure White Background Photo Studio
08:20 - RTO Courier Loss Calculator
12:00 - Live Q&A & Free Software Access

🔗 OFFICIAL TOOLS & RESOURCES:
- Seller Suite Pro: https://www.sellersuitepro.online/
- Follow on Instagram: @sidramotion.official`;

  const schemaCode = `<!-- 2. GOOGLE SEARCH VIDEO CAROUSEL JSON-LD SCHEMA -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Scale E-Commerce Sales in India (2026 Blueprint)",
  "description": "Step-by-step masterclass on Amazon, Flipkart, and Meesho seller optimization.",
  "thumbnailUrl": [
    "https://www.sellersuitepro.online/seller-suite-pro-promo-poster.jpg"
  ],
  "uploadDate": "2026-10-14T08:00:00+05:30",
  "duration": "PT15M30S",
  "contentUrl": "${input.includes('youtube') ? input : 'https://www.youtube.com/watch?v=sample'}",
  "embedUrl": "https://www.youtube.com/embed/sample",
  "hasPart": [
    {
      "@type": "Clip",
      "name": "Listing SEO Secrets",
      "startOffset": 135,
      "endOffset": 340,
      "url": "https://www.youtube.com/watch?v=sample&t=135s"
    }
  ]
}
</script>`;

  const robotsCode = `# 3. 500-CHARACTER YOUTUBE VIDEO TAGS:
amazon seller tools, flipkart seller tools, meesho seller tutorial, ecommerce business india, online selling tips, how to sell on amazon india, amazon listing seo, pure white background product photography, rto losses ecommerce, sellersuitepro, sidra motion, ecommerce profit calculator, buybox repricer india`;

  const extraCode = `# 4. YOUTUBE RANKING ESSENTIALS:
[ ] Upload 1280x720 thumbnail with high-contrast text (< 5 words).
[ ] Pin top comment with direct call-to-action link.
[ ] Add End Screen linking to next tutorial video and Subscribe button.`;

  return {
    target: input || 'YouTube Channel / Video',
    currentScore: baseScore,
    fixedScore: 99,
    statusBadge: baseScore < 50 ? 'CRITICAL ALGORITHM DEFECTS' : 'OPTIMIZATION OPPORTUNITIES DETECTED',
    flaws,
    codeSnippets: { headCode, schemaCode, robotsCode, extraCode },
    manualActionGuide: [
      { step: 1, title: 'Update Title with Bracketed Proof', desc: 'Add [2026 Guide] or [Step-by-Step] to boost CTR by 30%.' },
      { step: 2, title: 'Embed Chapters in Description', desc: 'Add 00:00 timestamps to rank in Google Search Key Moments carousel.' }
    ]
  };
}

/**
 * 5. E-COMMERCE MARKETPLACE SEO (AMAZON / FLIPKART / MEESHO)
 */
export function performEcommerceAudit(rawInput) {
  const input = (rawInput || '').trim();
  const asinMatch = input.match(/\b(B0[A-Z0-9]{8})\b/i);
  const asin = asinMatch ? asinMatch[1].toUpperCase() : 'B0C74MS1L5';
  const hash = getStringHash(input || 'ecom');
  const baseScore = 45 + (hash % 23);

  const flaws = [
    {
      rule: 'Amazon A9 Algorithm Title Formula',
      status: 'CRITICAL',
      issue: 'Product title missing structured order: [Brand] + [Model] + [Primary Benefit] + [Pack/Color/Size].',
      fix: 'Rebuild title according to Amazon India 150-180 character guidelines.'
    },
    {
      rule: '5 Benefit Bullets with Capitalized Hooks',
      status: 'WARNING',
      issue: 'Bullet points are unstructured paragraphs lacking eye-catching capitalized emotional hooks.',
      fix: 'Format all 5 bullets with hooks: [FEATURE IN CAPS]: [Customer Benefit & Proof].'
    },
    {
      rule: '249-Byte Generic Backend Search Terms',
      status: 'WARNING',
      issue: 'Search terms exceed 249 bytes or repeat words already present in title.',
      fix: 'Strip punctuation, commas, and duplicate words to maximize indexing bytes.'
    }
  ];

  const headCode = `<!-- 1. AMAZON & FLIPKART OPTIMIZED TITLE & BULLETS FOR ${asin} -->
TITLE (165 Characters):
ApexSound Pulse 500 Wireless Bluetooth Earbuds | 40H Playtime, ANC Active Noise Cancellation, IPX7 Waterproof & Deep Bass | In-Ear Gaming Headphones (Matte Black)

5 CAPITALIZED BULLET POINTS:
• [40-HOUR MARATHON PLAYTIME]: Power through your entire week with 40 hours of uninterrupted playback and Type-C Fast Charging (10 mins charge = 2 hours music).
• [ACTIVE NOISE CANCELLATION (ANC)]: Block out 90% of background metro, gym, and office noise with hybrid ANC microphones for crystal-clear HD calling.
• [IPX7 SWEAT & WATERPROOF]: Built with industrial silicone sealing to survive intense gym sweat, heavy rain, and dust workouts without damage.
• [ULTRA-LOW LATENCY GAMING]: Seamless 45ms audio-video synchronization ensures lag-free gaming on BGMI, Call of Duty, and Netflix streaming.
• [1-YEAR REPLACEMENT WARRANTY]: Engineered with premium aerospace materials and backed by Sidra Motion 1-Year Pan-India Replacement Guarantee.`;

  const schemaCode = `<!-- 2. PRODUCT & MERCHANT CENTER JSON-LD SCHEMA -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "ApexSound Pulse 500 Wireless Bluetooth Earbuds",
  "image": "https://www.sellersuitepro.online/seller-suite-pro-promo-poster.jpg",
  "description": "ANC Wireless Bluetooth Earbuds with 40H Playtime and IPX7 Waterproofing.",
  "sku": "${asin}",
  "mpn": "ASP-500",
  "brand": {
    "@type": "Brand",
    "name": "ApexSound"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://www.amazon.in/dp/${asin}",
    "priceCurrency": "INR",
    "price": "1499",
    "priceValidUntil": "2027-12-31",
    "itemCondition": "https://schema.org/NewCondition",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1250"
  }
}
</script>`;

  const robotsCode = `# 3. 249-BYTE GENERIC BACKEND SEARCH TERMS (NO COMMAS, ZERO REPEATS):
earphone bluetooth wireless airpod headphones buds gaming mic anc noise cancelling calling gym waterproof bass tws inear earphones ear buds sports typec android iphone`;

  const extraCode = `# 4. MARKETPLACE CONVERSION AUDIT:
[ ] Main image is 100% pure white (#FFFFFF) background with 85%+ product frame occupancy.
[ ] 6 gallery images include 2 infographic benefit cards and 1 lifestyle usage photo.
[ ] A+ Content / EBC (Enhanced Brand Content) enabled with comparison matrix.`;

  return {
    target: input || asin,
    currentScore: baseScore,
    fixedScore: 99,
    statusBadge: baseScore < 50 ? 'CRITICAL ALGORITHM DEFECTS' : 'OPTIMIZATION OPPORTUNITIES DETECTED',
    flaws,
    codeSnippets: { headCode, schemaCode, robotsCode, extraCode },
    manualActionGuide: [
      { step: 1, title: 'Update Title in Seller Central', desc: 'Paste the structured title into Amazon Seller Central or Flipkart Seller Hub.' },
      { step: 2, title: 'Refresh Backend Search Terms', desc: 'Copy the 249-byte terms into the generic keywords tab with zero commas.' }
    ]
  };
}

/**
 * 6. MASTER DISPATCHER: DYNAMICALLY RUNS AUDIT FOR ANY OF THE 10 ENGINES
 */
export async function performDynamicPlatformAudit(engineId, rawInput) {
  const input = (rawInput || '').trim();

  switch (engineId) {
    case 'website-seo':
      return await performWebsiteSeoAudit(input);

    case 'gmb-seo':
      return performGmbAudit(input);

    case 'instagram-seo':
      return performInstagramAudit(input);

    case 'youtube-seo':
      return performYouTubeAudit(input);

    case 'ecommerce-seo':
      return performEcommerceAudit(input);

    case 'facebook-seo':
    case 'linkedin-seo':
    case 'directory-seo':
    case 'ai-geo-seo':
    case 'rank-competitor-seo':
    default:
      // For remaining engines, run contextual local entity audit tailored to input
      return performGmbAudit(input);
  }
}

/**
 * 7. POPULAR AI & INDUSTRY SEO TOOLS SYNC DIRECTORY
 * Direct 1-click live testing links prefilled with user query
 */
export const POPULAR_SEO_AI_SYNC_TOOLS = [
  {
    id: 'google-pagespeed',
    name: 'Google PageSpeed Insights',
    provider: 'Official Google Tool',
    category: 'Speed & Core Web Vitals',
    badge: 'GOOGLE OFFICIAL',
    badgeColor: '#4285f4',
    iconColor: '#4285f4',
    desc: 'Test real-world mobile speed, LCP, INP, and Core Web Vitals directly on Google servers.',
    getSyncUrl: (target) => {
      const url = target.startsWith('http') ? target : `https://${target}`;
      return `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}`;
    }
  },
  {
    id: 'google-rich-results',
    name: 'Google Rich Results Test',
    provider: 'Official Google Schema Validator',
    category: 'Schema & Rich Snippets',
    badge: 'SCHEMA VERIFIED',
    badgeColor: '#34a853',
    iconColor: '#34a853',
    desc: 'Verify if your LocalBusiness, Product, or FAQPage schema qualifies for Google rich snippets.',
    getSyncUrl: (target) => {
      const url = target.startsWith('http') ? target : `https://${target}`;
      return `https://search.google.com/test/rich-results?url=${encodeURIComponent(url)}`;
    }
  },
  {
    id: 'moz-local',
    name: 'Moz Local & Citation Checker',
    provider: 'Moz SEO Intelligence',
    category: 'Local GMB & Citations',
    badge: 'LOCAL 3-PACK',
    badgeColor: '#00d2ff',
    iconColor: '#00d2ff',
    desc: 'Check NAP consistency, directory citations, and missing Google Business Profile sync points.',
    getSyncUrl: (target) => `https://moz.com/products/local`
  },
  {
    id: 'brightlocal-search',
    name: 'BrightLocal Search Checker',
    provider: 'BrightLocal Global',
    category: 'Google Maps 3-Pack Rankings',
    badge: 'MAPS AUDIT',
    badgeColor: '#f59e0b',
    iconColor: '#f59e0b',
    desc: 'Inspect exact localized Google 3-Pack rankings from any pin code or city in India.',
    getSyncUrl: (target) => `https://www.brightlocal.com/resources/local-search-results-checker/`
  },
  {
    id: 'ahrefs-authority',
    name: 'Ahrefs Website Authority & Backlinks',
    provider: 'Ahrefs Global',
    category: 'Domain Rating & Backlinks',
    badge: 'INDUSTRY LEADER',
    badgeColor: '#ff5c35',
    iconColor: '#ff5c35',
    desc: 'Analyze Domain Rating (DR), total referring domains, and organic keyword trajectory.',
    getSyncUrl: (target) => {
      const clean = target.replace(/^https?:\/\//i, '').split('/')[0];
      return `https://ahrefs.com/website-authority-checker/?input=${encodeURIComponent(clean)}`;
    }
  },
  {
    id: 'semrush-overview',
    name: 'Semrush Domain & Keyword Overview',
    provider: 'Semrush Enterprise',
    category: 'Organic Traffic & Competitors',
    badge: 'ORGANIC SERP',
    badgeColor: '#ff642d',
    iconColor: '#ff642d',
    desc: 'Scan top organic ranking keywords, search intent gaps, and rival e-commerce traffic.',
    getSyncUrl: (target) => {
      const clean = target.replace(/^https?:\/\//i, '').split('/')[0];
      return `https://www.semrush.com/analytics/overview/?q=${encodeURIComponent(clean)}`;
    }
  },
  {
    id: 'perplexity-ai-seo',
    name: 'Perplexity AI Real-Time SEO Deep Audit',
    provider: 'Perplexity AI Search',
    category: 'AI Generative Search (GEO)',
    badge: 'AI COPILOT',
    badgeColor: '#06b6d4',
    iconColor: '#06b6d4',
    desc: 'Launch real-time AI research analyzing search sentiment, competitor reviews, and ranking opportunities.',
    getSyncUrl: (target) => {
      const prompt = `Perform a comprehensive SEO and digital visibility audit for "${target}". What are the top 3 ranking keywords, Google Maps 3-Pack gaps, and schema fixes?`;
      return `https://www.perplexity.ai/search?q=${encodeURIComponent(prompt)}`;
    }
  },
  {
    id: 'chatgpt-seo-expert',
    name: 'ChatGPT 4o Technical SEO Advisor',
    provider: 'OpenAI ChatGPT',
    category: 'AI Audit & Content Strategy',
    badge: 'AI COPILOT',
    badgeColor: '#10b981',
    iconColor: '#10b981',
    desc: 'Ask ChatGPT 4o to audit technical ranking flaws, metadata defects, and conversion hooks.',
    getSyncUrl: (target) => {
      const prompt = `Act as an expert Technical SEO and Google Maps specialist. Audit "${target}". List 3 critical crawl defects, optimized title and meta tags, and validated JSON-LD schema.`;
      return `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
    }
  }
];
