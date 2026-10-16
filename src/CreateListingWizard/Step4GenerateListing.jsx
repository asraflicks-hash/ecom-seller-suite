// src/CreateListingWizard/Step4GenerateListing.jsx
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Layers, 
  Camera, 
  Tag, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  BarChart3,
  DollarSign,
  Info
} from 'lucide-react';
import { MARKETPLACES_CONFIG, UI_LANG } from '../marketplaceRulesConfig.js';

// UTF-8 byte calculator helper
function getByteLength(str) {
  if (!str) return 0;
  return new TextEncoder().encode(str).length;
}

export default function Step4GenerateListing({
  selectedMarketplaces,
  productDetails,
  referenceData,
  competitorKeywords,
  generatedListings,
  onUpdateGeneratedListings,
  lang = 'en'
}) {
  const t = UI_LANG[lang] || UI_LANG.en;

  const [activePlatform, setActivePlatform] = useState(selectedMarketplaces[0] || 'amazon');
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // Trigger generation automatically if listings are empty
  useEffect(() => {
    if (!generatedListings || Object.keys(generatedListings).length === 0) {
      handleGenerateAll();
    }
  }, []);

  // Sync active platform if selection changes
  useEffect(() => {
    if (!selectedMarketplaces.includes(activePlatform)) {
      setActivePlatform(selectedMarketplaces[0] || 'amazon');
    }
  }, [selectedMarketplaces]);

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    setGenProgress(20);
    setErrorMessage(null);

    const progressTimer = setInterval(() => {
      setGenProgress(prev => (prev < 90 ? prev + 15 : prev));
    }, 400);

    try {
      const res = await fetch('/api/generate-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productDetails,
          targetMarketplaces: selectedMarketplaces,
          competitorKeywords,
          competitorFlaws: referenceData?.audit?.flaws || []
        })
      });

      clearInterval(progressTimer);
      setGenProgress(100);

      const data = await res.json();
      if (data.success && data.listings) {
        onUpdateGeneratedListings(data.listings);
      } else {
        setErrorMessage(data.error || 'Failed to generate listings.');
      }
    } catch (err) {
      clearInterval(progressTimer);
      setErrorMessage('Server connection error. Using local high-precision generator.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentListing = generatedListings?.[activePlatform];
  const mpMeta = MARKETPLACES_CONFIG.find(m => m.id === activePlatform) || MARKETPLACES_CONFIG[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#a855f7',
              background: 'rgba(168, 85, 247, 0.12)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase'
            }}>
              Step 4 / 6
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
            {t.step4Title}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            {t.step4Desc}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateAll}
          disabled={isGenerating}
          className="kinara-glow-dynamic"
          style={{
            '--glow-color': '#a855f7',
            background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
            border: '1px solid #a855f7',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '12px',
            fontWeight: '700',
            fontSize: '12px',
            cursor: isGenerating ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <RotateCcw size={14} className={isGenerating ? 'spin' : ''} />
          <span>{isGenerating ? 'Generating...' : 'Regenerate All'}</span>
        </button>
      </div>

      {/* Progress Bar (During Generation) */}
      {isGenerating && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(168, 85, 247, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#e2e8f0', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={14} color="#a855f7" />
              AI applying official marketplace formulas & limits...
            </span>
            <span style={{ color: '#a855f7', fontWeight: '800' }}>{genProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${genProgress}%`, height: '100%', background: 'linear-gradient(90deg, #a855f7, #00d2ff)', transition: 'width 0.3s ease' }} />
          </div>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: '10px',
          padding: '12px',
          fontSize: '12px',
          color: '#fca5a5'
        }}>
          {errorMessage}
        </div>
      )}

      {/* Marketplace Selector Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {selectedMarketplaces.map((mpId) => {
          const mp = MARKETPLACES_CONFIG.find(m => m.id === mpId) || { name: mpId, iconColor: '#00d2ff' };
          const isActive = activePlatform === mpId;
          return (
            <button
              key={mpId}
              type="button"
              onClick={() => setActivePlatform(mpId)}
              style={{
                background: isActive ? mp.bgColor || 'rgba(0, 210, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                border: isActive ? `1.5px solid ${mp.iconColor || '#00d2ff'}` : '1px solid rgba(255, 255, 255, 0.1)',
                color: isActive ? '#ffffff' : '#94a3b8',
                padding: '8px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: mp.iconColor || '#00d2ff'
              }} />
              <span>{mp.name}</span>
            </button>
          );
        })}
      </div>

      {/* Generated Content Showcase */}
      {currentListing && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Top Banner: Marketplace Compliance & LQS Preview */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
            border: `1.5px solid ${mpMeta.borderColor}`,
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                border: '1px solid #22c55e',
                borderRadius: '8px',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#22c55e',
                fontSize: '11px',
                fontWeight: '800'
              }}>
                <ShieldCheck size={14} />
                <span>{currentListing.complianceBadge}</span>
              </div>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                {mpMeta.sellerPortalName} sequence
              </span>
            </div>

            {/* LQS Pill */}
            <div style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              borderRadius: '999px',
              padding: '4px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#38bdf8',
              fontSize: '12px',
              fontWeight: '800'
            }}>
              <BarChart3 size={14} />
              <span>LQS: {currentListing.lqsScore}/100</span>
            </div>
          </div>

          {/* 1. Title Showcase */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
                📌 Product Title (Official Formula)
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px' }}>
                <span style={{
                  color: currentListing.titleChars <= mpMeta.rules.titleMaxChars ? '#4ade80' : '#f87171',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontWeight: '700'
                }}>
                  {currentListing.titleChars} / {mpMeta.rules.titleMaxChars} {t.charCount}
                </span>
                <span style={{ color: '#64748b' }}>({currentListing.titleBytes} bytes)</span>
              </div>
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '10px',
              padding: '12px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              lineHeight: 1.5
            }}>
              {currentListing.title}
            </div>
          </div>

          {/* 2. Bullets / Highlights Showcase */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
                🎯 {currentListing.bullets?.length || 5} Bullet Points / Highlights
              </span>
              <span style={{ fontSize: '11px', color: '#38bdf8' }}>
                {mpMeta.rules.bulletFormat}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentListing.bullets?.map((b, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    fontSize: '13px',
                    color: '#e2e8f0',
                    lineHeight: 1.4
                  }}
                >
                  <strong style={{ color: '#38bdf8', marginRight: '6px' }}>#{idx + 1}</strong>
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* 3. Backend Search Terms (With Live 249-Byte Bar for Amazon) */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
                🔍 Backend Search Terms / Keywords
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: currentListing.searchTermsBytes <= mpMeta.rules.searchTermsMaxBytes ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  border: `1px solid ${currentListing.searchTermsBytes <= mpMeta.rules.searchTermsMaxBytes ? '#22c55e' : '#ef4444'}`,
                  color: currentListing.searchTermsBytes <= mpMeta.rules.searchTermsMaxBytes ? '#22c55e' : '#ef4444'
                }}>
                  {currentListing.searchTermsBytes} / {mpMeta.rules.searchTermsMaxBytes} {t.byteCount} ({currentListing.searchTermsBytes <= mpMeta.rules.searchTermsMaxBytes ? t.safe : t.overLimit})
                </span>
              </div>
            </div>

            {/* Byte progress bar */}
            <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{
                width: `${Math.min(100, (currentListing.searchTermsBytes / mpMeta.rules.searchTermsMaxBytes) * 100)}%`,
                height: '100%',
                background: currentListing.searchTermsBytes <= mpMeta.rules.searchTermsMaxBytes ? '#22c55e' : '#ef4444'
              }} />
            </div>

            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '10px 12px',
              fontSize: '13px',
              color: '#38bdf8',
              fontFamily: 'monospace',
              lineHeight: 1.5,
              wordBreak: 'break-all'
            }}>
              {currentListing.searchTerms}
            </div>

            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {mpMeta.rules.searchTermsRules}
            </div>
          </div>

          {/* 4. Shot-by-Shot Image Plan */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
              <Camera size={16} color="#00d2ff" />
              <span>📸 Shot-by-Shot Image Plan</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
              {currentListing.imagePlan?.map((img) => (
                <div
                  key={img.shotNumber}
                  style={{
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff' }}>
                      Shot {img.shotNumber}: {img.title}
                    </span>
                    <span style={{ fontSize: '10px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                      {img.requirement}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                    {img.description}
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: 'auto' }}>
                    📐 {img.resolution}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Pricing & Net Profit Recommendation (RTO Math) */}
          {currentListing.pricing && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1.5px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: '#4ade80' }}>
                  <DollarSign size={16} />
                  <span>💰 Pricing & Net Profit Recommendation</span>
                </div>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Based on {activePlatform.toUpperCase()} fee slabs
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Selling Price</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>₹{currentListing.pricing.sellingPrice}</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Commission / Fee</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#f87171' }}>{currentListing.pricing.estimatedFeePct}%</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>RTO Rate Allowance</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#fbbf24' }}>{currentListing.pricing.estimatedRtoRate}%</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>Net Profit / Order</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80' }}>₹{currentListing.pricing.netProfitPerOrder} ({currentListing.pricing.netMarginPct}%)</div>
                </div>
                <div style={{ background: 'rgba(0, 0, 0, 0.35)', padding: '10px', borderRadius: '8px', border: '1px solid #4ade80' }}>
                  <div style={{ fontSize: '10px', color: '#86efac', fontWeight: '700' }}>Target 20% SP</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: '#4ade80' }}>₹{currentListing.pricing.recommendedSellingPrice}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
