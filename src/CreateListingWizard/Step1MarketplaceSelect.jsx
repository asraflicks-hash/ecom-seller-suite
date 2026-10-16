// src/CreateListingWizard/Step1MarketplaceSelect.jsx
import React from 'react';
import { Check, ShieldAlert, Sparkles, AlertCircle, Info } from 'lucide-react';
import { MARKETPLACES_CONFIG, UI_LANG } from '../marketplaceRulesConfig.js';

export default function Step1MarketplaceSelect({ 
  selectedMarketplaces, 
  onToggleMarketplace, 
  lang = 'en' 
}) {
  const t = UI_LANG[lang] || UI_LANG.en;

  const primaryIds = ['amazon', 'flipkart', 'meesho'];
  const primaryList = MARKETPLACES_CONFIG.filter(m => primaryIds.includes(m.id));
  const otherList = MARKETPLACES_CONFIG.filter(m => !primaryIds.includes(m.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#00d2ff',
            background: 'rgba(0, 210, 255, 0.12)',
            border: '1px solid rgba(0, 210, 255, 0.3)',
            padding: '2px 8px',
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}>
            Step 1 / 6
          </span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            {selectedMarketplaces.length} Selected
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
          {t.step1Title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          {t.step1Desc}
        </p>
      </div>

      {/* Primary Indian Marketplaces (Cards) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ⭐ Primary Marketplaces
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px'
        }}>
          {primaryList.map((mp) => {
            const isSelected = selectedMarketplaces.includes(mp.id);
            return (
              <div
                key={mp.id}
                onClick={() => onToggleMarketplace(mp.id)}
                role="button"
                tabIndex={0}
                style={{
                  background: isSelected 
                    ? `linear-gradient(135deg, ${mp.bgColor} 0%, rgba(15, 23, 42, 0.95) 100%)` 
                    : 'rgba(15, 23, 42, 0.65)',
                  border: isSelected ? `2px solid ${mp.iconColor}` : '1.5px solid rgba(255, 255, 255, 0.09)',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                  boxShadow: isSelected ? `0 8px 24px ${mp.bgColor}, 0 0 15px ${mp.iconColor}33` : 'none'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: mp.bgColor,
                      border: `1.5px solid ${mp.iconColor}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '800',
                      color: mp.iconColor,
                      fontSize: '15px'
                    }}>
                      {mp.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                        {mp.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {mp.sellerPortalName}
                      </div>
                    </div>
                  </div>

                  {/* Checkbox circle */}
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: isSelected ? mp.iconColor : 'rgba(255, 255, 255, 0.08)',
                    border: isSelected ? `1px solid ${mp.iconColor}` : '1.5px solid rgba(255, 255, 255, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s'
                  }}>
                    {isSelected && <Check size={14} color="#000000" strokeWidth={3} />}
                  </div>
                </div>

                {/* Marketplace Rules Pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                  <span style={{
                    fontSize: '11px',
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    📏 Title: ≤ {mp.rules.titleMaxChars} chars
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    🔍 Search: ≤ {mp.rules.searchTermsMaxBytes} bytes
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: '#e2e8f0',
                    background: 'rgba(255, 255, 255, 0.06)',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}>
                    🎯 {mp.rules.bulletCount} Bullets
                  </span>
                </div>

                {/* Title Formula Snippet */}
                <div style={{
                  marginTop: '10px',
                  padding: '8px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '8px',
                  fontSize: '11px',
                  color: '#94a3b8',
                  lineHeight: 1.4
                }}>
                  <strong style={{ color: '#cbd5e1' }}>Title Formula: </strong>
                  {mp.rules.titleFormula}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Other Channels (Myntra, Ajio, Nykaa, JioMart, Shopify) */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          ➕ Additional Channels & D2C
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '10px'
        }}>
          {otherList.map((mp) => {
            const isSelected = selectedMarketplaces.includes(mp.id);
            return (
              <div
                key={mp.id}
                onClick={() => onToggleMarketplace(mp.id)}
                role="button"
                tabIndex={0}
                style={{
                  background: isSelected ? mp.bgColor : 'rgba(15, 23, 42, 0.5)',
                  border: isSelected ? `1.5px solid ${mp.iconColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: mp.iconColor
                  }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                      {mp.name}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                      {mp.tag}
                    </div>
                  </div>
                </div>

                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isSelected ? mp.iconColor : 'rgba(255, 255, 255, 0.06)',
                  border: isSelected ? `1px solid ${mp.iconColor}` : '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isSelected && <Check size={12} color="#000000" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tip Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        padding: '12px 14px',
        background: 'rgba(56, 189, 248, 0.08)',
        border: '1px solid rgba(56, 189, 248, 0.25)',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#e2e8f0',
        lineHeight: 1.5
      }}>
        <Info size={16} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Cross-Platform Rule Isolation:</strong> AI will simultaneously generate platform-specific listings respecting individual byte limits, title formulas, and formatting rules.
        </div>
      </div>
    </div>
  );
}
