import React, { useState, useEffect } from 'react';
import { ShieldCheck, X, FileText, Check, SlidersHorizontal } from 'lucide-react';

export default function PrivacyConsentBanner({ onOpenPrivacyPolicy }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consentGiven = localStorage.getItem('sidra_privacy_consent');
      if (!consentGiven) {
        setIsVisible(true);
      }
    } catch (e) {
      // In case localStorage is blocked
    }

    const handleReopen = () => setIsVisible(true);
    window.addEventListener('sidra_open_consent_banner', handleReopen);
    return () => window.removeEventListener('sidra_open_consent_banner', handleReopen);
  }, []);

  const handleAccept = () => {
    try {
      localStorage.setItem('sidra_privacy_consent', 'true');
      localStorage.setItem('sidra_privacy_consent_timestamp', new Date().toISOString());
      window.dispatchEvent(new CustomEvent('sidra_privacy_consent_accepted'));
    } catch (e) {}
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('sidra_privacy_consent', 'rejected');
      localStorage.setItem('sidra_privacy_consent_timestamp', new Date().toISOString());
      window.dispatchEvent(new CustomEvent('sidra_privacy_consent_rejected'));
    } catch (e) {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 20px)',
        maxWidth: '840px',
        boxSizing: 'border-box',
        zIndex: 99999,
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(8, 17, 33, 0.98) 100%)',
        border: '1.5px solid rgba(0, 210, 255, 0.45)',
        borderRadius: '20px',
        padding: '14px 16px',
        boxShadow: '0 16px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 210, 255, 0.25)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 240px', minWidth: 0 }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: 'rgba(0, 210, 255, 0.15)',
          border: '1px solid rgba(0, 210, 255, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <ShieldCheck size={22} color="#00d2ff" />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Privacy & Cookie Consent (DPDP Act 2023)</span>
            <span style={{ fontSize: '9px', background: 'rgba(37, 211, 102, 0.2)', color: '#25d366', padding: '1px 6px', borderRadius: '6px', border: '1px solid rgba(37, 211, 102, 0.4)' }}>
              100% Local Image Processing
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: '3px 0 0 0', lineHeight: '1.4' }}>
            We process product photos, catalog spreadsheets, and prices locally in your browser. Optional third-party advertising cookies and monetization scripts (Google AdSense) remain <strong>completely blocked</strong> until you choose to accept.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={handleRejectNonEssential}
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '7px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <X size={12} /> Reject Non-Essential
        </button>

        <button
          type="button"
          onClick={onOpenPrivacyPolicy}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#cbd5e1',
            padding: '7px 12px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <FileText size={12} /> Privacy Policy
        </button>

        <button
          type="button"
          onClick={handleAccept}
          className="glow-btn-cyan"
          style={{
            background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
            border: 'none',
            color: '#050b14',
            padding: '7px 16px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            boxShadow: '0 0 12px rgba(0, 210, 255, 0.4)'
          }}
        >
          <Check size={13} /> Got It & Accept
        </button>
      </div>
    </div>
  );
}
