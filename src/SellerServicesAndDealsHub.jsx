import React, { useState } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  MessageSquare, 
  CheckCircle2, 
  ExternalLink, 
  Truck, 
  Printer, 
  Package, 
  FileText, 
  Coffee, 
  ShieldCheck, 
  ArrowRight, 
  Star, 
  Zap, 
  Clock, 
  DollarSign, 
  Check, 
  Heart,
  Headphones
} from 'lucide-react';
import { OFFICIAL_AGENT_WHATSAPP, OFFICIAL_AGENT_DISPLAY_PHONE } from './licenseManager.js';
import { AmazonLogo, FlipkartLogo, MeeshoLogo } from './MarketplaceLogos.jsx';

export default function SellerServicesAndDealsHub() {
  const [activeTab, setActiveTab] = useState('services'); // 'services' | 'deals' | 'support'
  const [copiedUpi, setCopiedUpi] = useState(false);

  const UPI_ID = 'sidramotions@okaxis';

  const sendWhatsAppBooking = (serviceName, price) => {
    const text = `Hello Sidra Motion Team! 💼

I am an e-commerce seller on https://sellersuitepro.online.
I want to hire your team for:
📌 Service: ${serviceName}
💰 Quoted Price: ${price}

Please share the onboarding details, required product info, and payment process!`;
    const url = `https://wa.me/${OFFICIAL_AGENT_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2200);
  };

  const AGENCY_SERVICES = [
    {
      id: 'store-launch',
      badge: 'Most Popular • Complete Store Launch',
      title: 'Full Multi-Marketplace Onboarding & Account Launch',
      marketplaces: ['Amazon', 'Flipkart', 'Meesho'],
      price: '₹9,999',
      originalPrice: '₹18,000',
      discount: '45% OFF',
      turnaround: '3 to 5 Days',
      features: [
        'Complete Seller Account setup & KYC approval',
        'GTIN Exemption / Brand approval with zero barcode cost',
        'First 20 Product Listings with A9 SEO Titles & Bullet Points',
        'Shipping template, courier pickup & warehouse location setup',
        'Bank account, GSTIN & TCS / TDS compliance linking'
      ]
    },
    {
      id: 'ebc-design',
      badge: 'High Conversion • Brand Building',
      title: 'Amazon A+ Content & Enhanced Brand Content (EBC) Design',
      marketplaces: ['Amazon'],
      price: '₹2,999',
      originalPrice: '₹5,500',
      discount: '45% OFF',
      turnaround: '24 to 48 Hours',
      features: [
        '5 Custom high-converting visual banners & infographic modules',
        'Product comparison chart & cross-selling matrix',
        'Mobile-first responsive layout tailored for Indian shoppers',
        'Copywriting with bold customer psychological hooks',
        'Full submission and Amazon Brand Registry approval support'
      ]
    },
    {
      id: 'photo-white-bg',
      badge: '100% Policy Compliant',
      title: 'Studio Pure White #FFFFFF Product Photo Retouching',
      marketplaces: ['Amazon', 'Flipkart', 'Meesho'],
      price: '₹49 / Photo',
      originalPrice: '₹120',
      discount: '59% OFF',
      turnaround: 'Same Day Delivery',
      features: [
        'Hand-drawn pen tool clipping mask (Zero jagged edges)',
        '100% Pure RGB (255, 255, 255) #FFFFFF background',
        'Natural drop shadow / ground reflection preservation',
        '1600x1600 px high-res zoom optimization for Amazon & Flipkart',
        'Scratch, dust, and color grading enhancement'
      ]
    },
    {
      id: 'seo-overhaul',
      badge: 'Ranking Booster',
      title: 'Listing SEO Overhaul & Competitor Flaw Neutralizer',
      marketplaces: ['Amazon', 'Flipkart'],
      price: '₹1,499 / SKU',
      originalPrice: '₹3,000',
      discount: '50% OFF',
      turnaround: '24 Hours',
      features: [
        'A9 high-volume keyword injection in Title & 5 Bullets',
        '249-byte backend search terms (Zero duplicate words)',
        'Competitor 1-star review mining to answer buyer doubts',
        'HTML formatted description for mobile display',
        'Guaranteed Listing Quality Score (LQS) 90+ out of 100'
      ]
    },
    {
      id: 'trademark-brand',
      badge: 'Legal & Protection',
      title: 'Trademark Registration & Amazon Brand Registry 2.0',
      marketplaces: ['Amazon', 'Flipkart'],
      price: '₹4,999',
      originalPrice: '₹8,500',
      discount: '41% OFF',
      turnaround: '2 to 3 Days',
      features: [
        'Trademark Class Search & Govt Application filing assistance',
        'Amazon Brand Registry 2.0 application submission',
        'Hijacker removal & BuyBox unauthorized seller shielding',
        'Unlock Brand Storefront, Video Ads, and A+ Content'
      ]
    }
  ];

  const SELLER_DEALS = [
    {
      id: 'shiprocket',
      icon: Truck,
      color: '#7c3aed',
      badge: 'Logistics Partner',
      title: 'Shiprocket Multi-Carrier Courier Delivery',
      desc: 'Ship across 29,000+ pin codes starting at just ₹20/500g with Delhivery, Blue Dart, DTDC, and Shadowfax. Cut RTO by 40% with AI-powered Automated NDR confirmation calls.',
      offer: 'Flat 40% Discount + ₹500 Free Recharge Credits',
      url: 'https://www.shiprocket.in/',
      cta: 'Claim Free Shipping Credits'
    },
    {
      id: 'thermal-printer',
      icon: Printer,
      color: '#00d2ff',
      badge: 'Seller Hardware',
      title: 'High-Speed 4x6" Thermal Shipping Label Printer',
      desc: 'Print 100 shipping labels in 60 seconds with Zero ink or ribbon expenses! Directly compatible with Amazon Easy Ship, Flipkart Express, Meesho, and Delhivery barcodes.',
      offer: 'Best Price on Amazon India (~₹3,499)',
      url: 'https://www.amazon.in/s?k=thermal+shipping+label+printer+4x6',
      cta: 'Check Seller Price on Amazon'
    },
    {
      id: 'courier-bags',
      icon: Package,
      color: '#f59e0b',
      badge: 'Packaging Supplies',
      title: 'Tamper-Proof Courier Envelopes with POD Jacket',
      desc: 'Heavy-duty 50+ micron tamper-evident courier bags approved by Amazon, Flipkart, and Meesho. Includes clear plastic POD jacket for automated airway bill (AWB) insertion.',
      offer: 'Bulk Pack of 500 Bags starting @ ₹1.20/bag',
      url: 'https://www.amazon.in/s?k=tamper+evident+courier+bags+with+pod+jacket',
      cta: 'View Packaging Bulk Deals'
    },
    {
      id: 'gst-billing',
      icon: FileText,
      color: '#25d366',
      badge: 'GST & Accounting',
      title: 'Vyapar / CaptainBiz E-Commerce GST Billing & Inventory',
      desc: 'Simplify multi-channel GST returns (GSTR-1, GSTR-3B) and e-Way bills. Automatically sync inventory stock across Amazon, Flipkart, and your physical wholesale counter.',
      offer: 'Free 14-Day Pro Trial + ₹500 Discount Code',
      url: 'https://vyaparapp.in/',
      cta: 'Get Free GST App Trial'
    }
  ];

  return (
    <section
      aria-label="Official Seller Services & Verified Partner Deals"
      style={{
        marginTop: '40px',
        borderTop: '1px solid rgba(37, 211, 102, 0.3)',
        paddingTop: '35px',
        width: '100%'
      }}
    >
      {/* Top Banner Header */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(0, 210, 255, 0.15) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.45)',
          padding: '5px 18px',
          borderRadius: '24px',
          color: '#25d366',
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '0.5px',
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>SIDRA MOTION OFFICIAL SELLER GROWTH HUB • EARN & EXPAND</span>
        </div>

        <h2 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: '#ffffff',
          fontFamily: "'Space Grotesk', sans-serif",
          margin: '0 0 10px 0'
        }}>
          Done-For-You Agency Services & Verified Seller Deals
        </h2>

        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          maxWidth: '840px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Need hands-off professional execution? Hire our in-house marketplace specialists for A+ content, account launch, or photography—or claim exclusive seller discounts on courier logistics and hardware.
        </p>

        {/* Navigation Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginTop: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: activeTab === 'services' ? '1.5px solid #25d366' : '1px solid rgba(255, 255, 255, 0.12)',
              background: activeTab === 'services' ? 'linear-gradient(135deg, rgba(37, 211, 102, 0.25) 0%, rgba(18, 140, 126, 0.25) 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'services' ? '#25d366' : '#cbd5e1',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'services' ? '0 0 20px rgba(37, 211, 102, 0.2)' : 'none'
            }}
          >
            <Briefcase size={16} />
            <span>💼 Hire Our Agency (Done-For-You Services)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('deals')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: activeTab === 'deals' ? '1.5px solid #00d2ff' : '1px solid rgba(255, 255, 255, 0.12)',
              background: activeTab === 'deals' ? 'linear-gradient(135deg, rgba(0, 210, 255, 0.25) 0%, rgba(14, 116, 144, 0.25) 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'deals' ? '#00d2ff' : '#cbd5e1',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: activeTab === 'deals' ? '0 0 20px rgba(0, 210, 255, 0.2)' : 'none'
            }}
          >
            <Truck size={16} />
            <span>🏷️ Logistics & Equipment Deals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('support')}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: activeTab === 'support' ? '1.5px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
              background: activeTab === 'support' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.25) 100%)' : 'rgba(15, 23, 42, 0.65)',
              color: activeTab === 'support' ? '#fbbf24' : '#cbd5e1',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Coffee size={16} />
            <span>☕ Support Free Platform (Chai Fund)</span>
          </button>
        </div>
      </div>

      {/* 1. AGENCY SERVICES SECTION */}
      {activeTab === 'services' && (
        <div>
          {/* Direct WhatsApp Callout Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            borderRadius: '16px',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '26px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#25d366',
                color: '#070d19',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                  Sidra Motion Official Seller Desk Active: {OFFICIAL_AGENT_DISPLAY_PHONE}
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '2px' }}>
                  24/7 Dedicated Account Managers • 100% Satisfaction Guarantee • Invoicing with GST
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => sendWhatsAppBooking('Custom Consultation & Store Growth', 'Flexible')}
              style={{
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(37, 211, 102, 0.35)'
              }}
            >
              <MessageSquare size={16} />
              <span>Talk to Seller Specialist on WhatsApp</span>
            </button>
          </div>

          {/* Service Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '22px'
          }}>
            {AGENCY_SERVICES.map(service => (
              <div
                key={service.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '18px',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 18, 36, 0.9) 100%)',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '10px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'rgba(37, 211, 102, 0.15)',
                      color: '#25d366',
                      border: '1px solid rgba(37, 211, 102, 0.4)',
                      fontWeight: '800'
                    }}>
                      {service.badge}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> {service.turnaround}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: '0 0 10px 0', lineHeight: '1.4' }}>
                    {service.title}
                  </h3>

                  {/* Marketplaces Pill */}
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                    {service.marketplaces.map(m => (
                      <span
                        key={m}
                        style={{
                          fontSize: '10px',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#e2e8f0',
                          fontWeight: '700'
                        }}
                      >
                        ✓ {m}
                      </span>
                    ))}
                  </div>

                  {/* Pricing Box */}
                  <div style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline'
                  }}>
                    <div>
                      <span style={{ fontSize: '22px', fontWeight: '800', color: '#25d366' }}>
                        {service.price}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', textDecoration: 'line-through', marginLeft: '8px' }}>
                        {service.originalPrice}
                      </span>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#fbbf24',
                      background: 'rgba(245, 158, 11, 0.15)',
                      padding: '2px 8px',
                      borderRadius: '8px'
                    }}>
                      {service.discount}
                    </span>
                  </div>

                  {/* Deliverables Checklist */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {service.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px', color: '#cbd5e1' }}>
                        <CheckCircle2 size={14} color="#25d366" style={{ marginTop: '2px', flexShrink: 0 }} />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => sendWhatsAppBooking(service.title, service.price)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(37, 211, 102, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <MessageSquare size={16} />
                  <span>Book on WhatsApp ({service.price})</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. LOGISTICS & HARDWARE DEALS SECTION */}
      {activeTab === 'deals' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '22px'
        }}>
          {SELLER_DEALS.map(deal => {
            const IconComponent = deal.icon;
            return (
              <div
                key={deal.id}
                className="glass-card"
                style={{
                  padding: '24px',
                  borderRadius: '18px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                  background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(10, 18, 36, 0.9) 100%)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: `${deal.color}20`,
                      border: `1px solid ${deal.color}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: deal.color
                    }}>
                      <IconComponent size={22} />
                    </div>
                    <span style={{
                      fontSize: '10px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#cbd5e1',
                      fontWeight: '700'
                    }}>
                      {deal.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', lineHeight: '1.4' }}>
                    {deal.title}
                  </h3>

                  <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 14px 0', lineHeight: '1.55' }}>
                    {deal.desc}
                  </p>

                  <div style={{
                    background: 'rgba(37, 211, 102, 0.1)',
                    border: '1px solid rgba(37, 211, 102, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: '#25d366',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Zap size={14} />
                    <span>Special Seller Deal: {deal.offer}</span>
                  </div>
                </div>

                <a
                  href={deal.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${deal.color} 0%, #00d2ff 100%)`,
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '800',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 15px rgba(0, 210, 255, 0.25)',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{deal.cta}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. SUPPORT FREE PLATFORM (CHAI FUND) SECTION */}
      {activeTab === 'support' && (
        <div style={{
          maxWidth: '680px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 15, 35, 0.95) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: '20px',
          padding: '30px',
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 35px rgba(245, 158, 11, 0.15)'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: '#070d19',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Coffee size={30} />
          </div>

          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 8px 0', fontFamily: "'Space Grotesk', sans-serif" }}>
            Support Our Free Tools with a Cutting Chai! ☕
          </h3>

          <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            Seller Suite Pro is 100% free with zero paywalls. If our AI listing tools, #FFFFFF studio, or RTO calculator helped your store grow, consider supporting our server infrastructure with a small contribution.
          </p>

          {/* Quick Amounts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '22px' }}>
            {[
              { label: 'Cutting Chai ☕', amount: '₹49' },
              { label: 'Special Chai 🫖', amount: '₹99' },
              { label: 'Seller Samosa Treat 🥐', amount: '₹249' }
            ].map(tier => (
              <div
                key={tier.amount}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '12px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{tier.label}</span>
                <span style={{ fontSize: '18px', fontWeight: '800', color: '#fbbf24' }}>{tier.amount}</span>
              </div>
            ))}
          </div>

          {/* Official UPI Box */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '18px'
          }}>
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Official Sidra Motion UPI ID (GPay / PhonePe / Paytm)
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#25d366', fontFamily: 'monospace' }}>
                {UPI_ID}
              </div>
            </div>

            <button
              type="button"
              onClick={copyUpiId}
              style={{
                background: copiedUpi ? '#25d366' : 'rgba(255, 255, 255, 0.1)',
                color: copiedUpi ? '#070d19' : '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              {copiedUpi ? <Check size={13} /> : <Zap size={13} />}
              <span>{copiedUpi ? 'Copied!' : 'Copy UPI ID'}</span>
            </button>
          </div>

          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>
            Every contribution directly funds our AI server GPUs and keeps all 8 tools 100% free for everyone! ❤️
          </p>
        </div>
      )}
    </section>
  );
}
