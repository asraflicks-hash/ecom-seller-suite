// src/mobile/MobileHome.jsx
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Image as ImageIcon, 
  ArrowRightLeft, 
  Calculator, 
  Tag, 
  ChevronRight,
  ChevronDown,
  MoreVertical,
  Clock,
  Sparkles
} from 'lucide-react';

export default function MobileHome({ 
  activeMarketplace, 
  onOpenMarketplaceSheet, 
  onOpenOverflow, 
  onNavigateTab,
  triggerHaptic,
  onOpenCreateListingWizard
}) {
  const [recentItems, setRecentItems] = useState([
    {
      id: 'rec-1',
      title: 'Earbuds listing',
      subtitle: 'Optimizer, 2 min ago',
      tab: 'listing',
      segment: 'optimizer'
    },
    {
      id: 'rec-2',
      title: 'Shoe photo',
      subtitle: 'Studio, yesterday',
      tab: 'studio',
      segment: null
    }
  ]);

  // Load any dynamic recent history stored in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ssp_mobile_recent_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setRecentItems(parsed);
        }
      }
    } catch {
      // Keep defaults
    }
  }, []);

  const handleToolClick = (tab, segment = null) => {
    if (triggerHaptic) triggerHaptic('light');
    onNavigateTab(tab, segment);
  };

  const getMarketplaceDisplayName = (mp) => {
    switch ((mp || 'amazon').toLowerCase()) {
      case 'flipkart': return 'Flipkart';
      case 'meesho': return 'Meesho';
      default: return 'Amazon';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Top App Bar */}
      <header className="mobile-top-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="mobile-logo-mark">
            S
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0, letterSpacing: '-0.2px' }}>
            Home
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Marketplace Chip */}
          <button
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              onOpenMarketplaceSheet();
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '999px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <span>{getMarketplaceDisplayName(activeMarketplace)}</span>
            <ChevronDown size={14} style={{ color: '#94a3b8' }} />
          </button>

          {/* Overflow Menu Icon */}
          <button
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              onOpenOverflow();
            }}
            className="mobile-icon-btn"
            style={{ width: '40px', height: '40px' }}
            aria-label="Menu"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mobile-scroll-container">
        {/* Flagship: Create New Listing Action Card */}
        <div 
          className="mobile-btn-rgb"
          onClick={() => {
            if (triggerHaptic) triggerHaptic('medium');
            if (onOpenCreateListingWizard) onOpenCreateListingWizard();
          }}
          role="button"
          tabIndex={0}
          style={{
            marginBottom: '16px',
            padding: '12px 14px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#ffffff',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontSize: '16px'
            }}>
              ➕
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                Create New Listing
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                Amazon, Flipkart & Meesho AI Wizard
              </div>
            </div>
          </div>
          <ChevronRight size={18} color="#ffffff" />
        </div>

        {/* Quick Tools Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#e2e8f0', margin: 0 }}>
            Quick tools
          </h2>
          <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Sparkles size={12} /> Indian Sellers
          </span>
        </div>

        {/* 2x3 Quick Tools Grid (Strict Mockup Match) */}
        <div className="mobile-tools-grid">
          {/* 1. Listing optimizer */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('listing', 'optimizer')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <FileText size={22} />
            </div>
            <div className="mobile-tool-title">Listing optimizer</div>
          </div>

          {/* 2. Quality audit */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('listing', 'audit')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <CheckCircle2 size={22} />
            </div>
            <div className="mobile-tool-title">Quality audit</div>
          </div>

          {/* 3. White background */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('studio')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <ImageIcon size={22} />
            </div>
            <div className="mobile-tool-title">White background</div>
          </div>

          {/* 4. Catalog convert */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('listing', 'convert')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <ArrowRightLeft size={22} />
            </div>
            <div className="mobile-tool-title">Catalog convert</div>
          </div>

          {/* 5. RTO profit */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('profit', 'rto')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <Calculator size={22} />
            </div>
            <div className="mobile-tool-title">RTO profit</div>
          </div>

          {/* 6. Repricer */}
          <div 
            className="mobile-tool-card"
            onClick={() => handleToolClick('profit', 'repricer')}
            role="button"
            tabIndex={0}
          >
            <div className="mobile-tool-icon-wrap">
              <Tag size={22} />
            </div>
            <div className="mobile-tool-title">Repricer</div>
          </div>
        </div>

        {/* Recent Section (Strict Mockup Match) */}
        <div style={{ marginTop: '4px' }}>
          <div className="mobile-section-header">Recent</div>
          
          {recentItems.map((item) => (
            <div
              key={item.id}
              className="mobile-recent-card"
              onClick={() => handleToolClick(item.tab, item.segment)}
              role="button"
              tabIndex={0}
            >
              <div className="mobile-recent-info">
                <div className="mobile-recent-title">{item.title}</div>
                <div className="mobile-recent-sub">{item.subtitle}</div>
              </div>
              <ChevronRight size={18} style={{ color: '#64748b' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
