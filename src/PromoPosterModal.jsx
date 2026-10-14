import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  Gift, 
  ExternalLink,
  MessageCircle,
  Eye,
  Award
} from 'lucide-react';

export default function PromoPosterModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const promoPosterUrl = '/seller-suite-pro-promo-poster.jpg';

  const promotionalText = `🇮🇳 *BHARAT SELLER MISSION 2026: SABHI INDIAN SELLERS KE LIYE 100% FREE!* 🚀

Amazon, Flipkart, Meesho aur Quick-Commerce ke sabhi Indian dukaandaron aur sellers ke liye Sidra Motion ka *Seller Suite Pro 2026* hamesha ke liye 100% Muft (Zero Charges) hai!

⚡ *All 8 Pro AI Tools Unlocked:*
1. 📝 AI Product Listing & A9 SEO Title Maker
2. 📸 #FFFFFF Pure White Background Photo Studio
3. 🔄 1-Click Multi-Marketplace Catalog Converter
4. 📈 Dynamic BuyBox Repricer & Margin Guard
5. 🔍 Competitor Review & Customer Gap Mining
6. 💰 RTO & Return Courier Loss Calculator
7. 🎯 RGB 100-Point Listing Quality Score Audit
8. 🌐 360° Omnichannel Marketing & WhatsApp Ads

✅ *0₹ Zero Charges • No Credit Card • Direct Access*
👉 Free me use karein: https://www.sellersuitepro.online

Apne sabhi seller bhai-behno aur groups me share karein! 🇮🇳✨`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(promotionalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(promotionalText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 10, 20, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="animated-top-popup-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '880px',
          maxHeight: '92vh',
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 14, 28, 0.98) 100%)',
          border: '1.5px solid rgba(0, 210, 255, 0.45)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 210, 255, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Top Gradient Accent Strip */}
        <div 
          className="tiranga-animated-border" 
          style={{ height: '3px', width: '100%' }} 
        />

        {/* Modal Header */}
        <div style={{
          padding: '16px 22px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.25) 0%, rgba(37, 211, 102, 0.25) 100%)',
              border: '1.5px solid #ff9933',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px'
            }}>
              📢
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Official Promotional Poster & Marketing Kit
                </h3>
                <span style={{
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '2px 7px',
                  borderRadius: '10px',
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.45)',
                  color: '#25d366'
                }}>
                  HD READY
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>
                WhatsApp, Instagram, Facebook groups aur print ke liye ready-to-share promotional creative
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#cbd5e1',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.25)';
              e.currentTarget.style.borderColor = '#f43f5e';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 1fr) minmax(300px, 1.2fr)',
          gap: '20px',
          padding: '20px',
          overflowY: 'auto'
        }}>
          {/* Left Column: HD Poster Preview */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 210, 255, 0.3)',
              border: '2px solid rgba(0, 210, 255, 0.45)',
              maxHeight: '460px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              background: '#070d19'
            }}>
              <img 
                src={promoPosterUrl} 
                alt="Seller Suite Pro 2026 Promotional Poster" 
                style={{
                  width: '100%',
                  height: '100%',
                  maxHeight: '460px',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </div>

            {/* Direct Image Download Button */}
            <a
              href={promoPosterUrl}
              download="SellerSuitePro-Promotional-Poster.jpg"
              className="kinara-glow-dynamic"
              style={{
                '--glow-color': '#00d2ff',
                width: '100%',
                background: 'linear-gradient(135deg, #00d2ff 0%, #0077ff 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                padding: '11px 16px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(0, 210, 255, 0.4)',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              <Download size={16} />
              <span>Download HD Poster (Save Image)</span>
            </a>
          </div>

          {/* Right Column: Copy & Share Toolkit */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Value Callout Card */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.12) 0%, rgba(37, 211, 102, 0.12) 100%)',
              border: '1px solid rgba(255, 153, 51, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffb74d', fontSize: '12px', fontWeight: '800' }}>
                <Award size={14} />
                <span>Ready-Made Promotion Kit</span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#e2e8f0', lineHeight: '1.4' }}>
                Is poster aur text ko WhatsApp Seller groups, Facebook E-com pages aur dukaandar community me share karein taaki har Indian seller free tools ka faayda utha sake!
              </p>
            </div>

            {/* Pre-written WhatsApp Message Box */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Pre-Written Share Message (Hindi / English)
                </span>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>1-Tap Copy</span>
              </div>

              <div style={{
                background: 'rgba(11, 18, 33, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '11px',
                color: '#cbd5e1',
                lineHeight: '1.5',
                maxHeight: '180px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}>
                {promotionalText}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: 'auto' }}>
              {/* Copy Message Button */}
              <button
                type="button"
                onClick={handleCopyText}
                style={{
                  background: copied ? 'rgba(37, 211, 102, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                  border: copied ? '1.5px solid #25d366' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: copied ? '#25d366' : '#ffffff',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>

              {/* Share to WhatsApp Button */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="kinara-glow-dynamic"
                style={{
                  '--glow-color': '#25d366',
                  background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
                }}
              >
                <MessageCircle size={15} />
                <span>Share on WhatsApp</span>
              </button>
            </div>

            {/* Quick Link Reference */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '11px'
            }}>
              <span style={{ color: '#94a3b8' }}>Website Link:</span>
              <a
                href="https://www.sellersuitepro.online"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#00d2ff', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>sellersuitepro.online</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
