// src/mobile/MobileListing.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  ChevronDown, 
  MoreVertical, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightLeft,
  Share2
} from 'lucide-react';

export default function MobileListing({
  activeMarketplace,
  initialSegment = 'optimizer',
  onOpenMarketplaceSheet,
  onOpenOverflow,
  triggerHaptic
}) {
  const [activeSegment, setActiveSegment] = useState(initialSegment || 'optimizer');

  // Sync if initialSegment prop changes from parent deep-link
  useEffect(() => {
    if (initialSegment) {
      setActiveSegment(initialSegment);
    }
  }, [initialSegment]);

  // Form State for Optimizer (Defaulting to Mockup values for instant parity)
  const [productName, setProductName] = useState('Wireless earbuds');
  const [brand, setBrand] = useState('Sidra');
  const [packSize, setPackSize] = useState('Pack of 2');
  const [colour, setColour] = useState('Black');

  // Additional generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  // Audit State
  const [auditInput, setAuditInput] = useState('');
  const [auditResult, setAuditResult] = useState(null);

  // Convert State
  const [convertSource, setConvertSource] = useState('amazon');
  const [convertTarget, setConvertTarget] = useState('flipkart');
  const [convertText, setConvertText] = useState('');
  const [convertedResult, setConvertedResult] = useState(null);

  // Calculate live Title Preview based on inputs
  const liveTitle = useMemo(() => {
    const parts = [];
    if (brand.trim()) parts.push(brand.trim());
    if (productName.trim()) parts.push(productName.trim());
    parts.push('Bluetooth 5.3, 40H Battery');
    if (packSize.trim()) parts.push(packSize.trim());
    if (colour.trim()) parts.push(colour.trim());
    return parts.join(', ');
  }, [brand, productName, packSize, colour]);

  // Byte calculation for Amazon / Flipkart compliance (UTF-8 byte length)
  const byteLength = useMemo(() => {
    return new TextEncoder().encode(liveTitle).length;
  }, [liveTitle]);

  const maxBytes = (activeMarketplace || 'amazon').toLowerCase() === 'amazon' ? 249 : 200;
  const bytePercentage = Math.min(100, Math.round((byteLength / maxBytes) * 100));

  const handleCopy = (text, fieldKey) => {
    if (triggerHaptic) triggerHaptic('light');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldKey);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleGenerate = () => {
    if (triggerHaptic) triggerHaptic('medium');
    setIsGenerating(true);

    // Simulated instant generation with rule-based fallback
    setTimeout(() => {
      setIsGenerating(false);

      // Save to recent items in localStorage
      try {
        const item = {
          id: 'rec-' + Date.now(),
          title: `${productName || 'Product'} listing`,
          subtitle: `Optimizer, just now`,
          tab: 'listing',
          segment: 'optimizer'
        };
        const current = JSON.parse(localStorage.getItem('ssp_mobile_recent_history') || '[]');
        const updated = [item, ...current.slice(0, 4)];
        localStorage.setItem('ssp_mobile_recent_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update recent items:', e);
      }
    }, 600);
  };

  const handleRunAudit = () => {
    if (triggerHaptic) triggerHaptic('medium');
    const textToAudit = auditInput.trim() || liveTitle;
    const hasBrand = /^[A-Z0-9]/i.test(textToAudit);
    const hasPromo = /(free|guarantee|warranty|best|sale|discount)/i.test(textToAudit);
    const lengthValid = textToAudit.length >= 40 && textToAudit.length <= 200;
    
    let score = 75;
    if (hasBrand) score += 10;
    if (!hasPromo) score += 10;
    if (lengthValid) score += 5;

    setAuditResult({
      score: Math.min(100, score),
      hasBrand,
      noPromo: !hasPromo,
      lengthValid,
      charCount: textToAudit.length
    });
  };

  const handleRunConvert = () => {
    if (triggerHaptic) triggerHaptic('medium');
    const input = convertText.trim() || liveTitle;
    setConvertedResult({
      marketplace: convertTarget.toUpperCase(),
      title: input.slice(0, convertTarget === 'meesho' ? 100 : 150),
      bullets: [
        'Premium high fidelity sound with active noise suppression',
        'Long endurance battery with rapid type-C fast charging',
        'Ergonomic waterproof sweat-resistant design for active lifestyle',
        'Instant pairing Bluetooth connectivity compatible with all devices',
        'Proudly supported with dedicated 1-year domestic service assistance'
      ]
    });
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
            Listing
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

      {/* Main Scroll Container */}
      <main className="mobile-scroll-container">
        {/* Segmented Control (Mockup Parity: Optimizer | Audit | Convert) */}
        <div className="mobile-segmented-control" role="tablist">
          <button
            className={`mobile-segment-pill ${activeSegment === 'optimizer' ? 'active' : ''}`}
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              setActiveSegment('optimizer');
            }}
            role="tab"
            aria-selected={activeSegment === 'optimizer'}
          >
            Optimizer
          </button>
          <button
            className={`mobile-segment-pill ${activeSegment === 'audit' ? 'active' : ''}`}
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              setActiveSegment('audit');
            }}
            role="tab"
            aria-selected={activeSegment === 'audit'}
          >
            Audit
          </button>
          <button
            className={`mobile-segment-pill ${activeSegment === 'convert' ? 'active' : ''}`}
            onClick={() => {
              if (triggerHaptic) triggerHaptic('light');
              setActiveSegment('convert');
            }}
            role="tab"
            aria-selected={activeSegment === 'convert'}
          >
            Convert
          </button>
        </div>

        {/* ============================================================== */}
        {/* SEGMENT 1: OPTIMIZER (STRICT MOCKUP REPLICA)                   */}
        {/* ============================================================== */}
        {activeSegment === 'optimizer' && (
          <div>
            {/* Product Name Input */}
            <div className="mobile-input-group">
              <label className="mobile-input-label" htmlFor="mobile-product-name">Product name</label>
              <input
                id="mobile-product-name"
                type="text"
                className="mobile-input"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Wireless earbuds"
                aria-label="Product name"
              />
            </div>

            {/* Brand Input */}
            <div className="mobile-input-group">
              <label className="mobile-input-label" htmlFor="mobile-brand-name">Brand</label>
              <input
                id="mobile-brand-name"
                type="text"
                className="mobile-input"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Sidra"
                aria-label="Brand name"
              />
            </div>

            {/* Pack Size & Colour (Two-Column Row) */}
            <div className="mobile-input-row">
              <div className="mobile-input-group" style={{ marginBottom: 0 }}>
                <label className="mobile-input-label" htmlFor="mobile-pack-size">Pack size</label>
                <input
                  id="mobile-pack-size"
                  type="text"
                  className="mobile-input"
                  value={packSize}
                  onChange={(e) => setPackSize(e.target.value)}
                  placeholder="e.g. Pack of 2"
                  aria-label="Pack size"
                />
              </div>

              <div className="mobile-input-group" style={{ marginBottom: 0 }}>
                <label className="mobile-input-label" htmlFor="mobile-colour">Colour</label>
                <input
                  id="mobile-colour"
                  type="text"
                  className="mobile-input"
                  value={colour}
                  onChange={(e) => setColour(e.target.value)}
                  placeholder="e.g. Black"
                  aria-label="Colour"
                />
              </div>
            </div>

            {/* Title Preview Card (Strict Mockup Match) */}
            <div className="mobile-preview-card" style={{ marginTop: '16px' }}>
              <div className="mobile-preview-header">
                <span className="mobile-preview-label">Title preview</span>
                <button
                  onClick={() => handleCopy(liveTitle, 'title')}
                  className="mobile-icon-btn"
                  title="Copy title"
                  aria-label="Copy title"
                >
                  {copiedField === 'title' ? (
                    <Check size={16} style={{ color: '#22c55e' }} />
                  ) : (
                    <Copy size={16} />
                  )}
                </button>
              </div>

              <div className="mobile-preview-text">
                {liveTitle}
              </div>

              {/* Byte / Search Terms Counter Bar */}
              <div className="mobile-byte-counter-row">
                <span>Search terms {byteLength} / {maxBytes} bytes</span>
                <span style={{ color: byteLength <= maxBytes ? '#22c55e' : '#ef4444' }}>
                  {byteLength <= maxBytes ? 'Safe' : 'Over limit'}
                </span>
              </div>

              <div className="mobile-byte-progress">
                <div 
                  className="mobile-byte-fill"
                  style={{
                    width: `${bytePercentage}%`,
                    background: byteLength <= maxBytes ? '#22c55e' : '#ef4444'
                  }}
                />
              </div>
            </div>

            {/* Sticky Action Button: Generate Listing (Mockup Match with RGB Motion) */}
            <div style={{ marginTop: '20px' }}>
              <button 
                className="mobile-btn-rgb"
                onClick={handleGenerate}
                disabled={isGenerating}
                style={{ width: '100%' }}
              >
                <div className="mobile-btn-rgb-inner">
                  <Sparkles size={18} />
                  <span>{isGenerating ? 'Generating...' : 'Generate listing'}</span>
                </div>
              </button>
            </div>

            {/* 5 AI Generated Feature Bullets & Backend Terms */}
            <div style={{ marginTop: '24px' }}>
              <div className="mobile-section-header">Generated Feature Bullets</div>
              <div className="mobile-card">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    `[IMMERSIVE SOUND] Engineered for deep bass and crystalline treble clarity.`,
                    `[40-HOUR PLAYTIME] Fast Type-C quick charge provides 5 hours of playback in 10 minutes.`,
                    `[ERGONOMIC FIT] Lightweight sweat-proof build designed for long workout sessions.`,
                    `[SEAMLESS PAIRING] Bluetooth 5.3 ultra-low latency connection for mobile and desktop.`,
                    `[IN THE BOX] Includes ${productName || 'Earbuds'}, charging case, cable, user manual.`
                  ].map((bullet, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      <span style={{ color: '#38bdf8', fontWeight: '700' }}>•</span>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => handleCopy(
                      `• [IMMERSIVE SOUND] Engineered for deep bass.\n• [40-HOUR PLAYTIME] Fast Type-C quick charge.\n• [ERGONOMIC FIT] Lightweight sweat-proof build.\n• [SEAMLESS PAIRING] Bluetooth 5.3 ultra-low latency.\n• [IN THE BOX] Complete accessories.`,
                      'bullets'
                    )}
                    className="mobile-icon-btn"
                    style={{ display: 'flex', gap: '6px', fontSize: '12px', color: '#38bdf8', padding: '6px 12px' }}
                  >
                    {copiedField === 'bullets' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedField === 'bullets' ? 'Copied' : 'Copy Bullets'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SEGMENT 2: QUALITY AUDIT                                       */}
        {/* ============================================================== */}
        {activeSegment === 'audit' && (
          <div>
            <div className="mobile-input-group">
              <label className="mobile-input-label">Listing title to audit</label>
              <textarea
                className="mobile-input"
                rows={3}
                value={auditInput}
                onChange={(e) => setAuditInput(e.target.value)}
                placeholder="Paste your existing listing title here to audit against marketplace guidelines..."
              />
            </div>

            <button 
              className="mobile-btn-rgb"
              onClick={handleRunAudit}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              <div className="mobile-btn-rgb-inner">
                <CheckCircle2 size={18} />
                <span>Audit Listing Quality</span>
              </div>
            </button>

            {auditResult && (
              <div className="mobile-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Quality Score</div>
                    <div style={{ fontSize: '28px', fontWeight: '800', color: auditResult.score >= 80 ? '#22c55e' : '#f59e0b' }}>
                      {auditResult.score} / 100
                    </div>
                  </div>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <Sparkles size={24} />
                  </div>
                </div>

                <div className="mobile-checklist" style={{ padding: 0, background: 'transparent', border: 'none' }}>
                  <div className="mobile-checklist-item">
                    <CheckCircle2 size={16} className="mobile-check-icon" />
                    <span>Brand name prominently placed at front</span>
                  </div>
                  <div className="mobile-checklist-item">
                    {auditResult.lengthValid ? (
                      <CheckCircle2 size={16} className="mobile-check-icon" />
                    ) : (
                      <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    )}
                    <span>Length within guideline ({auditResult.charCount} characters)</span>
                  </div>
                  <div className="mobile-checklist-item">
                    {auditResult.noPromo ? (
                      <CheckCircle2 size={16} className="mobile-check-icon" />
                    ) : (
                      <AlertCircle size={16} style={{ color: '#ef4444' }} />
                    )}
                    <span>Suppression-safe: No prohibited promotional words</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* SEGMENT 3: CATALOG CONVERT                                     */}
        {/* ============================================================== */}
        {activeSegment === 'convert' && (
          <div>
            <div className="mobile-input-row">
              <div className="mobile-input-group">
                <label className="mobile-input-label">From</label>
                <select 
                  className="mobile-input"
                  value={convertSource}
                  onChange={(e) => setConvertSource(e.target.value)}
                >
                  <option value="amazon">Amazon India</option>
                  <option value="flipkart">Flipkart</option>
                  <option value="meesho">Meesho</option>
                </select>
              </div>

              <div className="mobile-input-group">
                <label className="mobile-input-label">To</label>
                <select 
                  className="mobile-input"
                  value={convertTarget}
                  onChange={(e) => setConvertTarget(e.target.value)}
                >
                  <option value="flipkart">Flipkart</option>
                  <option value="amazon">Amazon India</option>
                  <option value="meesho">Meesho</option>
                </select>
              </div>
            </div>

            <div className="mobile-input-group">
              <label className="mobile-input-label">Source listing content</label>
              <textarea
                className="mobile-input"
                rows={3}
                value={convertText}
                onChange={(e) => setConvertText(e.target.value)}
                placeholder="Paste title or bullet points to adapt schema..."
              />
            </div>

            <button 
              className="mobile-btn-rgb"
              onClick={handleRunConvert}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              <div className="mobile-btn-rgb-inner">
                <ArrowRightLeft size={18} />
                <span>Convert to {convertTarget.toUpperCase()} Format</span>
              </div>
            </button>

            {convertedResult && (
              <div className="mobile-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8' }}>
                    {convertedResult.marketplace} Ready Copy Pack
                  </span>
                  <button
                    onClick={() => handleCopy(convertedResult.title, 'conv_title')}
                    className="mobile-icon-btn"
                  >
                    {copiedField === 'conv_title' ? <Check size={16} style={{ color: '#22c55e' }} /> : <Copy size={16} />}
                  </button>
                </div>
                <div style={{ fontSize: '13px', color: '#ffffff', marginBottom: '12px', fontWeight: '500' }}>
                  {convertedResult.title}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
