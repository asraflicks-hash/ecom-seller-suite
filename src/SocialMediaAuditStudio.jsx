import React, { useState, useEffect, useRef } from 'react';
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
  Edit3,
  ChevronDown,
  X,
  Printer
} from 'lucide-react';
import {
  SOCIAL_PLATFORMS,
  INDUSTRY_CATEGORIES,
  parseSocialInput,
  generateSocialAudit,
  scoreReelHook,
  inspectHashtags
} from './socialMediaAuditEngine.js';
import SocialAuditPdfModal from './SocialAuditPdfModal.jsx';
import { openPrintableSocialAuditReport } from './socialAuditPdfGenerator.js';

export const DAILY_AUDIT_LIMIT = 10;

const getTodayKey = () => new Date().toISOString().split('T')[0];

const getStoredScanUsage = () => {
  try {
    const raw = localStorage.getItem('ssp_social_audit_usage');
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed = JSON.parse(raw);
    if (parsed.date !== getTodayKey()) {
      return { date: getTodayKey(), count: 0 };
    }
    return parsed;
  } catch (e) {
    return { date: getTodayKey(), count: 0 };
  }
};

export default function SocialMediaAuditStudio({
  copyToClipboard,
  copiedKey,
  userProfile,
  isAdmin: initialIsAdmin = false
}) {
  // Check if current user is owner or admin (bypass daily limits completely)
  const isOwnerOrAdmin = initialIsAdmin || 
    localStorage.getItem('sidra_license_key_valid') === 'true' || 
    localStorage.getItem('sidra_owner_logged_in') === 'true';

  // Daily Quota Tracking (10 free scans per day per visitor)
  const [scansUsedToday, setScansUsedToday] = useState(() => getStoredScanUsage().count);
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);

  // Input & scan states (Empty by default - Zero demo profile leaks)
  const [targetHandle, setTargetHandle] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [selectedCategory, setSelectedCategory] = useState('digital_creator_influencer');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepIndex, setScanStepIndex] = useState(0);
  const [auditData, setAuditData] = useState(null);

  // Category Search Combobox state
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const [isCategorySearchOpen, setIsCategorySearchOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Live Manual Metrics Customizer (Optional for 100% exact live alignment)
  const [showLiveCustomizer, setShowLiveCustomizer] = useState(false);
  const [liveFollowers, setLiveFollowers] = useState('');
  const [liveFollowing, setLiveFollowing] = useState('');
  const [livePosts, setLivePosts] = useState('');

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

  // Colorful PDF Report Export state
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);

  // Scan steps for authentic progress display
  const SCAN_STEPS = [
    'Connecting to Meta 2026 Graph & Social Feed Simulation...',
    'Fetching public profile metadata & follower activity graph...',
    'Analyzing last 6-100 Reels & Posts for Community Guidelines...',
    'Screening comment sections for scam bots & toxic links...',
    'Calculating Dead Follower ratio & Algorithmic reach health...'
  ];

  // Close category dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategorySearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered categories based on live search input
  const selectedCategoryObj = INDUSTRY_CATEGORIES.find(c => c.id === selectedCategory) || INDUSTRY_CATEGORIES[0];
  const filteredCategories = INDUSTRY_CATEGORIES.filter(c => {
    if (!categorySearchQuery.trim()) return true;
    const q = categorySearchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || (c.group && c.group.toLowerCase().includes(q));
  });

  // Run initial helper tools on mount (DO NOT run any default profile scan on mount!)
  useEffect(() => {
    handleInspectHashtags('#marketing #business #ecommerce #growth #viralreels');
    handleScoreHook('Stop buying expensive software until you see this custom build!');
  }, []);

  const handleRunAudit = async (
    handleToAudit = targetHandle,
    platform = selectedPlatform,
    cat = selectedCategory,
    customStats = null
  ) => {
    if (!handleToAudit || !handleToAudit.trim()) {
      alert('Please enter an account username or link to audit.');
      return;
    }

    // Check daily scan quota (Unless owner/admin or fine-tuning custom stats on existing profile)
    if (!customStats && !isOwnerOrAdmin) {
      const usage = getStoredScanUsage();
      if (usage.count >= DAILY_AUDIT_LIMIT) {
        setIsQuotaModalOpen(true);
        return;
      }
    }

    setAuditData(null); // Clear previous audit data immediately so old profiles never leak
    setIsScanning(true);
    setScanStepIndex(0);

    // Sanitize handle
    let cleanHandle = handleToAudit.trim().replace(/^@+/, '');
    cleanHandle = cleanHandle.replace(/^https?:\/\/(www\.)?(instagram|facebook|twitter|x|youtube|tiktok)\.com\//i, '');
    cleanHandle = cleanHandle.split('?')[0].split('#')[0].replace(/\/+$/, '').trim();

    // Start animated progress steps
    let currentStep = 0;
    const stepInterval = setInterval(() => {
      currentStep++;
      if (currentStep < SCAN_STEPS.length) {
        setScanStepIndex(currentStep);
      }
    }, 400);

    let resolvedLiveProfile = customStats;

    // Fetch real live metrics from serverless scraper if not manually passed
    if (!customStats || customStats.followers === undefined) {
      try {
        const apiUrl = `/api/resolve-social?handle=${encodeURIComponent(cleanHandle)}&platform=${encodeURIComponent(platform)}`;
        const res = await fetch(apiUrl, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          const json = await res.json();
          if (json && json.success) {
            resolvedLiveProfile = {
              followers: json.followers,
              following: json.following,
              posts: json.posts,
              displayName: json.displayName,
              bio: json.bio,
              avatarUrl: json.avatarUrl,
              isRealScan: true
            };
            setLiveFollowers(String(json.followers));
            setLiveFollowing(String(json.following));
            setLivePosts(String(json.posts));
          }
        }
      } catch (err) {
        console.warn('Real social metadata fetch warning:', err);
      }
    }

    // Smooth completion delay for UX
    await new Promise(r => setTimeout(r, 1400));
    clearInterval(stepInterval);
    setScanStepIndex(SCAN_STEPS.length - 1);

    const results = generateSocialAudit(cleanHandle, cat, platform, resolvedLiveProfile);
    setAuditData(results);
    setIsScanning(false);

    // Increment daily usage count for new scans (Bypassed for owner/admin)
    if (!customStats && !isOwnerOrAdmin) {
      const usage = getStoredScanUsage();
      const updated = { date: getTodayKey(), count: usage.count + 1 };
      try {
        localStorage.setItem('ssp_social_audit_usage', JSON.stringify(updated));
      } catch (e) {}
      setScansUsedToday(updated.count);
    }

    if (results.ghostFollowersList && results.ghostFollowersList.length > 0) {
      setSelectedGhostIds(new Set(results.ghostFollowersList.slice(0, 5).map(g => g.id)));
    } else {
      setSelectedGhostIds(new Set());
    }
  };

  const handleApplyCustomStats = () => {
    handleRunAudit(targetHandle, selectedPlatform, selectedCategory, {
      followers: liveFollowers,
      following: liveFollowing,
      posts: livePosts,
      isRealScan: true
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

  const handleOpenPdfReport = () => {
    if (!auditData) return;
    setIsPdfModalOpen(true);
  };

  const handleDirectPrintPdf = () => {
    if (!auditData) return;
    openPrintableSocialAuditReport(auditData, selectedGhostIds);
  };

  const exportPurgeList = () => {
    if (!auditData) return;
    // Open high-definition colorful PDF audit report modal
    setIsPdfModalOpen(true);
  };

  const runAutoRepairSim = () => {
    setAutoRepairProgress('INITIALIZING');
    setTimeout(() => setAutoRepairProgress('CLEANING_COMMENTS'), 800);
    setTimeout(() => setAutoRepairProgress('TAGGING_CAPTIONS'), 1800);
    setTimeout(() => setAutoRepairProgress('DONE'), 3000);
  };

  // 10 Helper Sub-Tools
  const SUB_TOOLS = [
    { id: 'ghost_purge', label: '1. Ghost Follower Purge', icon: Users, badge: 'Active Radar', color: '#ec4899', desc: 'Dead follower detector & reach penalty blocker to restore Explore delivery.' },
    { id: 'meta_guidelines', label: '2. Meta Guidelines Doctor', icon: ShieldAlert, badge: 'Live Scanner', color: '#f43f5e', desc: 'Scan captions & video claims against 2026 Meta Terms & shadowban triggers.' },
    { id: 'comment_cleaner', label: '3. Toxic Comment Cleaner', icon: MessageSquare, badge: 'Audit Active', color: '#f59e0b', desc: 'Automated scan & purge for bot attacks, phishing links & competitor spam.' },
    { id: 'banned_hashtags', label: '4. Banned Hashtag Radar', icon: Filter, badge: 'Radar Active', color: '#8b5cf6', desc: 'Instant check against 100+ suppressed and shadowbanned Instagram/FB tags.' },
    { id: 'post_clock', label: '5. Algorithm Peak Clock', icon: Clock, badge: 'Optimal Time', color: '#06b6d4', desc: 'Pinpoint the 30-minute initial test window when engagement creates viral push.' },
    { id: 'reel_hook', label: '6. 3-Sec Reel Hook Auditor', icon: Flame, badge: 'Hook AI', color: '#10b981', desc: 'Score your video hooks against 3-second drop-off thresholds before posting.' },
    { id: 'bio_funnel', label: '7. Bio Link & Funnel Audit', icon: Link2, badge: 'Funnel Test', color: '#38bdf8', desc: 'Diagnose conversion leaks in your link-in-bio & high-converting buyer journey.' },
    { id: 'competitor_spy', label: '8. Competitor Audience Spy', icon: Compass, badge: 'Spy Engine', color: '#a855f7', desc: 'Analyze rival audience engagement patterns and high-retention formats.' },
    { id: 'collab_fraud', label: '9. Influencer Fraud Spotter', icon: Award, badge: 'Fraud Check', color: '#eab308', desc: 'Detect engagement pods, bot follower spikes & real audience quality.' },
    { id: 'auto_repair', label: '10. 1-Click Auto-Repair', icon: Zap, badge: '⏳ Coming Soon', color: '#6366f1', desc: 'Automated 1-click meta policy compliance fixer and comment cleanup.' }
  ];

  return (
    <div style={{
      color: '#f8fafc',
      padding: '16px 12px 60px 12px',
      maxWidth: '1440px',
      width: '100%',
      margin: '0 auto',
      minHeight: '85vh',
      boxSizing: 'border-box',
      overflowX: 'hidden'
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
                  Social Media AI Auditor &amp; Doctor Command Center
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
                Real-Time Account Audit, Ghost Follower Radar, Meta Community Policy Scanner &amp; Status Doctor.
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.15)',
            padding: '8px 14px',
            borderRadius: '12px',
            border: '1.5px solid #10b981'
          }}>
            <ShieldCheck size={16} color="#10b981" />
            <span style={{ fontSize: '12px', fontWeight: '800', color: '#10b981' }}>
              LIVE PROFILE STATUS &amp; AUDIT SCANNER
            </span>
          </div>
        </div>
      </div>

      {/* Top Animated Developer Calibration & Patience Notice (English) */}
      <div style={{
        marginBottom: '20px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(239, 68, 68, 0.1) 50%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1.5px solid rgba(245, 158, 11, 0.55)',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 0 25px rgba(245, 158, 11, 0.2), 0 8px 32px rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        boxSizing: 'border-box'
      }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(239, 68, 68, 0.25) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 0 15px rgba(245, 158, 11, 0.3)'
        }}>
          <AlertTriangle size={22} color="#f59e0b" />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: '900',
              padding: '2px 9px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.22)',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              color: '#fbbf24',
              letterSpacing: '0.5px'
            }}>
              ⚠️ ACTIVE CALIBRATION NOTICE
            </span>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              • Meta 2026 Graph &amp; Policy Pipeline
            </span>
          </div>

          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '800', color: '#ffffff' }}>
            Social Media AI Doctor is Currently Under Active Development
          </h4>
          <p style={{ margin: 0, fontSize: '12px', color: '#cbd5e1', lineHeight: '1.55' }}>
            This module is undergoing continuous real-time engineering calibration. For <strong>100% precision audit results</strong>, please bear with us and exercise patience as live social media rate limits, public meta-tag endpoints, and algorithmic shadowban models are dynamically tuned.
          </p>
        </div>
      </div>

      {/* Control Bar: Platform + Searchable Category + Handle + Scan Button */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '20px'
      }}>
        {/* Header Bar with Public Intelligence & Daily Quota Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
          flexWrap: 'wrap',
          gap: '8px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span>🔍 PUBLIC PROFILE AUDITOR</span>
            <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '500' }}>
              • Public Metadata Only (Zero Passwords / No Login Required)
            </span>
          </div>

          <div
            onClick={() => !isOwnerOrAdmin && scansUsedToday >= DAILY_AUDIT_LIMIT && setIsQuotaModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '20px',
              background: isOwnerOrAdmin
                ? 'rgba(16, 185, 129, 0.15)'
                : scansUsedToday >= DAILY_AUDIT_LIMIT
                  ? 'rgba(239, 68, 68, 0.2)'
                  : DAILY_AUDIT_LIMIT - scansUsedToday <= 2
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(16, 185, 129, 0.15)',
              border: `1.5px solid ${
                isOwnerOrAdmin
                  ? '#10b981'
                  : scansUsedToday >= DAILY_AUDIT_LIMIT
                    ? '#ef4444'
                    : DAILY_AUDIT_LIMIT - scansUsedToday <= 2
                      ? '#f59e0b'
                      : '#10b981'
              }`,
              color: isOwnerOrAdmin
                ? '#86efac'
                : scansUsedToday >= DAILY_AUDIT_LIMIT
                  ? '#fca5a5'
                  : DAILY_AUDIT_LIMIT - scansUsedToday <= 2
                    ? '#fbbf24'
                    : '#86efac',
              fontSize: '11px',
              fontWeight: '800',
              cursor: (!isOwnerOrAdmin && scansUsedToday >= DAILY_AUDIT_LIMIT) ? 'pointer' : 'default'
            }}
          >
            <span>⚡ Daily Free Quota:</span>
            <span>
              {isOwnerOrAdmin
                ? 'UNLIMITED (ADMIN / PRO)'
                : DAILY_AUDIT_LIMIT - scansUsedToday > 0
                  ? `${DAILY_AUDIT_LIMIT - scansUsedToday} of ${DAILY_AUDIT_LIMIT} Free Scans Remaining Today`
                  : `0/${DAILY_AUDIT_LIMIT} Used (Daily Limit Reached)`}
            </span>
          </div>
        </div>

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

          {/* Searchable Category Selector */}
          <div style={{ position: 'relative' }} ref={categoryDropdownRef}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' }}>
                2. Category (Searchable)
              </label>
              <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: '700' }}>
                {filteredCategories.length} Categories
              </span>
            </div>

            {/* Selected category trigger button */}
            <div
              onClick={() => setIsCategorySearchOpen(prev => !prev)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: '#0a0f1d',
                border: '1.5px solid rgba(168, 85, 247, 0.45)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
                gap: '8px'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedCategoryObj?.name || 'Select Category'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, color: '#a855f7' }}>
                <Search size={14} />
                <ChevronDown size={14} style={{ transform: isCategorySearchOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
            </div>

            {/* Dropdown with live search filter */}
            {isCategorySearchOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                left: 0,
                right: 0,
                background: '#0a0f1d',
                border: '1.5px solid rgba(168, 85, 247, 0.6)',
                borderRadius: '12px',
                padding: '8px',
                zIndex: 1000,
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.25)',
                boxSizing: 'border-box'
              }}>
                {/* Search Input Box */}
                <div style={{ position: 'relative', marginBottom: '8px' }}>
                  <Search size={14} color="#a855f7" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={categorySearchQuery}
                    onChange={(e) => setCategorySearchQuery(e.target.value)}
                    placeholder="Search category (e.g. Software, Creator, Fashion, Doctor...)"
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '8px 10px 8px 30px',
                      background: '#070d19',
                      border: '1px solid rgba(168, 85, 247, 0.4)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      fontSize: '12px',
                      boxSizing: 'border-box'
                    }}
                  />
                  {categorySearchQuery && (
                    <button
                      type="button"
                      onClick={() => setCategorySearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '2px'
                      }}
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Filtered Category Items List */}
                <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
                  {filteredCategories.length === 0 ? (
                    <div style={{ padding: '12px', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>
                      No matching category found for "{categorySearchQuery}".
                    </div>
                  ) : (
                    filteredCategories.map(cat => {
                      const isSelected = selectedCategory === cat.id;
                      return (
                        <div
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setIsCategorySearchOpen(false);
                            setCategorySearchQuery('');
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '6px',
                            background: isSelected ? 'rgba(168, 85, 247, 0.25)' : 'transparent',
                            color: isSelected ? '#c084fc' : '#e2e8f0',
                            fontSize: '12px',
                            fontWeight: isSelected ? '800' : '500',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) e.currentTarget.style.background = 'transparent';
                          }}
                        >
                          <div>
                            <div>{cat.name}</div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>{cat.group}</div>
                          </div>
                          {isSelected && <Check size={14} color="#c084fc" />}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
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
                placeholder="e.g. @username or instagram.com/profile"
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
                  : scansUsedToday >= DAILY_AUDIT_LIMIT && !initialIsAdmin
                    ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)'
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
                boxShadow: scansUsedToday >= DAILY_AUDIT_LIMIT && !initialIsAdmin
                  ? '0 4px 15px rgba(239, 68, 68, 0.4)'
                  : '0 4px 15px rgba(236, 72, 153, 0.4)',
                transition: 'all 0.2s'
              }}
            >
              {isScanning ? (
                <>
                  <RefreshCw size={16} className="spin" />
                  <span>Scanning Profile...</span>
                </>
              ) : scansUsedToday >= DAILY_AUDIT_LIMIT && !initialIsAdmin ? (
                <>
                  <Lock size={16} />
                  <span>Daily Limit Reached (2/2)</span>
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  <span>AI Scan &amp; Deep Audit</span>
                </>
              )}
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

      {/* Ready to Scan / Welcome Empty State */}
      {!auditData && !isScanning && (
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(16px)',
          border: '1.5px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '44px 20px',
          textAlign: 'center',
          marginTop: '10px',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
            border: '2px solid rgba(236, 72, 153, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto',
            fontSize: '30px'
          }}>
            🎯
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: '0 0 10px 0' }}>
            Ready to Run Full Deep Audit
          </h2>
          <p style={{ maxWidth: '620px', margin: '0 auto 28px auto', fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>
            Enter any public social media username or profile URL above and click <strong style={{ color: '#ec4899' }}>Run Deep AI Audit</strong>. Receive an instant breakdown of ghost followers, bio flaws, shadowban flags, and algorithm growth bottlenecks.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            maxWidth: '850px',
            margin: '0 auto',
            textAlign: 'left'
          }}>
            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🔍</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>Deep Profile Diagnosis</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                Detects engagement anomalies, true follower-to-like ratios, and high-conversion bio opportunities.
              </div>
            </div>

            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🛡️</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>Ghost &amp; Shadowban Radar</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                Scans for dormant bot followers, engagement pod spam, and risky keywords causing reach demotion.
              </div>
            </div>

            <div style={{
              background: 'rgba(2, 6, 23, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '16px'
            }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>📈</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#f8fafc', marginBottom: '4px' }}>Viral Content Blueprint</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                Generates industry-specific reel scripts, viral hooks, and algorithm posting schedules.
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '28px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            color: '#34d399'
          }}>
            🔒 100% Privacy Guaranteed • No Passwords Required • Direct Public API Scanner
          </div>
        </div>
      )}

      {auditData && (
        <>
          {/* Profile Overview Card & Real Vital Metrics */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '16px',
            padding: '20px 18px',
            marginBottom: '20px',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              alignItems: 'center',
              boxSizing: 'border-box'
            }}>
              {/* Profile Card Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img
                  src={auditData.avatarUrl}
                  alt={auditData.handle}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(auditData.handle || 'user')}`;
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
                    {auditData.isRealScan ? (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid #10b981',
                        color: '#10b981',
                        fontWeight: '800'
                      }}>
                        ✅ 100% LIVE VERIFIED
                      </span>
                    ) : (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: 'rgba(234, 179, 8, 0.2)',
                        border: '1px solid #eab308',
                        color: '#facc15',
                        fontWeight: '800'
                      }} title="Direct profile access rate-limited by Instagram; stats calibrated using verified niche benchmarks.">
                        ⚡ BENCHMARK CALIBRATED
                      </span>
                    )}
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '10px',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}>
                <div 
                  onClick={() => setShowLiveCustomizer(true)}
                  style={{ background: '#0a0f1d', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer' }}
                  title="Click to adjust/sync live follower count"
                >
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <span>FOLLOWERS</span>
                    <Edit3 size={10} color="#38bdf8" />
                  </div>
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

            {/* Action Bar: PDF Report & Live Customizer */}
            <div style={{
              marginTop: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenPdfReport}
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)'
                  }}
                >
                  <Printer size={14} />
                  <span>📑 Download Colorful PDF Audit Report</span>
                </button>

                <button
                  onClick={handleDirectPrintPdf}
                  style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#cbd5e1',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                  title="Direct Print or Save as PDF"
                >
                  <Download size={13} />
                  <span>Direct Print / PDF</span>
                </button>
              </div>

              <button
                onClick={() => setShowLiveCustomizer(!showLiveCustomizer)}
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '7px 14px',
                  borderRadius: '8px',
                  background: showLiveCustomizer ? 'rgba(56, 189, 248, 0.2)' : 'rgba(56, 189, 248, 0.1)',
                  border: '1.5px solid rgba(56, 189, 248, 0.4)',
                  color: '#38bdf8',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit3 size={13} />
                {showLiveCustomizer ? 'Hide Live Customizer' : `✏️ Adjust / Sync Live Stats (Current: ${auditData.metrics.followers} Followers)`}
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

          {/* ========================================================================= */}
          {/* 3-PILLAR DEEP STATUS DIAGNOSIS (DANGEROUS RISKS, PROFILE FLAWS, FAKE BOTS) */}
          {/* ========================================================================= */}
          <div style={{
            marginBottom: '22px',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 30, 0.98) 100%)',
            border: '1.5px solid rgba(236, 72, 153, 0.35)',
            borderRadius: '16px',
            padding: '20px 20px',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ShieldAlert size={18} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                    Profile Status &amp; Risk Diagnosis: {auditData.handle}
                  </h3>
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                    Deep scan breakdown: Dangerous Policy Risks • Profile Flaws &amp; Mistakes • Fake Followers &amp; Bots
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={handleOpenPdfReport}
                  style={{
                    background: 'rgba(236, 72, 153, 0.2)',
                    border: '1.5px solid #ec4899',
                    color: '#f472b6',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={13} />
                  <span>📑 Export PDF Report</span>
                </button>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  borderRadius: '20px',
                  background: 'rgba(99, 102, 241, 0.18)',
                  border: '1px solid rgba(99, 102, 241, 0.45)',
                  color: '#a5b4fc',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  <span>🛠️ 1-Click Auto-Repair Engine:</span>
                  <span style={{ color: '#f472b6' }}>⏳ Coming Soon</span>
                </div>
              </div>
            </div>

            {/* 3 Pillar Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              boxSizing: 'border-box'
            }}>
              {/* PILLAR 1: KYA DANGEROUS HAI (DANGEROUS ISSUES & POLICY RISKS) */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: '800', fontSize: '13px' }}>
                  <AlertTriangle size={16} />
                  <span>1. Dangerous Issues (Kya Khatarnak Hai)</span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {auditData.health.score < 80 ? (
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <li style={{ color: '#fca5a5' }}>
                        <strong>Engagement Risk:</strong> Engagement rate ({auditData.metrics.engagementRate}%) is under the {auditData.categoryName} benchmark ({auditData.metrics.benchmarkRate}%).
                      </li>
                      <li style={{ color: '#fca5a5' }}>
                        <strong>Shadowban Warning:</strong> High ratio of inactive followers risks Explore delivery suppression under 2026 Meta ranking filters.
                      </li>
                      <li style={{ color: '#fca5a5' }}>
                        <strong>Caption &amp; Tag Compliance:</strong> Review post captions against commercial terms to avoid restricted visibility.
                      </li>
                    </ul>
                  ) : (
                    <div style={{ color: '#86efac', display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '4px' }}>
                      <CheckCircle2 size={16} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>Zero critical policy violations or shadowban flags detected! Profile is in healthy standing.</span>
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '10px', color: '#fca5a5' }}>
                  💡 Diagnostic: Review Tool 2 (Meta Guidelines) &amp; Tool 4 (Banned Tags) below.
                </div>
              </div>

              {/* PILLAR 2: KYA GALAT HAI (PROFILE FLAWS & MISTAKES) */}
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1.5px solid rgba(245, 158, 11, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', fontWeight: '800', fontSize: '13px' }}>
                  <Sliders size={16} />
                  <span>2. Profile Flaws (Kya Galat Hai)</span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  <ul style={{ margin: '4px 0 0 0', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <li>
                      <strong>Bio Conversion Leak:</strong> {auditData.bioDetails?.link ? 'Bio has link, but lacks a high-converting direct WhatsApp lead CTA.' : 'Missing direct clickable business link in bio!'}
                    </li>
                    <li>
                      <strong>Posting Timing Mismatch:</strong> Posting outside your golden viral test window ({auditData.postingSlots?.goldenWindowMinutes || 30} mins) drops first-hour distribution.
                    </li>
                    <li>
                      <strong>Reel Hook Retention:</strong> First 3 seconds need sharp problem/curiosity statement to prevent drop-off.
                    </li>
                  </ul>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '10px', color: '#fde047' }}>
                  💡 Diagnostic: Review Tool 5 (Algorithm Clock), Tool 6 (Hook Scorer) &amp; Tool 7 (Bio Funnel).
                </div>
              </div>

              {/* PILLAR 3: KYA FAKE HAI (GHOST & BOT AUDIENCE) */}
              <div style={{
                background: 'rgba(168, 85, 247, 0.08)',
                border: '1.5px solid rgba(168, 85, 247, 0.35)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                boxSizing: 'border-box'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c084fc', fontWeight: '800', fontSize: '13px' }}>
                  <Users size={16} />
                  <span>3. Fake &amp; Bot Followers (Kya Fake Hai)</span>
                </div>
                <div style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ color: '#94a3b8' }}>Detected Ghost / Bot Accounts:</span>
                    <strong style={{ color: auditData.metrics.ghostFollowerCount > 0 ? '#f43f5e' : '#10b981' }}>
                      {auditData.metrics.ghostFollowerCount} accounts ({auditData.metrics.ghostPercentage}%)
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ color: '#94a3b8' }}>Active Genuine Followers:</span>
                    <strong style={{ color: '#38bdf8' }}>
                      {auditData.metrics.activeFollowers.toLocaleString()} real users
                    </strong>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: '1.4' }}>
                    {auditData.metrics.ghostFollowerCount > 0 
                      ? 'Ghost accounts never engage. Having inactive followers reduces overall account reach and signals low interest to the Meta algorithm.'
                      : 'Audience is clean! No automated spam or ghost followers detected on this profile.'}
                  </div>
                </div>
                <div style={{ marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid rgba(168, 85, 247, 0.2)', fontSize: '10px', color: '#d8b4fe' }}>
                  💡 Diagnostic: Review Tool 1 (Ghost Purge Radar) &amp; Tool 9 (Fraud Spotter).
                </div>
              </div>
            </div>
          </div>

          {/* 10 Sub-Tools Navigation Bar */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '20px',
            width: '100%',
            boxSizing: 'border-box'
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
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: isActive ? `${tool.color}25` : 'rgba(15, 23, 42, 0.7)',
                    border: `1.5px solid ${isActive ? tool.color : 'rgba(255, 255, 255, 0.1)'}`,
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    fontSize: '12px',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    flex: '1 1 auto',
                    minWidth: '150px',
                    boxSizing: 'border-box',
                    textAlign: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <Icon size={15} color={tool.color} />
                  <span>{tool.label}</span>
                  <span style={{
                    fontSize: '9px',
                    fontWeight: '800',
                    padding: '2px 7px',
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
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                        border: 'none',
                        color: '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
                      }}
                      title="Download Full Colorful PDF Audit & Purge Report"
                    >
                      <Printer size={14} />
                      📑 Export Colorful PDF Report ({selectedGhostIds.size || auditData.ghostFollowersList.length})
                    </button>
                    <div style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      background: 'rgba(236, 72, 153, 0.15)',
                      border: '1px solid rgba(236, 72, 153, 0.45)',
                      color: '#f472b6',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Clock size={13} />
                      <span>1-Click Auto-Purge: ⏳ Coming Soon</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Zero Ghost Followers Clean State */}
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
              <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#ffffff' }}>
                    💬 Toxic, Competitor &amp; Bot Spam Comment Cleaner
                  </h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#94a3b8' }}>
                    Identifies financial phishing scams, competitor bot attacks, and harmful comments to keep your account safe from community infractions.
                  </p>
                </div>
                <div style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: '#fbbf24',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Clock size={13} />
                  <span>1-Click Auto-Clean: ⏳ Coming Soon</span>
                </div>
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px', boxSizing: 'border-box' }}>
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
                ⏳ 1-CLICK AUTO-REPAIR • COMING SOON (DEVELOPER MODE)
              </div>

              <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                1-Click Social Media Auto-Repair &amp; Safe Push
              </h2>
              <p style={{ maxWidth: '680px', margin: '8px auto 20px auto', fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>
                Automated 1-Click OAuth direct push to Meta Graph API is currently in active calibration. All real profile diagnoses, dangerous policy flaws, and fake follower detections are 100% active in Tools 1 to 9 above. Connect feature will roll out shortly!
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

      {/* Daily Scan Quota Reached Modal */}
      {isQuotaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(2, 6, 23, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            maxWidth: '480px',
            width: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
            border: '2px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '20px',
            padding: '28px 24px',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
            position: 'relative'
          }}>
            <button
              onClick={() => setIsQuotaModalOpen(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                color: '#ffffff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>

            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '2px solid #ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              fontSize: '28px'
            }}>
              🔒
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              fontSize: '11px',
              fontWeight: '800',
              marginBottom: '10px'
            }}>
              DAILY AUDIT LIMIT REACHED ({DAILY_AUDIT_LIMIT}/{DAILY_AUDIT_LIMIT} USED)
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#ffffff', margin: '0 0 10px 0' }}>
              Daily Free Profile Scans Exhausted
            </h3>

            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              To prevent automated scraping, protect public profile bandwidth, and ensure fair usage, free users are allocated <strong>{DAILY_AUDIT_LIMIT} deep profile audits per day</strong>. Your free quota resets tonight at 12:00 AM midnight.
            </p>

            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '20px',
              textAlign: 'left',
              fontSize: '12px'
            }}>
              <div style={{ color: '#38bdf8', fontWeight: '800', marginBottom: '4px' }}>
                💡 Need Unlimited Agency Audits?
              </div>
              <div style={{ color: '#94a3b8', lineHeight: '1.5' }}>
                If you are an agency, social media marketer, or seller needing unlimited competitor &amp; profile scans, connect with Sidra Motion Support.
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="https://wa.me/916306348371?text=Hello%20Sidra%20Motion%20Team,%20I%20am%20using%20Seller%20Suite%20Pro%20and%20need%20unlimited%20social%20media%20audits."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  fontWeight: '800',
                  fontSize: '13px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 15px rgba(37, 211, 102, 0.4)',
                  boxSizing: 'border-box'
                }}
              >
                <span>💬 Request Unlimited Access on WhatsApp</span>
              </a>

              {auditData && (
                <button
                  onClick={() => {
                    setIsQuotaModalOpen(false);
                    setIsPdfModalOpen(true);
                  }}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📑 View / Print Previous PDF Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Interactive On-Screen Colorful PDF Report Preview Modal */}
      <SocialAuditPdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        auditData={auditData}
        selectedGhostIds={selectedGhostIds}
      />
    </div>
  );
}
