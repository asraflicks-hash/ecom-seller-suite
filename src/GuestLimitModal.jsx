import React from 'react';
import { 
  X, 
  Lock, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Database,
  LogIn,
  UserPlus
} from 'lucide-react';

export default function GuestLimitModal({ 
  isOpen, 
  onClose, 
  onOpenAuth 
}) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(3, 7, 18, 0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100005,
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0e172a 0%, #070d19 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.45)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(245, 158, 11, 0.2)',
        position: 'relative',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        padding: '28px 24px'
      }}>
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#94a3b8',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <X size={16} />
        </button>

        {/* Lock Icon Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(239, 68, 68, 0.15) 100%)',
            border: '1.5px solid #f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.35)'
          }}>
            <Lock size={32} color="#fbbf24" />
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            color: '#fbbf24',
            padding: '3px 12px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '8px'
          }}>
            <span>🔒 5% Free Guest Limit Reached</span>
          </div>

          <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
            Guest Mode 5% Demo Limit Reached
          </h3>
          <p style={{ margin: 0, fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
            The entire suite is <b>100% FREE</b>! Simply create your free account or sign in with Google to unlock full access immediately.
          </p>
        </div>

        {/* 5% Progress Bar */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '700', marginBottom: '6px' }}>
            <span style={{ color: '#94a3b8' }}>Guest Usage Allowed:</span>
            <span style={{ color: '#ef4444' }}>5% Maximum (Limit Reached)</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)', borderRadius: '999px' }} />
          </div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '6px', textAlign: 'center' }}>
            Signing in upgrades your account to <b>100% UNLIMITED</b> usage at zero cost.
          </div>
        </div>

        {/* Benefits Unlocked on Login */}
        <div style={{
          background: 'rgba(37, 211, 102, 0.08)',
          border: '1px solid rgba(37, 211, 102, 0.25)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#86efac', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="#25d366" />
            <span>What You Unlock on Free Sign Up (100% Free):</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#25d366" style={{ flexShrink: 0 }} />
              <span><b>All 8 AI Modules Unlocked:</b> Listing Repair, White BG Studio, Repricer</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#25d366" style={{ flexShrink: 0 }} />
              <span><b>Unlimited Usage:</b> Optimize unlimited listings with zero artificial limits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#25d366" style={{ flexShrink: 0 }} />
              <span><b>Full Exports & Downloads:</b> P&L Reports, 5-Bullet Packs & Catalog Exports</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={15} color="#25d366" style={{ flexShrink: 0 }} />
              <span><b>Cloud Work History:</b> Your optimization history is safely stored in cloud database</span>
            </div>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth('login');
            }}
            style={{
              width: '100%',
              padding: '13px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
              border: 'none',
              color: '#050b14',
              fontSize: '14px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 25px rgba(0, 210, 255, 0.45)',
              transition: 'all 0.2s'
            }}
          >
            <LogIn size={16} />
            <span>Sign In / Login (100% Free Unlock)</span>
            <ArrowRight size={16} />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenAuth('signup');
            }}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
              border: 'none',
              color: '#050b14',
              fontSize: '13px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(37, 211, 102, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={15} />
            <span>Create New Free Seller Account (30 Sec)</span>
          </button>
        </div>

        {/* Footer Note */}
        <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
          <ShieldCheck size={13} color="#25d366" style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
          100% Free Lifetime for Indian Sellers • Zero Hidden Fees • No Card Required
        </div>
      </div>
    </div>
  );
}
