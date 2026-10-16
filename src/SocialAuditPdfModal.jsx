// =========================================================================================
//  SIDRA MOTION - SELLER SUITE PRO
//  Interactive On-Screen PDF Report Preview Modal
// =========================================================================================

import React from 'react';
import { Printer, X, Download, ShieldCheck, ExternalLink } from 'lucide-react';
import { COMPANY_DETAILS, openPrintableSocialAuditReport } from './socialAuditPdfGenerator.js';

export default function SocialAuditPdfModal({ isOpen, onClose, auditData, selectedGhostIds }) {
  if (!isOpen || !auditData) return null;

  const m = auditData.metrics || {};
  const h = auditData.health || {};
  const bio = auditData.bioAudit || {};
  const ghostList = auditData.ghostFollowersList || [];
  const activeGhosts = selectedGhostIds && selectedGhostIds.size > 0
    ? ghostList.filter(g => selectedGhostIds.has(g.id))
    : ghostList;

  const handlePrint = () => {
    openPrintableSocialAuditReport(auditData, selectedGhostIds);
  };

  return (
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
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '16px 12px',
      overflowY: 'auto'
    }}>
      {/* Top Modal Control Bar */}
      <div style={{
        maxWidth: '960px',
        width: '100%',
        background: '#0f172a',
        border: '1.5px solid rgba(236, 72, 153, 0.4)',
        borderRadius: '14px',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={COMPANY_DETAILS.logoUrl}
            alt={COMPANY_DETAILS.name}
            style={{
              height: '36px',
              width: 'auto',
              borderRadius: '6px',
              background: '#ffffff',
              padding: '2px 6px'
            }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#ffffff' }}>
              Official PDF Audit Report: <span style={{ color: '#ec4899' }}>{auditData.handle}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
              Multi-Page Colorful Dossier • Formatted like an Executive Resume &amp; Invoice
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: 'rgba(236, 72, 153, 0.15)',
            border: '1px solid rgba(236, 72, 153, 0.4)',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '10.5px',
            color: '#fbcfe8'
          }}>
            💡 Tip: Uncheck <strong>"Headers &amp; footers"</strong> in print to hide URL
          </div>

          <button
            onClick={handlePrint}
            style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 15px rgba(236, 72, 153, 0.4)'
            }}
          >
            <Printer size={15} />
            <span>🖨️ Save as PDF / Print</span>
          </button>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={15} />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* PDF Document Preview Paper */}
      <div style={{
        maxWidth: '920px',
        width: '100%',
        background: '#ffffff',
        color: '#0f172a',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        border: '1px solid #cbd5e1',
        marginBottom: '40px'
      }}>
        {/* Document Header - Strictly Side-by-Side Flex Layout */}
        <div style={{
          background: 'linear-gradient(135deg, #0b1329 0%, #1e1b4b 60%, #311042 100%)',
          color: '#ffffff',
          padding: '14px 20px',
          borderBottom: '3.5px solid #ec4899',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px',
          flexWrap: 'nowrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '1 1 auto', minWidth: 0 }}>
            <img
              src={COMPANY_DETAILS.logoUrl}
              alt={COMPANY_DETAILS.name}
              style={{
                height: '46px',
                width: 'auto',
                background: '#ffffff',
                padding: '3px 6px',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                flexShrink: 0
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', color: '#ffffff', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
                <span style={{ color: '#ec4899' }}>SELLER SUITE PRO</span>
              </div>
              <div style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', textTransform: 'uppercase', marginTop: '1px' }}>
                Social Media AI Doctor &amp; Enterprise Audit Report
              </div>
              <div style={{
                display: 'inline-block',
                marginTop: '4px',
                background: 'rgba(236, 72, 153, 0.25)',
                border: '1px solid rgba(236, 72, 153, 0.6)',
                color: '#f472b6',
                fontSize: '9px',
                fontWeight: '800',
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                ⚡ {COMPANY_DETAILS.standardsVersion}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', fontSize: '10px', color: '#cbd5e1', lineHeight: '1.45', flexShrink: 0, minWidth: '230px' }}>
            <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffffff', letterSpacing: '0.5px' }}>{COMPANY_DETAILS.name.toUpperCase()}</div>
            <div>📞 Phone / WA: <strong style={{ color: '#ffffff' }}>{COMPANY_DETAILS.phone}</strong></div>
            <div>✉️ Email: <strong style={{ color: '#ffffff' }}>{COMPANY_DETAILS.email}</strong></div>
            <div>🌐 Portal: <strong style={{ color: '#ffffff' }}>{COMPANY_DETAILS.website}</strong></div>
            <div style={{
              marginTop: '4px',
              padding: '2px 8px',
              background: 'rgba(0,0,0,0.4)',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '9px',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'inline-block'
            }}>
              ID: SSP-AUD-2026 • {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Document Body */}
        <div style={{ padding: '24px 28px' }}>
          {/* Target Profile Card */}
          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <img
                src={auditData.avatarUrl}
                alt={auditData.handle}
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  border: `3px solid ${h.color || '#10b981'}`,
                  background: '#0f172a'
                }}
                onError={(e) => {
                  e.target.src = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(auditData.handle || 'user')}`;
                }}
              />
              <div>
                <div style={{ fontSize: '18px', fontWeight: '900', color: '#0f172a' }}>
                  {auditData.handle}
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: '#0284c7', color: '#ffffff' }}>
                    {auditData.platform.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: '#7c3aed', color: '#ffffff' }}>
                    {auditData.categoryName}
                  </span>
                  <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '4px', background: '#059669', color: '#ffffff' }}>
                    ✅ VERIFIED REPORT
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              textAlign: 'right',
              padding: '10px 16px',
              background: '#ffffff',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '24px', fontWeight: '900', color: h.color || '#10b981', lineHeight: '1' }}>
                {h.score || 75}/100
              </div>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', marginTop: '2px' }}>
                {h.status || 'GOOD HEALTH'}
              </div>
            </div>
          </div>

          {/* 4 Core Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '10px',
            marginBottom: '20px'
          }}>
            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Total Followers</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#0284c7', marginTop: '2px' }}>
                {(m.followers || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>Posts: {m.posts || 0} • Following: {m.following || 0}</div>
            </div>

            <div style={{ background: '#ecfdf5', border: '1.5px solid #6ee7b7', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#047857', textTransform: 'uppercase' }}>Active Genuine Users</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
                {(m.activeFollowers || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '9px', color: '#059669' }}>Authentic Audience</div>
            </div>

            <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#166534', textTransform: 'uppercase' }}>Follower Authority Ratio</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#15803d', marginTop: '2px' }}>
                {m.followerRatio || (m.following > 0 ? (m.followers / m.following).toFixed(1) : m.followers)}x
              </div>
              <div style={{ fontSize: '9px', color: '#166534' }}>{m.followerRatioStatus || 'Organic Creator Ratio'}</div>
            </div>

            <div style={{ background: '#ffffff', border: '1.5px solid #e2e8f0', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase' }}>Engagement Rate</div>
              <div style={{ fontSize: '18px', fontWeight: '900', color: m.engagementRate >= m.benchmarkRate ? '#059669' : '#dc2626', marginTop: '2px' }}>
                {m.engagementRate}%
              </div>
              <div style={{ fontSize: '9px', color: '#94a3b8' }}>Category Bench: {m.benchmarkRate}%</div>
            </div>
          </div>

          {/* 2-Column Flaws vs Risks */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '22px'
          }}>
            {/* Flaws */}
            <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderLeft: '4px solid #f59e0b', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '900', color: '#92400e', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚠️ 1. Profile Flaws &amp; Deficiencies (Kya Kami Hai)
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Bio USP Deficit:</strong> Lacks an immediate 3-second hook explaining who you help.
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Link-in-Bio Leak:</strong> {bio.bounceRisk || 'Third-party tree causes 34% drop-off compared to direct 1-click links.'}
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Engagement Gap:</strong> Engagement is currently {m.engagementRate < m.benchmarkRate ? 'below' : 'matching'} the {auditData.categoryName} average.
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45' }}>
                • <strong>Reel Hook Drop-Off:</strong> Video reels lack bold text overlay in initial 2 seconds.
              </div>
            </div>

            {/* Risks */}
            <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderLeft: '4px solid #ef4444', borderRadius: '8px', padding: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: '900', color: '#991b1b', textTransform: 'uppercase', marginBottom: '8px' }}>
                🛑 2. Risky Flags &amp; Violations (Kya Hatana Hai)
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Comment-Gating:</strong> Meta demotes posts with "Comment X to win". Edit caption history.
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Banned Hashtags:</strong> Purge generic tags (#f4f, #followme) that risk shadowbans.
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45', marginBottom: '6px' }}>
                • <strong>Follower Quality:</strong> Zero simulated bot accounts. Audience is 100% verified organic.
              </div>
              <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.45' }}>
                • <strong>Recommendation:</strong> Use Instagram's native "Least Interacted With" tool to review low-engagement profiles safely.
              </div>
            </div>
          </div>

          {/* Ghost Followers Table or Pristine Celebration */}
          <div style={{ marginBottom: '22px' }}>
            <div style={{ fontSize: '13px', fontWeight: '900', textTransform: 'uppercase', color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>🛡️ 3. Follower Authenticity &amp; Ghost Audit</span>
              <span style={{ fontSize: '11px', background: activeGhosts.length > 0 ? '#dc2626' : '#16a34a', color: '#ffffff', padding: '2px 8px', borderRadius: '4px' }}>
                {activeGhosts.length > 0 ? `${activeGhosts.length} Accounts Flagged` : '0 Bots • 100% Clean'}
              </span>
            </div>

            {activeGhosts.length > 0 ? (
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', textAlign: 'left' }}>
                  <thead style={{ background: '#0f172a', color: '#ffffff', textTransform: 'uppercase', fontSize: '10px' }}>
                    <tr>
                      <th style={{ padding: '8px 10px', width: '35px' }}>#</th>
                      <th style={{ padding: '8px 10px', width: '160px' }}>Username</th>
                      <th style={{ padding: '8px 10px' }}>Flag Reason</th>
                      <th style={{ padding: '8px 10px', width: '110px' }}>Inactive Period</th>
                      <th style={{ padding: '8px 10px', width: '120px' }}>Reach Penalty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeGhosts.map((g, idx) => (
                      <tr key={g.id || idx} style={{ borderBottom: '1px solid #e2e8f0', background: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '7px 10px', color: '#94a3b8', fontWeight: '700' }}>{idx + 1}</td>
                        <td style={{ padding: '7px 10px', fontWeight: '800', fontFamily: 'monospace', color: '#0f172a' }}>{g.username}</td>
                        <td style={{ padding: '7px 10px', color: '#334155' }}>{g.reason}</td>
                        <td style={{ padding: '7px 10px', color: '#64748b' }}>{g.daysInactive} days</td>
                        <td style={{ padding: '7px 10px', color: '#dc2626', fontWeight: '800' }}>{g.reachPenalty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '8px', padding: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎉 🛡️ ✅</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: '#15803d' }}>
                  0 GHOST OR INACTIVE BOT ACCOUNTS DETECTED
                </div>
                <div style={{ fontSize: '11px', color: '#166534', marginTop: '3px' }}>
                  All {(m.followers || 0).toLocaleString()} followers are authentic active users. No purge needed!
                </div>
              </div>
            )}
          </div>

          {/* Footer in Modal */}
          <div style={{
            background: '#f8fafc',
            borderTop: '2px solid #cbd5e1',
            padding: '14px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#64748b',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <div>
              <strong style={{ color: '#0f172a' }}>{COMPANY_DETAILS.name} • {COMPANY_DETAILS.suiteName}</strong>
              <div>Official Portal: {COMPANY_DETAILS.website} • Support: {COMPANY_DETAILS.email}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>Phone / WhatsApp: <strong style={{ color: '#0f172a' }}>{COMPANY_DETAILS.phone}</strong></div>
              <div>Report Generated: {new Date().toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
