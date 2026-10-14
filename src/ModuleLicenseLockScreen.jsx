import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Key, 
  MessageSquare, 
  CheckCircle2, 
  ShieldAlert, 
  Copy, 
  Check, 
  Zap, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  Gauge,
  X,
  Eye
} from 'lucide-react';
import { 
  getOrAssignCustomerId, 
  validateLicenseKeyForCustomer, 
  getUserProfile, 
  isProfileComplete,
  formatWhatsAppPitchMessage,
  OFFICIAL_AGENT_WHATSAPP 
} from './licenseManager.js';

export default function ModuleLicenseLockScreen({ 
  moduleName, 
  moduleId, 
  onUnlockSuccess, 
  onGoToFreeModule, 
  onOpenProfileModal,
  isModal = false,
  onClose
}) {
  const [customerId] = useState(() => getOrAssignCustomerId());
  const [profile] = useState(() => getUserProfile());
  const [keyInput, setKeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(customerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleKeyVerification = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = keyInput.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter your license key.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const result = validateLicenseKeyForCustomer(clean, customerId, profile.phone);
      if (result.valid) {
        setSuccessMsg(result.message || `License Key successfully verified for ${customerId}!`);
        localStorage.setItem('sidra_license_key_valid', 'true');
        localStorage.setItem('sidra_active_license_key', clean);
        setTimeout(() => {
          if (onUnlockSuccess) onUnlockSuccess(clean);
        }, 800);
      } else {
        setErrorMsg(result.error || 'Access Denied: Unregistered or invalid License Key.');
      }
    }, 500);
  };

  const handleWhatsAppRequest = () => {
    // Check if profile is complete (Name, Phone, Email, City)
    if (!isProfileComplete(profile)) {
      if (onOpenProfileModal) {
        onOpenProfileModal();
      }
      return;
    }

    // Profile already complete, launch WhatsApp directly to Agent
    const msg = formatWhatsAppPitchMessage(profile);
    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/${OFFICIAL_AGENT_WHATSAPP}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const lockContent = (
    <div style={{
      maxWidth: '780px',
      width: '100%',
      margin: isModal ? 'auto' : '20px auto 40px',
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        padding: '36px 32px',
        borderRadius: '24px',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(245, 158, 11, 0.2)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Modal Close Button */}
        {isModal && (
          <button
            type="button"
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={14} /> Close
          </button>
        )}

        {/* Top Floating Badge */}
        <div style={{
          position: 'absolute',
          top: '-14px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#070d19',
          fontSize: '11px',
          fontWeight: '800',
          padding: '4px 18px',
          borderRadius: '20px',
          border: '1px solid rgba(254, 240, 138, 0.5)',
          boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)',
          whiteSpace: 'nowrap'
        }}>
          🔒 PRO COMMERCIAL LICENSE REQUIRED
        </div>

        {/* Lock Graphic */}
        <div style={{
          width: '74px',
          height: '74px',
          margin: '12px auto 16px',
          borderRadius: '50%',
          background: 'rgba(245, 158, 11, 0.15)',
          border: '2px solid #f59e0b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.3)'
        }}>
          <Lock size={34} />
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
          {moduleName || 'Pro Module'} is Locked
        </h2>

        {/* Freemium Highlight Notice */}
        <div style={{
          background: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.35)',
          borderRadius: '14px',
          padding: '12px 18px',
          margin: '16px auto 22px',
          maxWidth: '680px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              background: 'rgba(37, 211, 102, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25d366',
              flexShrink: 0
            }}>
              <Gauge size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#25d366' }}>
                🟢 All 8 Modules are 100% FREE For Indian Sellers!
              </div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>
                Your account has full unlimited lifetime access to all 8 AI optimization tools.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onGoToFreeModule}
            style={{
              background: '#25d366',
              color: '#070d19',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Open Module 7 <ArrowRight size={13} />
          </button>
        </div>

        {/* User's Auto-Assigned Customer ID */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 210, 255, 0.3)',
          borderRadius: '14px',
          padding: '14px 20px',
          maxWidth: '520px',
          margin: '0 auto 22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Sequential Customer ID
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#00d2ff', fontFamily: 'monospace', letterSpacing: '1px' }}>
              {customerId}
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyId}
            style={{
              background: 'rgba(0, 210, 255, 0.15)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              color: '#00d2ff',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {copiedId ? <Check size={12} color="#25d366" /> : <Copy size={12} />}
            {copiedId ? 'Copied' : 'Copy ID'}
          </button>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#f43f5e',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            maxWidth: '520px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px',
            textAlign: 'left'
          }}>
            <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>{errorMsg}</div>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            color: '#25d366',
            padding: '12px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            maxWidth: '520px',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'left'
          }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <div>{successMsg}</div>
          </div>
        )}

        {/* Enter License Key Form */}
        <form onSubmit={handleKeyVerification} style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#cbd5e1', display: 'block', marginBottom: '6px', textAlign: 'left' }}>
              Enter License Key (Bound to {customerId})
            </label>
            <input
              type="text"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={`e.g. SMSSP-${customerId.replace(/[^0-9]/g, '')}-XXXX`}
              style={{
                width: '100%',
                textTransform: 'uppercase',
                letterSpacing: '2px',
                fontWeight: '800',
                fontFamily: 'monospace',
                fontSize: '14px',
                textAlign: 'center',
                padding: '12px'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '14px',
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(0, 210, 255, 0.35)'
            }}
          >
            {isVerifying ? <Zap size={16} className="pulse-radar-dot" /> : <Unlock size={16} />}
            {isVerifying ? 'Verifying Key...' : `Unlock All Pro Modules for ${customerId}`}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '520px', margin: '20px auto 16px' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700' }}>DON'T HAVE A KEY YET?</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
        </div>

        {/* Claim via WhatsApp CTA */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.12) 0%, rgba(18, 140, 126, 0.15) 100%)',
          border: '1px solid rgba(37, 211, 102, 0.4)',
          borderRadius: '14px',
          padding: '18px',
          maxWidth: '520px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#25d366' }}>
              📱 Complete Profile & Request 1-Device Key on WhatsApp
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px', lineHeight: '1.4' }}>
              Fill your Name, WhatsApp Phone, Email, and City. Your pitch message with Customer ID <strong>{customerId}</strong> will be sent to Sidra Motion for instant key delivery.
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppRequest}
            style={{
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '12px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(37, 211, 102, 0.4)'
            }}
          >
            <MessageSquare size={16} /> Complete Profile & Claim License Key
          </button>
        </div>

        <div style={{
          fontSize: '11px',
          color: '#64748b',
          marginTop: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <ShieldCheck size={13} color="#25d366" />
          Single device key binding • Customer ID: {customerId} • Official Portal: sellersuitepro.online
        </div>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}>
        {lockContent}
      </div>
    );
  }

  return lockContent;
}

// -------------------------------------------------------------
// MODULE PREVIEW LOCK BANNER (TOP OF OPEN MODULE)
// -------------------------------------------------------------
export function ModulePreviewLockBanner({ 
  moduleName, 
  moduleId, 
  customerId, 
  onUnlockSuccess, 
  onGoToFreeModule, 
  onOpenProfileModal,
  onOpenModal 
}) {
  const [keyInput, setKeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const profile = getUserProfile();

  const handleCopyId = () => {
    navigator.clipboard.writeText(customerId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleKeyVerification = (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const clean = keyInput.trim().toUpperCase();
    if (!clean) {
      setErrorMsg('Please enter your license key.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const result = validateLicenseKeyForCustomer(clean, customerId, profile.phone);
      if (result.valid) {
        setSuccessMsg(result.message || `License Key verified for ${customerId}!`);
        localStorage.setItem('sidra_license_key_valid', 'true');
        localStorage.setItem('sidra_active_license_key', clean);
        setTimeout(() => {
          if (onUnlockSuccess) onUnlockSuccess(clean);
        }, 600);
      } else {
        setErrorMsg(result.error || 'Access Denied: Unregistered or invalid License Key.');
      }
    }, 450);
  };

  const handleWhatsApp = () => {
    if (!isProfileComplete(profile)) {
      if (onOpenProfileModal) onOpenProfileModal();
      return;
    }
    const msg = formatWhatsAppPitchMessage(profile);
    window.open(`https://wa.me/${OFFICIAL_AGENT_WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(15, 23, 42, 0.9) 100%)',
      border: '1px solid rgba(245, 158, 11, 0.5)',
      borderRadius: '18px',
      padding: '16px 20px',
      marginBottom: '22px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 25px rgba(245, 158, 11, 0.15)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px'
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.2)',
            border: '1px solid rgba(245, 158, 11, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24',
            boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
          }}>
            <Lock size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.25)', color: '#fbbf24', padding: '2px 8px', borderRadius: '8px', fontWeight: '800', border: '1px solid rgba(245, 158, 11, 0.4)' }}>
                PRO PREVIEW MODE
              </span>
              <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', margin: 0 }}>
                {moduleName || 'Pro Module'} — Visual Showcase Open
              </h3>
            </div>
            <p style={{ fontSize: '12px', color: '#cbd5e1', margin: '4px 0 0', lineHeight: '1.4' }}>
              All features and interface controls are fully visible. Enter your authorized license key to run execution, processing, and downloads.
            </p>
          </div>
        </div>

        {/* Customer ID Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(0, 210, 255, 0.35)',
          padding: '6px 12px',
          borderRadius: '12px'
        }}>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Your ID:</span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: '#00d2ff', fontFamily: 'monospace' }}>
            {customerId}
          </span>
          <button
            type="button"
            onClick={handleCopyId}
            style={{
              background: 'none',
              border: 'none',
              color: copiedId ? '#25d366' : '#00d2ff',
              cursor: 'pointer',
              padding: '2px 4px',
              fontSize: '11px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            {copiedId ? <Check size={11} /> : <Copy size={11} />}
            {copiedId ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Quick Key Entry Bar + WhatsApp button */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px' }}>
        <form onSubmit={handleKeyVerification} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '280px', maxWidth: '520px' }}>
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder={`Enter Key (e.g. SMSSP-${customerId ? customerId.replace(/[^0-9]/g, '') : '110892'}-XXXX)`}
            style={{
              flex: 1,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700',
              fontFamily: 'monospace',
              fontSize: '12px',
              padding: '9px 12px',
              borderRadius: '8px',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              color: '#fff'
            }}
          />
          <button
            type="submit"
            disabled={isVerifying}
            style={{
              background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 10px rgba(0, 210, 255, 0.3)'
            }}
          >
            {isVerifying ? <Zap size={13} className="pulse-radar-dot" /> : <Unlock size={13} />}
            {isVerifying ? 'Verifying...' : 'Unlock All Modules'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={handleWhatsApp}
            style={{
              background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
              color: '#fff',
              border: 'none',
              padding: '9px 16px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)'
            }}
          >
            <MessageSquare size={13} /> Complete Profile & Get Free Key
          </button>

          <button
            type="button"
            onClick={onGoToFreeModule}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#cbd5e1',
              padding: '9px 14px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Switch to Free Module 7 ➔
          </button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.4)', color: '#f43f5e', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert size={14} /> {errorMsg}
        </div>
      )}

      {successMsg && (
        <div style={{ background: 'rgba(37, 211, 102, 0.15)', border: '1px solid rgba(37, 211, 102, 0.4)', color: '#25d366', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}
    </div>
  );
}
