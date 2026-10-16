// src/marketplaceRulesConfig.js - Master Marketplace Rules & Specification Config
export const MARKETPLACES_CONFIG = [
  {
    id: 'amazon',
    name: 'Amazon India',
    tag: 'Amazon.in',
    iconColor: '#f97316',
    bgColor: 'rgba(249, 115, 22, 0.12)',
    borderColor: 'rgba(249, 115, 22, 0.4)',
    sellerPortalName: 'Amazon Seller Central',
    sellerPortalUrl: 'https://sellercentral.amazon.in',
    rules: {
      titleMaxChars: 200,
      titleMaxBytes: 249,
      titleFormula: '[Brand] + [Model/Product Name] + [Key Specs/Features] + [Color/Material] + [Pack Size]',
      bulletCount: 5,
      bulletMaxChars: 250,
      bulletFormat: 'Start with [CAPITALIZED BENEFIT] in brackets followed by explanation.',
      descriptionMaxChars: 2000,
      searchTermsMaxBytes: 249,
      searchTermsRules: 'Max 249 UTF-8 bytes. No brand names, no punctuation, no duplicates, space-separated.',
      imageRules: {
        bgColor: '#FFFFFF',
        minResolution: 1600,
        frameFillPct: 85,
        requiredAngle: 'Pure white background (#FFFFFF) seamless crop, product filling 85%+ of frame.'
      },
      bannedWords: [
        'free shipping', 'guarantee', 'warranty', 'best', 'sale', 'discount', 
        'cheap', 'top rated', 'offer', 'lowest price', '#1', '100% authentic', 
        'money back', 'satisfaction guaranteed'
      ],
      mandatoryAttributes: ['Brand', 'Product Name', 'Color', 'Size', 'Material', 'Pack Size', 'HSN Code', 'Country of Origin']
    },
    checklistSequence: [
      { key: 'title', label: 'Item Name / Title', fieldType: 'input' },
      { key: 'brand', label: 'Brand Name', fieldType: 'input' },
      { key: 'bullet_1', label: 'Bullet Point 1 (Feature & Benefit)', fieldType: 'textarea' },
      { key: 'bullet_2', label: 'Bullet Point 2 (Performance / Durability)', fieldType: 'textarea' },
      { key: 'bullet_3', label: 'Bullet Point 3 (Material & Build Quality)', fieldType: 'textarea' },
      { key: 'bullet_4', label: 'Bullet Point 4 (Compatibility / Use Case)', fieldType: 'textarea' },
      { key: 'bullet_5', label: 'Bullet Point 5 (In The Box & Support)', fieldType: 'textarea' },
      { key: 'searchTerms', label: 'Generic Keywords / Search Terms (<= 249 bytes)', fieldType: 'input' },
      { key: 'description', label: 'Product Description (Plain text)', fieldType: 'textarea' },
      { key: 'aplusOutline', label: 'A+ Content Module Text & Wireframe', fieldType: 'textarea' },
      { key: 'browseNode', label: 'Recommended Browse Node / Category', fieldType: 'input' }
    ]
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    tag: 'Flipkart.com',
    iconColor: '#2563eb',
    bgColor: 'rgba(37, 99, 235, 0.12)',
    borderColor: 'rgba(37, 99, 235, 0.4)',
    sellerPortalName: 'Flipkart Seller Hub',
    sellerPortalUrl: 'https://seller.flipkart.com',
    rules: {
      titleMaxChars: 150,
      titleMaxBytes: 180,
      titleFormula: '[Brand] + [Product Name] + [Key Spec/Model] + (Color/Size)',
      bulletCount: 5,
      bulletMaxChars: 120,
      bulletFormat: 'Short bulleted highlights under 120 characters each.',
      descriptionMaxChars: 1500,
      searchTermsMaxBytes: 150,
      searchTermsRules: 'Comma-separated search tags relevant to Indian buyer intent.',
      imageRules: {
        bgColor: '#FFFFFF',
        minResolution: 1100,
        frameFillPct: 80,
        requiredAngle: 'Clean white or light grey background, clear front view.'
      },
      bannedWords: [
        'exclusive', 'free gift', 'best deal', 'guaranteed', 'wholesale', 
        'flipkart assured fake claim', 'contact number', 'discount code'
      ],
      mandatoryAttributes: ['Brand', 'Model Name', 'Color', 'Size', 'Ideal For', 'Fabric/Material', 'HSN Code', 'GST %']
    },
    checklistSequence: [
      { key: 'title', label: 'Product Title', fieldType: 'input' },
      { key: 'brand', label: 'Brand', fieldType: 'input' },
      { key: 'bullet_1', label: 'Highlight 1', fieldType: 'input' },
      { key: 'bullet_2', label: 'Highlight 2', fieldType: 'input' },
      { key: 'bullet_3', label: 'Highlight 3', fieldType: 'input' },
      { key: 'bullet_4', label: 'Highlight 4', fieldType: 'input' },
      { key: 'bullet_5', label: 'Highlight 5', fieldType: 'input' },
      { key: 'searchTerms', label: 'Keywords / Search Tags', fieldType: 'input' },
      { key: 'description', label: 'Description', fieldType: 'textarea' },
      { key: 'category', label: 'Vertical / Sub-Category', fieldType: 'input' }
    ]
  },
  {
    id: 'meesho',
    name: 'Meesho',
    tag: 'Meesho.com',
    iconColor: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    sellerPortalName: 'Meesho Supplier Panel',
    sellerPortalUrl: 'https://supplier.meesho.com',
    rules: {
      titleMaxChars: 100,
      titleMaxBytes: 120,
      titleFormula: '[Attractive Short Title with Key Keyword + Color + Pack]',
      bulletCount: 3,
      bulletMaxChars: 90,
      bulletFormat: 'Simple short points for Tier 2/3 mobile shoppers.',
      descriptionMaxChars: 1000,
      searchTermsMaxBytes: 100,
      searchTermsRules: 'Max 5 trending regional search keywords.',
      imageRules: {
        bgColor: 'Clean',
        minResolution: 800,
        frameFillPct: 75,
        requiredAngle: 'Clear lifestyle or studio photo on clean background.'
      },
      bannedWords: [
        'amazon', 'flipkart', 'cod available on call', 'call for price', 
        'whatsapp', 'phone number', 'paytm'
      ],
      mandatoryAttributes: ['Color', 'Fabric/Material', 'Net Quantity', 'Weight', 'Country of Origin']
    },
    checklistSequence: [
      { key: 'title', label: 'Product Name / Title (Concise <= 100 chars)', fieldType: 'input' },
      { key: 'description', label: 'Product Description (Short Specs & Care Instructions)', fieldType: 'textarea' },
      { key: 'netQuantity', label: 'Net Quantity / Pack Size', fieldType: 'input' },
      { key: 'material', label: 'Fabric / Material', fieldType: 'input' },
      { key: 'searchTerms', label: 'Search Tags / Keywords', fieldType: 'input' }
    ]
  },
  {
    id: 'myntra',
    name: 'Myntra',
    tag: 'Myntra Fashion',
    iconColor: '#f43f5e',
    bgColor: 'rgba(244, 63, 94, 0.12)',
    borderColor: 'rgba(244, 63, 94, 0.4)',
    sellerPortalName: 'Myntra Partner Portal',
    rules: {
      titleMaxChars: 120,
      titleMaxBytes: 140,
      titleFormula: '[Brand] + [Fit] + [Category/Product Name] in [Color]',
      bulletCount: 4,
      bulletMaxChars: 100,
      descriptionMaxChars: 1200,
      searchTermsMaxBytes: 120,
      bannedWords: ['cheap', 'low price', 'dupe', 'copy', 'first copy'],
      mandatoryAttributes: ['Brand', 'Size', 'Color', 'Fit', 'Fabric', 'Care Instructions', 'Country of Origin']
    },
    checklistSequence: [
      { key: 'title', label: 'Style Title', fieldType: 'input' },
      { key: 'description', label: 'Editorial Description', fieldType: 'textarea' },
      { key: 'bullet_1', label: 'Key Spec / Fabric', fieldType: 'input' },
      { key: 'bullet_2', label: 'Fit & Pattern', fieldType: 'input' }
    ]
  },
  {
    id: 'ajio',
    name: 'Ajio',
    tag: 'Reliance Retail',
    iconColor: '#0ea5e9',
    bgColor: 'rgba(14, 165, 233, 0.12)',
    borderColor: 'rgba(14, 165, 233, 0.4)',
    sellerPortalName: 'Ajio Business Portal',
    rules: {
      titleMaxChars: 120,
      titleMaxBytes: 140,
      titleFormula: '[Brand] + [Pattern] + [Product Category]',
      bulletCount: 4,
      bulletMaxChars: 100,
      descriptionMaxChars: 1000,
      searchTermsMaxBytes: 100,
      bannedWords: ['guarantee', 'free delivery', 'contact us'],
      mandatoryAttributes: ['Brand', 'Article Type', 'Color', 'Size', 'Fabric']
    },
    checklistSequence: [
      { key: 'title', label: 'Article Description', fieldType: 'input' },
      { key: 'description', label: 'Style Details', fieldType: 'textarea' }
    ]
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    tag: 'Beauty & Fashion',
    iconColor: '#d946ef',
    bgColor: 'rgba(217, 70, 239, 0.12)',
    borderColor: 'rgba(217, 70, 239, 0.4)',
    sellerPortalName: 'Nykaa Seller Hub',
    rules: {
      titleMaxChars: 140,
      titleMaxBytes: 160,
      titleFormula: '[Brand] + [Product Range] + [Variant/Shade/Volume]',
      bulletCount: 4,
      bulletMaxChars: 120,
      descriptionMaxChars: 1500,
      searchTermsMaxBytes: 140,
      bannedWords: ['miracle cure', '100% cure', 'fairness guarantee'],
      mandatoryAttributes: ['Brand', 'Volume/Weight', 'Shade/Color', 'Skin/Hair Type', 'Expiry Months']
    },
    checklistSequence: [
      { key: 'title', label: 'Product Name', fieldType: 'input' },
      { key: 'description', label: 'Product Overview & Ingredients', fieldType: 'textarea' }
    ]
  },
  {
    id: 'jiomart',
    name: 'JioMart',
    tag: 'JioMart Seller',
    iconColor: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    sellerPortalName: 'JioMart Merchant Panel',
    rules: {
      titleMaxChars: 130,
      titleMaxBytes: 150,
      titleFormula: '[Brand] + [Product Name] + [Weight/Pack]',
      bulletCount: 3,
      bulletMaxChars: 100,
      descriptionMaxChars: 1000,
      searchTermsMaxBytes: 100,
      bannedWords: ['free gift', 'reliance promo'],
      mandatoryAttributes: ['Brand', 'Weight', 'MRP', 'HSN']
    },
    checklistSequence: [
      { key: 'title', label: 'Display Name', fieldType: 'input' },
      { key: 'description', label: 'Description', fieldType: 'textarea' }
    ]
  },
  {
    id: 'shopify',
    name: 'Shopify / D2C Store',
    tag: 'Direct-to-Consumer',
    iconColor: '#84cc16',
    bgColor: 'rgba(132, 204, 22, 0.12)',
    borderColor: 'rgba(132, 204, 22, 0.4)',
    sellerPortalName: 'Shopify Admin',
    rules: {
      titleMaxChars: 70, // Ideal for Google SEO on Shopify
      titleMaxBytes: 100,
      titleFormula: '[Brand] + [Product Name] | [Primary Benefit / D2C Hook]',
      bulletCount: 5,
      bulletMaxChars: 180,
      descriptionMaxChars: 3000,
      searchTermsMaxBytes: 250,
      bannedWords: [],
      mandatoryAttributes: ['Title', 'Handle', 'Price', 'SKU', 'Vendor', 'Tags']
    },
    checklistSequence: [
      { key: 'title', label: 'Page Title (SEO Optimized <= 70 chars)', fieldType: 'input' },
      { key: 'description', label: 'HTML Rich Product Description', fieldType: 'textarea' },
      { key: 'searchTerms', label: 'Meta Description & Product Tags', fieldType: 'textarea' }
    ]
  }
];

// 100% Pure English UI Labels
export const UI_LANG = {
  en: {
    wizardTitle: 'Create New Listing Wizard',
    wizardSubtitle: 'Generate 100% marketplace-compliant listings across Amazon, Flipkart, Meesho & D2C.',
    step1Title: 'Select Marketplaces',
    step1Desc: 'Choose where you want to sell. We apply official title formulas, byte limits, and image rules for each.',
    step2Title: 'Reference Product',
    step2Desc: 'Paste a competitor or reference link to analyze gaps, extract keywords, and improve listing flaws.',
    step3Title: 'Product Details',
    step3Desc: 'Enter your brand specifications, prices, dimensions, and upload your product photos.',
    step4Title: 'Generate & Optimize',
    step4Desc: 'AI generates compliant titles, 5 bullets, backend search terms, image briefs, and LQS scores.',
    step5Title: 'Copy-Paste Output',
    step5Desc: 'Field-by-field copy checklist matching your Seller Central / Hub panel sequence.',
    step6Title: 'Go Live & Track',
    step6Desc: 'Save your listings dashboard, track submission status, and run re-audits against live URLs.',
    btnNext: 'Next Step →',
    btnBack: '← Back',
    btnGenerate: '⚡ Generate Multi-Marketplace Listing',
    btnScan: '🔍 Scan Reference URL',
    btnCopy: 'Copy',
    btnCopied: 'Copied!',
    btnCopyAll: '📋 Copy All Fields',
    btnExportCsv: '📥 Download Excel / CSV',
    btnExportPdf: '📄 Download PDF Sheet',
    referenceInputPlaceholder: 'Paste Amazon, Flipkart, Meesho or any product URL...',
    fallbackTextTitle: 'Page blocked or taking too long? Paste product text or upload screenshot:',
    fallbackPlaceholder: 'Paste title, price, bullet points, or product specs here...',
    draftRestored: 'Saved draft restored from your browser session.',
    charCount: 'chars',
    byteCount: 'bytes',
    safe: 'Safe',
    overLimit: 'Over Limit',
    pureWhiteMainImg: 'Main Image: Pure White (#FFFFFF) & Resolution Check',
    reAuditBtn: '🔄 Re-Audit Live URL',
    saveListingBtn: '💾 Save to My Listings'
  }
};
UI_LANG.hi = UI_LANG.en; // Fallback strictly to English

