import React, { useState } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  Mail, 
  X, 
  CheckCircle2, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { purgeAllUserData } from './securitySanitizer.js';

export default function LegalAndPrivacyModal({ isOpen, onClose, initialTab = 'privacy' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [purgeSuccess, setPurgeSuccess] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handlePurgeData = async () => {
    await purgeAllUserData();
    setPurgeSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

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
      background: 'rgba(5, 11, 24, 0.88)',
      backdropFilter: 'blur(16px)',
      zIndex: 100000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '820px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '28px',
        borderRadius: '24px',
        border: '1.5px solid rgba(0, 210, 255, 0.4)',
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 17, 33, 0.98) 100%)',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 210, 255, 0.2)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(0, 210, 255, 0.15)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00d2ff'
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                Legal, Privacy & Compliance Hub
              </h3>
              <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0 0' }}>
                Seller Suite Pro • Sidra Motions • India DPDP Act 2023 Compliant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={15} /> Close
          </button>
        </div>

        {/* Tab Selector */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {[
            { id: 'privacy', label: '1. Privacy Policy (DPDP 2023)', icon: ShieldCheck, color: '#00d2ff' },
            { id: 'terms', label: '2. Terms of Use', icon: FileText, color: '#38bdf8' },
            { id: 'disclaimer', label: '3. Marketplace Disclaimer', icon: AlertTriangle, color: '#fbbf24' },
            { id: 'erasure', label: '4. Delete All My Data', icon: Trash2, color: '#f43f5e' },
            { id: 'grievance', label: '5. Grievance & Contact', icon: Mail, color: '#25d366' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  border: `1.5px solid ${isActive ? tab.color : 'rgba(255, 255, 255, 0.1)'}`,
                  background: isActive ? `${tab.color}25` : 'rgba(15, 23, 42, 0.6)',
                  color: isActive ? tab.color : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={13} color={tab.color} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Privacy Policy */}
        {activeTab === 'privacy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#00d2ff', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                1. Data Fiduciary & Scope
              </strong>
              This Privacy Policy explains how <strong>Sidra Motions</strong> ("we", "us", "our") operates <strong>Seller Suite Pro</strong> (https://www.sellersuitepro.online). We comply with India's <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong> and international privacy standards.
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#25d366', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                2. 100% Client-Side Processing Guarantee (Your Images & Files Never Leave Your Device)
              </strong>
              All image background removal, white background conversions (#FFFFFF), catalog CSV spreadsheet transformations, P&L calculations, and listing score checks run <strong>100% locally in your browser memory</strong> using client-side HTML5 Canvas and local processing algorithms.
              <br /><br />
              <strong>ONNX / WASM Model Downloading:</strong> When optional deep learning background segmentation is activated, the pre-trained neural network weights (~40MB) and WebAssembly binary (WASM) are downloaded directly to your browser memory from the vendor CDN. All neural inference and pixel manipulation execute strictly on your device's local CPU/GPU hardware.
              <br /><br />
              <span style={{ color: '#4ade80', fontWeight: '700' }}>✓ We do NOT upload, inspect, copy, or transmit your product photos or catalog files to any remote server.</span>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#38bdf8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                3. What Data Is Collected & Purpose
              </strong>
              <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
                <li><strong>Unauthenticated / Guest Users:</strong> Zero personal data collected. Tool usage counters and temporary state are stored strictly in your browser's local <code>sessionStorage</code> and <code>localStorage</code>.</li>
                <li><strong>Signed-In Users:</strong> If you voluntarily create an account or sign in with Google/Email, we store your email address, display name, and your saved project history in an encrypted PostgreSQL cloud database hosted by Supabase to allow you to restore your work across sessions.</li>
                <li><strong>Marketplace Credentials:</strong> We <strong>never</strong> ask for, receive, or store your Amazon Seller Central, Flipkart Seller Hub, or Meesho passwords or API push secrets in client storage.</li>
              </ul>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#fbbf24', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                4. Third-Party Service Providers, Cookies & AI Processing
              </strong>
              We use strictly vetted industry-standard service providers:
              <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
                <li><strong>Vercel Inc.:</strong> Static web hosting, Edge network, and Content Delivery Network (CDN).</li>
                <li><strong>Supabase Inc.:</strong> User authentication and cloud project history database with PostgreSQL Row-Level Security (RLS) and TLS 1.3 encryption.</li>
                <li><strong>Google AdSense & DoubleClick:</strong> Monetization partner. Third-party ad scripts and advertising cookies are <em>strictly blocked until you grant explicit privacy consent</em> via the consent banner. You may reject or withdraw consent at any time via the footer link or banner.</li>
                <li><strong>Cookies & Local Storage:</strong> We use strictly necessary browser storage to maintain session login, your consent choice, and cached catalog drafts. No cross-site fingerprinting is performed.</li>
                <li><strong>AI & LLM Providers (Google Gemini / OpenAI):</strong> Algorithmic assistance is routed through an authenticated server-side proxy (<code>/api/ai-proxy</code>) with rate limiting, payload capping (max 2,000 characters), and daily spend protection. Standard provider abuse retention policies apply (prompts may be temporarily retained by the AI provider for up to 30 days for safety and abuse prevention per standard provider terms). Sellers should not submit confidential credentials or proprietary trade secrets in prompt inputs.</li>
              </ul>
              We do <strong>NOT</strong> sell, rent, license, or monetize your personal or commercial seller data to any advertising brokers or data harvesters.
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#f43f5e', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                5. Your Rights Under DPDP Act 2023
              </strong>
              Under the Digital Personal Data Protection Act 2023, you hold the:
              <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>
                <li><strong>Right to Access:</strong> View all saved data at any time via your Account Profile.</li>
                <li><strong>Right to Correction:</strong> Update your profile and project records anytime.</li>
                <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Permanently delete all your personal data, local storage, and cloud records using the "Delete All My Data" tab in this modal.</li>
                <li><strong>Right to Grievance Redressal:</strong> Direct contact with our designated Grievance Officer.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Terms of Use */}
        {activeTab === 'terms' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#38bdf8', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                1. Acceptance of Terms
              </strong>
              By accessing or using Seller Suite Pro (sellersuitepro.online), you agree to be bound by these Terms of Use. If you disagree with any part of these terms, please discontinue using the software.
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#25d366', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                2. Free Access & Fair Use
              </strong>
              Seller Suite Pro is provided 100% free for Indian and global e-commerce sellers. You may freely use the tools to generate SEO copy, clean product images, calculate profit/loss, and format catalogs for your commercial store operations. You agree not to reverse-engineer, attempt Denial-of-Service attacks, or execute automated scraping against our service endpoints.
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#fbbf24', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                3. User Content & Intellectual Property
              </strong>
              You retain all ownership and copyright in your product titles, images, descriptions, and catalog datasets. Sidra Motions claims zero ownership over any materials you process using this suite.
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#f43f5e', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                4. Limitation of Liability
              </strong>
              The tools and formulas are provided on an "as is" and "as available" basis. While we strive for absolute accuracy with marketplace guidelines, Sidra Motions shall not be held liable for any loss of profits, marketplace listing rejections, or account suspensions resulting from marketplace policy changes or user implementation.
            </div>
          </div>
        )}

        {/* Tab 3: Marketplace Disclaimer */}
        {activeTab === 'disclaimer' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(251, 191, 36, 0.4)', background: 'rgba(251, 191, 36, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <AlertTriangle size={18} color="#fbbf24" />
                <strong style={{ color: '#fbbf24', fontSize: '14px' }}>
                  Non-Affiliation & Trademark Notice
                </strong>
              </div>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>Seller Suite Pro</strong> is an independent software toolkit developed by <strong>Sidra Motions</strong> to assist third-party online sellers.
              </p>
              <p style={{ margin: '0 0 10px 0' }}>
                Seller Suite Pro is <strong>NOT affiliated with, endorsed by, sponsored by, or officially associated with</strong>:
              </p>
              <ul style={{ margin: '0 0 10px 0', paddingLeft: '20px' }}>
                <li><strong>Amazon.com, Inc.</strong> or <strong>Amazon Seller Central India</strong></li>
                <li><strong>Flipkart Internet Private Limited</strong> or <strong>Flipkart Seller Hub</strong></li>
                <li><strong>Fashnear Technologies Private Limited (Meesho)</strong> or <strong>Meesho Supplier Panel</strong></li>
                <li><strong>Myntra Designs Private Limited</strong>, <strong>Blinkit</strong>, or <strong>Zepto</strong></li>
              </ul>
              <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                All product names, logos, trademarks, and registered trademarks cited on this platform are property of their respective owners. Their use does not imply any affiliation with or endorsement by them.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '16px' }}>
              <strong style={{ color: '#00d2ff', fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                Algorithmic Recommendations & Output Disclaimers
              </strong>
              All SEO keyword recommendations, RGB Listing Quality Scores (LQS), Amazon 249-byte limits, BuyBox margin estimates, and catalog conversions generated by Seller Suite Pro are algorithmic suggestions and automated best-practice estimates. 
              <br /><br />
              They do <strong>not</strong> constitute a guarantee of Page 1 search placement, BuyBox win-rate, specific revenue outcomes, or immunity from marketplace compliance flags. Sellers must always review final listing content against official Seller Central / Seller Hub guidelines before publishing.
            </div>
          </div>
        )}

        {/* Tab 4: Delete All My Data */}
        {activeTab === 'erasure' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div className="glass-card" style={{ padding: '20px', border: '1.5px solid rgba(244, 63, 94, 0.4)', background: 'rgba(244, 63, 94, 0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Trash2 size={20} color="#f43f5e" />
                <strong style={{ color: '#f43f5e', fontSize: '14px' }}>
                  Right to Erasure / Permanent Data Purge
                </strong>
              </div>
              <p style={{ margin: '0 0 12px 0' }}>
                Under India's Digital Personal Data Protection Act 2023 (Section 12), you have the absolute right to have all your personal and workstation data permanently deleted.
              </p>
              <p style={{ margin: '0 0 16px 0', fontSize: '11px', color: '#94a3b8' }}>
                Clicking the button below will immediately and irrecoverably wipe:
              </p>
              <ul style={{ margin: '0 0 18px 0', paddingLeft: '20px', fontSize: '11px', color: '#fca5a5' }}>
                <li>All profile data (name, phone, store name, email) from browser local storage</li>
                <li>All saved projects, listings, catalog conversions, and P&L simulations</li>
                <li>All active Supabase and local session tokens</li>
                <li>All cached browser image assets and IndexedDB stores</li>
              </ul>

              {purgeSuccess ? (
                <div style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'rgba(37, 211, 102, 0.2)',
                  border: '1px solid #25d366',
                  color: '#25d366',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '700'
                }}>
                  <CheckCircle2 size={16} />
                  <span>All your data has been successfully and permanently purged from this device. Refreshing...</span>
                </div>
              ) : confirmDelete ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handlePurgeData}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '10px 18px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                    }}
                  >
                    <Trash2 size={14} /> YES, PERMANENTLY ERASE EVERYTHING
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#cbd5e1',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  style={{
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    color: '#f43f5e',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Trash2 size={14} /> Delete All My Data Now
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tab 5: Grievance Officer & Contact */}
        {activeTab === 'grievance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '12px', color: '#cbd5e1', lineHeight: '1.6' }}>
            <div className="glass-card" style={{ padding: '18px' }}>
              <strong style={{ color: '#25d366', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Designated Grievance Redressal Officer (DPDP Act 2023, Section 19)
              </strong>
              In accordance with the Digital Personal Data Protection Act 2023 and the Information Technology Rules, our designated Grievance Officer details are published below:
              <br /><br />
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div><strong>Designation:</strong> Data Protection & Grievance Redressal Officer</div>
                <div><strong>Entity:</strong> Sidra Motions (Publishers of Seller Suite Pro)</div>
                <div><strong>Location:</strong> Lucknow, Uttar Pradesh, India</div>
                <div>
                  <strong>Official Grievance Email:</strong>{' '}
                  <a href="mailto:grievance@sidramotion.com" style={{ color: '#00d2ff', textDecoration: 'none', fontWeight: '700' }}>
                    grievance@sidramotion.com
                  </a>
                </div>
                <div>
                  <strong>General Inquiries & Support:</strong>{' '}
                  <a href="mailto:contact@sidramotion.com" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: '700' }}>
                    contact@sidramotion.com
                  </a>
                </div>
                <div><strong>Response Window:</strong> We acknowledge complaints within 24 hours and resolve inquiries within 72 business hours.</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
