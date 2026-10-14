import React, { useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  Zap, 
  Gift, 
  ShoppingBag, 
  TrendingUp, 
  ChevronRight,
  Flame,
  Award,
  Globe
} from 'lucide-react';

/**
 * TopFreeIndiaTickerBanner:
 * Placed at the very top of both Desktop and Mobile views.
 * Ultra-modern, responsive announcement bar celebrating 100% free access for all Indian sellers.
 */
export function TopFreeIndiaTickerBanner({ onOpenDetails, viewMode = 'desktop' }) {
  return (
    <div 
      style={{
        position: 'relative',
        zIndex: 60,
        background: 'linear-gradient(90deg, #130a04 0%, #081426 50%, #04140b 100%)',
        borderBottom: '1px solid rgba(255, 153, 51, 0.35)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 153, 51, 0.15)',
        padding: viewMode === 'mobile' ? '7px 10px' : '8px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}
    >
      {/* Flowing Tricolor Animated Bottom Accent Line */}
      <div 
        className="tiranga-animated-border" 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          opacity: 0.95
        }} 
      />

      {/* Left Badge: Indian Flag + 100% FREE Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
        <div 
          className="tiranga-glow-badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.25) 0%, rgba(19, 136, 8, 0.25) 100%)',
            border: '1.5px solid #ff9933',
            borderRadius: '20px',
            padding: '3px 9px',
            fontSize: viewMode === 'mobile' ? '10px' : '11px',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '0.4px',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
        >
          <span style={{ fontSize: '13px' }}>🇮🇳</span>
          <span>100% FREE FOR ALL INDIANS</span>
        </div>

        {/* Pulsing Live Beacon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#25d366',
            boxShadow: '0 0 8px #25d366',
            display: 'inline-block'
          }} />
          <span style={{
            fontSize: '9px',
            fontWeight: '800',
            color: '#25d366',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            LIFETIME ACCESS
          </span>
        </div>
      </div>

      {/* Center Ticker / Message */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: viewMode === 'mobile' ? '11px' : '12px',
        fontWeight: '700',
        color: '#f8fafc',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        flex: 1,
        minWidth: 0,
        justifyContent: viewMode === 'mobile' ? 'flex-start' : 'center'
      }}>
        <span className="free-shimmer-text" style={{ fontWeight: '900' }}>
          🎉 BHARAT SELLER MISSION:
        </span>
        <span style={{ color: '#e2e8f0' }}>
          Sabhi Indian Sellers Ke Liye Sabhi 8 Pro AI Tools 100% Muft (Zero Fees • No Card Needed)
        </span>
      </div>

      {/* Right Action Button: Open Celebration Popup */}
      <button
        type="button"
        onClick={onOpenDetails}
        className="kinara-glow-dynamic"
        style={{
          '--glow-color': '#ff9933',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.28) 0%, rgba(19, 136, 8, 0.35) 100%)',
          border: '1.5px solid #ff9933',
          color: '#ffffff',
          borderRadius: '16px',
          padding: viewMode === 'mobile' ? '4px 10px' : '5px 14px',
          fontSize: viewMode === 'mobile' ? '10px' : '11px',
          fontWeight: '800',
          cursor: 'pointer',
          boxShadow: '0 0 12px rgba(255, 153, 51, 0.35)',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          transition: 'all 0.2s'
        }}
        title="100% Free For All Indians - Click for details"
      >
        <Gift size={12} color="#ffb74d" />
        <span>🎉 जानिये कैसे / Details ▾</span>
      </button>
    </div>
  );
}

/**
 * FreeIndiaCelebrationModal:
 * Rich, high-impact animated popup that slides down gracefully from the top.
 * Fully responsive for mobile and desktop, clearly explaining the 100% Free commitment.
 */
export function FreeIndiaCelebrationModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'rgba(5, 10, 20, 0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Dialog Card */}
      <div 
        className="animated-top-popup-container"
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          marginTop: '16px',
          marginBottom: '24px',
          background: 'linear-gradient(180deg, rgba(17, 24, 39, 0.98) 0%, rgba(11, 19, 34, 0.98) 100%)',
          border: '2px solid rgba(255, 153, 51, 0.65)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 153, 51, 0.3), 0 0 60px rgba(37, 211, 102, 0.2)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Tricolor Header Strip */}
        <div 
          className="tiranga-animated-border" 
          style={{ height: '4px', width: '100%' }} 
        />

        {/* Modal Top Ribbon */}
        <div style={{
          padding: '20px 24px 12px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Animated Indian Flag Seal */}
            <div 
              className="tiranga-glow-badge"
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.2) 0%, rgba(19, 136, 8, 0.2) 100%)',
                border: '2px solid #ff9933',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                flexShrink: 0
              }}
            >
              🇮🇳
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{
                  background: 'linear-gradient(90deg, #ff9933, #ffffff, #10b981)',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  fontSize: '11px',
                  fontWeight: '900',
                  letterSpacing: '1px',
                  textTransform: 'uppercase'
                }}>
                  SIDRA MOTION • BHARAT EMPOWERMENT 2026
                </span>
                <span style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid rgba(37, 211, 102, 0.45)',
                  color: '#25d366',
                  fontSize: '9px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  ⚡ 100% UNLOCKED
                </span>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '900',
                color: '#ffffff',
                margin: '3px 0 0 0',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Sabhi Indians Ke Liye <span style={{ color: '#25d366' }}>100% FREE!</span>
              </h2>
            </div>
          </div>

          {/* Close Button */}
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
            title="Close Popup"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '0 24px 20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Main Hero Notification Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.12) 0%, rgba(15, 23, 42, 0.8) 50%, rgba(37, 211, 102, 0.12) 100%)',
            border: '1px solid rgba(255, 153, 51, 0.35)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Award size={18} color="#ff9933" />
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffb74d' }}>
                Desh Ke Har Chhote Aur Bade Seller Ke Naam:
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: '1.6', margin: 0 }}>
              Amazon, Flipkart, Meesho aur Quick-Commerce (Blinkit, Zepto) par bechne wale sabhi Bharatiya dukaandaron, manufacturers aur sellers ke liye <strong>Sidra Motion Seller Suite Pro</strong> hamesha ke liye <strong>100% Muft (Zero Rupees)</strong> hai.
            </p>
          </div>

          {/* 4 Feature Highlights Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '10px'
          }}>
            {/* Card 1 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(37, 211, 102, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(37, 211, 102, 0.18)',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#25d366',
                flexShrink: 0
              }}>
                <Gift size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>
                  0₹ Charge • Lifetime Free
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  Koi hidden charges nahi, na monthly subscription, na credit card ki jarurat.
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(0, 210, 255, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(0, 210, 255, 0.18)',
                border: '1px solid rgba(0, 210, 255, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00d2ff',
                flexShrink: 0
              }}>
                <Zap size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>
                  Sabhi 8 Tools Unlocked
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  AI Listing, #FFFFFF White BG, Catalog Converter, BuyBox Repricer, RTO & SEO.
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
                flexShrink: 0
              }}>
                <ShoppingBag size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>
                  All Marketplaces Ready
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  Amazon India, Flipkart, Meesho ke exact seller algorithm aur guidelines par based.
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid rgba(168, 85, 247, 0.35)',
              borderRadius: '14px',
              padding: '12px 14px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(168, 85, 247, 0.18)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#c084fc',
                flexShrink: 0
              }}>
                <ShieldCheck size={16} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>
                  100% Private & Safe
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: '1.4' }}>
                  Client-side processing: Aapka product catalog aur listing data aapke paas surakshit.
                </div>
              </div>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderLeft: '3px solid #ff9933',
            padding: '10px 14px',
            borderRadius: '0 10px 10px 0',
            fontSize: '11px',
            color: '#cbd5e1',
            fontStyle: 'italic',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <span>"Hamara lakshya: Bharat ke har seller ko duniya ka sabse powerful AI tool dena taaki business grow kare!"</span>
            <span style={{ fontWeight: '800', color: '#25d366', fontStyle: 'normal' }}>🇮🇳 Jai Hind!</span>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            flexWrap: 'wrap',
            paddingTop: '6px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#cbd5e1',
                padding: '9px 18px',
                borderRadius: '14px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Samajh Gaya / Dismiss
            </button>

            <button
              type="button"
              onClick={onClose}
              className="kinara-glow-dynamic"
              style={{
                '--glow-color': '#25d366',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 0 20px rgba(16, 185, 129, 0.45)',
                transition: 'all 0.2s'
              }}
            >
              <span>🚀 SHURU KAREIN (USE ALL 8 TOOLS FREE)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
