import React, { useState, useEffect } from 'react';
import { 
  X, 
  Folder, 
  FolderOpen, 
  Clock, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  RefreshCw, 
  DollarSign, 
  Share2, 
  TrendingUp, 
  Zap, 
  FileText, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  Search,
  ArrowRight,
  Database
} from 'lucide-react';
import { getUserWorkHistory, deleteUserWork } from './supabaseClient';

export default function SavedWorkHistoryModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onRestoreWork 
}) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [restoredId, setRestoredId] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const items = await getUserWorkHistory();
      setHistoryItems(items);
    } catch (err) {
      console.warn('Failed to load work history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, currentUser]);

  // Listen to new work saved events
  useEffect(() => {
    const handleWorkSaved = () => {
      if (isOpen) {
        loadHistory();
      }
    };
    window.addEventListener('ssp_work_saved', handleWorkSaved);
    window.addEventListener('ssp_work_deleted', handleWorkSaved);
    return () => {
      window.removeEventListener('ssp_work_saved', handleWorkSaved);
      window.removeEventListener('ssp_work_deleted', handleWorkSaved);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = async (item) => {
    if (!window.confirm(`Kya aap "${item.title}" ko apne history se delete karna chahte hain?`)) {
      return;
    }
    setDeletingId(item.id || item.db_id);
    try {
      await deleteUserWork(item);
      setHistoryItems(prev => prev.filter(i => (i.id || i.db_id) !== (item.id || item.db_id)));
    } catch (err) {
      console.error('Delete work item error:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleRestore = (item) => {
    setRestoredId(item.id || item.db_id);
    setTimeout(() => {
      onRestoreWork && onRestoreWork(item);
      onClose();
    }, 400);
  };

  const getToolMeta = (toolId) => {
    switch (toolId) {
      case 'listing-ai':
        return { icon: Sparkles, color: '#00d2ff', bg: 'rgba(0, 210, 255, 0.15)', name: 'AI Listing Repair' };
      case 'rto-calculator':
        return { icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)', name: 'RTO & Profit Calc' };
      case 'buybox-repricer':
        return { icon: Zap, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)', name: 'BuyBox Repricer' };
      case 'review-analyzer':
        return { icon: TrendingUp, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)', name: 'Review Mining' };
      case 'social-doctor':
        return { icon: Share2, color: '#ec4899', bg: 'rgba(236, 72, 153, 0.15)', name: 'Social Audit' };
      case 'omnichannel-seo':
        return { icon: FileText, color: '#a855f7', bg: 'rgba(168, 85, 247, 0.15)', name: 'Omnichannel SEO' };
      default:
        return { icon: Layers, color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', name: 'Workstation Tool' };
    }
  };

  const filteredItems = historyItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.tool_id === activeFilter;
    const matchesSearch = !searchQuery.trim() || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.tool_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toolCounts = historyItems.reduce((acc, item) => {
    acc[item.tool_id] = (acc[item.tool_id] || 0) + 1;
    return acc;
  }, {});

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return 'Recent';
    }
  };

  const userEmail = currentUser?.email || (typeof window !== 'undefined' ? localStorage.getItem('sidra_user_email') : '') || 'Verified Seller';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(4, 9, 20, 0.88)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 99999,
      padding: '16px'
    }}>
      <div style={{
        background: 'linear-gradient(145deg, #0d1728 0%, #070e1b 100%)',
        border: '1.5px solid rgba(0, 210, 255, 0.35)',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '780px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8), 0 0 35px rgba(0, 210, 255, 0.15)',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 210, 255, 0.4)'
            }}>
              <FolderOpen size={22} color="#050b14" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px' }}>
                  My Saved Work History
                </h3>
                <span style={{
                  background: 'rgba(37, 211, 102, 0.15)',
                  border: '1px solid #25d366',
                  color: '#86efac',
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Database size={11} /> Cloud Synced
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Account: <b style={{ color: '#00d2ff' }}>{userEmail}</b> • Pichla sara kaam safe hai
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={loadHistory}
              title="Refresh History"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                padding: '8px',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={15} className={loading ? 'spin-fast' : ''} />
            </button>
            <button 
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Search & Tool Filter Tabs */}
        <div style={{
          padding: '12px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {/* Search Box */}
          <div style={{ position: 'relative' }}>
            <Search size={15} color="#64748b" style={{ position: 'absolute', left: '12px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search in your saved work (e.g. EVM Motherboard, Earbuds, RTO)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '2px',
            scrollbarWidth: 'none'
          }}>
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              style={{
                background: activeFilter === 'all' ? 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'all' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'all' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              All Projects ({historyItems.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('listing-ai')}
              style={{
                background: activeFilter === 'listing-ai' ? 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'listing-ai' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'listing-ai' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Listing Repairs ({toolCounts['listing-ai'] || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('rto-calculator')}
              style={{
                background: activeFilter === 'rto-calculator' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'rto-calculator' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'rto-calculator' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              RTO Calculations ({toolCounts['rto-calculator'] || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('buybox-repricer')}
              style={{
                background: activeFilter === 'buybox-repricer' ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'buybox-repricer' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'buybox-repricer' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              BuyBox ({toolCounts['buybox-repricer'] || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('review-analyzer')}
              style={{
                background: activeFilter === 'review-analyzer' ? 'linear-gradient(135deg, #f43f5e 0%, #be123c 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'review-analyzer' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'review-analyzer' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Review Audits ({toolCounts['review-analyzer'] || 0})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('omnichannel-seo')}
              style={{
                background: activeFilter === 'omnichannel-seo' ? 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)' : 'rgba(255, 255, 255, 0.05)',
                color: activeFilter === 'omnichannel-seo' ? '#050b14' : '#94a3b8',
                border: activeFilter === 'omnichannel-seo' ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '5px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: '700',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              SEO & Copy ({toolCounts['omnichannel-seo'] || 0})
            </button>
          </div>
        </div>

        {/* Content List */}
        <div style={{
          padding: '16px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
              <RefreshCw size={24} className="spin-fast" style={{ margin: '0 auto 10px auto', display: 'block', color: '#00d2ff' }} />
              <div style={{ fontSize: '13px' }}>Loading your previous work from cloud...</div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1.5px dashed rgba(255, 255, 255, 0.1)',
              borderRadius: '16px'
            }}>
              <Folder size={40} color="#475569" style={{ margin: '0 auto 12px auto' }} />
              <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#e2e8f0' }}>
                Koi Pichla Kaam Nahi Mila
              </h4>
              <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8', maxWidth: '380px', marginInline: 'auto' }}>
                Jab bhi aap kisi bhi tool me kaam karenge (jaise Listing Repair ya RTO Calculate), wo automatic aapke account (<b style={{ color: '#00d2ff' }}>{userEmail}</b>) me cloud sync ho jayega!
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const meta = getToolMeta(item.tool_id);
              const Icon = meta.icon;
              const isRestoring = restoredId === (item.id || item.db_id);
              const isDeleting = deletingId === (item.id || item.db_id);

              return (
                <div
                  key={item.id || item.db_id || idx}
                  style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: meta.bg,
                      border: `1px solid ${meta.color}40`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}>
                      <Icon size={18} color={meta.color} />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: meta.color,
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px'
                        }}>
                          {meta.name}
                        </span>
                        <span style={{ color: '#475569', fontSize: '10px' }}>•</span>
                        <span style={{
                          fontSize: '11px',
                          color: '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Clock size={11} /> {formatDate(item.created_at)}
                        </span>
                      </div>

                      <div style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#f8fafc',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {item.title}
                      </div>

                      {item.summary && (
                        <div style={{
                          fontSize: '12px',
                          color: '#94a3b8',
                          lineHeight: '1.4',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}>
                          {item.summary}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleRestore(item)}
                      disabled={isRestoring}
                      style={{
                        background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                        color: '#050b14',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 0 12px rgba(0, 210, 255, 0.3)',
                        transition: 'all 0.2s'
                      }}
                    >
                      {isRestoring ? (
                        <>
                          <CheckCircle2 size={13} /> Restored!
                        </>
                      ) : (
                        <>
                          <span>Load Work</span> <ArrowRight size={13} />
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      disabled={isDeleting}
                      title="Delete saved item"
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        borderRadius: '10px',
                        padding: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#25d366" />
            <span>Encrypted cloud backup • Har login ke baad data wapas load ho jata hai</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
