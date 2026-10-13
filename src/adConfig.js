// SELLER SUITE PRO 2026 - Official Ad & Monetization Configuration
// Sellersuitepro.online

export const DEFAULT_AD_CONFIG = {
  // Official Google AdSense Publisher ID for sellersuitepro.online
  pubId: 'ca-pub-6600425381242237',
  topSlotId: '',
  inFeedSlotId: '',
  footerSlotId: '',
  adsEnabled: true,
  autoAdsEnabled: true,
  fallbackSponsorsEnabled: true
};

export const getAdConfig = () => {
  try {
    const saved = localStorage.getItem('sidra_ads_config');
    if (saved) {
      return { ...DEFAULT_AD_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Error reading ad config from localStorage', e);
  }
  return { ...DEFAULT_AD_CONFIG };
};

export const saveAdConfig = (newConfig) => {
  try {
    const merged = { ...getAdConfig(), ...newConfig };
    localStorage.setItem('sidra_ads_config', JSON.stringify(merged));
    window.dispatchEvent(new Event('ad-config-updated'));
    return merged;
  } catch (e) {
    console.error('Error saving ad config', e);
    return DEFAULT_AD_CONFIG;
  }
};

// Premium E-Commerce Fallback Sponsors (shown while AdSense is pending approval or if no fill)
export const FALLBACK_SPONSORS = [
  {
    id: 'amazon-seller',
    badge: 'Official Marketplace Partner',
    title: 'Amazon India Seller Central',
    desc: 'Launch your products to 10+ Crore Indian shoppers. 50% waiver on selling fees for new registrations!',
    cta: 'Register as Amazon Seller',
    url: 'https://sell.amazon.in/',
    themeColor: '#ff9900',
    logo: '📦'
  },
  {
    id: 'shiprocket',
    badge: 'Logistics Partner',
    title: 'Shiprocket Multi-Carrier Shipping',
    desc: 'Automate courier delivery across 29,000+ pin codes starting at ₹20/500g. Reduce RTO by 40% with AI NDR.',
    cta: 'Claim Free Shipping Credits',
    url: 'https://www.shiprocket.in/',
    themeColor: '#7c3aed',
    logo: '🚚'
  },
  {
    id: 'flipkart-seller',
    badge: 'Marketplace Partner',
    title: 'Flipkart Seller Hub',
    desc: 'Sell across 19,000+ pincodes in India with 10-minute listing and express 7-day payments.',
    cta: 'Start Selling on Flipkart',
    url: 'https://seller.flipkart.com/',
    themeColor: '#2874f0',
    logo: '🛍️'
  },
  {
    id: 'meesho-supplier',
    badge: 'Zero Commission Marketplace',
    title: 'Meesho Supplier Panel',
    desc: '0% Commission on all categories. Keep 100% of your product profit with next-day dispatch.',
    cta: 'Register on Meesho',
    url: 'https://supplier.meesho.com/',
    themeColor: '#d946ef',
    logo: '🏷️'
  }
];
