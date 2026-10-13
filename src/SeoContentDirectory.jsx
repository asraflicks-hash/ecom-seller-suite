import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  HelpCircle, 
  ExternalLink, 
  ChevronDown, 
  Globe, 
  ShoppingBag,
  Sliders,
  DollarSign,
  Maximize2
} from 'lucide-react';
import { AmazonLogo, FlipkartLogo, MeeshoLogo } from './MarketplaceLogos.jsx';

export default function SeoContentDirectory({ onSwitchTab }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const SEO_CATEGORIES = [
    { id: 'all', label: 'All Seller Guides & Tools' },
    { id: 'amazon', label: 'Amazon A9 Listing SEO', icon: AmazonLogo },
    { id: 'flipkart', label: 'Flipkart FSN & Quality Score', icon: FlipkartLogo },
    { id: 'meesho', label: 'Meesho 0% Commission Hub', icon: MeeshoLogo },
    { id: 'image', label: '#FFFFFF Pure White Studio' },
    { id: 'repricer', label: 'BuyBox & Auto Repricer' },
    { id: 'rto', label: 'RTO & Profit Protection' }
  ];

  const SEO_CARDS = [
    {
      id: 'amazon-listing-seo',
      category: 'amazon',
      badge: 'Amazon India • A9 Algorithm',
      title: 'Amazon Listing SEO & Search Terms Optimization 2026',
      keywords: ['amazon listing seo', 'amazon backend search terms', 'a9 algorithm 2026', 'amazon bullet points generator', 'amazon 249 bytes rule'],
      desc: 'Master Amazon India search rankings with formula-driven titles (Brand + Model + Key Specs under 200 chars), 5 capitalized benefit bullet points, and 249-byte generic search terms without commas or repetition.',
      actionTab: 'listing-ai',
      actionLabel: 'Launch Amazon Listing Studio'
    },
    {
      id: 'flipkart-fsn-rankings',
      category: 'flipkart',
      badge: 'Flipkart Hub • Listing Score',
      title: 'Flipkart Listing Optimization & Quality Score (FSN) Booster',
      keywords: ['flipkart listing optimization', 'flipkart quality score', 'fsn audit', 'flipkart title formula', 'flipkart express tag'],
      desc: 'Achieve top organic ranking on Flipkart search by passing all 8 listing quality metrics. Auto-generate compliant titles, key feature bullets, and attribute tags for maximum visibility.',
      actionTab: 'listing-audit',
      actionLabel: 'Audit Flipkart Listing Score'
    },
    {
      id: 'meesho-catalog-converter',
      category: 'meesho',
      badge: 'Meesho Hub • 0% Commission',
      title: 'Meesho Catalog Converter & Single SKU Upload Formatter',
      keywords: ['meesho catalog converter', 'meesho upload excel', 'meesho single sku format', 'meesho pricing calculator', 'meesho zero commission'],
      desc: 'Convert complex Amazon and Flipkart catalog spreadsheets into Meesho single-page upload format in 1-click. Keep 100% margin with intelligent pricing tier recommendations.',
      actionTab: 'catalog-convert',
      actionLabel: 'Convert to Meesho Catalog'
    },
    {
      id: 'pure-white-studio',
      category: 'image',
      badge: 'Compliance Standard • RGB (255,255,255)',
      title: 'Amazon Pure White Background Tool (#FFFFFF Compliance)',
      keywords: ['amazon pure white background tool', 'rgb 255 255 255 online', 'product photo background white', 'amazon 1600x1600 zoom', 'white bg studio'],
      desc: 'Ensure 100% compliance with Amazon Main Image guidelines. Clean backgrounds to absolute pure RGB (255,255,255) #FFFFFF with zero shadows, high-resolution 1600x1600 zoom, and 85% frame fill ratio.',
      actionTab: 'image-studio',
      actionLabel: 'Open Pure White Studio'
    },
    {
      id: 'buybox-repricing',
      category: 'repricer',
      badge: 'Price Warfare • Profit Guard',
      title: 'Amazon & Flipkart Real-Time BuyBox Repricer',
      keywords: ['amazon buybox repricer', 'auto repricer ecommerce', 'flipkart buybox win', 'dynamic price adjustment', 'profit margin stops'],
      desc: 'Win the BuyBox at the highest possible selling price. Automate penny-undercutting with strict minimum floor and ceiling stops to protect gross profit margins against price-war algorithms.',
      actionTab: 'buybox-repricer',
      actionLabel: 'Run Auto BuyBox Repricer'
    },
    {
      id: 'rto-profit-guard',
      category: 'rto',
      badge: 'Cashflow Protection • RTO Shield',
      title: 'E-Commerce RTO Calculator & Net Profit Cashflow Guard',
      keywords: ['rto calculator ecommerce', 'net profit calculator amazon flipkart', 'reverse courier loss', 'cod rto reduction', 'break even price formula'],
      desc: 'Stop burning cash on customer returns. Simulate 100 orders accounting for forward and reverse courier penalties, packaging losses, and marketplace commissions to calculate exact take-home cashflow.',
      actionTab: 'rto-calculator',
      actionLabel: 'Calculate Net Cashflow & RTO'
    },
    {
      id: 'review-gap-miner',
      category: 'amazon',
      badge: 'Competitive Intelligence • 1-Star Flaws',
      title: 'Competitor Review & Negative Feedback Mining Studio',
      keywords: ['review gap analyzer', 'amazon competitor analysis', 'mine 1 star reviews', 'crush rival listings', 'customer flaw extractor'],
      desc: 'Extract competitor flaws, recurring buyer complaints, and unmet needs from 1-star reviews on Amazon, Flipkart, and Meesho to craft listings that solve customer pain points.',
      actionTab: 'review-analyzer',
      actionLabel: 'Mine Competitor Flaws'
    },
    {
      id: 'omnichannel-marketing',
      category: 'all',
      badge: 'Omnichannel 360° • 8 Marketing Kits',
      title: '360° Omnichannel E-Commerce SEO & Advertising Suite',
      keywords: ['omnichannel seller tools', 'amazon ppc keyword research', 'flipkart ads strategy', 'meesho broadcast messages', 'ecommerce whatsapp marketing'],
      desc: 'All-inclusive marketing toolchain featuring 8 dedicated kits and 76 output types: Google Shopping feeds, WhatsApp broadcast copy, Instagram carousel briefs, and PPC keyword clusters.',
      actionTab: 'omnichannel-seo',
      actionLabel: 'Access Omnichannel Suite'
    }
  ];

  const SEO_FAQS = [
    {
      q: 'How to optimize Amazon product listings to rank on Page 1?',
      a: 'To rank on Page 1 of Amazon India search results, follow the A9 algorithm formula: 1) Include Brand + Model + Top 3 Features in under 200 characters in the Title. 2) Capitalize the first 3-5 words of every bullet point as a benefit hook. 3) Maximize 249 bytes in backend search terms without commas or duplicate words. 4) Ensure your main image is RGB (255,255,255) pure white.'
    },
    {
      q: 'Why does Amazon reject product images without pure white background?',
      a: 'Amazon strictly mandates pure #FFFFFF (RGB 255, 255, 255) background for all Main Images to deliver a consistent, distraction-free mobile shopping experience. Off-white backgrounds (e.g. RGB 250, 250, 250) trigger listing suppression. Seller Suite Pro provides a free pure white studio that achieves exact #FFFFFF in 1 click.'
    },
    {
      q: 'How to convert Amazon listings into Flipkart and Meesho catalog format?',
      a: 'Every marketplace has different catalog formats. Amazon uses flat file TSVs with specific bullet points, Flipkart uses FSN attributes, and Meesho uses single-column specifications. Seller Suite Pro Bulk Catalog Converter automatically restructures title length, attributes, and bullet points to match each platform schema.'
    },
    {
      q: 'What is the formula to calculate e-commerce RTO losses and net take-home profit?',
      a: 'Actual Net Cashflow = (Delivered Orders × Gross Profit Per Unit) - (RTO Returned Orders × [Forward Courier + Reverse Courier + Packaging Waste]). If your RTO is above 25%, you must adjust product pricing upwards by at least ₹40-₹60 to buffer against return courier deductions.'
    },
    {
      q: 'Is Seller Suite Pro 100% free for Indian e-commerce sellers?',
      a: 'Yes! All 8 core modules—including AI Listing Generator, Pure White Studio, Bulk Catalog Converter, BuyBox Repricer, RTO Calculator, and RGB Listing Quality Score—are 100% free with zero registration fees or lock screens.'
    }
  ];

  const KEYWORD_CLOUD = [
    'Amazon Listing SEO', 'Flipkart FSN Optimizer', 'Meesho Catalog Upload',
    'Pure White #FFFFFF Tool', 'Amazon BuyBox Repricer', 'RTO Calculator Ecommerce',
    'RGB Listing Quality Score', 'Amazon A9 Algorithm', 'Flipkart Quality Score',
    'Meesho 0% Commission', 'Amazon Backend Search Terms', 'Ecommerce Net Profit Calculator',
    'Indian Seller Central Tools', 'Product Photo Pure White Background', 'Amazon Bullet Points Generator',
    'Reverse Courier Loss Formula', 'Competitor Review Mining', 'Amazon ASIN SEO Audit'
  ];

  const filteredCards = SEO_CARDS.filter(card => {
    const matchesCat = activeCategory === 'all' || card.category === activeCategory;
    const matchesQuery = searchQuery === '' || 
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesQuery;
  });

  return (
    <section 
      aria-label="E-Commerce Seller SEO & Knowledge Index"
      style={{
        marginTop: '45px',
        borderTop: '1px solid rgba(0, 210, 255, 0.25)',
        paddingTop: '35px',
        width: '100%'
      }}
    >
      {/* Header with Search Intent Focus */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 210, 255, 0.12)',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          padding: '4px 16px',
          borderRadius: '24px',
          color: '#00d2ff',
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          <Sparkles size={13} />
          <span>OFFICIAL SELLER SEO & KEYWORDS KNOWLEDGE HUB</span>
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
          margin: '0 0 10px 0'
        }}>
          Complete E-Commerce Seller Optimization & Ranking Directory
        </h2>

        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          maxWidth: '820px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Rank #1 on <strong style={{ color: '#ff9900' }}>Amazon India</strong>, <strong style={{ color: '#2874f0' }}>Flipkart</strong>, and <strong style={{ color: '#d946ef' }}>Meesho</strong>. 
          Formula-driven SEO, #FFFFFF compliant imagery, zero-loss repricing, and multi-channel catalog synchronization.
        </p>

        {/* Real-time Category Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          marginTop: '22px',
          flexWrap: 'wrap'
        }}>
          {SEO_CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '12px',
                  border: isActive ? '1px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.1)',
                  background: isActive ? 'rgba(0, 210, 255, 0.22)' : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? '#00d2ff' : '#cbd5e1',
                  fontSize: '12px',
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {cat.icon && <cat.icon size={14} />}
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* SEO Topic Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        {filteredCards.map(card => (
          <article
            key={card.id}
            className="glass-card"
            style={{
              padding: '22px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '14px',
              transition: 'all 0.25s ease'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  fontSize: '10px',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  background: 'rgba(0, 210, 255, 0.12)',
                  color: '#00d2ff',
                  border: '1px solid rgba(0, 210, 255, 0.35)',
                  fontWeight: '700'
                }}>
                  {card.badge}
                </span>
                <span style={{ fontSize: '10px', color: '#25d366', fontWeight: '700' }}>
                  ✓ 100% Free Tool
                </span>
              </div>

              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                {card.title}
              </h3>

              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.55' }}>
                {card.desc}
              </p>

              {/* Keyword Badges */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {card.keywords.map((kw, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '10px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      color: '#cbd5e1',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onSwitchTab(card.actionTab)}
              style={{
                width: '100%',
                padding: '9px 14px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(37, 211, 102, 0.15) 100%)',
                border: '1px solid rgba(0, 210, 255, 0.4)',
                color: '#00d2ff',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #00d2ff 0%, #25d366 100%)';
                e.currentTarget.style.color = '#070d19';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(37, 211, 102, 0.15) 100%)';
                e.currentTarget.style.color = '#00d2ff';
              }}
            >
              <span>{card.actionLabel}</span>
              <ArrowRight size={14} />
            </button>
          </article>
        ))}
      </div>

      {/* High-Intent Keyword Cloud Section */}
      <div className="glass-panel" style={{
        padding: '24px',
        borderRadius: '18px',
        marginBottom: '35px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Globe size={16} color="#00d2ff" />
          <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0 }}>
            Indexed Search Queries & High-Intent Seller Keywords
          </h4>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {KEYWORD_CLOUD.map((kw, i) => (
            <span
              key={i}
              style={{
                fontSize: '11px',
                padding: '5px 12px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid rgba(0, 210, 255, 0.25)',
                color: '#e2e8f0',
                fontWeight: '600'
              }}
            >
              🔍 {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Expandable FAQ Accordion for Search Engine Rich Answers */}
      <div className="glass-panel" style={{
        padding: '28px',
        borderRadius: '18px',
        border: '1px solid rgba(0, 210, 255, 0.25)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <HelpCircle size={18} color="#00d2ff" />
          <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', margin: 0 }}>
            Frequently Asked Questions — E-Commerce SEO, Imagery & Repricing
          </h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {SEO_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index}
                style={{
                  background: 'rgba(0, 0, 0, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'transparent',
                    border: 'none',
                    color: isOpen ? '#00d2ff' : '#ffffff',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: '12px'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                </button>

                {isOpen && (
                  <div style={{
                    padding: '0 18px 14px 18px',
                    fontSize: '12px',
                    color: '#94a3b8',
                    lineHeight: '1.6',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
