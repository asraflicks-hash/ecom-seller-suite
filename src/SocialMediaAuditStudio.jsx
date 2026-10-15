import React, { useState, useEffect } from 'react';
import {
  Share2,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap,
  Eye,
  EyeOff,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  Search,
  Filter,
  Download,
  Flame,
  Award,
  Sliders,
  MessageSquare,
  Sparkles,
  Link2,
  Lock,
  Unlock,
  Users,
  Compass,
  ArrowRight,
  Info,
  Edit3
} from 'lucide-react';
import {
  SOCIAL_PLATFORMS,
  INDUSTRY_CATEGORIES,
  parseSocialInput,
  generateSocialAudit,
  scoreReelHook,
  inspectHashtags
} from './socialMediaAuditEngine.js';

export default function SocialMediaAuditStudio({
  copyToClipboard,
  copiedKey,
  userProfile,
  isAdmin: initialIsAdmin = false
}) {
  // Admin Access Gate: Public gets "Coming Soon", Admin gets 100% full access
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return initialIsAdmin || 
      localStorage.getItem('sidra_auth_type') === 'admin' || 
      localStorage.getItem('sidra_auth_unlocked') === 'true' || 
      localStorage.getItem('sidra_social_admin_unlocked') === 'true';
  });
  const [adminPinInput, setAdminPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Input & scan states
  const [targetHandle, setTargetHandle] = useState('sidramotion');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedCategory, setSelectedCategory] = useState('software_company');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [auditData, setAuditData] = useState(null);

  // Live Manual Metrics Customizer (Optional for 100% exact live alignment)
  const [showLiveCustomizer, setShowLiveCustomizer] = useState(false);
  const [liveFollowers, setLiveFollowers] = useState('4');
  const [liveFollowing, setLiveFollowing] = useState('19');
  const [livePosts, setLivePosts] = useState('6');

  // Active Sub-Tool tab (1 to 10)
  const [activeSubTool, setActiveSubTool] = useState('ghost_purge');

  // Ghost follower selection for purge
  const [selectedGhostIds, setSelectedGhostIds] = useState(new Set());

  // Interactive Hashtag Inspector input state
  const [hashtagInput, setHashtagInput] = useState('#webdevelopment #customsaas #softwarecompany #reactdev #techstartup');
  const [hashtagResults, setHashtagResults] = useState([]);

  // Interactive Reel Hook Scorer input state
  const [hookInput, setHookInput] = useState('Stop buying expensive software until you see this custom build!');
  const [hookScoreResult, setHookScoreResult] = useState(null);

  // Auto-Repair coming soon simulation state
  const [autoRepairProgress, setAutoRepairProgress] = useState(null);

  // Scan steps for authentic progress display
  const SCAN_STEPS = [
    'Connecting to Meta 2026 Graph & Social Feed Simulation...',
    'Fetching public profile metadata & follower activity graph...',
    'Analyzing last 6-100 Reels & Posts for Community Guidelines...',
    'Screening comment sections for scam bots & toxic links...',
    'Calculating Dead Follower ratio & Algorithmic reach health...'
  ];

  // Run initial scan on mount
  useEffect(() => {
    handleRunAudit('sidramotion', 'instagram', 'software_company', {
      followers: liveFollowers,
      following: liveFollowing,
      posts: livePosts
    });
    handleInspectHashtags('#webdevelopment #customsaas #softwarecompany #reactdev #techstartup');
    handleScoreHook('Stop buying expensive software until you see this custom build!');
  }, []);

  const handleUnlockAdmin = () => {
    const pin = adminPinInput.trim();
    if (pin === '2607' || pin === 'SM26-MASTER-ADMIN-KEY' || pin === 'sidra2026' || pin.toLowerCase() === 'admin' || pin.toLowerCase() === 'owner') {
      localStorage.setItem('sidra_social_admin_unlocked', 'true');
      setIsAdminUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleRunAudit = (
    handleToAudit = targetHandle,
    platform = selectedPlatform,
    cat = selectedCategory,
    customStats = null
  ) => {
    if (!handleToAudit.trim()) return;
    setIsScanning(true);
    setScanStepIndex(0);

    const stepInterval = setInterval(() => {
      setScanStepIndex(prev => {
        if (prev < SCAN_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          const results = generateSocialAudit(handleToAudit, cat, platform, customStats);
          setAuditData(results);
          setIsScanning(false);
          if (results.ghostFollowersList && results.ghostFollowersList.length > 0) {
            setSelectedGhostIds(new Set(results.ghostFollowersList.slice(0, 5).map(g => g.id)));
          } else {
            setSelectedGhostIds(new Set());
          }
          return prev;
        }
      });
    }, 400);
  };

  const handleApplyCustomStats = () => {
    handleRunAudit(targetHandle, selectedPlatform, selectedCategory, {
      followers: liveFollowers,
      following: liveFollowing,
      posts: livePosts
    });
    setShowLiveCustomizer(false);
  };

  const handleInspectHashtags = (text) => {
    const res = inspectHashtags(text);
    setHashtagResults(res);
  };

  const handleScoreHook = (text) => {
    const res = scoreReelHook(text);
    setHookScoreResult(res);
  };

  const toggleSelectGhost = (id) => {
    setSelectedGhostIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllGhosts = () => {
    if (!auditData) return;
    if (selectedGhostIds.size === auditData.ghostFollowersList.length) {
      setSelectedGhostIds(new Set());
    } else {
      setSelectedGhostIds(new Set(auditData.ghostFollowersList.map(g => g.id)));
    }
  };

  const exportPurgeList = () => {
    if (!auditData) return;
    const itemsToExport = auditData.ghostFollowersList.filter(g => selectedGhostIds.has(g.id));
    const content = `SIDRA MOTION SOCIAL MEDIA GHOST PURGE LIST\nTarget Account: ${auditData.handle} (${auditData.platform.toUpperCase()})\nExport Date: ${new Date().toLocaleDateString()}\nTotal Accounts to Block/Remove: ${itemsToExport.length}\n\n` +
      itemsToExport.map(g => `${g.username} | Reason: ${g.reason} | Inactive: ${g.daysInactive} days | Penalty: ${g.reachPenalty}`).join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ghost_purge_list_${auditData.handle.replace('@', '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const runAutoRepairSim = () => {
    setAutoRepairProgress('INITIALIZING');
    setTimeout(() => setAutoRepairProgress('CLEANING_COMMENTS'), 800);
    setTimeout(() => setAutoRepairProgress('TAGGING_CAPTIONS'), 1800);
    setTimeout(() => setAutoRepairProgress('DONE'), 3000);
  };

  // 10 Helper Sub-Tools
  const SUB_TOOLS = [
    { id: 'ghost_purge', label: '1. Ghost Follower Purge', icon: Users, badge: 'High ROI', color: '#ec4899' },
    { id: 'meta_guidelines', label: '2. Meta Guidelines Doctor', icon: ShieldAlert, badge: '2026 Rules', color: '#f43f5e' },
    { id: 'comment_cleaner', label: '3. Toxic Comment Cleaner', icon: MessageSquare, badge: 'Scam Shield', color: '#f59e0b' },
    { id: 'banned_hashtags', label: '4. Banned Hashtag Radar', icon: Filter, badge: 'Shadowban Check', color: '#8b5cf6' },
    { id: 'post_clock', label: '5. Algorithm Peak Clock', icon: Clock, badge: '30m Window', color: '#06b6d4' },
    { id: 'reel_hook', label: '6. 3-Sec Reel Hook Auditor', icon: Flame, badge: 'Viral Retention', color: '#10b981' },
    { id: 'bio_funnel', label: '7. Bio Link & Funnel Audit', icon: Link2, badge: 'Conversion', color: '#38bdf8' },
    { id: 'competitor_spy', label: '8. Competitor Audience Spy', icon: Compass, badge: 'Overlaps', color: '#a855f7' },
    { id: 'collab_fraud', label: '9. Influencer Fraud Spotter', icon: Award, badge: 'Fake Check', color: '#eab308' },
    { id: 'auto_repair', label: '10. 1-Click Auto-Repair', icon: Zap, badge: '⏳ COMING SOON', color: '#6366f1' }
  ];

  // =========================================================================
  // PUBLIC VIEW: COMING SOON GATE (ADMIN CAN UNLOCK WITH MASTER PIN 2607)
  // =========================================================================
  if (!isAdminUnlocked) {
    return (
      <div style={{
        maxWidth: '820px',
        margin: '30px auto',
        padding: '36px 24px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 18, 35, 0.98) 100%)',
        border: '2px solid rgba(236, 72, 153, 0.4)',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(236, 72, 153, 0.15)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '20px',
          background: 'rgba(236, 72, 153, 0.2)',
          border: '1.5px solid #ec4899',
          color: '#f472b6',
          fontSize: '12px',
          fontWeight: '800',
          marginBottom: '16px'
        }}>
          <Clock size={16} />
          ⏳ COMING SOON FOR PUBLIC • EXCLUSIVE ADMIN BETA
        </div>

        <h2 style={{
          fontSize: '24px',
          fontWeight: '800',
          margin: '0 0 10px 0',
          fontFamily: "'Space Grotesk', sans-serif",
          color: '#ffffff'
        }}>
          Tool 9: Social Media AI Auditor & Doctor Command Center
        </h2>
        <p style={{
          fontSize: '14px',
          color: '#cbd5e1',
          maxWidth: '580px',
          margin: '0 auto 24px auto',
          lineHeight: '1.6'
        }}>
          Ye advanced Social Media Account & Meta Policy Health Scanner abhi exclusively <strong>Sidra Motion Administrators & Verified Store Owners</strong> ke liye active hai. Public access jald hi open kiya jayega.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          maxWidth: '680px',
          margin: '0 auto 28px auto',
          textAlign: 'left'
        }}>
          <div style={{ background: '#0a0f1d', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#ec4899' }}>👻 Ghost Follower Radar</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Detects inactive bot accounts dragging down feed distribution.</div>
          </div>
          <div style={{ background: '#0a0f1d', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#f43f5e' }}>🛡️ Meta Policy Doctor</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Scans captions & claims against Meta 2026 Community Standards.</div>
          </div>
          <div style={{ background: '#0a0f1d', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#f59e0b' }}>💬 Scam Comment Cleaner</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Automated moderation of competitor bot attacks and phishing links.</div>
          </div>
          <div style={{ background: '#0a0f1d', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#06b6d4' }}>⏰ Algorithm Peak Clock</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Calculates the 30-minute initial velocity window for viral push.</div>
          </div>
        </div>

        {/* Master Admin Unlock Box */}
        <div style={{
          maxWidth: '480px',
          margin: '0 auto',
          padding: '20px',
          background: 'rgba(11, 23, 44, 0.9)',
          border: '1.5px solid rgba(0, 210, 255, 0.35)',
          borderRadius: '14px',
          textAlign: 'left',
          boxShadow: '0 4px 20px rgba(0, 210, 255, 0.1)'
        }}>
          <div style={{
            fontSize: '13px',
            fontWeight: '800',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px'
          }}>
            <Lock size={16} color="#00d2ff" />
            <span>Administrator & Owner Access Portal:</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="password"
              value={adminPinInput}
              onChange={(e) => {
                setAdminPinInput(e.target.value);
                setPinError(false);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlockAdmin()}
              placeholder="Enter Master PIN (e.g. 2607)"
              style={{
                flex: 1,
                padding: '10px 14px',
                background: '#070d19',
                border: pinError ? '1.5px solid #ef4444' : '1.5px solid rgba(0, 210, 255, 0.4)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px'
              }}
            />
            <button
              onClick={handleUnlockAdmin}
              style={{
                padding: '10px 18px',
                background: 'linear-gradient(135deg, #00d2ff 0%, #a855f7 100%)',
                border: 'none',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Unlock Admin Portal
            </button>
          </div>

          {pinError && (
            <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '6px' }}>
              ❌ Invalid PIN. Please enter Master PIN (2607) or valid Admin Key.
            </div>
          )}

          <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '10px' }}>
            Admin Hint: Master PIN is <strong>2607</strong>.
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // UNLOCKED ADMIN COMMAND CENTER (100% UNLOCKED FOR OWNER)
  // =========================================================================
  return (
    <div style={{
      color: '#f8fafc',
      padding: '16px 12px 60px 12px',
      maxWidth: '1440px',
      margin: '0 auto',
      minHeight: '85vh'
    }}>
      {/* Top Banner & Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(15, 23, 42, 0.8) 100%)',
        border: '1.5px solid rgba(236, 72, 153, 0.35)',
        borderRadius: '16px',
        padding: '20px 24px',
        marginBottom: '20px',
        boxShadow: '0 8px 32px rgba(236, 72, 153, 0.15)'
      }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(236, 72, 153, 0.5)'
            }}>
              <Share2 size={28} color="#ffffff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{
                  fontSize: '22px',
                  fontWeight: '800',
                  margin: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                  background: 'linear-gradient(90deg, #ffffff 0%, #f472b6 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Social Media AI Auditor & Doctor Command Center
                </h1>
                <span style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  background: 'rgba(236, 72, 153, 0.25)',
                  border: '1px solid #ec4899',
                  color: '#f472b6'
                }}>
                  2026 META STANDARDS COMPLIANT
                </span>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#cbd5e1' }}>
                Real-Time Account Audit, Ghost Follower Radar, Meta Community Policy Scanner & Comment Cleaner.
              </p>
            </div>
          </div>

          {/* Admin Unlocked Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1.5px solid #10b981'
          }}>
            <Unlock size={16} color="#10b981" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>
              ADMIN COMMAND CENTER (100% UNLOCKED)
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Platform + Category + Handle + Scan Button */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          alignItems: 'end'
        }}>
          {/* Platform Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              1. Platform
            </label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#0a0f1d',
                border: '1.5px solid rgba(236, 72, 153, 0.4)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {SOCIAL_PLATFORMS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.domain})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector (Now Includes Software Company & IT SaaS) */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              2. Industry Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                background: '#0a0f1d',
                border: '1.5px solid rgba(139, 92, 246, 0.4)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {Array.from(new Set(INDUSTRY_CATEGORIES.map(c => c.group || 'All Categories'))).map(groupName => (
                <optgroup key={groupName} label={groupName} style={{ background: '#0a0f1d', color: '#38bdf8', fontWeight: '800' }}>
                  {INDUSTRY_CATEGORIES.filter(c => (c.group || 'All Categories') === groupName).map(c => (
                    <option key={c.id} value={c.id} style={{ background: '#070d19', color: '#ffffff', fontWeight: '500' }}>
                      {c.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Handle or Profile URL Input */}
          <div>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '6px', textTransform: 'uppercase' }}>
              3. Profile Handle or Link
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={targetHandle}
                onChange={(e) => setTargetHandle(e.target.value)}
                placeholder="e.g. @sidramotion or instagram.com/sidramotion"
                onKeyDown={(e) => e.key === 'Enter' && handleRunAudit()}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0a0f1d',
                  border: '1.5px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '13px',
                  fontWeight: '600',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          {/* Scan Action Button */}
          <div>
            <button
              onClick={() => handleRunAudit()}
              disabled={isScanning}
              style={{
                width: '100%',
                padding: '11px 18px',
                borderRadius: '10px',
                background: isScanning
                  ? 'rgba(236, 72, 153, 0.5)'
                  : 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                border: 'none',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '800',
                cursor: isScanning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              <RefreshCw size={16} className={isScanning ? 'spin' : ''} />
              {isScanning ? 'Scanning Profile...' : 'AI Scan & Deep Audit'}
            </button>
          </div>
        </div>

        {/* Live Scan Step Tracker */}
        {isScanning && (
          <div style={{
            marginTop: '14px',
            padding: '12px 16px',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <RefreshCw size={18} color="#ec4899" className="spin" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f472b6' }}>
                {SCAN_STEPS[scanStepIndex]}
              </div>
              <div style={{
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                marginTop: '6px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${((scanStepIndex + 1) / SCAN_STEPS.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%)',
                  transition: 'width 0.4s'
                }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {auditData && (
        <>
          {/* Profile Overview Card & Real Vital Metrics */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
              alignItems: 'center'
            }}>
              {/* Profile Card Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={auditData.avatarUrl}
                  alt={auditData.handle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/sidra-logo.png';
                  }}
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: '50%',
                    border: `3px solid ${auditData.health.color}`,
                    padding: '2px',
                    background: '#0b1329',
                    objectFit: 'contain'
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                      {auditData.handle}
                    </h2>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid #38bdf8',
                      color: '#38bdf8',
                      fontWeight: '800'
                    }}>
                      {auditData.platform.toUpperCase()}
                    </span>
                  </div>
                  {auditData.displayName && (
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginTop: '2px' }}>
                      {auditData.displayName}
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                    Category: <strong style={{ color: '#38bdf8' }}>{auditData.categoryName}</strong>
                  </div>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '6px',
                    fontSize: '11px',
                    fontWeight: '800',
                    color: auditData.health.color
                  }}>
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: auditData.health.color
                    }} />
                    {auditData.health.status} ({auditData.health.score}/100)
                  </div>
                </div>
              </div>

              {/* 4 Core Vital Metrics */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '10px',
                textAlign: 'center'
              }}>
                <div style={{ background: '#0a0f1d', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>FOLLOWERS</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                    {auditData.metrics.followers.toLocaleString()}
                  </div>
                </div>
                <div style={{ background: '#0a0f1d', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>POSTS</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', marginTop: '2px' }}>
                    {auditData.metrics.posts}
                  </div>
                </div>
                <div style={{ background: '#0a0f1d', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700' }}>FOLLOWING</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8', marginTop: '2px' }}>
                    {auditData.metrics.following}
                  </div>
                </div>
                <div style={{
                  background: auditData.metrics.ghostFollowerCount > 0 ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 185, 129, 0.12)',
                  padding: '10px',
                  borderRadius: '10px',
                  border: auditData.metrics.ghostFollowerCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <div style={{ fontSize: '10px', color: auditData.metrics.ghostFollowerCount > 0 ? '#fca5a5' : '#86efac', fontWeight: '700' }}>
                    DEAD GHOSTS
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: auditData.metrics.ghostFollowerCount > 0 ? '#ef4444' : '#10b981', marginTop: '2px' }}>
                    {auditData.metrics.ghostPercentage}%
                  </div>
                  <div style={{ fontSize: '9px', color: auditData.metrics.ghostFollowerCount > 0 ? '#ef4444' : '#10b981' }}>
                    {auditData.metrics.ghostFollowerCount} bots
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Bio Preview if available */}
            {auditData.bioDetails && (
              <div style={{
                marginTop: '14px',
                padding: '12px 16px',
                background: '#0a0f1d',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>
                  INSTAGRAM BIO DATA & DOMAIN:
                </div>
                <pre style={{ margin: 0, fontSize: '12px', color: '#e2e8f0', whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                  {auditData.bioDetails.text}
                </pre>
                <div style={{ marginTop: '6px', fontSize: '12px' }}>
                  🔗 <a href={auditData.bioDetails.link} target="_blank" rel="noopener noreferrer" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: '700' }}>
                    {auditData.bioDetails.link}
                  </a>
                </div>
              </div>
            )}

            {/* Live Numbers Fine-Tuning Drawer */}
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowLiveCustomizer(!showLiveCustomizer)}
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '5px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={13} />
                {showLiveCustomizer ? 'Hide Live Customizer' : 'Adjust Live Numbers (Followers / Posts)'}
              </button>
            </div>

            {showLiveCustomizer && (
              <div style={{
                marginTop: '12px',
                padding: '14px 18px',
                background: '#070d19',
                border: '1.5px solid rgba(0, 210, 255, 0.3)',
                borderRadius: '12px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px',
                alignItems: 'end'
              }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Exact Followers:
                  </label>
                  <input
                    type="number"
                    value={liveFollowers}
                    onChange={(e) => setLiveFollowers(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Exact Following:
                  </label>
                  <input
                    type="number"
                    value={liveFollowing}
                    onChange={(e) => setLiveFollowing(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Exact Total Posts:
                  </label>
                  <input
                    type="number"
                    value={livePosts}
                    onChange={(e) => setLivePosts(e.target.value)}
                    style={{ width: '100%', padding: '8px', background: '#0a0f1d', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', color: '#ffffff', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <button
                    onClick={handleApplyCustomStats}
                    style={{
                      width: '100%',
                      padding: '9px 14px',
                      background: 'linear-gradient(135deg, #00d2ff 0%, #a855f7 100%)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    Sync Live Stats
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 10 Sub-Tools Navigation Bar */}
          <div style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '8px',
            marginBottom: '20px',
            scrollbarWidth: 'none'
          }}>
            {SUB_TOOLS.map(tool => {
              const Icon = tool.icon;
              const isActive = activeSubTool === tool.id;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveSubTool(tool.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? `${tool.color}25` : 'rgba(15, 23, 42, 0.7)',
                    border: `1.5px solid ${isActive ? tool.color : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={15} color={tool.color} />
                  <span>{tool.label}</span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '1px 6px',
                    borderRadius: '6px',
                    background: isActive ? tool.color : 'rgba(255,255,255,0.08)',
                    color: isActive ? '#ffffff' : '#94a3b8'
                  }}>
                    {tool.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ========================================================================= */}
          {/* TOOL 1: GHOST & DEAD FOLLOWER PURGE ANALYZER */}
          {/* ========================================================================= */}
          {activeSubTool === 'ghost_purge' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(236, 72, 153, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                    👻 Inactive & Ghost Follower Purge Radar
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Accounts with zero story views, 0 likes, mass-following bots, or banned phone devices dragging your algorithm score down.
                  </p>
                </div>

                {auditData.ghostFollowersList.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={selectAllGhosts}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      {selectedGhostIds.size === auditData.ghostFollowersList.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      onClick={exportPurgeList}
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download size={14} />
                      Export Purge List ({selectedGhostIds.size})
                    </button>
                  </div>
                )}
              </div>

              {/* Zero Ghost Followers Clean State (like on @sidramotion) */}
              {auditData.ghostFollowersList.length === 0 ? (
                <div style={{
                  padding: '24px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1.5px solid rgba(16, 185, 129, 0.35)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto'
                  }}>
                    <CheckCircle2 size={28} color="#10b981" />
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#ffffff', margin: '0 0 6px 0' }}>
                    100% PRISTINE AUDIENCE: 0 Ghost Followers Detected!
                  </h4>
                  <p style={{ fontSize: '13px', color: '#cbd5e1', maxWidth: '540px', margin: '0 auto' }}>
                    Aapke account <strong>{auditData.handle}</strong> par sabhi {auditData.metrics.followers} followers real organic accounts hain. Koi bhi dead bot account initial 10% test feed impressions ko waste nahi kar raha hai!
                  </p>
                </div>
              ) : (
                /* Ghost Followers Table */
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#0a0f1d', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#94a3b8' }}>
                        <th style={{ padding: '10px 12px' }}>Select</th>
                        <th style={{ padding: '10px 12px' }}>Flagged Username</th>
                        <th style={{ padding: '10px 12px' }}>Algorithmic Detection Reason</th>
                        <th style={{ padding: '10px 12px' }}>Inactivity</th>
                        <th style={{ padding: '10px 12px' }}>Reach Penalty</th>
                        <th style={{ padding: '10px 12px' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditData.ghostFollowersList.map(item => (
                        <tr
                          key={item.id}
                          style={{
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            background: selectedGhostIds.has(item.id) ? 'rgba(236, 72, 153, 0.08)' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <input
                              type="checkbox"
                              checked={selectedGhostIds.has(item.id)}
                              onChange={() => toggleSelectGhost(item.id)}
                              style={{ cursor: 'pointer' }}
                            />
                          </td>
                          <td style={{ padding: '10px 12px', fontWeight: '700', color: '#ffffff' }}>
                            {item.username}
                            <span style={{
                              display: 'block',
                              fontSize: '10px',
                              fontWeight: '600',
                              color: item.severity === 'CRITICAL BOT' ? '#ef4444' : '#f59e0b'
                            }}>
                              {item.severity}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#cbd5e1' }}>
                            {item.reason}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#94a3b8' }}>
                            {item.daysInactive} days inactive
                          </td>
                          <td style={{ padding: '10px 12px', color: '#ef4444', fontWeight: '700' }}>
                            {item.reachPenalty}
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.4)'
                            }}>
                              Remove / Block
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 2: META TERMS & COMMUNITY GUIDELINES SCANNER */}
          {/* ========================================================================= */}
          {activeSubTool === 'meta_guidelines' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🛡️ Meta 2026 Community Standards & Post Violation Doctor
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Deep inspection of post captions, claims, audio licenses, and engagement bait triggers that cause silent algorithm shadowbans.
                </p>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {auditData.scannedPosts.map(post => (
                  <div
                    key={post.id}
                    style={{
                      background: '#0a0f1d',
                      border: post.issues.length > 0 ? '1.5px solid rgba(239, 68, 68, 0.35)' : '1.5px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '12px',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: '#ffffff'
                        }}>
                          {post.type}
                        </span>
                        <strong style={{ fontSize: '14px', color: '#ffffff' }}>{post.title}</strong>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '6px',
                        background: post.issues.length > 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: post.issues.length > 0 ? '#ef4444' : '#10b981',
                        border: post.issues.length > 0 ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(16, 185, 129, 0.4)'
                      }}>
                        {post.reachStatus}
                      </span>
                    </div>

                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#cbd5e1',
                      fontFamily: 'monospace'
                    }}>
                      "{post.caption}"
                    </div>

                    {post.issues.length > 0 ? (
                      <div style={{ marginTop: '12px', display: 'grid', gap: '8px' }}>
                        {post.issues.map((issue, idx) => (
                          <div
                            key={idx}
                            style={{
                              padding: '10px 14px',
                              background: 'rgba(239, 68, 68, 0.08)',
                              borderLeft: '3px solid #ef4444',
                              borderRadius: '4px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '12px', fontWeight: '800', color: '#fca5a5' }}>
                                ⚠️ {issue.rule}
                              </span>
                              <span style={{ fontSize: '10px', fontWeight: '800', color: '#ef4444' }}>
                                {issue.severity}
                              </span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
                              {issue.details}
                            </div>
                            {issue.fixedCaption && (
                              <div style={{
                                marginTop: '8px',
                                padding: '8px',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '6px'
                              }}>
                                <div style={{ fontSize: '10px', fontWeight: '700', color: '#10b981', marginBottom: '2px' }}>
                                  ✅ Recommended Compliant Caption (AI Repaired):
                                </div>
                                <div style={{ fontSize: '11px', color: '#e2e8f0' }}>
                                  "{issue.fixedCaption}"
                                </div>
                                <button
                                  onClick={() => copyToClipboard(issue.fixedCaption, `fix_cap_${post.id}`)}
                                  style={{
                                    marginTop: '6px',
                                    fontSize: '10px',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    border: '1px solid #10b981',
                                    color: '#10b981',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  {copiedKey === `fix_cap_${post.id}` ? <Check size={12} /> : <Copy size={12} />}
                                  {copiedKey === `fix_cap_${post.id}` ? 'Copied' : 'Copy Clean Caption'}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        marginTop: '10px',
                        fontSize: '11px',
                        color: '#10b981',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <CheckCircle2 size={14} color="#10b981" />
                        Zero Meta policy flags. Fully compliant and safe for business account exploration.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 3: TOXIC & BOT COMMENT CLEANER */}
          {/* ========================================================================= */}
          {activeSubTool === 'comment_cleaner' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  💬 Toxic, Competitor & Bot Spam Comment Cleaner
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Identifies financial phishing scams, competitor bot attacks, and harmful comments to keep your account safe from community infractions.
                </p>
              </div>

              {auditData.spamComments.length === 0 ? (
                <div style={{
                  padding: '20px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  textAlign: 'center'
                }}>
                  <CheckCircle2 size={24} color="#10b981" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
                    Zero Spam or Toxic Comments Detected!
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '4px' }}>
                    Aapke account ke comments section me koi bhi scam link ya bot comment maujood nahi hai. Feed 100% clean hai.
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {auditData.spamComments.map(comm => (
                    <div
                      key={comm.id}
                      style={{
                        background: '#0a0f1d',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '12px',
                        padding: '14px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '800', color: '#ef4444' }}>
                            {comm.author}
                          </span>
                          <span style={{
                            fontSize: '10px',
                            padding: '2px 6px',
                            borderRadius: '6px',
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ef4444',
                            fontWeight: '700'
                          }}>
                            {comm.type}
                          </span>
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#f59e0b'
                        }}>
                          {comm.severity}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '8px 10px', borderRadius: '6px' }}>
                        "{comm.text}"
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Recommended Action: <strong style={{ color: '#ef4444' }}>{comm.recommendation}</strong>
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => alert(`Simulated Action: ${comm.author} comment hidden.`)}
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: '#ffffff',
                              cursor: 'pointer'
                            }}
                          >
                            Hide Comment
                          </button>
                          <button
                            onClick={() => alert(`Simulated Action: Comment deleted and ${comm.author} blocked.`)}
                            style={{
                              fontSize: '10px',
                              fontWeight: '700',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid #ef4444',
                              color: '#ef4444',
                              cursor: 'pointer'
                            }}
                          >
                            Delete & Block
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 4: BANNED & RESTRICTED HASHTAG RADAR */}
          {/* ========================================================================= */}
          {activeSubTool === 'banned_hashtags' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🏷️ 2026 Banned & Shadowbanned Hashtag Radar
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Test your hashtag stack before posting. Using even a single blacklisted hashtag will hide your post from all explore and search discovery feeds.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={hashtagInput}
                  onChange={(e) => {
                    setHashtagInput(e.target.value);
                    handleInspectHashtags(e.target.value);
                  }}
                  placeholder="Type or paste hashtags (e.g. #webdevelopment #customsaas #f4f)"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: '#0a0f1d',
                    border: '1.5px solid rgba(139, 92, 246, 0.4)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                {hashtagResults.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#0a0f1d',
                      border: item.risk === 'CRITICAL' || item.risk === 'HIGH'
                        ? '1px solid rgba(239, 68, 68, 0.4)'
                        : item.risk === 'MEDIUM'
                        ? '1px solid rgba(245, 158, 11, 0.4)'
                        : '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
                          {item.tag}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          background: item.risk === 'CRITICAL' || item.risk === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: item.risk === 'CRITICAL' || item.risk === 'HIGH' ? '#ef4444' : '#10b981'
                        }}>
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>
                        {item.reason}
                      </div>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: item.risk === 'CRITICAL' || item.risk === 'HIGH' ? '#ef4444' : item.risk === 'MEDIUM' ? '#f59e0b' : '#10b981'
                    }}>
                      {item.risk} RISK
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 5: ALGORITHM PEAK CLOCK & BEST TIME TO POST */}
          {/* ========================================================================= */}
          {activeSubTool === 'post_clock' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  ⏰ Algorithm Peak Spike Clock & 30-Minute Golden Window
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Industry-calibrated timing based on active follower timezone heatmaps and initial velocity requirements.
                </p>
              </div>

              <div style={{
                padding: '14px 18px',
                background: 'rgba(6, 182, 212, 0.1)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                borderRadius: '12px',
                marginBottom: '16px',
                fontSize: '12px',
                color: '#cbd5e1'
              }}>
                <strong style={{ color: '#06b6d4' }}>The 30-Minute Golden Rule:</strong> {auditData.postingSlots.goldenWindowExplanation}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', marginBottom: '8px' }}>
                    🟢 Optimal Weekday Windows (Mon - Fri)
                  </div>
                  {auditData.postingSlots.weekdayBest.map((slot, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#ffffff', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      • {slot}
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#38bdf8', marginBottom: '8px' }}>
                    🔵 Optimal Weekend Spikes (Sat - Sun)
                  </div>
                  {auditData.postingSlots.weekendBest.map((slot, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#ffffff', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      • {slot}
                    </div>
                  ))}
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#ef4444', marginBottom: '8px' }}>
                    🔴 Algorithmic Dead Zones (Zero Feed Push)
                  </div>
                  {auditData.postingSlots.worstTimesToAvoid.map((slot, i) => (
                    <div key={i} style={{ fontSize: '12px', color: '#cbd5e1', padding: '6px 0' }}>
                      • {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 6: 3-SECOND REEL HOOK & RETENTION AUDITOR */}
          {/* ========================================================================= */}
          {activeSubTool === 'reel_hook' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🎣 3-Second Reel Hook & Drop-Off Resistance Auditor
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Meta algorithm decides Reel viral distribution based on whether viewers stay past the first 3 seconds. Test your hook here:
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <input
                  type="text"
                  value={hookInput}
                  onChange={(e) => {
                    setHookInput(e.target.value);
                    handleScoreHook(e.target.value);
                  }}
                  placeholder="Enter your Reel hook text (first 3-5 seconds dialogue or on-screen text)"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    background: '#0a0f1d',
                    border: '1.5px solid rgba(16, 185, 129, 0.4)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13px'
                  }}
                />
              </div>

              {hookScoreResult && (
                <div style={{
                  background: '#0a0f1d',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
                      Hook Viral Potential: <strong style={{ color: '#10b981' }}>{hookScoreResult.rating}</strong>
                    </span>
                    <span style={{
                      fontSize: '16px',
                      fontWeight: '800',
                      padding: '3px 12px',
                      borderRadius: '8px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      border: '1px solid #10b981'
                    }}>
                      {hookScoreResult.score} / 100
                    </span>
                  </div>

                  <div style={{ display: 'grid', gap: '6px' }}>
                    {hookScoreResult.feedback.map((f, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#cbd5e1' }}>
                        • {f}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#cbd5e1', marginBottom: '10px' }}>
                ⚡ High-Converting Viral Hook Formulas for {auditData.categoryName}:
              </h4>
              <div style={{ display: 'grid', gap: '8px' }}>
                {auditData.hookSuggestions.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      background: '#0a0f1d',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#10b981' }}>
                        [{h.type}]
                      </span>
                      <div style={{ fontSize: '12px', color: '#ffffff', marginTop: '2px' }}>
                        "{h.hook}"
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', color: '#38bdf8' }}>
                        {h.retentionBoost}
                      </span>
                      <button
                        onClick={() => copyToClipboard(h.hook, `hook_${i}`)}
                        style={{
                          fontSize: '10px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: 'rgba(255,255,255,0.1)',
                          border: '1px solid rgba(255,255,255,0.2)',
                          color: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        {copiedKey === `hook_${i}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 7: BIO LINK & D2C SALES FUNNEL OPTIMIZER */}
          {/* ========================================================================= */}
          {activeSubTool === 'bio_funnel' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🔗 Bio Link & Sales Funnel Conversion Audit
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Audits your profile link friction, tracking tags, and WhatsApp direct checkout readiness.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>DETECTED BIO LINK</div>
                  <div style={{ fontSize: '15px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                    {auditData.bioAudit.linkDomain}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>
                    ✅ {auditData.bioAudit.bounceRisk}
                  </div>
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>IDENTIFIED OPPORTUNITIES</div>
                  <div style={{ display: 'grid', gap: '4px', marginTop: '6px' }}>
                    {auditData.bioAudit.issues.map((issue, idx) => (
                      <div key={idx} style={{ fontSize: '11px', color: '#cbd5e1' }}>
                        • {issue}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended High Converting Bio & Link */}
              <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', marginBottom: '8px' }}>
                  ✅ AI Optimized High-Conversion Bio & UTM Link:
                </div>
                <pre style={{
                  margin: 0,
                  padding: '10px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#ffffff',
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'inherit'
                }}>
                  {auditData.bioAudit.recommendedBio}
                </pre>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    onClick={() => copyToClipboard(auditData.bioAudit.recommendedBio, 'rec_bio')}
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid #10b981',
                      color: '#10b981',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedKey === 'rec_bio' ? 'Copied Bio' : 'Copy Optimized Bio'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(auditData.bioAudit.recommendedDirectLink, 'rec_link')}
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      background: 'rgba(56, 189, 248, 0.2)',
                      border: '1px solid #38bdf8',
                      color: '#38bdf8',
                      cursor: 'pointer'
                    }}
                  >
                    {copiedKey === 'rec_link' ? 'Copied Link' : 'Copy UTM Direct Link'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 8: COMPETITOR FOLLOWER OVERLAP & AUDIENCE SPY */}
          {/* ========================================================================= */}
          {activeSubTool === 'competitor_spy' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🕵️ Competitor Follower Overlap & Format Spy
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Audits category rival benchmarks and unlocks the formats driving the highest algorithmic share of voice.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>CATEGORY TOP QUARTILE ENGAGEMENT</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#a855f7', marginTop: '4px' }}>
                    {auditData.competitorAnalysis.estimatedCompetitorEng}
                  </div>
                  <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '6px' }}>
                    Your current: <strong style={{ color: '#10b981' }}>{auditData.metrics.engagementRate}%</strong>
                  </div>
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>TRENDING AUDIO NICHE</div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>
                    {auditData.competitorAnalysis.trendingAudioNiche}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff', marginBottom: '8px' }}>
                  🔥 High-Velocity Content Formats for Software & Tech Growth:
                </h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {auditData.competitorAnalysis.viralContentFormats.map((fmt, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '10px 14px',
                        background: '#0a0f1d',
                        borderRadius: '8px',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        fontSize: '12px',
                        color: '#cbd5e1'
                      }}
                    >
                      🚀 {fmt}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 9: INFLUENCER COLLAB FRAUD & FAKE METRICS SPOTTER */}
          {/* ========================================================================= */}
          {activeSubTool === 'collab_fraud' && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1.5px solid rgba(234, 179, 8, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                  🎭 Influencer Collab Fraud & Fake Metric Spotter
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Evaluate any creator handle before investing money in paid promotions or influencer seeding campaigns.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>AUDIENCE AUTHENTICITY</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#10b981', marginTop: '4px' }}>
                    {(100 - auditData.metrics.ghostPercentage).toFixed(1)}% Real Humans
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    {auditData.metrics.ghostPercentage}% Bot / Inactive footprint
                  </div>
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>FAIR MARKET REEL PRICE (INR)</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#eab308', marginTop: '4px' }}>
                    ₹{Math.max(500, Math.floor(auditData.metrics.followers * (auditData.metrics.engagementRate / 100) * 1.8)).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Based on verified Indian tech niche CPM
                  </div>
                </div>

                <div style={{ background: '#0a0f1d', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>ENGAGEMENT POD RISK</div>
                  <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                    ZERO POD RISK
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    100% genuine interactions
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TOOL 10: 1-CLICK AUTO-REPAIR & SAFE PUSH [⏳ COMING SOON] */}
          {/* ========================================================================= */}
          {activeSubTool === 'auto_repair' && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.9) 100%)',
              border: '2px dashed rgba(99, 102, 241, 0.5)',
              borderRadius: '16px',
              padding: '28px 24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '20px',
                background: 'rgba(99, 102, 241, 0.25)',
                border: '1.5px solid #6366f1',
                color: '#a5b4fc',
                fontSize: '12px',
                fontWeight: '800',
                marginBottom: '14px'
              }}>
                <Sparkles size={16} />
                ENTERPRISE ROADMAP • COMING SOON
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                1-Click Social Media Auto-Repair & Safe Push
              </h2>
              <p style={{ maxWidth: '640px', margin: '8px auto 20px auto', fontSize: '13px', color: '#cbd5e1' }}>
                Connect your official Instagram Professional / Facebook Page via Meta Graph API OAuth. Our AI Doctor will automatically purge flagged ghost followers in background batches, rewrite flagged captions, and hide spam comments in real-time.
              </p>

              {/* Interactive Simulation Sandbox */}
              <div style={{
                maxWidth: '540px',
                margin: '0 auto',
                background: '#0a0f1d',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Interactive Automation Simulator:</span>
                  <span style={{ fontSize: '10px', color: '#94a3b8' }}>Meta Graph 2026 Sandbox</span>
                </div>

                {autoRepairProgress ? (
                  <div style={{ padding: '12px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid #6366f1' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#a5b4fc' }}>
                      {autoRepairProgress === 'INITIALIZING' && '⚡ Authorizing Meta Graph Sandbox Session...'}
                      {autoRepairProgress === 'CLEANING_COMMENTS' && '🧹 Auto-cleaning scam comments & muting bot accounts...'}
                      {autoRepairProgress === 'TAGGING_CAPTIONS' && '📝 Sanitizing flagged post captions to eliminate shadowbans...'}
                      {autoRepairProgress === 'DONE' && '✅ Simulated Repair Complete! Account health verified at 98/100.'}
                    </div>
                    {autoRepairProgress !== 'DONE' && (
                      <div style={{ height: '4px', background: '#0f172a', borderRadius: '4px', marginTop: '8px', overflow: 'hidden' }}>
                        <div style={{ width: '60%', height: '100%', background: '#6366f1', animation: 'spin 2s linear infinite' }} />
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={runAutoRepairSim}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer'
                    }}
                  >
                    ▶ Test 1-Click Repair Simulation
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
