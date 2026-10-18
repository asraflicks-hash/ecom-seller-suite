// src/AmazonFlatFileSpecModal.jsx - Professional 38+ Category Flat-File Attribute Explorer
import React, { useState, useMemo } from 'react';
import { 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Download, 
  Search, 
  ShieldCheck, 
  Tag, 
  Layers, 
  Gauge, 
  DollarSign, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle
} from 'lucide-react';
import { exportAttributesToTSV, exportAttributesToCSV } from './flatFileAttributesEngine.js';

export default function AmazonFlatFileSpecModal({ 
  isOpen, 
  onClose, 
  flatFileData, 
  copyToClipboard, 
  copiedKey 
}) {
  if (!isOpen || !flatFileData) return null;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('all');
  const [collapsedSections, setCollapsedSections] = useState({});

  const toggleSectionCollapse = (secId) => {
    setCollapsedSections(prev => ({ ...prev, [secId]: !prev[secId] }));
  };

  // Filter attributes based on search keyword
  const filteredSections = useMemo(() => {
    if (!flatFileData.sections) return [];
    const term = searchTerm.toLowerCase().trim();

    return flatFileData.sections.map(sec => {
      if (activeSectionId !== 'all' && sec.id !== activeSectionId) return null;

      const matchedAttrs = sec.attributes.filter(attr => {
        if (!term) return true;
        return (
          attr.key.toLowerCase().includes(term) ||
          attr.name.toLowerCase().includes(term) ||
          String(attr.value).toLowerCase().includes(term) ||
          (attr.note && attr.note.toLowerCase().includes(term))
        );
      });

      if (matchedAttrs.length === 0) return null;
      return { ...sec, attributes: matchedAttrs };
    }).filter(Boolean);
  }, [flatFileData, searchTerm, activeSectionId]);

  const totalAttributeCount = useMemo(() => {
    if (!flatFileData.sections) return 0;
    return flatFileData.sections.reduce((acc, sec) => acc + sec.attributes.length, 0);
  }, [flatFileData]);

  // Download CSV Handler
  const handleDownloadCSV = () => {
    const csvContent = exportAttributesToCSV(flatFileData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Amazon_FlatFile_Attributes_${flatFileData.productType || 'Product'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy All as TSV for direct paste into Excel
  const handleCopyTSV = () => {
    const tsv = exportAttributesToTSV(flatFileData);
    copyToClipboard(tsv, 'all-flat-file-tsv');
  };

  const getSectionIcon = (iconName) => {
    switch (iconName) {
      case 'Tag': return <Tag size={16} color="#00d2ff" />;
      case 'Layers': return <Layers size={16} color="#38bdf8" />;
      case 'Gauge': return <Gauge size={16} color="#25d366" />;
      case 'DollarSign': return <DollarSign size={16} color="#f59e0b" />;
      case 'ShieldCheck': return <ShieldCheck size={16} color="#a855f7" />;
      default: return <Sparkles size={16} color="#ec4899" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 10, 20, 0.88)',
      backdropFilter: 'blur(10px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(180deg, #0b1528 0%, #070d19 100%)',
        border: '1px solid rgba(0, 210, 255, 0.35)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 210, 255, 0.2)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1100px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        color: '#f8fafc'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(37, 211, 102, 0.2) 100%)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileSpreadsheet size={22} color="#00d2ff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                  Amazon Pro Category Flat-File & Inventory Attribute Engine
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: 'rgba(37, 211, 102, 0.2)',
                  color: '#25d366',
                  border: '1px solid rgba(37, 211, 102, 0.4)'
                }}>
                  {totalAttributeCount} Mandatory & Pro Fields
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                Category: <strong style={{ color: '#00d2ff' }}>{flatFileData.categoryName}</strong> • Browse Node: <strong style={{ color: '#cbd5e1' }}>{flatFileData.browseNode.split(' ')[0]}</strong> • HSN: <strong style={{ color: '#f59e0b' }}>{flatFileData.hsnCode.split(' ')[0]}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#94a3b8',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Action Toolbar & Search */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '8px',
            padding: '6px 12px',
            flex: '1 1 240px',
            maxWidth: '380px'
          }}>
            <Search size={15} color="#64748b" />
            <input
              type="text"
              placeholder="Search attribute (e.g. arm, seat, hsn, weight)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                width: '100%',
                outline: 'none'
              }}
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Master Export Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={handleCopyTSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: copiedKey === 'all-flat-file-tsv' ? 'rgba(37, 211, 102, 0.2)' : 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                color: '#fff',
                fontSize: '12px',
                fontWeight: '700',
                border: copiedKey === 'all-flat-file-tsv' ? '1px solid #25d366' : 'none',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0, 210, 255, 0.25)'
              }}
            >
              {copiedKey === 'all-flat-file-tsv' ? <Check size={14} color="#25d366" /> : <Copy size={14} />}
              <span>{copiedKey === 'all-flat-file-tsv' ? 'Copied for Excel!' : 'Copy All for Excel / Flat-File'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#38bdf8',
                fontSize: '12px',
                fontWeight: '700',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              <span>Download (.CSV)</span>
            </button>
          </div>
        </div>

        {/* Content Body: Scrollable Attribute Explorer */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          {/* Informational Guidance Notice */}
          <div style={{
            background: 'rgba(0, 210, 255, 0.08)',
            border: '1px solid rgba(0, 210, 255, 0.25)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertCircle size={20} color="#00d2ff" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.45' }}>
              <strong style={{ color: '#00d2ff' }}>Seller Central Flat-File Ready: </strong>
              These {totalAttributeCount} attributes exactly match the official Amazon India category feed column headers. You can copy individual fields using the copy button on the right, or click <strong>"Copy All for Excel"</strong> to paste the entire tabular dataset directly into your inventory flat-file sheet.
            </div>
          </div>

          {/* Attribute Sections */}
          {filteredSections.map((section) => {
            const isCollapsed = !!collapsedSections[section.id];

            return (
              <div 
                key={section.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                {/* Section Header */}
                <div 
                  onClick={() => toggleSectionCollapse(section.id)}
                  style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {getSectionIcon(section.icon)}
                    <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                      {section.title}
                    </h3>
                    <span style={{
                      fontSize: '10px',
                      color: '#94a3b8',
                      background: 'rgba(255, 255, 255, 0.06)',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {section.attributes.length} fields
                    </span>
                  </div>

                  <div style={{ color: '#64748b' }}>
                    {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                  </div>
                </div>

                {/* Section Attributes Table */}
                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {section.attributes.map((attr, idx) => {
                      const isFieldCopied = copiedKey === `flat-${attr.name}`;

                      return (
                        <div
                          key={attr.name || idx}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '240px 1fr 45px',
                            alignItems: 'center',
                            padding: '12px 16px',
                            gap: '16px',
                            borderBottom: idx === section.attributes.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                            background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                          }}
                        >
                          {/* Attribute Name / Feed Key */}
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#f1f5f9' }}>
                                {attr.key}
                              </span>
                              {attr.required && (
                                <span style={{
                                  fontSize: '9px',
                                  color: '#f43f5e',
                                  fontWeight: '800',
                                  letterSpacing: '0.3px'
                                }}>
                                  *REQ
                                </span>
                              )}
                            </div>
                            <span style={{
                              fontSize: '10px',
                              fontFamily: 'monospace',
                              color: '#64748b',
                              display: 'block',
                              marginTop: '2px'
                            }}>
                              feed: {attr.name}
                            </span>
                          </div>

                          {/* Attribute Value & Description */}
                          <div>
                            <div style={{
                              fontSize: '13px',
                              color: '#00d2ff',
                              fontWeight: '600',
                              wordBreak: 'break-word',
                              lineHeight: '1.4'
                            }}>
                              {String(attr.value)}
                            </div>
                            {attr.note && (
                              <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                                💡 {attr.note}
                              </div>
                            )}
                          </div>

                          {/* 1-Click Copy Button */}
                          <div>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(String(attr.value), `flat-${attr.name}`)}
                              title={`Copy ${attr.key}`}
                              style={{
                                background: isFieldCopied ? 'rgba(37, 211, 102, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                border: isFieldCopied ? '1px solid #25d366' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: isFieldCopied ? '#25d366' : '#cbd5e1',
                                borderRadius: '6px',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isFieldCopied ? <Check size={14} /> : <Copy size={13} />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div>
            Powered by <strong>Seller Suite Pro 2026</strong> • Fully compliant with Amazon A9 & Indian Legal Metrology Act 2020.
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#cbd5e1',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
