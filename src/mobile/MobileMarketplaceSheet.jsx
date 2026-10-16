// src/mobile/MobileMarketplaceSheet.jsx
import React from 'react';
import { Check, X, ShoppingBag } from 'lucide-react';

const MARKETPLACES = [
  {
    id: 'amazon',
    name: 'Amazon India',
    tag: 'Amazon.in',
    titleLimit: '200 chars / 249 bytes',
    imageRule: 'Pure #FFFFFF, 1600px+',
    badgeColor: '#f97316'
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    tag: 'Flipkart.com',
    titleLimit: '150 chars max',
    imageRule: 'White background, 1100px+',
    badgeColor: '#2563eb'
  },
  {
    id: 'meesho',
    name: 'Meesho',
    tag: 'Meesho.com',
    titleLimit: '100 chars, concise',
    imageRule: 'Clean background, 800px+',
    badgeColor: '#ec4899'
  }
];

export default function MobileMarketplaceSheet({ isOpen, onClose, activeMarketplace, onSelect, triggerHaptic }) {
  if (!isOpen) return null;

  const handleSelect = (mpId) => {
    if (triggerHaptic) triggerHaptic('light');
    onSelect(mpId);
    onClose();
  };

  return (
    <div className="mobile-bottom-sheet-backdrop" onClick={onClose}>
      <div 
        className="mobile-bottom-sheet" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Select Marketplace"
      >
        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.2)' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Active Marketplace</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
              Optimizes listing schemas, image rules & calculators
            </p>
          </div>
          <button 
            onClick={onClose}
            className="mobile-icon-btn"
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {MARKETPLACES.map((mp) => {
            const isSelected = (activeMarketplace || 'amazon').toLowerCase() === mp.id;
            return (
              <div
                key={mp.id}
                onClick={() => handleSelect(mp.id)}
                style={{
                  background: isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1px solid ${isSelected ? 'rgba(56, 189, 248, 0.6)' : 'rgba(255, 255, 255, 0.08)'}`,
                  borderRadius: '16px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'border-color 150ms, background 150ms'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: `${mp.badgeColor}22`,
                      color: mp.badgeColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      fontSize: '15px'
                    }}
                  >
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
                      {mp.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                      {mp.titleLimit} • {mp.imageRule}
                    </div>
                  </div>
                </div>

                {isSelected ? (
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#070d19' }}>
                    <Check size={15} strokeWidth={3} />
                  </div>
                ) : (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
