import React from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  ArrowRightLeft, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Gauge, 
  Globe, 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  CheckCircle, 
  User, 
  Briefcase, 
  Users, 
  Headphones, 
  FileText, 
  BookOpen, 
  ShieldCheck, 
  Bell, 
  ExternalLink,
  Share2,
  Wrench,
  LogIn,
  UserPlus,
  LogOut,
  Database,
  Monitor
} from 'lucide-react';
import { AmazonLogo, FlipkartLogo, MeeshoLogo } from './MarketplaceLogos.jsx';

export default function MobileFolderMenu({
  isOpen,
  onClose,
  activeTab,
  onSelectTab,
  currentCustomerId,
  supabaseUser,
  onOpenLogin,
  onOpenSignup,
  onSignOut,
  onOpenSyncMonitor,
  onOpenCommunity,
  onOpenProfile,
  onOpenWorkHistory,
  onOpenUserManual,
  onOpenTerms,
  onOpenAbout,
  onOpenContact,
  onOpenServicesHub,
  onOpenFreeCelebration,
  onOpenDevMode,
  onSwitchToDesktop
}) {
  if (!isOpen) return null;

  const MODULES = [
    { id: 'listing-ai', label: '1. AI Listing & SEO', icon: Sparkles, tag: 'Smart Repair', glowColor: '#00d2ff', desc: 'Amazon, Flipkart & Meesho Listing Optimizer' },
    { id: 'image-studio', label: '2. Image & #FFFFFF White BG', icon: ImageIcon, tag: 'Pure White BG', glowColor: '#38bdf8', desc: 'RGB 255,255,255 Amazon Image Studio' },
    { id: 'catalog-convert', label: '3. Bulk Catalog Converter', icon: ArrowRightLeft, tag: 'Az ⇄ Fk ⇄ Ms', glowColor: '#f97316', desc: 'Instant 1-Click Multi-Marketplace Format' },
    { id: 'buybox-repricer', label: '4. BuyBox & Auto Repricer', icon: Zap, tag: 'Profit Guard', glowColor: '#f59e0b', desc: 'Dynamic Rule Repricer & Margin Protection' },
    { id: 'review-analyzer', label: '5. Review & Gap Mining', icon: TrendingUp, tag: 'Crush Rivals', glowColor: '#f43f5e', desc: 'Extract 1-Star Flaws & Buyer Doubts' },
    { id: 'rto-calculator', label: '6. RTO & Net Profit Calculator', icon: DollarSign, tag: 'Stop Loss', glowColor: '#10b981', desc: 'Courier Return Penalties & Cashflow Simulation' },
    { id: 'listing-audit', label: '7. Sync & RGB Listing Score', icon: Gauge, tag: 'RGB Live Audit', glowColor: '#25d366', desc: 'Live A9 Audit Engine & Instant Fixes' },
    { id: 'omnichannel-seo', label: '8. 360° Omnichannel SEO & Marketing', icon: Globe, tag: '8 Kits • 76 Types', glowColor: '#a855f7', desc: 'Google Shopping, WhatsApp & Ad Copy' },
    { id: 'social-doctor', label: '9. Social Media AI Doctor', icon: Share2, tag: 'Live Audit', glowColor: '#ec4899', desc: 'Dead Follower Purge, Meta Policy Scanner & Spam Cleaner' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '100%',
      height: '100vh',
      zIndex: 100000,
      background: 'rgba(5, 11, 22, 0.88)',
      backdropFilter: 'blur(20px)',
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      {/* Top Drawer Header */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 18, 35, 0.95) 100%)',
        borderBottom: '1px solid rgba(0, 210, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
            border: '1px solid #00d2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00d2ff'
          }}>
            <FolderOpen size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', fontFamily: "'Space Grotesk', sans-serif" }}>
                SUITE FOLDER MENU
              </span>
              <span style={{
                fontSize: '9px',
                padding: '1px 6px',
                borderRadius: '10px',
                background: 'rgba(37, 211, 102, 0.2)',
                color: '#25d366',
                fontWeight: '800',
                border: '1px solid rgba(37, 211, 102, 0.4)'
              }}>
                9 TOOLS
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
              sellersuitepro.online • Mobile Command Center
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            fontSize: '10px',
            fontFamily: 'monospace',
            color: '#38bdf8',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '4px 8px',
            borderRadius: '8px'
          }}>
            {currentCustomerId}
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable Drawer Body */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '18px 16px 40px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Special 100% Free For All Indians Status Banner */}
        <div
          className="kinara-glow-dynamic"
          style={{
            '--glow-color': '#ff9933',
            background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.2) 0%, rgba(15, 23, 42, 0.95) 50%, rgba(37, 211, 102, 0.2) 100%)',
            border: '1.5px solid #ff9933',
            borderRadius: '16px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 153, 51, 0.25)'
          }}
        >
          <span style={{ fontSize: '26px' }}>🇮🇳</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>100% FREE FOR ALL INDIANS</span>
              <span style={{ fontSize: '9px', background: '#25d366', color: '#000', padding: '1px 6px', borderRadius: '8px', fontWeight: '900' }}>0₹</span>
            </div>
            <div style={{ fontSize: '10px', color: '#cbd5e1', marginTop: '2px' }}>
              Amazon, Flipkart & Meesho sellers ke liye all 8 tools lifetime free
            </div>
          </div>
        </div>

        {/* Section 1: All 8 Suite Modules */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            padding: '0 4px'
          }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={13} />
              <span>Select Suite Tool (All 8 Modules)</span>
            </span>
            <span style={{ fontSize: '10px', color: '#25d366', fontWeight: '700' }}>
              ● 100% Free
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {MODULES.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '14px',
                    border: `1.5px solid ${isActive ? item.glowColor : 'rgba(255, 255, 255, 0.1)'}`,
                    background: isActive 
                      ? `linear-gradient(135deg, ${item.glowColor}25 0%, rgba(15, 23, 42, 0.9) 100%)` 
                      : 'rgba(15, 23, 42, 0.65)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    boxShadow: isActive ? `0 0 20px ${item.glowColor}30` : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: `${item.glowColor}20`,
                      border: `1px solid ${item.glowColor}50`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.glowColor,
                      flexShrink: 0
                    }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: isActive ? item.glowColor : '#ffffff' }}>
                          {item.label}
                        </span>
                        <span style={{
                          fontSize: '9px',
                          padding: '1px 6px',
                          borderRadius: '8px',
                          background: `${item.glowColor}20`,
                          color: item.glowColor,
                          fontWeight: '800',
                          border: `1px solid ${item.glowColor}40`
                        }}>
                          {item.tag}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {isActive ? (
                      <span style={{ fontSize: '10px', color: '#25d366', fontWeight: '800', background: 'rgba(37, 211, 102, 0.15)', padding: '3px 8px', borderRadius: '10px' }}>
                        OPEN 🟢
                      </span>
                    ) : (
                      <ChevronRight size={16} color="#64748b" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1.5: Supabase Auth & Seller Account */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(37, 211, 102, 0.08) 100%)',
          border: '1.5px solid rgba(0, 210, 255, 0.25)',
          borderRadius: '16px',
          padding: '12px 14px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={13} color="#00d2ff" />
              <span style={{ fontSize: '11px', fontWeight: '800', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Supabase Seller Auth
              </span>
            </div>
            <span style={{
              fontSize: '9px',
              fontWeight: '800',
              padding: '2px 6px',
              borderRadius: '8px',
              background: supabaseUser ? 'rgba(37, 211, 102, 0.2)' : 'rgba(251, 191, 36, 0.2)',
              color: supabaseUser ? '#25d366' : '#fbbf24',
              border: `1px solid ${supabaseUser ? 'rgba(37, 211, 102, 0.4)' : 'rgba(251, 191, 36, 0.4)'}`
            }}>
              {supabaseUser ? '🟢 LOGGED IN' : '⚡ SIGN IN NEEDED'}
            </span>
          </div>

          {supabaseUser ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00d2ff, #25d366)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '800',
                  color: '#050b14',
                  fontSize: '12px'
                }}>
                  {(supabaseUser.user_metadata?.full_name || supabaseUser.email || 'S')[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {supabaseUser.user_metadata?.full_name || 'Verified Seller'}
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {supabaseUser.email}
                  </div>
                </div>
              </div>

              {/* My Saved Work Button */}
              <button
                type="button"
                onClick={() => {
                  onOpenWorkHistory && onOpenWorkHistory();
                  onClose();
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.2) 0%, rgba(56, 189, 248, 0.1) 100%)',
                  border: '1.5px solid rgba(0, 210, 255, 0.45)',
                  color: '#00d2ff',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginBottom: '8px'
                }}
              >
                <FolderOpen size={14} color="#00d2ff" />
                <span>My Saved Work History</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onOpenProfile();
                    onClose();
                  }}
                  style={{
                    flex: 1,
                    padding: '7px 10px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  Manage Profile
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut && onSignOut();
                    onClose();
                  }}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#f87171',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <LogOut size={11} /> Logout
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
                Apna cloud account banayein ya login karein Supabase database ke sath:
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    onOpenLogin && onOpenLogin();
                    onClose();
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                    border: 'none',
                    color: '#050b14',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 0 12px rgba(0, 210, 255, 0.3)'
                  }}
                >
                  <LogIn size={13} /> Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenSignup && onOpenSignup();
                    onClose();
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
                    border: 'none',
                    color: '#050b14',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 0 12px rgba(37, 211, 102, 0.3)'
                  }}
                >
                  <UserPlus size={13} /> Sign Up
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Quick Status Pills & Action Controls (From User's Screenshot) */}
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '10px', padding: '0 4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={13} />
            <span>Suite Controls & Shortcuts</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* 1. RGB Listing Score */}
            <button
              type="button"
              onClick={() => {
                onSelectTab('listing-audit');
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(168, 85, 247, 0.12)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                color: '#c084fc',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Gauge size={15} color="#c084fc" />
                <span style={{ fontSize: '12px', fontWeight: '800' }}>RGB Listing Score</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Live A9 Audit Engine</span>
            </button>

            {/* 2. Sync & Alerts Center */}
            <button
              type="button"
              onClick={() => {
                onOpenSyncMonitor();
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.12)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                color: '#f43f5e',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Bell size={15} color="#f43f5e" />
                  <span style={{ fontSize: '12px', fontWeight: '800' }}>Sync & Alerts</span>
                </div>
                <span style={{ fontSize: '9px', background: '#f43f5e', color: '#fff', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
                  5
                </span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Flaw Alert Monitor</span>
            </button>

            {/* 3. Official Community */}
            <button
              type="button"
              onClick={() => {
                onOpenCommunity();
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(37, 211, 102, 0.12)',
                border: '1px solid rgba(37, 211, 102, 0.4)',
                color: '#25d366',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={15} color="#25d366" />
                <span style={{ fontSize: '12px', fontWeight: '800' }}>Join Community</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>WhatsApp Feed & News</span>
            </button>

            {/* 4. Agency Services & Deals */}
            <button
              type="button"
              onClick={() => {
                onOpenServicesHub();
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(0, 210, 255, 0.15) 100%)',
                border: '1px solid rgba(37, 211, 102, 0.45)',
                color: '#25d366',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Briefcase size={15} color="#25d366" />
                <span style={{ fontSize: '12px', fontWeight: '800' }}>Agency & Deals</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Done-For-You Services</span>
            </button>

            {/* 5. Seller Profile */}
            <button
              type="button"
              onClick={() => {
                onOpenProfile();
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#e2e8f0',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={15} color="#00d2ff" />
                <span style={{ fontSize: '12px', fontWeight: '800' }}>Seller Profile</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Account & Settings</span>
            </button>

            {/* 6. Docs & User Manual */}
            <button
              type="button"
              onClick={() => {
                onOpenUserManual();
                onClose();
              }}
              style={{
                padding: '12px',
                borderRadius: '12px',
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.35)',
                color: '#00d2ff',
                textAlign: 'left',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={15} color="#00d2ff" />
                <span style={{ fontSize: '12px', fontWeight: '800' }}>User Manual</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Guides & Tutorials</span>
            </button>

            {/* 7. Developer Mode Active Notice */}
            {onOpenDevMode && (
              <button
                type="button"
                onClick={() => {
                  onOpenDevMode();
                  onClose();
                }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'rgba(245, 158, 11, 0.12)',
                  border: '1px solid rgba(245, 158, 11, 0.45)',
                  color: '#fbbf24',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Wrench size={15} color="#f59e0b" />
                  <span style={{ fontSize: '12px', fontWeight: '800' }}>Dev Mode Notice</span>
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8' }}>Active Maintenance</span>
              </button>
            )}

            {/* 8. Switch to Desktop View */}
            {onSwitchToDesktop && (
              <button
                type="button"
                onClick={() => {
                  onSwitchToDesktop();
                  onClose();
                }}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
                  border: '1px solid rgba(0, 210, 255, 0.45)',
                  color: '#00d2ff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  boxShadow: '0 0 12px rgba(0, 210, 255, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Monitor size={15} color="#00d2ff" />
                  <span style={{ fontSize: '12px', fontWeight: '800' }}>Desktop View 💻</span>
                </div>
                <span style={{ fontSize: '10px', color: '#cbd5e1' }}>Switch to PC Layout</span>
              </button>
            )}
          </div>
        </div>

        {/* Section 3: Supported Marketplaces */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#ffb74d' }}>
            <AmazonLogo size={16} /> Amazon
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#60a5fa' }}>
            <FlipkartLogo size={16} /> Flipkart
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '700', color: '#f472b6' }}>
            <MeeshoLogo size={16} /> Meesho
          </div>
        </div>

        {/* 100% Free Guarantee Banner */}
        <div style={{
          background: 'rgba(37, 211, 102, 0.1)',
          border: '1px solid rgba(37, 211, 102, 0.35)',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <CheckCircle size={18} color="#25d366" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#25d366' }}>
              🟢 100% FREE • ALL 8 MODULES UNLOCKED
            </div>
            <div style={{ fontSize: '10px', color: '#cbd5e1' }}>
              Zero registration barriers. Accessible across mobile and desktop.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
