// src/mobile/MobileMore.jsx
import React, { useState } from 'react';
import { 
  Settings, 
  Trash2, 
  ShieldCheck, 
  ShieldAlert, 
  ExternalLink, 
  Sparkles, 
  ChevronDown, 
  MoreVertical,
  Check,
  Info,
  RefreshCw,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { purgeAllUserData } from '../securitySanitizer.js';

export default function MobileMore({
  activeMarketplace,
  onOpenMarketplaceSheet,
  onOpenOverflow,
  motionMode,
  setMotionMode,
  triggerHaptic,
  showToast,
  onSwitchToDesktop
}) {
  const [isPurging, setIsPurging] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePurge = async () => {
    if (triggerHaptic) triggerHaptic('medium');
    setIsPurging(true);
    try {
      await purgeAllUserData();
      if (showToast) showToast('All local storage, caches & session data purged');
    } catch (err) {
      console.warn('Purge error:', err);
    } finally {
      setIsPurging(false);
    }
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
          <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
            More
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
        {/* Motion & Performance Settings */}
        <div className="mobile-section-header">Visual Motion & Effects</div>
        <div className="mobile-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { id: 'auto', title: 'Auto (System Adaptive)', desc: 'Follows Android system power & motion settings' },
              { id: 'rich', title: 'Enhanced RGB Mode', desc: 'Active conic gradient borders & subtle glows' },
              { id: 'reduced', title: 'Battery Saver (Static)', desc: 'Pure static accents, zero animations for maximum battery' }
            ].map((opt) => {
              const isSelected = (motionMode || 'auto') === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => {
                    if (triggerHaptic) triggerHaptic('light');
                    setMotionMode(opt.id);
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                    border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.4)' : 'transparent'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>
                      {opt.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                      {opt.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#38bdf8', color: '#070d19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Privacy & Data Protection */}
        <div className="mobile-section-header">Privacy & Storage Controls</div>
        <div className="mobile-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#22c55e', fontSize: '13px', fontWeight: '600' }}>
              <ShieldCheck size={18} />
              <span>Zero-Tracking Client Sandbox Architecture</span>
            </div>

            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0, lineHeight: 1.45 }}>
              All image edits and listing calculations run 100% locally on your smartphone. We do not store marketplace credentials or customer listings.
            </p>

            <button
              onClick={handlePurge}
              disabled={isPurging}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Trash2 size={16} />
              <span>{isPurging ? 'Purging data...' : 'Purge All Local Cache & Data'}</span>
            </button>
          </div>
        </div>

        {/* Legal & Play Store Policy Links */}
        <div className="mobile-section-header">Compliance & App Details</div>
        <div className="mobile-card">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <a
              href="/data-deletion.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#cbd5e1', textDecoration: 'none', fontSize: '13px' }}
            >
              <span>Account & Data Deletion Portal</span>
              <ExternalLink size={15} style={{ color: '#94a3b8' }} />
            </a>

            <div style={{ borderTop: '1px solid var(--mobile-border)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
              <span>Package ID:</span>
              <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>com.sidramotions.sellersuitepro</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#94a3b8' }}>
              <span>App Version:</span>
              <span style={{ color: '#38bdf8', fontWeight: '700' }}>v2.4.0 (Build 36)</span>
            </div>

            {onSwitchToDesktop && (
              <>
                <div style={{ borderTop: '1px solid var(--mobile-border)', marginTop: '4px' }} />
                <button
                  onClick={onSwitchToDesktop}
                  style={{
                    width: '100%',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    color: '#38bdf8',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    marginTop: '4px'
                  }}
                >
                  Switch to Desktop View
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
