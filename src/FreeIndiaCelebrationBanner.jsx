import React from 'react';

/**
 * TopFreeIndiaTickerBanner:
 * Hamesha Header pe likha rahe bas ek title:
 * "🇮🇳 Sabhi Indians Ke Liye 100% FREE 🇮🇳"
 * Clean, animated, tricolor glowing title banner on both Desktop & Mobile.
 */
export function TopFreeIndiaTickerBanner({ viewMode = 'desktop' }) {
  return (
    <div 
      style={{
        position: 'relative',
        zIndex: 60,
        background: 'linear-gradient(90deg, rgba(255, 153, 51, 0.24) 0%, rgba(11, 23, 44, 0.98) 25%, rgba(11, 23, 44, 0.98) 75%, rgba(19, 136, 8, 0.24) 100%)',
        borderBottom: '1.5px solid rgba(255, 153, 51, 0.45)',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        gap: '8px',
        overflow: 'hidden'
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

      {/* Left Tricolor Flag Icon */}
      <span 
        style={{ 
          fontSize: viewMode === 'mobile' ? '14px' : '16px',
          filter: 'drop-shadow(0 0 6px rgba(255, 153, 51, 0.7))',
          display: 'inline-flex',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        🇮🇳
      </span>

      {/* BAS EK TITLE: Animated Shimmering Text */}
      <span 
        className="free-shimmer-text"
        style={{
          fontSize: viewMode === 'mobile' ? '13px' : '15px',
          fontWeight: '900',
          letterSpacing: '0.6px',
          fontFamily: "'Space Grotesk', -apple-system, sans-serif",
          textTransform: 'uppercase',
          textShadow: '0 0 12px rgba(255, 153, 51, 0.35)',
          whiteSpace: 'nowrap'
        }}
      >
        100% FREE FOR ALL E-COMMERCE SELLERS
      </span>

      {/* Right Tricolor Flag Icon */}
      <span 
        style={{ 
          fontSize: viewMode === 'mobile' ? '14px' : '16px',
          filter: 'drop-shadow(0 0 6px rgba(37, 211, 102, 0.7))',
          display: 'inline-flex',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        🇮🇳
      </span>
    </div>
  );
}

export default TopFreeIndiaTickerBanner;
