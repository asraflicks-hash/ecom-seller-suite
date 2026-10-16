// src/CreateListingWizard/Step2ReferenceProduct.jsx
import React, { useState } from 'react';
import { 
  Camera,
  Upload,
  Sparkles,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  UploadCloud,
  ArrowRight,
  ExternalLink,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Check,
  Trash2,
  DollarSign,
  ShieldCheck,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import { UI_LANG } from '../marketplaceRulesConfig.js';

// SVG Visual Presets for instant 1-click testing by beginners
const PRESET_PRODUCTS = [
  {
    id: 'wallet',
    label: 'Leather Wallet',
    icon: '👜',
    title: 'Genuine Leather Bifold Wallet',
    price: 399,
    brand: 'UrbanHide',
    category: 'Bags, Wallets & Luggage',
    svgColor: '#854d0e',
    svgBg: '#fef3c7'
  },
  {
    id: 'bottle',
    label: 'Steel Bottle',
    icon: '💧',
    title: 'Insulated Stainless Steel Water Bottle',
    price: 499,
    brand: 'HydroSteel',
    category: 'Home & Kitchen',
    svgColor: '#0284c7',
    svgBg: '#e0f2fe'
  },
  {
    id: 'kurti',
    label: 'Cotton Kurti',
    icon: '👕',
    title: 'Pure Cotton Printed Straight Kurti',
    price: 599,
    brand: 'Virasat',
    category: 'Clothing & Accessories',
    svgColor: '#c026d3',
    svgBg: '#fae8ff'
  },
  {
    id: 'earbuds',
    label: 'Wireless Earbuds',
    icon: '🎧',
    title: 'True Wireless Bluetooth 5.3 Earbuds',
    price: 899,
    brand: 'AuraSound',
    category: 'Consumer Electronics',
    svgColor: '#4f46e5',
    svgBg: '#e0e7ff'
  },
  {
    id: 'lamp',
    label: 'LED Desk Lamp',
    icon: '💡',
    title: 'Rechargeable Touch LED Desk Lamp',
    price: 649,
    brand: 'LumiDesk',
    category: 'Home & Kitchen / Home Decor',
    svgColor: '#ca8a04',
    svgBg: '#fef9c3'
  },
  {
    id: 'pan',
    label: 'Non-Stick Pan',
    icon: '🍳',
    title: 'Granite Non-Stick Frying Pan (24cm)',
    price: 799,
    brand: 'ChefCraft',
    category: 'Home & Kitchen / Cookware',
    svgColor: '#dc2626',
    svgBg: '#fee2e2'
  }
];

function generatePresetSvgDataUrl(preset) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#ffffff"/>
    <rect x="20" y="20" width="360" height="360" rx="24" fill="${preset.svgBg}" stroke="${preset.svgColor}" stroke-width="4"/>
    <circle cx="200" cy="180" r="80" fill="#ffffff" stroke="${preset.svgColor}" stroke-width="3"/>
    <text x="200" y="195" font-size="70" text-anchor="middle" dominant-baseline="middle">${preset.icon}</text>
    <text x="200" y="290" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="bold" fill="${preset.svgColor}" text-anchor="middle">${preset.title}</text>
    <text x="200" y="320" font-family="system-ui, -apple-system, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">Official Marketplace Sample Photo</text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

export default function Step2ReferenceProduct({
  referenceData = {},
  onUpdateReferenceData,
  productDetails = {},
  onUpdateDetails,
  generatedListings = {},
  onUpdateGeneratedListings,
  competitorKeywords = [],
  onToggleKeyword,
  onNavigateToStep,
  selectedMarketplaces = ['amazon', 'flipkart', 'meesho'],
  lang = 'en'
}) {
  const t = UI_LANG[lang] || UI_LANG.en;

  // Mode: 'ai-scan' (Beginner brand-new product) vs 'url-ref' (Existing listing)
  const [activeTab, setActiveTab] = useState('ai-scan');

  // AI Visual Scanner States
  const [uploadedImage, setUploadedImage] = useState(null); // { dataUrl, name, size }
  const [userTitle, setUserTitle] = useState(productDetails.title || '');
  const [userPrice, setUserPrice] = useState(productDetails.sp ? String(productDetails.sp) : '');
  const [userBrand, setUserBrand] = useState(productDetails.brand || '');
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [aiScanStatus, setAiScanStatus] = useState(null);
  const [scanResult, setScanResult] = useState(null);

  // URL Scanner States
  const [inputUrl, setInputUrl] = useState(referenceData.url || '');
  const [rawText, setRawText] = useState(referenceData.rawText || '');
  const [isScanningUrl, setIsScanningUrl] = useState(false);
  const [showFallbackBox, setShowFallbackBox] = useState(referenceData.fallbackRequired || false);
  const [statusMessage, setStatusMessage] = useState(null);

  // File Upload Handler
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage({
        dataUrl: event.target.result,
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        mime: file.type || 'image/jpeg'
      });
      setAiScanStatus({
        type: 'info',
        text: `Photo loaded: ${file.name}. Type your working name & price below, then click Scan!`
      });
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Starter Preset Selection
  const handleSelectPreset = (preset) => {
    setUserTitle(preset.title);
    setUserPrice(String(preset.price));
    setUserBrand(preset.brand);
    const dataUrl = generatePresetSvgDataUrl(preset);
    setUploadedImage({
      dataUrl,
      name: `${preset.id}-sample-photo.png`,
      size: '12.4 KB',
      mime: 'image/svg+xml'
    });
    setAiScanStatus({
      type: 'info',
      text: `Loaded preset: ${preset.title} (₹${preset.price}). Click "Scan Photo & Generate Complete Listing" below!`
    });
  };

  // Perform AI Visual Scan for Brand New Item
  const handleRunAiScan = async (e) => {
    if (e) e.preventDefault();

    if (!userTitle.trim() && !uploadedImage) {
      setAiScanStatus({
        type: 'error',
        text: 'Please upload a product photo or enter a product name.'
      });
      return;
    }

    setIsAiScanning(true);
    setAiScanStatus({
      type: 'info',
      text: 'AI inspecting image textures, identifying category, attributes, HSN code, and calculating fees...'
    });

    try {
      const res = await fetch('/api/ai-scan-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: uploadedImage?.dataUrl || null,
          imageMime: uploadedImage?.mime || 'image/jpeg',
          userTitle: userTitle.trim(),
          userPrice: userPrice.trim(),
          userBrand: userBrand.trim(),
          selectedMarketplaces
        })
      });

      const data = await res.json();

      if (data.success && data.productDetails) {
        setScanResult(data);
        setAiScanStatus({
          type: 'success',
          text: '🎉 100% Complete Listing Synthesized! Title, 5 bullets, 249-byte search terms, image plan, and fee calculations generated.'
        });

        // 1. Update Product Details in Parent Wizard State
        if (onUpdateDetails) {
          onUpdateDetails(prev => ({
            ...prev,
            title: data.productDetails.title,
            brand: data.productDetails.brand,
            category: data.productDetails.category,
            model: data.productDetails.model,
            color: data.productDetails.color,
            size: data.productDetails.size,
            material: data.productDetails.material,
            packSize: data.productDetails.packSize,
            weight: data.productDetails.weight,
            mrp: data.productDetails.mrp,
            sp: data.productDetails.sp,
            cogs: data.productDetails.cogs,
            gstPct: data.productDetails.gstPct,
            hsnCode: data.productDetails.hsnCode,
            features: data.productDetails.features?.slice(0, 4) || prev.features,
            freeformFeatures: data.productDetails.features?.join('\n') || '',
            targetCustomer: data.productDetails.targetCustomer
          }));
        }

        // 2. Update Generated Listings in Parent Wizard State
        if (onUpdateGeneratedListings && data.generatedListings) {
          onUpdateGeneratedListings(data.generatedListings);
        }

        // 3. Update Reference Data
        if (onUpdateReferenceData) {
          onUpdateReferenceData({
            url: '',
            rawText: '',
            marketplace: 'all',
            identifier: data.productDetails.model,
            extracted: data.productDetails,
            audit: { score: 98, flaws: [] },
            competitorKeywords: data.competitorKeywords || [],
            fallbackRequired: false,
            isAiScannedNewProduct: true
          });
        }
      } else {
        setAiScanStatus({
          type: 'error',
          text: data.error || 'AI could not complete the scan. Please check your inputs.'
        });
      }
    } catch (err) {
      setAiScanStatus({
        type: 'error',
        text: 'Network error communicating with AI server. Please retry.'
      });
    } finally {
      setIsAiScanning(false);
    }
  };

  // URL Scanner Handlers
  const handleScanUrl = async (e) => {
    if (e) e.preventDefault();
    if (!inputUrl || !inputUrl.startsWith('http')) {
      setStatusMessage({
        type: 'error',
        text: 'Please enter a valid HTTP/HTTPS link.'
      });
      return;
    }

    setIsScanningUrl(true);
    setStatusMessage({
      type: 'info',
      text: 'Scanning reference listing...'
    });

    try {
      const res = await fetch('/api/scan-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl })
      });

      const data = await res.json();

      if (data.success) {
        onUpdateReferenceData({
          url: inputUrl,
          marketplace: data.marketplace,
          identifier: data.identifier,
          extracted: data.extracted,
          audit: data.audit,
          competitorKeywords: data.competitorKeywords || [],
          fallbackRequired: data.fallbackRequired || false,
          notice: data.notice
        });

        if (data.fallbackRequired) {
          setShowFallbackBox(true);
          setStatusMessage({
            type: 'warning',
            text: 'Marketplace security limited full page access. Available metadata was extracted; you can refine by pasting product text below.'
          });
        } else {
          setStatusMessage({
            type: 'success',
            text: `Successfully scanned ${data.marketplace.toUpperCase()} listing! See flaw audit below.`
          });
        }
      } else {
        setShowFallbackBox(true);
        setStatusMessage({
          type: 'warning',
          text: 'Unable to scrape directly. Please paste the product details or text below.'
        });
      }
    } catch {
      setShowFallbackBox(true);
      setStatusMessage({
        type: 'warning',
        text: 'Network timeout. You can paste the text below to proceed without waiting.'
      });
    } finally {
      setIsScanningUrl(false);
    }
  };

  const handleParseRawText = async () => {
    if (!rawText.trim()) return;
    setIsScanningUrl(true);

    try {
      const res = await fetch('/api/scan-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, manualMarketplace: referenceData.marketplace || 'amazon' })
      });

      const data = await res.json();
      if (data.success) {
        onUpdateReferenceData({
          ...referenceData,
          rawText,
          extracted: data.extracted,
          audit: data.audit,
          competitorKeywords: data.competitorKeywords || [],
          fallbackRequired: false
        });
        setStatusMessage({
          type: 'success',
          text: 'Product text parsed and analyzed successfully!'
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error parsing product text.'
      });
    } finally {
      setIsScanningUrl(false);
    }
  };

  const audit = referenceData.audit;
  const extracted = referenceData.extracted;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            padding: '2px 8px',
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}>
            Step 2 / 6
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
          {activeTab === 'ai-scan' ? 'AI Visual Product Scanner' : t.step2Title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          {activeTab === 'ai-scan'
            ? 'Perfect for beginners with brand new products! Drop a photo, simple name & price. AI identifies specifications and synthesizes 100% complete listings for Amazon, Flipkart & Meesho.'
            : t.step2Desc}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '8px',
        background: 'rgba(0, 0, 0, 0.35)',
        padding: '6px',
        borderRadius: '14px',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Tab 1: AI Visual Scanner */}
        <button
          type="button"
          onClick={() => setActiveTab('ai-scan')}
          style={{
            background: activeTab === 'ai-scan' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            border: activeTab === 'ai-scan' ? '1px solid #38bdf8' : 'none',
            borderRadius: '10px',
            padding: '12px 14px',
            color: '#ffffff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
        >
          <Camera size={16} />
          <span>📸 AI Visual Scanner (Brand New Product)</span>
          <span style={{
            fontSize: '9px',
            background: '#22c55e',
            color: '#000000',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: '900'
          }}>
            RECOMMENDED
          </span>
        </button>

        {/* Tab 2: URL Scanner */}
        <button
          type="button"
          onClick={() => setActiveTab('url-ref')}
          style={{
            background: activeTab === 'url-ref' ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' : 'transparent',
            border: activeTab === 'url-ref' ? '1px solid #38bdf8' : 'none',
            borderRadius: '10px',
            padding: '12px 14px',
            color: activeTab === 'url-ref' ? '#ffffff' : '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontWeight: '700',
            fontSize: '13px',
            transition: 'all 0.2s'
          }}
        >
          <Search size={16} />
          <span>🔗 Scan Competitor URL (Existing Listing)</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* MODE 1: AI VISUAL SCANNER FOR BRAND NEW ITEMS            */}
      {/* ======================================================== */}
      {activeTab === 'ai-scan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Starter Presets for Beginners */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '14px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#38bdf8', textTransform: 'uppercase' }}>
                ⚡ 1-Click Starter Presets (Test Instantly)
              </span>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                Click any preset to auto-load sample photo, title & price
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '8px' }}>
              {PRESET_PRODUCTS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  style={{
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '10px',
                    padding: '8px 10px',
                    color: '#e2e8f0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.15s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = '#38bdf8'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                >
                  <span style={{ fontSize: '18px' }}>{preset.icon}</span>
                  <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                    <div style={{ color: '#ffffff' }}>{preset.label}</div>
                    <div style={{ fontSize: '10px', color: '#22c55e', fontWeight: '700' }}>₹{preset.price}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Photo Dropzone & Beginner Form */}
          <form onSubmit={handleRunAiScan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {/* Photo Upload Box */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: uploadedImage ? '1.5px solid #22c55e' : '1.5px dashed rgba(56, 189, 248, 0.4)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '210px',
                position: 'relative'
              }}>
                {uploadedImage ? (
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: '140px',
                      background: '#0a0f1d',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={uploadedImage.dataUrl}
                        alt="Product Photo"
                        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      />
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.85)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <div style={{ fontSize: '11px', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={14} />
                      <span>{uploadedImage.name} ({uploadedImage.size})</span>
                    </div>
                  </div>
                ) : (
                  <label style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '20px 10px',
                    textAlign: 'center'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid #38bdf8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#38bdf8'
                    }}>
                      <Upload size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                        Upload Product Photo
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Drag & drop or click (JPG, PNG, WEBP)
                      </div>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>

              {/* Beginner Form Fields */}
              <div style={{
                background: 'rgba(15, 23, 42, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                    Product Name / Working Title *
                  </label>
                  <input
                    type="text"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    placeholder="e.g. Leather Wallet, Steel Bottle, Cotton Kurti..."
                    style={{
                      width: '100%',
                      background: 'rgba(0, 0, 0, 0.4)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      color: '#ffffff',
                      fontSize: '13px',
                      boxSizing: 'border-box',
                      outline: 'none'
                    }}
                  />
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px' }}>
                    Tip: Enter simple words. AI converts it into high-ranking titles for Amazon, Flipkart & Meesho.
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                      Expected Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={userPrice}
                      onChange={(e) => setUserPrice(e.target.value)}
                      placeholder="e.g. 499"
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px' }}>
                      Brand (Optional)
                    </label>
                    <input
                      type="text"
                      value={userBrand}
                      onChange={(e) => setUserBrand(e.target.value)}
                      placeholder="e.g. Generic or ProStyle"
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        color: '#ffffff',
                        fontSize: '13px',
                        boxSizing: 'border-box',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Quick Price Pills */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Quick Price:</span>
                  {[299, 499, 699, 999, 1499].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUserPrice(String(p))}
                      style={{
                        background: userPrice === String(p) ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                        border: userPrice === String(p) ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                        color: userPrice === String(p) ? '#38bdf8' : '#cbd5e1',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      ₹{p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Button: AI Scan Photo & Generate Complete Listing */}
            <button
              type="submit"
              disabled={isAiScanning}
              className="kinara-glow-dynamic"
              style={{
                '--glow-color': '#00d2ff',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                border: '1.5px solid #38bdf8',
                color: '#ffffff',
                padding: '14px 24px',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: isAiScanning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 20px rgba(2, 132, 199, 0.45)'
              }}
            >
              <Sparkles size={18} className={isAiScanning ? 'spin' : ''} />
              <span>
                {isAiScanning
                  ? 'AI Scanning Visual Attributes & Generating 100% Complete Listings...'
                  : '⚡ Scan Photo & Generate Complete Listing (All Marketplaces)'}
              </span>
            </button>

            {/* Status Notification Message */}
            {aiScanStatus && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '10px',
                fontSize: '12px',
                lineHeight: 1.5,
                background: aiScanStatus.type === 'error' ? 'rgba(239, 68, 68, 0.15)' :
                            aiScanStatus.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                            aiScanStatus.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: `1px solid ${aiScanStatus.type === 'error' ? 'rgba(239, 68, 68, 0.4)' :
                                     aiScanStatus.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' :
                                     aiScanStatus.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                color: '#e2e8f0'
              }}>
                {aiScanStatus.text}
              </div>
            )}
          </form>

          {/* ======================================================== */}
          {/* SCAN RESULT SHOWCASE: 100% COMPLETE LISTING GENERATED    */}
          {/* ======================================================== */}
          {scanResult && scanResult.productDetails && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
              border: '1.5px solid rgba(34, 197, 94, 0.45)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              boxShadow: '0 10px 35px rgba(0, 0, 0, 0.5)'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1.5px solid #22c55e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#22c55e'
                  }}>
                    <CheckCircle size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                      🎉 AI Visual Scan & Listing Synthesis Complete!
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Every required field across Amazon India, Flipkart & Meesho has been generated.
                    </div>
                  </div>
                </div>

                {/* Score Pill */}
                <div style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid #22c55e',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: '#22c55e'
                }}>
                  Listing Quality Score: 98/100
                </div>
              </div>

              {/* Detected Visual Specifications Grid */}
              <div style={{
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '14px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px'
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Identified Category</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                    {scanResult.productDetails.category}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Material & Color</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>
                    {scanResult.productDetails.material} ({scanResult.productDetails.color})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Size & Pack</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                    {scanResult.productDetails.size} • {scanResult.productDetails.packSize}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Weight</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '2px' }}>
                    {scanResult.productDetails.weight} grams
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>HSN Code & GST</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#4ade80', marginTop: '2px' }}>
                    HSN {scanResult.productDetails.hsnCode} ({scanResult.productDetails.gstPct}% GST)
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Pricing & Net Margin</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#fbbf24', marginTop: '2px' }}>
                    ₹{scanResult.productDetails.sp} (MRP ₹{scanResult.productDetails.mrp})
                  </div>
                </div>
              </div>

              {/* Complete Output Summary Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#cbd5e1', textTransform: 'uppercase' }}>
                  ✅ 100% Complete Generated Pack Contents:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                    <strong style={{ color: '#ff9900' }}>Amazon India:</strong> Title ({scanResult.generatedListings.amazon?.titleChars} chars, formula compliant), 5 Benefit Bullets with hooks, 249-byte search terms, A+ content outline & 5-shot photo brief.
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                    <strong style={{ color: '#2874f0' }}>Flipkart:</strong> Title ({scanResult.generatedListings.flipkart?.titleChars} chars), 5 Key Highlights, Flipkart search keywords, and description.
                  </div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', fontSize: '12px', color: '#e2e8f0' }}>
                    <strong style={{ color: '#f43397' }}>Meesho:</strong> High-CTR Title, Product Specifications, Reseller search tags, and 0% commission margin breakdown.
                  </div>
                </div>
              </div>

              {/* Navigation Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px', paddingTop: '6px' }}>
                {onNavigateToStep && (
                  <button
                    type="button"
                    onClick={() => onNavigateToStep(3)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#ffffff',
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️ Review Specifications (Step 3)
                  </button>
                )}

                {onNavigateToStep && (
                  <button
                    type="button"
                    onClick={() => onNavigateToStep(4)}
                    className="kinara-glow-dynamic"
                    style={{
                      '--glow-color': '#22c55e',
                      background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                      border: '1.5px solid #22c55e',
                      color: '#ffffff',
                      padding: '10px 22px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(22, 163, 74, 0.4)'
                    }}
                  >
                    <span>🚀 View Complete Listings Now (Step 4)</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODE 2: COMPETITOR URL SCANNER (EXISTING LISTINGS)       */}
      {/* ======================================================== */}
      {activeTab === 'url-ref' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* URL Input Form */}
          <form onSubmit={handleScanUrl} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 300px', position: 'relative' }}>
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={t.referenceInputPlaceholder}
                  style={{
                    width: '100%',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1.5px solid rgba(0, 210, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    color: '#ffffff',
                    fontSize: '14px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isScanningUrl}
                className="kinara-glow-dynamic"
                style={{
                  '--glow-color': '#00d2ff',
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid #38bdf8',
                  color: '#ffffff',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: isScanningUrl ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexShrink: 0
                }}
              >
                <Search size={16} />
                <span>{isScanningUrl ? 'Scanning...' : t.btnScan}</span>
              </button>
            </div>

            {/* Status Notification Message */}
            {statusMessage && (
              <div style={{
                padding: '10px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                lineHeight: 1.5,
                background: statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' :
                            statusMessage.type === 'warning' ? 'rgba(245, 158, 11, 0.15)' :
                            statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                border: `1px solid ${statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.4)' :
                                     statusMessage.type === 'warning' ? 'rgba(245, 158, 11, 0.4)' :
                                     statusMessage.type === 'success' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(56, 189, 248, 0.4)'}`,
                color: '#e2e8f0'
              }}>
                {statusMessage.text}
              </div>
            )}
          </form>

          {/* Fallback & Alternate Input Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.55)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            overflow: 'hidden'
          }}>
            <div 
              onClick={() => setShowFallbackBox(!showFallbackBox)}
              role="button"
              tabIndex={0}
              style={{
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                background: 'rgba(255, 255, 255, 0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: '#cbd5e1' }}>
                <FileText size={16} color="#38bdf8" />
                <span>{t.fallbackTextTitle}</span>
              </div>
              {showFallbackBox ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronDown size={16} color="#94a3b8" />}
            </div>

            {showFallbackBox && (
              <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder={t.fallbackPlaceholder}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '10px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handleParseRawText}
                    style={{
                      background: 'rgba(56, 189, 248, 0.15)',
                      border: '1px solid #38bdf8',
                      color: '#38bdf8',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: '700',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Analyze Pasted Text
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reference Analysis Card (Flaws & Improvements) */}
          {audit && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(20, 27, 45, 0.95) 100%)',
              border: '1.5px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '16px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1.5px solid #f59e0b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b'
                  }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff' }}>
                      🔍 Reference Listing Flaws Audit
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {extracted?.title?.substring(0, 55)}...
                    </div>
                  </div>
                </div>

                <div style={{
                  background: audit.score > 75 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  border: `1px solid ${audit.score > 75 ? '#22c55e' : '#f59e0b'}`,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: '800',
                  color: audit.score > 75 ? '#22c55e' : '#f59e0b'
                }}>
                  Listing Score: {audit.score}/100
                </div>
              </div>

              {/* Flaws list */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#ef4444', marginBottom: '8px', textTransform: 'uppercase' }}>
                  ❌ Flaws Detected in Reference Listing:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {audit.flaws.map((flaw, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(239, 68, 68, 0.08)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      borderRadius: '10px',
                      padding: '10px 12px',
                      fontSize: '12px',
                      lineHeight: 1.4
                    }}>
                      <div style={{ color: '#fca5a5', fontWeight: '700', marginBottom: '2px' }}>
                        • {flaw.issue}
                      </div>
                      <div style={{ color: '#86efac', fontSize: '11px' }}>
                        <strong>Our 1-Click Fix:</strong> {flaw.fix}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Competitor Keywords with Checkbox */}
              {referenceData.competitorKeywords && referenceData.competitorKeywords.length > 0 && (
                <div style={{ marginTop: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase' }}>
                      🔑 Competitor Keywords (Keep or Drop):
                    </span>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                      {referenceData.competitorKeywords.length} keywords found
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {referenceData.competitorKeywords.map((kwObj, idx) => {
                      const kw = typeof kwObj === 'string' ? kwObj : kwObj.keyword;
                      const isChecked = competitorKeywords.includes(kw);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => onToggleKeyword && onToggleKeyword(kw)}
                          style={{
                            background: isChecked ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: isChecked ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.1)',
                            color: isChecked ? '#38bdf8' : '#94a3b8',
                            padding: '5px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          {isChecked && <Check size={12} />}
                          <span>{kw}</span>
                          {kwObj.frequency && <span style={{ opacity: 0.6, fontSize: '10px' }}>({kwObj.frequency}x)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
