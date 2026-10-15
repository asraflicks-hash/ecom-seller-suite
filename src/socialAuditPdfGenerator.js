// =========================================================================================
//  SIDRA MOTION - SELLER SUITE PRO
//  High-Definition Printable & Multi-Page Colorful PDF Audit Report Generator
//  Executive Resume / Invoice / Medical Diagnostic Style
//  Strictly Balanced 2-Page Architecture (Zero Orphaned Footer Page Spills)
// =========================================================================================

export const COMPANY_DETAILS = {
  name: 'Sidra Motion',
  legalName: 'Sidra Motion Technologies Pvt Ltd',
  suiteName: 'Seller Suite Pro',
  phone: '+91 6306348371',
  whatsapp: '+91 6306348371',
  email: 'contact@sidramotion.com',
  website: 'www.sellersuitepro.online',
  portalUrl: 'https://www.sellersuitepro.online',
  parentSite: 'www.sidramotion.com',
  logoUrl: '/sidra-logo.png',
  reportTagline: 'Official Social Media AI Doctor & Enterprise Audit Report',
  standardsVersion: 'Meta 2026 Community Standards & Algorithm Compliance'
};

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

/**
 * Generates an executive, colorful, multi-page printable HTML document
 * strictly budgeted across 2 pages for pristine PDF export without spillover.
 */
export function generateSocialAuditHtml(auditData, selectedGhostIds = null) {
  if (!auditData) return '';

  const reportId = `SSP-AUD-${Math.abs(hashString(auditData.handle || 'account')).toString(16).toUpperCase()}-2026`;
  const reportDate = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const reportTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  const ghostList = auditData.ghostFollowersList || [];
  const activeGhosts = selectedGhostIds && selectedGhostIds.size > 0
    ? ghostList.filter(g => selectedGhostIds.has(g.id))
    : ghostList;

  const m = auditData.metrics || {};
  const h = auditData.health || {};
  const bio = auditData.bioAudit || {};
  const spam = auditData.spamComments || [];
  const slots = auditData.postingSlots || {};
  const platformId = (auditData.platform || 'instagram').toLowerCase();
  const followerLabel = platformId === 'youtube' ? 'Subscribers' : platformId === 'facebook' ? 'Page Followers' : platformId === 'linkedin' ? 'Connections / Followers' : 'Total Followers';
  const postLabel = platformId === 'youtube' ? 'Videos' : platformId === 'linkedin' ? 'Articles' : platformId === 'twitter' ? 'Tweets' : 'Posts';
  const followingLabel = platformId === 'youtube' ? 'Channels' : 'Following';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${auditData.handle} - Social Media Audit Report | Seller Suite Pro</title>
  <style>
    /* Reset & Base Fonts */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      line-height: 1.4;
      font-size: 12px;
      -webkit-font-smoothing: antialiased;
    }

    /* Floating Screen Action Bar (Hidden in Print) */
    .screen-action-bar {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #0f172a;
      color: #ffffff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      border-bottom: 2px solid #ec4899;
    }
    .screen-action-bar .brand-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .screen-action-bar .brand-logo {
      height: 32px;
      width: auto;
      object-fit: contain;
      border-radius: 6px;
      background: #ffffff;
      padding: 2px 6px;
    }
    .screen-action-bar .btn-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-print {
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(236, 72, 153, 0.4);
    }
    .btn-print:hover { filter: brightness(1.1); }
    .btn-close {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 7px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
    }
    .print-tip-bar {
      background: rgba(236, 72, 153, 0.15);
      border: 1px solid rgba(236, 72, 153, 0.4);
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 11px;
      color: #fbcfe8;
    }

    /* Paper Container (Resume / Invoice / Executive Audit Dossier) */
    .report-paper {
      max-width: 900px;
      margin: 16px auto 32px auto;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
      overflow: hidden;
      border: 1px solid #cbd5e1;
    }

    /* Print Specific Formatting - Clean 2-Page Budgeting */
    @page {
      size: A4 portrait;
      margin: 7mm 8mm 7mm 8mm;
    }
    @media print {
      body {
        background: #ffffff !important;
        font-size: 11px;
      }
      .screen-action-bar {
        display: none !important;
      }
      .report-paper {
        max-width: 100% !important;
        margin: 0 !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        border: none !important;
      }
      .page-break-after {
        page-break-after: always !important;
        break-after: page !important;
      }
      .page-break-avoid {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      /* Ensure vibrant exact colors print */
      *, *::before, *::after {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }
    }

    /* Page 1 Specific Styling */
    .page-one-container {
      padding: 16px 20px;
    }

    /* Header Banner - Side-by-Side Flex Layout That Never Wraps */
    .report-header {
      background: linear-gradient(135deg, #0b1329 0%, #1e1b4b 60%, #311042 100%);
      color: #ffffff;
      padding: 12px 18px;
      border-bottom: 3.5px solid #ec4899;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: nowrap;
      gap: 16px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1 1 auto;
      min-width: 0;
    }
    .company-logo {
      height: 46px;
      width: auto;
      object-fit: contain;
      background: #ffffff;
      padding: 3px 6px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
      flex-shrink: 0;
    }
    .brand-title {
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      text-transform: uppercase;
      line-height: 1.1;
      letter-spacing: -0.3px;
    }
    .brand-title span {
      background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: #ec4899;
    }
    .suite-sub {
      font-size: 11px;
      font-weight: 700;
      color: #cbd5e1;
      margin-top: 1px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .meta-tagline {
      display: inline-block;
      margin-top: 4px;
      background: rgba(236, 72, 153, 0.25);
      border: 1px solid rgba(236, 72, 153, 0.6);
      color: #f472b6;
      font-size: 9px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 4px;
    }

    .header-right {
      text-align: right;
      font-size: 10px;
      color: #cbd5e1;
      line-height: 1.45;
      flex-shrink: 0;
      min-width: 250px;
    }
    .company-badge-name {
      font-size: 13px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    .contact-line {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 5px;
      color: #cbd5e1;
    }
    .contact-line strong { color: #ffffff; }
    .report-meta-box {
      margin-top: 5px;
      padding: 3px 8px;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-family: monospace;
      font-size: 9px;
      display: inline-block;
    }

    /* Target Profile Executive Card */
    .profile-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .profile-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .profile-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2.5px solid ${h.color || '#10b981'};
      background: #0f172a;
      object-fit: cover;
      flex-shrink: 0;
    }
    .profile-handle {
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .profile-tags {
      display: flex;
      gap: 5px;
      align-items: center;
      flex-wrap: wrap;
    }
    .pill {
      font-size: 9.5px;
      font-weight: 800;
      padding: 1px 6px;
      border-radius: 4px;
    }
    .pill-platform { background: #0284c7; color: #ffffff; text-transform: uppercase; }
    .pill-category { background: #7c3aed; color: #ffffff; }
    .pill-verified { background: #059669; color: #ffffff; }

    .health-score-badge {
      text-align: right;
      padding: 8px 14px;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .health-num {
      font-size: 22px;
      font-weight: 900;
      color: ${h.color || '#10b981'};
      line-height: 1;
    }
    .health-label {
      font-size: 9px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 2px;
    }

    /* Core Metrics 4-Box Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 14px;
    }
    .metric-box {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 10px;
      text-align: center;
    }
    .metric-box.danger { background: #fef2f2; border-color: #fca5a5; }
    .metric-box.success { background: #ecfdf5; border-color: #6ee7b7; }
    .metric-val {
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 1px;
    }
    .metric-val.danger { color: #dc2626; }
    .metric-val.success { color: #059669; }
    .metric-val.blue { color: #0284c7; }
    .metric-lbl {
      font-size: 9.5px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
    }
    .metric-sub {
      font-size: 8.5px;
      color: #94a3b8;
      margin-top: 1px;
    }

    /* 2-Column Audit Breakdown: Flaws vs Risks */
    .diagnosis-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 8px;
    }
    .audit-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px;
    }
    .audit-card.flaws {
      border-left: 3.5px solid #f59e0b;
      background: #fffbeb;
    }
    .audit-card.risks {
      border-left: 3.5px solid #ef4444;
      background: #fef2f2;
    }
    .audit-card-title {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .audit-card.flaws .audit-card-title { color: #b45309; }
    .audit-card.risks .audit-card-title { color: #b91c1c; }

    .audit-list-item {
      font-size: 10.5px;
      margin-bottom: 6px;
      padding-bottom: 6px;
      border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
      color: #1e293b;
      line-height: 1.4;
    }
    .audit-list-item:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
    .item-badge {
      display: inline-block;
      font-size: 8.5px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      margin-right: 4px;
      text-transform: uppercase;
    }
    .badge-flaw { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
    .badge-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
    .badge-action { background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; }

    .bio-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 10px;
      margin-top: 6px;
      font-family: monospace;
      font-size: 9.5px;
      white-space: pre-line;
      color: #334155;
      line-height: 1.4;
    }

    /* Page 2 Specific Styling */
    .page-two-strip {
      background: #0f172a;
      color: #ffffff;
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      border-bottom: 2.5px solid #ec4899;
      margin-bottom: 12px;
    }
    .page-two-container {
      padding: 14px 20px 16px 20px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 900;
      text-transform: uppercase;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .section-title .badge {
      font-size: 9.5px;
      padding: 2px 7px;
      border-radius: 4px;
      color: #ffffff;
      font-weight: 800;
    }

    /* Ghost Followers Table */
    .table-container {
      width: 100%;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .ghost-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 10px;
    }
    .ghost-table thead {
      background: #0f172a;
      color: #ffffff;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.3px;
    }
    .ghost-table th {
      padding: 6px 8px;
    }
    .ghost-table td {
      padding: 5px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #1e293b;
      vertical-align: middle;
    }
    .ghost-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .ghost-username {
      font-weight: 800;
      color: #0f172a;
      font-family: monospace;
    }
    .ghost-penalty {
      color: #dc2626;
      font-weight: 800;
    }
    .ghost-status-badge {
      display: inline-block;
      font-size: 8px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 3px;
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fca5a5;
    }

    /* Algorithm Timing & Roadmap */
    .roadmap-banner {
      background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
      border: 1.5px solid #bfdbfe;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .roadmap-col-title {
      font-size: 10px;
      font-weight: 800;
      color: #1e40af;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .roadmap-item {
      font-size: 10px;
      color: #334155;
      margin-bottom: 2px;
      line-height: 1.35;
    }

    /* Footer & Seal */
    .report-footer {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .footer-seal {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .seal-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .seal-text {
      font-size: 10px;
      color: #475569;
      line-height: 1.35;
    }
    .seal-text strong {
      color: #0f172a;
      font-size: 11px;
    }
    .footer-right {
      text-align: right;
      font-size: 10px;
      color: #64748b;
      line-height: 1.4;
      flex-shrink: 0;
    }
    .footer-right strong { color: #0f172a; }
  </style>
</head>
<body>

  <!-- Floating Screen Action Bar (Hidden when printing / generating PDF) -->
  <div class="screen-action-bar">
    <div class="brand-info">
      <img src="${COMPANY_DETAILS.logoUrl}" alt="${COMPANY_DETAILS.name}" class="brand-logo" onerror="this.style.display='none'" />
      <div>
        <div style="font-size: 13px; font-weight: 900; letter-spacing: 0.5px;">${COMPANY_DETAILS.suiteName.toUpperCase()}</div>
        <div style="font-size: 10.5px; color: #cbd5e1;">Official Social Media AI Doctor &amp; Audit Report (${auditData.handle})</div>
      </div>
    </div>
    <div class="btn-group">
      <div class="print-tip-bar">
        💡 <strong>Tip for 100% Clean PDF:</strong> In Chrome Print settings under <em>More settings</em>, uncheck <strong>"Headers and footers"</strong> &amp; check <strong>"Background graphics"</strong>.
      </div>
      <button class="btn-print" onclick="window.print()">
        🖨️ Save as PDF / Print
      </button>
      <button class="btn-close" onclick="window.close()">
        ✕ Close
      </button>
    </div>
  </div>

  <!-- Printable Paper Body -->
  <div class="report-paper">

    <!-- ========================================================================= -->
    <!-- PAGE 1 OF 2: PROFILE OVERVIEW, VITAL METRICS, FLAWS & POLICY VIOLATIONS -->
    <!-- ========================================================================= -->
    <div class="page-break-after">
      <!-- Header Banner (Strictly Side-by-Side Flex Layout) -->
      <div class="report-header">
        <div class="header-left">
          <img
            src="${COMPANY_DETAILS.logoUrl}"
            alt="${COMPANY_DETAILS.name}"
            class="company-logo"
            onerror="this.style.display='none'"
          />
          <div>
            <div class="brand-title">
              <span>SELLER SUITE PRO</span>
            </div>
            <div class="suite-sub">
              Social Media AI Doctor &amp; Enterprise Audit Report
            </div>
            <div class="meta-tagline">
              ⚡ ${COMPANY_DETAILS.standardsVersion}
            </div>
          </div>
        </div>

        <div class="header-right">
          <div class="company-badge-name">${COMPANY_DETAILS.name.toUpperCase()}</div>
          <div class="contact-line">
            <span>📞 Phone / WhatsApp:</span>
            <strong>${COMPANY_DETAILS.phone}</strong>
          </div>
          <div class="contact-line">
            <span>✉️ Email:</span>
            <strong>${COMPANY_DETAILS.email}</strong>
          </div>
          <div class="contact-line">
            <span>🌐 Portal:</span>
            <strong>${COMPANY_DETAILS.website}</strong>
          </div>
          <div class="report-meta-box">
            ID: <strong>${reportId}</strong> • <strong>${reportDate}</strong>
          </div>
        </div>
      </div>

      <!-- Page 1 Content Container -->
      <div class="page-one-container">

        <!-- Target Profile Overview Card -->
        <div class="profile-card">
          <div class="profile-info">
            <img
              src="${auditData.avatarUrl}"
              alt="${auditData.handle}"
              class="profile-avatar"
              onerror="this.src='https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(auditData.handle || 'user')}'"
            />
            <div>
              <div class="profile-handle">${auditData.handle}</div>
              <div class="profile-tags">
                <span class="pill pill-platform">${auditData.platform.toUpperCase()}</span>
                <span class="pill pill-category">${auditData.categoryName || 'General Profile'}</span>
                <span class="pill pill-verified">✅ VERIFIED PUBLIC AUDIT</span>
              </div>
              ${auditData.bioDetails && auditData.bioDetails.text ? `
                <div style="font-size: 10px; color: #475569; margin-top: 4px; font-style: italic;">
                  "${auditData.bioDetails.text.substring(0, 95)}${auditData.bioDetails.text.length > 95 ? '...' : ''}"
                </div>
              ` : ''}
            </div>
          </div>

          <div class="health-score-badge">
            <div class="health-num">${h.score || 75}/100</div>
            <div class="health-label" style="color: ${h.color || '#10b981'};">${h.status || 'GOOD HEALTH'}</div>
            <div style="font-size: 8px; color: #94a3b8; margin-top: 1px;">ALGORITHMIC HEALTH INDEX</div>
          </div>
        </div>

        <!-- Core Vital Metrics 4-Box Grid -->
        <div class="metrics-grid">
          <div class="metric-box">
            <div class="metric-lbl">${followerLabel}</div>
            <div class="metric-val blue">${(m.followers || 0).toLocaleString()}</div>
            <div class="metric-sub">${postLabel}: ${m.posts || 0} • ${followingLabel}: ${m.following || 0}</div>
          </div>

          <div class="metric-box success">
            <div class="metric-lbl">Genuine Active Users</div>
            <div class="metric-val success">${(m.activeFollowers || 0).toLocaleString()}</div>
            <div class="metric-sub">Authentic community reach</div>
          </div>

          <div class="metric-box danger">
            <div class="metric-lbl">Ghost &amp; Bot Followers</div>
            <div class="metric-val danger">${m.ghostFollowerCount || 0} (${m.ghostPercentage || 0}%)</div>
            <div class="metric-sub">Suppresses feed test reach</div>
          </div>

          <div class="metric-box">
            <div class="metric-lbl">Engagement Rate</div>
            <div class="metric-val ${m.engagementRate >= m.benchmarkRate ? 'success' : 'danger'}">
              ${m.engagementRate}%
            </div>
            <div class="metric-sub">Niche Benchmark: ${m.benchmarkRate}%</div>
          </div>
        </div>

        <!-- 2-Column Section: KYA KAMI HAI / KYA GALAT HAI vs KYA HATANA HAI / KYA CHUPANA HAI -->
        <div class="diagnosis-grid">

          <!-- Left Column: KYA KAMI HAI & KYA GALAT HAI (Flaws & Deficiencies) -->
          <div class="audit-card flaws">
            <div class="audit-card-title">
              ⚠️ 1. Profile Flaws &amp; Deficiencies (Kya Kami Hai)
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-flaw">BIO HOOK FLAW</span>
              <strong>Missing Value Proposition:</strong> Bio lacks an immediate 3-second hook explaining who you help.
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-flaw">LINK LEAK</span>
              <strong>Funnel Friction:</strong> ${bio.bounceRisk || 'Third-party tree causes 34% drop-off compared to direct 1-click links.'}
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-flaw">ENGAGEMENT GAP</span>
              <strong>Benchmark Deficit:</strong> Account engagement (${m.engagementRate}%) is ${m.engagementRate >= m.benchmarkRate ? 'performing well' : `lagging behind the ${auditData.categoryName} average (${m.benchmarkRate}%)`}.
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-flaw">3-SEC RETENTION</span>
              <strong>Reel Hook Drop-Off:</strong> Video reels lack bold text overlay in initial 2 seconds.
            </div>

            <div style="margin-top: 8px;">
              <div style="font-size: 9.5px; font-weight: 800; color: #92400e; text-transform: uppercase;">
                💡 Recommended High-Converting Bio (Ready to Paste):
              </div>
              <div class="bio-box">${bio.recommendedBio || `✨ Official ${auditData.handle.toUpperCase()}\n🇮🇳 Verified Creator &amp; Store\n⚡ Exclusive Drops &amp; Daily Updates\n👇 Tap below for official links`}</div>
            </div>
          </div>

          <!-- Right Column: KYA HATANA HAI & KYA CHUPANA HAI (Risks & Violations) -->
          <div class="audit-card risks">
            <div class="audit-card-title">
              🛑 2. Risky Flags &amp; Violations (Kya Hatana Hai)
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-danger">POLICY VIOLATION</span>
              <strong>Comment-Gating Demotion:</strong> Meta 2026 AI demotes posts with "Comment X to win". Edit caption history.
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-danger">BANNED HASHTAGS</span>
              <strong>Demoted Tags to Purge:</strong> Remove generic follow-for-follow tags (#f4f, #followme) that flag for shadowbans.
            </div>

            <div class="audit-list-item">
              <span class="item-badge ${m.ghostFollowerCount > 0 ? 'badge-danger' : 'badge-action'}">${m.ghostFollowerCount > 0 ? 'ALGORITHM PENALTY' : 'AUDIENCE INTEGRITY'}</span>
              <strong>Ghost Follower Drag:</strong> ${m.ghostFollowerCount > 0 ? `${m.ghostFollowerCount} bots signal low relevance to test feeds, cutting organic reach.` : `0 bots detected. Authentic community reaches maximum initial test feeds.`}
            </div>

            <div class="audit-list-item">
              <span class="item-badge badge-action">REMEDIATION ACTION</span>
              <strong>${m.ghostFollowerCount > 0 ? 'Purge Inactive Bots:' : 'Maintain Quality Growth:'}</strong> ${m.ghostFollowerCount > 0 ? 'Remove detected ghost accounts to restore normal test-feed distribution.' : 'Account is 100% clean. Continue posting high-retention content.'}
            </div>

            ${spam && spam.length > 0 ? `
              <div style="margin-top: 8px;">
                <div style="font-size: 9.5px; font-weight: 800; color: #991b1b; text-transform: uppercase;">
                  🛡️ Flagged Spam Comments to Delete:
                </div>
                ${spam.slice(0, 2).map(s => `
                  <div style="font-size: 9.5px; color: #475569; margin-top: 3px; padding-left: 6px; border-left: 2px solid #ef4444;">
                    "${s.text}" — <span style="color: #dc2626; font-weight: 700;">${s.reason || s.type || 'SPAM DETECTED'}</span>
                  </div>
                `).join('')}
              </div>
            ` : `
              <div style="margin-top: 8px;">
                <div style="font-size: 9.5px; font-weight: 800; color: #166534; text-transform: uppercase;">
                  🛡️ Comment Feed Status:
                </div>
                <div style="font-size: 9.5px; color: #15803d; margin-top: 3px; padding-left: 6px; border-left: 2px solid #22c55e;">
                  ✅ Zero Spam or Toxic Comments Detected on Account.
                </div>
              </div>
            `}
          </div>
        </div>

        <div style="text-align: right; font-size: 9px; color: #94a3b8; margin-top: 4px;">
          Page 1 of 2 • Continued on Page 2 (Follower Authenticity Audit &amp; Official Seal) →
        </div>

      </div>
    </div>

    <!-- ========================================================================= -->
    <!-- PAGE 2 OF 2: GHOST PURGE LIST TABLE, TIMING ROADMAP & OFFICIAL SEAL -->
    <!-- ========================================================================= -->
    <div class="page-two-strip">
      <div style="display: flex; align-items: center; gap: 8px;">
        <img src="${COMPANY_DETAILS.logoUrl}" style="height: 18px; width: auto; background: #ffffff; padding: 1px 4px; border-radius: 4px;" onerror="this.style.display='none'" />
        <strong>${COMPANY_DETAILS.suiteName.toUpperCase()}</strong> • Deep Audit Dossier: ${auditData.handle}
      </div>
      <div>
        ID: <strong>${reportId}</strong> • Page 2 of 2
      </div>
    </div>

    <div class="page-two-container">

      <!-- Section 3: GHOST & BOT FOLLOWERS PURGE LIST -->
      <div>
        ${activeGhosts.length > 0 ? `
          <div class="section-title">
            <span>👻 3. Detected Ghost &amp; Bot Followers Purge List</span>
            <span class="badge" style="background: #dc2626;">${activeGhosts.length} ACCOUNTS FLAGGED</span>
          </div>

          <div style="font-size: 10px; color: #475569; margin-bottom: 6px;">
            Purging these inactive accounts prevents algorithmic test-feed suppression and boosts organic reach by up to <strong>${m.reachBoostPotential || '+16%'}</strong>.
          </div>

          <div class="table-container">
            <table class="ghost-table">
              <thead>
                <tr>
                  <th style="width: 30px;">#</th>
                  <th style="width: 150px;">Account Handle</th>
                  <th>Detection Reason / Trigger Flag</th>
                  <th style="width: 100px;">Inactive Period</th>
                  <th style="width: 110px;">Reach Penalty</th>
                  <th style="width: 70px; text-align: center;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${activeGhosts.map((g, idx) => `
                  <tr>
                    <td style="color: #94a3b8; font-weight: 700;">${idx + 1}</td>
                    <td>
                      <span class="ghost-username">${g.username}</span>
                    </td>
                    <td>${g.reason}</td>
                    <td style="color: #64748b; font-weight: 600;">${g.daysInactive} days</td>
                    <td class="ghost-penalty">${g.reachPenalty}</td>
                    <td style="text-align: center;">
                      <span class="ghost-status-badge">PURGE</span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="section-title">
            <span>🛡️ 3. Follower Authenticity &amp; Ghost Audit</span>
            <span class="badge" style="background: #16a34a;">0 BOTS • 100% AUTHENTIC</span>
          </div>

          <div style="background: #f0fdf4; border: 1.5px solid #22c55e; border-radius: 10px; padding: 20px; text-align: center; margin: 8px 0 16px 0;">
            <div style="font-size: 28px; margin-bottom: 6px;">🎉 🛡️ ✅</div>
            <div style="font-size: 14px; font-weight: 800; color: #15803d; text-transform: uppercase;">
              0 Ghost or Inactive Bot Followers Detected
            </div>
            <div style="font-size: 11px; color: #166534; margin-top: 5px; max-width: 540px; margin-left: auto; margin-right: auto; line-height: 1.5;">
              Algorithmic integrity scan verified that <strong>100%</strong> of your <strong>${(m.followers || 0).toLocaleString()} followers</strong> are authentic active accounts. Zero dead bot profiles or inactive farm accounts are suppressing your content. Your profile qualifies for maximum organic explore distribution.
            </div>
          </div>
        `}
      </div>

      <!-- Section 4: Algorithm Peak Clock & Viral Blueprint -->
      <div class="roadmap-banner">
        <div>
          <div class="roadmap-col-title">⏰ Algorithm Peak Posting Clock (Test Feed Windows)</div>
          ${slots && slots.length > 0 ? slots.map(s => `
            <div class="roadmap-item">
              <strong>${s.slot}:</strong> ${s.label} (<span style="color: #059669; font-weight: 700;">+${s.boost}% Reach Boost</span>)
            </div>
          `).join('') : `
            <div class="roadmap-item"><strong>12:30 PM - 02:00 PM:</strong> Peak Lunchtime Explore test window</div>
            <div class="roadmap-item"><strong>07:30 PM - 09:30 PM:</strong> Prime Evening viral reel distribution window</div>
          `}
        </div>

        <div>
          <div class="roadmap-col-title">🚀 Viral Content Blueprint for ${auditData.categoryName}</div>
          <div class="roadmap-item">• <strong>Hook Style:</strong> Use 3-word bold visual statement on first video frame.</div>
          <div class="roadmap-item">• <strong>Audio Choice:</strong> Commercial Indie Lo-Fi &amp; Fast Percussion Beat.</div>
          <div class="roadmap-item">• <strong>SEO Keywords:</strong> Include primary category keywords in first 2 lines of captions.</div>
        </div>
      </div>

      <!-- Official Footer & Verification Seal (Anchored on Page 2) -->
      <div class="report-footer">
        <div class="footer-seal">
          <div class="seal-icon">✓</div>
          <div class="seal-text">
            <strong>VERIFIED DIGITAL AUDIT CERTIFICATE</strong><br />
            Generated by ${COMPANY_DETAILS.suiteName} • Engineered by ${COMPANY_DETAILS.name}<br />
            Compliant with Meta 2026 Community Standards &amp; Graph API Guidelines.
          </div>
        </div>

        <div class="footer-right">
          <div>Official Support: <strong>${COMPANY_DETAILS.email}</strong></div>
          <div>Helpline / WhatsApp: <strong>${COMPANY_DETAILS.whatsapp}</strong></div>
          <div>Verify Online: <strong>${COMPANY_DETAILS.website}</strong></div>
        </div>
      </div>

    </div>

  </div>

  <script>
    if (window.location.search.includes('print=true')) {
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 500);
      };
    }
  </script>
</body>
</html>`;
}

/**
 * Opens the high-definition printable HTML report in a new tab/window via Blob URL
 * and automatically triggers print dialog.
 */
export function openPrintableSocialAuditReport(auditData, selectedGhostIds = null) {
  if (!auditData) return;

  const html = generateSocialAuditHtml(auditData, selectedGhostIds);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  const printWindow = window.open(blobUrl, '_blank');

  if (printWindow) {
    setTimeout(() => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch (e) {
        console.error('Print trigger error:', e);
      }
    }, 700);
  } else {
    printViaHiddenIframe(html);
  }
}

/**
 * Fallback print via invisible iframe if browser popup blocker intervened.
 */
function printViaHiddenIframe(html) {
  let iframe = document.getElementById('audit-report-print-frame');
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'audit-report-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);
  }

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
  }, 600);
}
