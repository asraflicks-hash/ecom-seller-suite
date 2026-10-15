import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, X, CheckCircle2, Sparkles, RefreshCw, ShieldAlert } from 'lucide-react';

export default function DeveloperModeAlertModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 23, 0.82)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        maxWidth: '560px',
        width: '100%',
        background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 18, 35, 0.99) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.45)',
        borderRadius: '20px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.2)',
        overflow: 'hidden',
        boxSizing: 'border-box',
        position: 'relative'
      }}>
        {/* Top Glowing Ambient Stripe */}
        <div style={{
          height: '4px',
          width: '100%',
          background: 'linear-gradient(90deg, #f59e0b 0%, #ef4444 50%, #00d2ff 100%)'
        }} />

        {/* Modal Header */}
        <div style={{
          padding: '24px 24px 16px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.2) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(245, 158, 11, 0.3)'
            }}>
              <Wrench size={24} color="#f59e0b" />
            </div>

            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '3px 10px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                marginBottom: '6px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#f59e0b',
                  boxShadow: '0 0 8px #f59e0b'
                }} />
                DEVELOPER MODE ACTIVE
              </div>

              <h2 style={{
                margin: 0,
                fontSize: '20px',
                fontWeight: '800',
                color: '#ffffff',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                Platform Under Active Development
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Notice"
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '0 24px 20px 24px' }}>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#cbd5e1',
            margin: '0 0 16px 0'
          }}>
            Seller Suite Pro is currently running in <strong>Developer &amp; Continuous Maintenance Mode</strong>. Our technical engineering team is actively building, updating, and deploying real-time system improvements.
          </p>

          {/* Details Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '14px 16px',
            marginBottom: '18px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <AlertTriangle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#fbbf24' }}>Possible Inconvenience:</strong> You may encounter temporary glitches, ongoing live updates, or brief UI adjustments while navigating the suite.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <RefreshCw size={16} color="#00d2ff" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#38bdf8' }}>Continuous Work in Progress:</strong> New tools, marketplace schemas, and AI doctor engines are being calibrated in real time.
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5' }}>
                <strong style={{ color: '#34d399' }}>Zero Data Impact:</strong> Your active sessions, saved product listings, and workstation authorizations remain 100% safe.
              </div>
            </div>
          </div>

          <div style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            marginBottom: '18px',
            lineHeight: '1.4'
          }}>
            We sincerely appreciate your patience and cooperation as we enhance your e-commerce growth platform.
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease'
              }}
            >
              <span>I Understand &amp; Continue</span>
              <Sparkles size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Subtle Top Header Indicator to let user re-open the Developer Notice
export function HeaderDevModeIndicator({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      title="Click to view Developer Mode status notice"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        borderRadius: '20px',
        background: 'rgba(245, 158, 11, 0.16)',
        border: '1px solid rgba(245, 158, 11, 0.45)',
        color: '#fbbf24',
        fontSize: '11px',
        fontWeight: '800',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: '0 0 10px rgba(245, 158, 11, 0.2)',
        transition: 'all 0.2s ease'
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: '#f59e0b',
        boxShadow: '0 0 6px #f59e0b'
      }} />
      <span>🛠️ Dev Mode Active</span>
    </button>
  );
}
