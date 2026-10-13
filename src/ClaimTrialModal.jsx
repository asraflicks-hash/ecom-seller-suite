import React, { useState, useEffect } from 'react';
import { 
  X, 
  MessageSquare, 
  Store, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ShoppingBag, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles, 
  Zap, 
  ShieldCheck,
  Clock,
  Key,
  BadgeAlert
} from 'lucide-react';
import { MarketplaceLogo } from './MarketplaceLogos.jsx';
import { 
  getOrAssignCustomerId, 
  allocateCustomerIdForApplicant,
  saveUserProfile, 
  formatWhatsAppPitchMessage, 
  getUserProfile,
  OFFICIAL_AGENT_WHATSAPP,
  OFFICIAL_AGENT_DISPLAY_PHONE
} from './licenseManager.js';

export default function ClaimTrialModal({ onClose, onProfileUpdated }) {
  // Form states with localStorage prefill
  const [sellerName, setSellerName] = useState(() => localStorage.getItem('sidra_user_name') || '');
  const [whatsapp, setWhatsapp] = useState(() => localStorage.getItem('sidra_user_phone') || '');
  const [email, setEmail] = useState(() => localStorage.getItem('sidra_user_email') || '');
  const [city, setCity] = useState(() => localStorage.getItem('sidra_user_city') || '');
  const [brandName, setBrandName] = useState(() => localStorage.getItem('sidra_brand_name') || localStorage.getItem('sidra_store_name') || '');
  const [marketplace, setMarketplace] = useState(() => localStorage.getItem('sidra_platform') || 'Amazon & Flipkart');
  const [trialDuration, setTrialDuration] = useState('14-Day Free Access');

  // Allocate unique sequential Customer ID (110892, 110893, 110894...)
  const [customerId, setCustomerId] = useState(() => {
    const existingPhone = localStorage.getItem('sidra_user_phone') || '';
    return allocateCustomerIdForApplicant(existingPhone);
  });

  const [formError, setFormError] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Dynamically allocate ID when phone number is entered or changed
  const handlePhoneChange = (val) => {
    setWhatsapp(val);
    const clean = val.replace(/[^0-9]/g, '');
    if (clean.length >= 8) {
      const allocated = allocateCustomerIdForApplicant(clean);
      setCustomerId(allocated);
    }
  };

  // Generate the formatted WhatsApp pitch message dynamically
  const generatedMessage = formatWhatsAppPitchMessage({
    customerId,
    name: sellerName,
    phone: whatsapp,
    email,
    city,
    brand: brandName || 'My Store',
    platform: marketplace
  });

  const handleCopyMessage = () => {
    // Validate required fields before allowing copy
    if (!sellerName.trim() || !whatsapp.trim() || !email.trim() || !city.trim()) {
      setFormError('Please fill in all 4 mandatory fields (Name, WhatsApp Number, Email, and City) to generate your message.');
      return;
    }
    setFormError('');
    const freshMessage = formatWhatsAppPitchMessage({
      customerId,
      name: sellerName,
      phone: whatsapp,
      email,
      city,
      brand: brandName || 'My Store',
      platform: marketplace
    });
    navigator.clipboard.writeText(freshMessage);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSubmitAndLaunchWhatsApp = (e) => {
    e?.preventDefault();
    setFormError('');

    // Strict validation: Name, Phone, Email, and City are all mandatory
    if (!sellerName.trim()) {
      setFormError('Please enter your Full Name.');
      return;
    }
    const cleanPhone = whatsapp.trim().replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setFormError('Please enter a valid WhatsApp Phone Number.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Please enter a valid Email Address.');
      return;
    }
    if (!city.trim()) {
      setFormError('Please enter your City.');
      return;
    }

    // Allocate guaranteed sequential Customer ID (110892, 110893, 110894...)
    const finalCustomerId = allocateCustomerIdForApplicant(cleanPhone);
    setCustomerId(finalCustomerId);

    // Persist profile and register in claimant log for owner
    const saved = saveUserProfile({
      customerId: finalCustomerId,
      name: sellerName.trim(),
      phone: whatsapp.trim(),
      email: email.trim(),
      city: city.trim(),
      brand: brandName.trim() || 'My Store',
      platform: marketplace.trim(),
      duration: trialDuration
    });

    if (onProfileUpdated) {
      onProfileUpdated({
        customerId: finalCustomerId,
        name: saved.name,
        phone: saved.phone,
        email: saved.email,
        city: saved.city,
        brand: saved.brand,
        platform: saved.platform
      });
    }

    // Generate accurate message with new allocated sequential customer ID
    const pitchMessage = formatWhatsAppPitchMessage({
      customerId: finalCustomerId,
      name: sellerName.trim(),
      phone: whatsapp.trim(),
      email: email.trim(),
      city: city.trim(),
      brand: brandName.trim() || 'My Store',
      platform: marketplace.trim()
    });

    // Build WhatsApp URL directly to Authorized Agent (6306348371)
    const encoded = encodeURIComponent(pitchMessage);
    const waUrl = `https://wa.me/${OFFICIAL_AGENT_WHATSAPP}?text=${encoded}`;

    setIsSent(true);
    window.open(waUrl, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(14px)',
      zIndex: 220,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '94vh',
        overflowY: 'auto',
        padding: '28px',
        borderRadius: '24px',
        border: '1px solid rgba(37, 211, 102, 0.45)',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 35px rgba(37, 211, 102, 0.2)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(37, 211, 102, 0.15)',
              border: '2px solid #25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25d366'
            }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Complete Profile to Claim Key
                </h3>
                <span style={{
                  background: 'rgba(37, 211, 102, 0.2)',
                  color: '#25d366',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  border: '1px solid rgba(37, 211, 102, 0.4)'
                }}>
                  1-DEVICE PRO KEY
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                All 4 fields (Name, Phone, Email, City) are required to generate your bound license key.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#cbd5e1',
              padding: '6px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <X size={14} /> Close
          </button>
        </div>

        {/* Customer ID Display Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.12) 0%, rgba(37, 211, 102, 0.15) 100%)',
          border: '1px solid rgba(0, 210, 255, 0.35)',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>
              Auto-Assigned Customer ID
            </div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#00d2ff', fontFamily: 'monospace', letterSpacing: '1px', marginTop: '2px' }}>
              {customerId}
            </div>
          </div>
          <div style={{
            fontSize: '11px',
            color: '#25d366',
            background: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.3)',
            borderRadius: '10px',
            padding: '4px 10px',
            fontWeight: '700'
          }}>
            ✓ 1-Key per 1-ID Binding Active
          </div>
        </div>

        {formError && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: '#f43f5e',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '12px',
            marginBottom: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BadgeAlert size={16} /> {formError}
          </div>
        )}

        {isSent && (
          <div style={{
            background: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            color: '#25d366',
            padding: '12px 14px',
            borderRadius: '12px',
            fontSize: '12px',
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            <div style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} /> Profile Saved & Routed to Agent Desk!
            </div>
            <div style={{ marginTop: '4px', color: '#e2e8f0' }}>
              Your pitch message with Customer ID <strong>{customerId}</strong> has been routed directly to Key Dispatch Agent <strong>{OFFICIAL_AGENT_DISPLAY_PHONE}</strong>. They will verify and issue your commercial key immediately!
            </div>
          </div>
        )}

        {/* Profile Completion Form */}
        <form onSubmit={handleSubmitAndLaunchWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1: Name and WhatsApp Number (MANDATORY) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} color="#00d2ff" /> 1. Full Name (Naam) *
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                style={{ width: '100%', fontSize: '12px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={12} color="#25d366" /> 2. WhatsApp Number *
              </label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 9876543210"
                style={{ width: '100%', fontSize: '12px' }}
                required
              />
            </div>
          </div>

          {/* Row 2: Email and City (MANDATORY) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={12} color="#00d2ff" /> 3. Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. rahul@example.com"
                style={{ width: '100%', fontSize: '12px' }}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={12} color="#f59e0b" /> 4. City (Shahar) *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Delhi, Mumbai, Jaipur, Surat"
                style={{ width: '100%', fontSize: '12px' }}
                required
              />
            </div>
          </div>

          {/* Row 3: Store / Brand and Marketplace (Optional / Contextual) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Store size={12} color="#00d2ff" /> Store / Brand Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. AuraSound / Apex Mart"
                style={{ width: '100%', fontSize: '12px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShoppingBag size={12} color="#00d2ff" /> Selling Marketplace
              </label>
              <select
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
                style={{ width: '100%', fontSize: '12px' }}
              >
                <option value="Amazon & Flipkart">Amazon & Flipkart</option>
                <option value="Amazon India">Amazon India (IN)</option>
                <option value="Flipkart Marketplace">Flipkart Marketplace</option>
                <option value="Meesho Supplier Hub">Meesho Supplier Hub</option>
                <option value="Shopify Direct Store">Shopify Direct Store</option>
              </select>
            </div>
          </div>

          {/* Real-time WhatsApp Pitch Preview with Customer ID */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '12px',
            marginTop: '2px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#25d366', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MessageSquare size={12} /> WhatsApp Pitch Message Preview (Auto-Generated)
              </span>
              <button
                type="button"
                onClick={handleCopyMessage}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isCopied ? '#25d366' : '#00d2ff',
                  fontSize: '11px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {isCopied ? <Check size={12} /> : <Copy size={12} />}
                {isCopied ? 'Copied' : 'Copy Text'}
              </button>
            </div>
            <pre style={{
              margin: 0,
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#cbd5e1',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.4',
              background: 'rgba(0,0,0,0.3)',
              padding: '10px',
              borderRadius: '8px'
            }}>
              {generatedMessage}
            </pre>
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                color: '#ffffff',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(37, 211, 102, 0.45)',
                transition: 'all 0.2s'
              }}
            >
              <MessageSquare size={16} /> Send WhatsApp Request with Customer ID {customerId} 🚀
            </button>
          </div>

          <div style={{
            fontSize: '11px',
            color: '#94a3b8',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={13} color="#25d366" />
            1 Key strictly bound to 1 Phone & Customer ID • Instant Delivery via Sidra Motion WhatsApp
          </div>
        </form>
      </div>
    </div>
  );
}
