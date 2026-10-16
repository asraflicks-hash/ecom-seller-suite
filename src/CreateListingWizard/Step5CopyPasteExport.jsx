// src/CreateListingWizard/Step5CopyPasteExport.jsx
import React, { useState, useEffect } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  RotateCw, 
  Printer, 
  ExternalLink,
  Edit3
} from 'lucide-react';
import { MARKETPLACES_CONFIG, UI_LANG } from '../marketplaceRulesConfig.js';

// UTF-8 byte calculator helper
function getByteLength(str) {
  if (!str) return 0;
  return new TextEncoder().encode(str).length;
}

export default function Step5CopyPasteExport({
  selectedMarketplaces,
  generatedListings,
  productDetails,
  onUpdateSingleField,
  lang = 'en'
}) {
  const t = UI_LANG[lang] || UI_LANG.en;

  const [activePlatform, setActivePlatform] = useState(selectedMarketplaces[0] || 'amazon');
  const [copiedKey, setCopiedKey] = useState(null);
  const [editableFields, setEditableFields] = useState({});

  // Sync active platform
  useEffect(() => {
    if (!selectedMarketplaces.includes(activePlatform)) {
      setActivePlatform(selectedMarketplaces[0] || 'amazon');
    }
  }, [selectedMarketplaces]);

  // Initialize editable fields from generated listing
  useEffect(() => {
    const current = generatedListings?.[activePlatform];
    if (current) {
      setEditableFields({
        title: current.title || '',
        brand: productDetails.brand || '',
        bullet_1: current.bullets?.[0] || '',
        bullet_2: current.bullets?.[1] || '',
        bullet_3: current.bullets?.[2] || '',
        bullet_4: current.bullets?.[3] || '',
        bullet_5: current.bullets?.[4] || '',
        searchTerms: current.searchTerms || '',
        description: current.description || '',
        browseNode: current.browseNode || '',
        netQuantity: productDetails.packSize || 'Pack of 1',
        material: productDetails.material || 'Standard',
        category: productDetails.category || 'General'
      });
    }
  }, [activePlatform, generatedListings, productDetails]);

  const mpConfig = MARKETPLACES_CONFIG.find(m => m.id === activePlatform) || MARKETPLACES_CONFIG[0];
  const checklist = mpConfig.checklistSequence || [];

  const handleFieldChange = (key, val) => {
    setEditableFields(prev => ({ ...prev, [key]: val }));
    if (onUpdateSingleField) {
      onUpdateSingleField(activePlatform, key, val);
    }
  };

  const copyToClipboard = (key, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  const handleCopyAll = () => {
    const combined = checklist
      .map(item => `--- ${item.label.toUpperCase()} ---\n${editableFields[item.key] || ''}\n`)
      .join('\n');
    copyToClipboard('ALL', combined);
  };

  // Generate Marketplace Bulk Flat File CSV
  const handleDownloadCsv = () => {
    let csvContent = '';
    const filename = `${activePlatform}_listing_flat_file_${Date.now()}.csv`;

    if (activePlatform === 'amazon') {
      const headers = ['feed_product_type', 'item_sku', 'brand_name', 'item_name', 'bullet_point1', 'bullet_point2', 'bullet_point3', 'bullet_point4', 'bullet_point5', 'standard_price', 'quantity', 'generic_keywords', 'product_description'];
      const row = [
        productDetails.category || 'Kitchen',
        productDetails.model || 'SKU-001',
        editableFields.brand || 'Brand',
        editableFields.title || '',
        editableFields.bullet_1 || '',
        editableFields.bullet_2 || '',
        editableFields.bullet_3 || '',
        editableFields.bullet_4 || '',
        editableFields.bullet_5 || '',
        productDetails.sp || '699',
        '100',
        editableFields.searchTerms || '',
        editableFields.description || ''
      ];
      csvContent = `${headers.join(',')}\n${row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')}`;
    } else if (activePlatform === 'flipkart') {
      const headers = ['Product ID', 'Brand', 'Title', 'Description', 'Key Features 1', 'Key Features 2', 'Key Features 3', 'Key Features 4', 'Key Features 5', 'Price', 'Search Keywords'];
      const row = [
        productDetails.model || 'FSN-001',
        editableFields.brand || 'Brand',
        editableFields.title || '',
        editableFields.description || '',
        editableFields.bullet_1 || '',
        editableFields.bullet_2 || '',
        editableFields.bullet_3 || '',
        editableFields.bullet_4 || '',
        editableFields.bullet_5 || '',
        productDetails.sp || '699',
        editableFields.searchTerms || ''
      ];
      csvContent = `${headers.join(',')}\n${row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')}`;
    } else {
      // General / Meesho / Shopify
      const headers = ['Product Name', 'Description', 'Price', 'Pack Size', 'Material', 'Keywords'];
      const row = [
        editableFields.title || '',
        editableFields.description || '',
        productDetails.sp || '499',
        editableFields.netQuantity || 'Pack of 1',
        editableFields.material || 'Standard',
        editableFields.searchTerms || ''
      ];
      csvContent = `${headers.join(',')}\n${row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')}`;
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  // Generate Printable Listing Sheet
  const handlePrintPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${mpConfig.name} Listing Sheet - ${productDetails.title || 'Product'}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 30px; color: #111; }
            h1 { font-size: 20px; border-bottom: 2px solid #0284c7; padding-bottom: 8px; margin-bottom: 20px; }
            .badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-bottom: 15px; }
            .field-group { margin-bottom: 16px; page-break-inside: avoid; }
            .field-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-bottom: 4px; }
            .field-value { font-size: 13px; line-height: 1.5; background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; white-space: pre-wrap; }
            .footer { margin-top: 30px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Seller Suite Pro • ${mpConfig.name} Official Listing Sheet</h1>
          <div class="badge">Portal: ${mpConfig.sellerPortalName} | Format: Ready to Copy-Paste</div>
          ${checklist.map(item => `
            <div class="field-group">
              <div class="field-label">${item.label}</div>
              <div class="field-value">${editableFields[item.key] || 'N/A'}</div>
            </div>
          `).join('')}
          <div class="footer">
            Generated via Seller Suite Pro (https://www.sellersuitepro.online) • 100% Marketplace Compliant
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // Quick single-field regeneration
  const handleRegenerateSingleField = (key) => {
    if (key === 'title') {
      const freshTitle = `${productDetails.brand || 'Brand'} ${productDetails.title || 'Product'} (${productDetails.material || 'Standard'}, ${productDetails.color || 'Black'}, ${productDetails.packSize || 'Pack of 1'})`;
      handleFieldChange('title', freshTitle);
    } else if (key.startsWith('bullet')) {
      const freshBullet = `[PREMIUM GRADE QUALITY]: Built with authentic ${productDetails.material || 'durable materials'} for heavy duty longevity and dependable daily reliability.`;
      handleFieldChange(key, freshBullet);
    } else if (key === 'searchTerms') {
      const freshTerms = `${(productDetails.title || '').toLowerCase()} ${(productDetails.material || '').toLowerCase()} ${(productDetails.color || '').toLowerCase()} accessories essentials`.substring(0, 200);
      handleFieldChange('searchTerms', freshTerms);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Step Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#22c55e',
              background: 'rgba(34, 197, 94, 0.12)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              padding: '2px 8px',
              borderRadius: '999px',
              textTransform: 'uppercase'
            }}>
              Step 5 / 6
            </span>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
            {t.step5Title}
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
            {t.step5Desc}
          </p>
        </div>

        {/* Global Export Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopyAll}
            className="kinara-glow-dynamic"
            style={{
              '--glow-color': '#22c55e',
              background: copiedKey === 'ALL' ? '#22c55e' : 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
              border: '1px solid #22c55e',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {copiedKey === 'ALL' ? <Check size={14} /> : <Copy size={14} />}
            <span>{copiedKey === 'ALL' ? t.btnCopied : t.btnCopyAll}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadCsv}
            style={{
              background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid #38bdf8',
              color: '#38bdf8',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FileSpreadsheet size={14} />
            <span>{t.btnExportCsv}</span>
          </button>

          <button
            type="button"
            onClick={handlePrintPdf}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Printer size={14} />
            <span>{t.btnExportPdf}</span>
          </button>
        </div>
      </div>

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
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: mp.iconColor || '#00d2ff' }} />
              <span>{mp.name}</span>
            </button>
          );
        })}
      </div>

      {/* Seller Portal Flow Reminder */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ fontSize: '12px', color: '#cbd5e1' }}>
          Portal: <strong style={{ color: '#38bdf8' }}>{mpConfig.sellerPortalName}</strong> • Sequence strictly mirrors your Seller Portal form.
        </div>
        {mpConfig.sellerPortalUrl && (
          <a
            href={mpConfig.sellerPortalUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              color: '#38bdf8',
              textDecoration: 'none',
              fontWeight: '700'
            }}
          >
            <span>Open {mpConfig.name} Panel</span>
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Checklist Fields in Portal Sequence */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {checklist.map((fieldItem) => {
          const val = editableFields[fieldItem.key] || '';
          const charCount = val.length;
          const byteCount = getByteLength(val);
          const isCopied = copiedKey === fieldItem.key;

          // Check limits if applicable
          let limitWarning = false;
          if (fieldItem.key === 'title' && charCount > mpConfig.rules.titleMaxChars) {
            limitWarning = true;
          }
          if (fieldItem.key === 'searchTerms' && byteCount > mpConfig.rules.searchTermsMaxBytes) {
            limitWarning = true;
          }

          return (
            <div
              key={fieldItem.key}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: limitWarning ? '1.5px solid #ef4444' : '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              {/* Field Label, Counters & Actions */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff' }}>
                    {fieldItem.label}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Live Counter Badge */}
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: limitWarning ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 0, 0, 0.4)',
                    color: limitWarning ? '#f87171' : '#94a3b8'
                  }}>
                    {charCount} chars • {byteCount} bytes
                  </span>

                  {/* Regenerate Field Button */}
                  <button
                    type="button"
                    onClick={() => handleRegenerateSingleField(fieldItem.key)}
                    title="Regenerate this field"
                    style={{
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '6px',
                      padding: '4px 8px',
                      color: '#cbd5e1',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RotateCw size={12} />
                    <span>Regen</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    type="button"
                    onClick={() => copyToClipboard(fieldItem.key, val)}
                    style={{
                      background: isCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      border: `1px solid ${isCopied ? '#22c55e' : '#38bdf8'}`,
                      borderRadius: '6px',
                      padding: '4px 12px',
                      color: isCopied ? '#22c55e' : '#38bdf8',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      minWidth: '70px',
                      justifyContent: 'center'
                    }}
                  >
                    {isCopied ? <Check size={12} /> : <Copy size={12} />}
                    <span>{isCopied ? t.btnCopied : t.btnCopy}</span>
                  </button>
                </div>
              </div>

              {/* Editable Field Input / Textarea */}
              {fieldItem.fieldType === 'textarea' ? (
                <textarea
                  rows={3}
                  value={val}
                  onChange={(e) => handleFieldChange(fieldItem.key, e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '10px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    lineHeight: 1.5,
                    boxSizing: 'border-box'
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleFieldChange(fieldItem.key, e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    color: '#ffffff',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
