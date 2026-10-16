import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, ChevronUp, ChevronDown, Sparkles, DollarSign, Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { getAdConfig, FALLBACK_SPONSORS } from './adConfig.js';
import AdsterraBanner from './AdsterraBanner';

export default function AdBanner({ position = 'top-leaderboard', onOpenAdSettings }) {
  if (typeof Capacitor !== 'undefined' && Capacitor.isNativePlatform()) {
    return null;
  }
  const [config, setConfig] = useState(getAdConfig);
  const [isAdBlockActive, setIsAdBlockActive] = useState(false);
  const [adSenseLoaded, setAdSenseLoaded] = useState(false);
  const [isAdFilled, setIsAdFilled] = useState(false);
  const [isFooterMinimized, setIsFooterMinimized] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(() => {
    if (position === 'in-feed') return 1;
    if (position === 'sticky-footer') return 2;
    return 0;
  });
  const adRef = useRef(null);
  const insRef = useRef(null);

  // Sync config updates
  useEffect(() => {
    const handleUpdate = () => setConfig(getAdConfig());
    window.addEventListener('ad-config-updated', handleUpdate);
    return () => window.removeEventListener('ad-config-updated', handleUpdate);
  }, []);

  // Monitor if Google AdSense has filled the ad slot or if it is pending/unfilled
  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    const checkFilled = () => {
      const status = el.getAttribute('data-ad-status');
      const hasIframe = el.querySelector('iframe');
      if (status === 'filled' || hasIframe) {
        setIsAdFilled(true);
      }
    };

    checkFilled();

    const observer = new MutationObserver(() => {
      checkFilled();
    });

    observer.observe(el, { attributes: true, childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const hasRealPubId = config.pubId && !config.pubId.includes('XXXX') && config.pubId.startsWith('ca-pub-');
  const [hasConsent, setHasConsent] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('sidra_privacy_consent') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Listen for consent acceptance and rejection/withdrawal
  useEffect(() => {
    const onConsentAccepted = () => setHasConsent(true);
    const onConsentRejected = () => setHasConsent(false);
    window.addEventListener('sidra_privacy_consent_accepted', onConsentAccepted);
    window.addEventListener('sidra_privacy_consent_rejected', onConsentRejected);
    return () => {
      window.removeEventListener('sidra_privacy_consent_accepted', onConsentAccepted);
      window.removeEventListener('sidra_privacy_consent_rejected', onConsentRejected);
    };
  }, []);

  // Dynamically load AdSense script ONLY after user grants explicit privacy consent
  useEffect(() => {
    if (hasConsent && hasRealPubId && config.adsEnabled) {
      if (!document.querySelector('script[src*="pagead2.googlesyndication.com"]')) {
        const script = document.createElement('script');
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${config.pubId}`;
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      try {
        if (typeof window !== 'undefined') {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdSenseLoaded(true);
        }
      } catch (err) {
        console.warn('AdSense push error (usually safe if pending or adblocked):', err);
        setIsAdBlockActive(true);
      }
    }
  }, [hasConsent, hasRealPubId, config.adsEnabled, position]);

  if (!config.adsEnabled) return null;

  const currentSponsor = FALLBACK_SPONSORS[sponsorIndex % FALLBACK_SPONSORS.length];

  // 1. STICKY FOOTER ANCHOR AD (Floating at bottom of viewport)
  if (position === 'sticky-footer') {
    return (
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'linear-gradient(180deg, rgba(11, 23, 44, 0.96) 0%, rgba(7, 13, 25, 0.98) 100%)',
        borderTop: '1px solid rgba(0, 210, 255, 0.3)',
        boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(16px)',
        transition: 'transform 0.3s ease',
        transform: isFooterMinimized ? 'translateY(calc(100% - 28px))' : 'translateY(0)'
      }}>
        {/* Top Control Bar with Sponsored Label & Minimize */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '4px 16px',
          background: 'rgba(0, 0, 0, 0.35)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          fontSize: '10px',
          color: '#94a3b8'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '1px 6px',
              borderRadius: '4px',
              fontWeight: '700',
              letterSpacing: '0.5px'
            }}>
              SPONSORED
            </span>
            <span>sellersuitepro.online Monetized Partner Ad</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsFooterMinimized(prev => !prev)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#00d2ff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '10px',
                fontWeight: '700',
                padding: '2px 6px'
              }}
            >
              {isFooterMinimized ? (
                <><span>Show Ad</span> <ChevronUp size={12} /></>
              ) : (
                <><span>Minimize</span> <ChevronDown size={12} /></>
              )}
            </button>
          </div>
        </div>

        {/* Ad Body */}
        <div style={{ padding: '8px 16px', maxWidth: '1200px', margin: '0 auto' }}>
          {hasRealPubId && (
            <div style={{ display: isAdFilled ? 'block' : 'none' }}>
              <ins 
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block', height: '60px', width: '100%' }}
                data-ad-client={config.pubId}
                data-ad-slot={config.footerSlotId || undefined}
                data-ad-format="horizontal"
                data-full-width-responsive="true"
              />
            </div>
          )}
          {(!hasRealPubId || !isAdFilled) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  fontSize: '22px',
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${currentSponsor.themeColor}50`
                }}>
                  {currentSponsor.logo}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
                      {currentSponsor.title}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 6px',
                      borderRadius: '10px',
                      background: `${currentSponsor.themeColor}25`,
                      color: currentSponsor.themeColor,
                      fontWeight: '700',
                      border: `1px solid ${currentSponsor.themeColor}50`
                    }}>
                      {currentSponsor.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    {currentSponsor.desc}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a
                  href={currentSponsor.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 16px',
                    borderRadius: '8px',
                    background: `linear-gradient(135deg, ${currentSponsor.themeColor} 0%, #00d2ff 100%)`,
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: '800',
                    textDecoration: 'none',
                    boxShadow: '0 2px 10px rgba(0, 210, 255, 0.3)'
                  }}
                >
                  <span>{currentSponsor.cta}</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. TOP LEADERBOARD AD (Placed between navigation bar and main workspace)
  if (position === 'top-leaderboard') {
    return (
      <aside 
        aria-label="Advertisement"
        style={{
          width: '100%',
          maxWidth: '1240px',
          boxSizing: 'border-box',
          margin: '12px auto 6px auto',
          padding: '0 16px'
        }}
      >
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 18, 36, 0.85) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.22)',
          borderRadius: '14px',
          padding: '10px 16px',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.35)',
          position: 'relative'
        }}>
          {/* Header Tag */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '6px',
            fontSize: '10px',
            color: '#64748b'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#94a3b8',
                padding: '1px 6px',
                borderRadius: '4px',
                fontSize: '9px',
                fontWeight: '700',
                letterSpacing: '0.4px'
              }}>
                ADVERTISEMENT
              </span>
              <span>• Top Banner Slot (728x90 Responsive)</span>
            </div>
            <span style={{ color: '#00d2ff', fontSize: '10px' }}>
              ⚡ Monetized by Seller Suite Pro
            </span>
          </div>

          {/* Ad Container */}
          {hasRealPubId && isAdFilled ? (
            <div style={{ display: 'flex', minHeight: '90px', alignItems: 'center', justifyContent: 'center' }}>
              <ins 
                ref={insRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', minHeight: '90px' }}
                data-ad-client={config.pubId}
                data-ad-slot={config.topSlotId || undefined}
                data-ad-format="horizontal"
                data-full-width-responsive="true"
              />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', width: '100%' }}>
              {/* Live Adsterra 728x90 Banner */}
              <AdsterraBanner />

              {/* Hidden AdSense node keeps Google review crawler active */}
              {hasRealPubId && (
                <ins 
                  ref={insRef}
                  className="adsbygoogle"
                  style={{ display: 'none' }}
                  data-ad-client={config.pubId}
                  data-ad-slot={config.topSlotId || undefined}
                  data-ad-format="horizontal"
                  data-full-width-responsive="true"
                />
              )}

              {/* Clean Sponsor Footer Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: '12px',
                flexWrap: 'wrap',
                paddingTop: '6px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Partner Network:</span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#00d2ff' }}>Adsterra Premium Publisher (ID: 6128040)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>Featured:</span>
                  <a
                    href={currentSponsor.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: currentSponsor.themeColor,
                      fontSize: '11px',
                      fontWeight: '700',
                      textDecoration: 'none'
                    }}
                  >
                    <span>{currentSponsor.title}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // 3. IN-FEED MID-WORKSPACE AD (Placed at bottom of modules before tool footers)
  return (
    <aside
      aria-label="Sponsored Partner"
      style={{
        marginTop: '28px',
        width: '100%'
      }}
    >
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.7) 0%, rgba(8, 17, 33, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '14px',
        padding: '16px 20px',
        backdropFilter: 'blur(10px)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          fontSize: '10px',
          color: '#64748b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94a3b8',
              padding: '1px 6px',
              borderRadius: '4px',
              fontSize: '9px',
              fontWeight: '700'
            }}>
              SPONSORED RECOMMENDATION
            </span>
            <span>Recommended E-Commerce Infrastructure Partner</span>
          </div>
          <span style={{ color: '#25d366', fontSize: '10px', fontWeight: '700' }}>
            ✓ Verified Partner
          </span>
        </div>

        {hasRealPubId && (
          <div style={{ display: isAdFilled ? 'flex' : 'none', minHeight: '120px', alignItems: 'center', justifyContent: 'center' }}>
            <ins 
              ref={insRef}
              className="adsbygoogle"
              style={{ display: 'block', width: '100%', minHeight: '120px' }}
              data-ad-client={config.pubId}
              data-ad-slot={config.inFeedSlotId || undefined}
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
          </div>
        )}
        {(!hasRealPubId || !isAdFilled) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                fontSize: '28px',
                width: '50px',
                height: '50px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${currentSponsor.themeColor}50`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {currentSponsor.logo}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
                    {currentSponsor.title}
                  </h4>
                  <span style={{
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: `${currentSponsor.themeColor}20`,
                    color: currentSponsor.themeColor,
                    border: `1px solid ${currentSponsor.themeColor}50`,
                    fontWeight: '700'
                  }}>
                    {currentSponsor.badge}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0', maxWidth: '750px', lineHeight: '1.4' }}>
                  {currentSponsor.desc}
                </p>
              </div>
            </div>

            <div>
              <a
                href={currentSponsor.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 20px',
                  borderRadius: '10px',
                  background: `linear-gradient(135deg, ${currentSponsor.themeColor} 0%, #00d2ff 100%)`,
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(0, 210, 255, 0.25)',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{currentSponsor.cta}</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
