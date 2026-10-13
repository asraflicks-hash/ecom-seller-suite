import React, { useState } from 'react';
import { X, ShieldCheck, Check, AlertCircle, Lock } from 'lucide-react';

export default function GoogleConsentModal({ onClose, onAuthorize }) {
  const [selectedEmail, setSelectedEmail] = useState(() => localStorage.getItem('sidra_user_email') || 'seller.pro@gmail.com');
  const [selectedName, setSelectedName] = useState(() => localStorage.getItem('sidra_user_name') || 'E-Commerce Seller');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const handleAllow = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      onAuthorize({
        name: selectedName.trim() || 'Google User',
        email: selectedEmail.trim(),
        authType: 'google',
        picture: ''
      });
    }, 700);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        maxWidth: '460px',
        width: '100%',
        background: '#ffffff',
        color: '#1f2937',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(66, 133, 244, 0.3)',
        padding: '32px 28px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '4px'
          }}
        >
          <X size={18} />
        </button>

        {/* Google Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <svg width="40" height="40" viewBox="0 0 24 24" style={{ margin: '0 auto 10px', display: 'block' }}>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111827', margin: 0 }}>
            Sign in with Google
          </h3>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Choose an account to continue to <strong>SellerSuite Pro</strong>
          </p>
        </div>

        {/* Account Selection Card */}
        <div style={{
          background: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '14px',
          padding: '14px',
          marginBottom: '18px'
        }}>
          <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '700', marginBottom: '8px' }}>
            Google Identity Account
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Your Google Email:</label>
              <input
                type="email"
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                placeholder="you@gmail.com"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginTop: '3px'
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#374151', fontWeight: '600' }}>Account Display Name:</label>
              <input
                type="text"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
                placeholder="Rahul Sharma"
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: '#ffffff',
                  color: '#111827',
                  fontSize: '13px',
                  marginTop: '3px'
                }}
              />
            </div>
          </div>
        </div>

        {/* Explicit Permission Request Notice */}
        <div style={{
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '14px',
          marginBottom: '20px',
          fontSize: '12px',
          color: '#374151',
          background: '#f8fafc'
        }}>
          <div style={{ fontWeight: '700', color: '#111827', marginBottom: '6px' }}>
            SellerSuite Pro will receive:
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#4b5563' }}>
            <Check size={14} color="#16a34a" /> Your name, email address, and profile picture
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4b5563' }}>
            <Check size={14} color="#16a34a" /> Access to Module 7: Sync & RGB Listing Score (Free Trial)
          </div>

          <div style={{
            marginTop: '10px',
            paddingTop: '8px',
            borderTop: '1px dashed #e2e8f0',
            fontSize: '11px',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Lock size={12} color="#b45309" />
            <span>Modules 1-6 remain locked until an authorized Pro key is provided.</span>
          </div>
        </div>

        {/* Action Buttons: Allow vs Cancel */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              background: '#f3f4f6',
              color: '#374151',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Cancel / Deny
          </button>

          <button
            type="button"
            onClick={handleAllow}
            disabled={isAuthorizing}
            style={{
              flex: 1.5,
              padding: '11px',
              borderRadius: '10px',
              border: 'none',
              background: '#1a73e8',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: '0 2px 8px rgba(26, 115, 232, 0.4)'
            }}
          >
            {isAuthorizing ? 'Signing In...' : 'Allow & Continue (Google)'}
          </button>
        </div>
      </div>
    </div>
  );
}
