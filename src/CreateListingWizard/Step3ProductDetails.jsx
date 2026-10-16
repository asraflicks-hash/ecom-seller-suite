// src/CreateListingWizard/Step3ProductDetails.jsx
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  DollarSign, 
  Info,
  Trash2
} from 'lucide-react';
import { UI_LANG } from '../marketplaceRulesConfig.js';

// Smart Category Suggestions with default GST% & HSN
const CATEGORY_DEFAULTS = {
  'Electronics & Gadgets': { gst: 18, hsn: '8518' },
  'Apparel & Fashion': { gst: 12, hsn: '6109' },
  'Home & Kitchen': { gst: 18, hsn: '7323' },
  'Beauty & Personal Care': { gst: 18, hsn: '3304' },
  'Footwear': { gst: 12, hsn: '6403' },
  'Sports & Fitness': { gst: 18, hsn: '9506' },
  'Grocery & Gourmet': { gst: 5, hsn: '2106' },
  'Stationery & Office': { gst: 18, hsn: '4820' },
  'General Merchandise': { gst: 18, hsn: '3926' }
};

const IMAGE_SLOTS = [
  { id: 'main', label: 'Main (Pure White BG)', required: true, desc: 'Amazon/Flipkart slot 1 must have seamless #FFFFFF white background' },
  { id: 'angle2', label: 'Angle 2 (Side / Back)', required: false, desc: 'Alternative perspective showing thickness/profile' },
  { id: 'dimensions', label: 'Dimension / Scale', required: false, desc: 'Measurement tape or real-life comparison' },
  { id: 'lifestyle', label: 'Lifestyle / In-Use', required: false, desc: 'Real Indian household / lifestyle context' },
  { id: 'packaging', label: 'Packaging / In-The-Box', required: false, desc: 'Box contents with MRP & barcode' }
];

export default function Step3ProductDetails({
  productDetails,
  onUpdateDetails,
  onNavigateToStudio,
  lang = 'en'
}) {
  const t = UI_LANG[lang] || UI_LANG.en;
  const [imageChecks, setImageChecks] = useState({});
  const [activeFeatureMode, setActiveFeatureMode] = useState('bullets'); // 'bullets' | 'hinglish'

  const handleInputChange = (field, value) => {
    const updated = { ...productDetails, [field]: value };
    if (field === 'category' && CATEGORY_DEFAULTS[value]) {
      updated.gstPct = CATEGORY_DEFAULTS[value].gst;
      updated.hsnCode = CATEGORY_DEFAULTS[value].hsn;
    }
    onUpdateDetails(updated);
  };

  const handleBulletChange = (index, value) => {
    const features = [...(productDetails.features || ['', '', '', ''])];
    features[index] = value;
    onUpdateDetails({ ...productDetails, features });
  };

  // Client-Side Image Verification: Resolution + Pure White (#FFFFFF) Canvas Sampling
  const processImageFile = (slotId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        // Canvas sampling for pure white check
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(w, 200);
        canvas.height = Math.min(h, 200);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Sample 4 corners and borders (5px inset)
        const samples = [
          ctx.getImageData(5, 5, 1, 1).data,
          ctx.getImageData(canvas.width - 5, 5, 1, 1).data,
          ctx.getImageData(5, canvas.height - 5, 1, 1).data,
          ctx.getImageData(canvas.width - 5, canvas.height - 5, 1, 1).data,
          ctx.getImageData(Math.floor(canvas.width / 2), 5, 1, 1).data
        ];

        // Is pure white: R, G, B all >= 250 in all corner samples
        const isWhite = samples.every(([r, g, b]) => r >= 250 && g >= 250 && b >= 250);
        const meetsRes = w >= 1600 && h >= 1600;

        setImageChecks(prev => ({
          ...prev,
          [slotId]: {
            dataUrl,
            width: w,
            height: h,
            isWhite,
            meetsRes,
            fileName: file.name
          }
        }));

        // Also save image ref in details
        const currentImages = { ...(productDetails.images || {}) };
        currentImages[slotId] = { name: file.name, width: w, height: h, isWhite };
        onUpdateDetails({ ...productDetails, images: currentImages });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (slotId) => {
    setImageChecks(prev => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
    const currentImages = { ...(productDetails.images || {}) };
    delete currentImages[slotId];
    onUpdateDetails({ ...productDetails, images: currentImages });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Step Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#10b981',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            padding: '2px 8px',
            borderRadius: '999px',
            textTransform: 'uppercase'
          }}>
            Step 3 / 6
          </span>
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
          {t.step3Title}
        </h2>
        <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
          {t.step3Desc}
        </p>
      </div>

      {/* Section 1: Basic Identifiers */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          1. Product Identifiers
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Product Name / Working Title *
            </label>
            <input
              type="text"
              value={productDetails.title || ''}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g. Insulated Stainless Steel Water Bottle"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Brand Name *
            </label>
            <input
              type="text"
              value={productDetails.brand || ''}
              onChange={(e) => handleInputChange('brand', e.target.value)}
              placeholder="e.g. AquaPro or Generic"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Category
            </label>
            <select
              value={productDetails.category || 'Home & Kitchen'}
              onChange={(e) => handleInputChange('category', e.target.value)}
              style={{
                width: '100%',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            >
              {Object.keys(CATEGORY_DEFAULTS).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Model / SKU Code
            </label>
            <input
              type="text"
              value={productDetails.model || ''}
              onChange={(e) => handleInputChange('model', e.target.value)}
              placeholder="e.g. AP-BOT-1000"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Section 2: Key Attributes & Dimensions */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#a855f7', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          2. Key Attributes & Specifications
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Color
            </label>
            <input
              type="text"
              value={productDetails.color || ''}
              onChange={(e) => handleInputChange('color', e.target.value)}
              placeholder="e.g. Matte Black"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Size / Capacity
            </label>
            <input
              type="text"
              value={productDetails.size || ''}
              onChange={(e) => handleInputChange('size', e.target.value)}
              placeholder="e.g. 1000ml / Free Size"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Material / Fabric
            </label>
            <input
              type="text"
              value={productDetails.material || ''}
              onChange={(e) => handleInputChange('material', e.target.value)}
              placeholder="e.g. 304 Food Grade Steel"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Pack Size / Quantity
            </label>
            <input
              type="text"
              value={productDetails.packSize || ''}
              onChange={(e) => handleInputChange('packSize', e.target.value)}
              placeholder="e.g. Pack of 1"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Weight (Grams)
            </label>
            <input
              type="number"
              value={productDetails.weight || ''}
              onChange={(e) => handleInputChange('weight', e.target.value)}
              placeholder="e.g. 350"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Section 3: Pricing, GST & HSN */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#22c55e', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          3. Pricing, GST & HSN Recommendation
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              MRP (₹)
            </label>
            <input
              type="number"
              value={productDetails.mrp || ''}
              onChange={(e) => handleInputChange('mrp', e.target.value)}
              placeholder="e.g. 1299"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Selling Price / SP (₹)
            </label>
            <input
              type="number"
              value={productDetails.sp || ''}
              onChange={(e) => handleInputChange('sp', e.target.value)}
              placeholder="e.g. 699"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Cost of Goods / COGS (₹)
            </label>
            <input
              type="number"
              value={productDetails.cogs || ''}
              onChange={(e) => handleInputChange('cogs', e.target.value)}
              placeholder="e.g. 240"
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Auto GST %
            </label>
            <input
              type="number"
              value={productDetails.gstPct || CATEGORY_DEFAULTS[productDetails.category || 'General Merchandise']?.gst || 18}
              onChange={(e) => handleInputChange('gstPct', e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#cbd5e1', marginBottom: '6px' }}>
              Recommended HSN
            </label>
            <input
              type="text"
              value={productDetails.hsnCode || CATEGORY_DEFAULTS[productDetails.category || 'General Merchandise']?.hsn || '7323'}
              onChange={(e) => handleInputChange('hsnCode', e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '9px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>
      </div>

      {/* Section 4: Key Features / USPs */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: '700', color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            4. Key Features & Benefits
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              type="button"
              onClick={() => setActiveFeatureMode('bullets')}
              style={{
                background: activeFeatureMode === 'bullets' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                color: activeFeatureMode === 'bullets' ? '#000000' : '#cbd5e1',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              3-5 Points
            </button>
            <button
              type="button"
              onClick={() => setActiveFeatureMode('notes')}
              style={{
                background: activeFeatureMode === 'notes' ? '#f59e0b' : 'rgba(255, 255, 255, 0.08)',
                color: activeFeatureMode === 'notes' ? '#000000' : '#cbd5e1',
                border: 'none',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              Free Notes / Raw Text
            </button>
          </div>
        </div>

        {activeFeatureMode === 'bullets' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[0, 1, 2, 3].map((idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#94a3b8', width: '20px' }}>
                  #{idx + 1}
                </span>
                <input
                  type="text"
                  value={(productDetails.features && productDetails.features[idx]) || ''}
                  onChange={(e) => handleBulletChange(idx, e.target.value)}
                  placeholder={
                    idx === 0 ? "e.g. 24 hours cold, 12 hours hot insulation" :
                    idx === 1 ? "e.g. Leak proof silicon ring lid design" :
                    idx === 2 ? "e.g. Rust-free 304 food grade interior" :
                    "e.g. Fits standard car cup holders"
                  }
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '13px'
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div>
            <textarea
              rows={4}
              value={productDetails.freeformFeatures || ''}
              onChange={(e) => handleInputChange('freeformFeatures', e.target.value)}
              placeholder="Describe key features in plain text: e.g. food grade 304 stainless steel, keeps water cold 24 hours and hot 12 hours, leak proof sipper cap, ideal for gym and daily office use..."
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.35)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#ffffff',
                fontSize: '13px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        )}
      </div>

      {/* Section 5: Image Slots with Instant Pure White (#FFFFFF) & Resolution Check */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              5. Image Verification & Pure White (#FFFFFF) Check
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              {t.pureWhiteMainImg}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {IMAGE_SLOTS.map((slot) => {
            const check = imageChecks[slot.id];
            return (
              <div
                key={slot.id}
                style={{
                  background: 'rgba(0, 0, 0, 0.35)',
                  border: check ? (check.isWhite ? '1.5px solid #22c55e' : '1.5px solid #f59e0b') : '1.5px dashed rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#ffffff' }}>
                    {slot.label}
                  </span>
                  {slot.required && (
                    <span style={{ fontSize: '9px', fontWeight: '800', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                      MANDATORY
                    </span>
                  )}
                </div>

                {check ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '100%', height: '110px', background: '#0a0f1d', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={check.dataUrl} alt={slot.label} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(slot.id)}
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          background: 'rgba(239, 68, 68, 0.8)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: check.meetsRes ? '#4ade80' : '#f59e0b' }}>
                        {check.meetsRes ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                        <span>{check.width} x {check.height} px ({check.meetsRes ? 'HD Zoom Pass' : 'Low Res'})</span>
                      </div>

                      {slot.id === 'main' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: check.isWhite ? '#4ade80' : '#f59e0b' }}>
                          {check.isWhite ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                          <span>{check.isWhite ? 'Pure White (#FFFFFF) Pass' : 'Not Pure White (#FFFFFF)'}</span>
                        </div>
                      )}
                    </div>

                    {slot.id === 'main' && !check.isWhite && (
                      <button
                        type="button"
                        onClick={onNavigateToStudio}
                        style={{
                          background: 'rgba(0, 210, 255, 0.15)',
                          border: '1px solid #00d2ff',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          color: '#00d2ff',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <span>Fix in Pure White Studio</span>
                        <ExternalLink size={12} />
                      </button>
                    )}
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '24px 10px',
                    cursor: 'pointer',
                    color: '#94a3b8'
                  }}>
                    <Upload size={20} color="#00d2ff" />
                    <span style={{ fontSize: '11px', textAlign: 'center' }}>
                      Click to Upload or Drag
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => processImageFile(slot.id, e.target.files?.[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}

                <div style={{ fontSize: '10px', color: '#64748b', lineHeight: 1.3 }}>
                  {slot.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
