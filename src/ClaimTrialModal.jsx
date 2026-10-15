import React, { useState } from 'react';
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
  ShieldCheck,
  BadgeAlert
} from 'lucide-react';
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

  // Allocate unique sequential Customer ID (110892, 110893, 110894...)
  const [customerId, setCustomerId] = useState(() => {
    const existingPhone = localStorage.getItem('sidra_user_phone') || '';
    return allocateCustomerIdForApplicant(existingPhone);
  });

  const [formError, setFormError] = useState('');
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

  const handleSubmitAndLaunchWhatsApp = (e) => {
    e?.preventDefault();
    setFormError('');

    // Strict validation: Name, Phone (10 digits), Email, and City are all mandatory
    const cleanName = sellerName.trim();
    if (!cleanName || cleanName.length < 2) {
      setFormError('⚠️ Pehle apna Pura Naam bharein.');
      return;
    }
    const rawDigits = whatsapp.trim().replace(/[^0-9]/g, '');
    const cleanPhone = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
    if (!cleanPhone || cleanPhone.length !== 10) {
      setFormError('⚠️ Kripya 10-digit ka valid WhatsApp Mobile Number bharein.');
      return;
    }
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError('⚠️ Kripya valid Email Address dalein.');
      return;
    }
    const cleanCity = city.trim();
    if (!cleanCity || cleanCity.length < 2) {
      setFormError('⚠️ Kripya apna Shahar (City) bharein.');
      return;
    }

    // Allocate guaranteed sequential Customer ID (110892, 110893, 110894...)
    const finalCustomerId = allocateCustomerIdForApplicant(cleanPhone);
    setCustomerId(finalCustomerId);

    // Persist profile and register in claimant log for owner
    const saved = saveUserProfile({
      customerId: finalCustomerId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      city: cleanCity,
      brand: brandName.trim(),
      platform: marketplace.trim(),
      duration: 'Commercial License'
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

    // Generate accurate message with real details only (Zero dummy fallbacks)
    const pitchMessage = formatWhatsAppPitchMessage({
      customerId: finalCustomerId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      city: cleanCity,
      brand: brandName.trim(),
      platform: marketplace.trim()
    });

    // Build WhatsApp URL directly to Authorized Agent (916306348371)
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
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '100%',
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
        maxWidth: '560px',
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
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(37, 211, 102, 0.15)',
              border: '2px solid #25d366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#25d366'
            }}>
              <MessageSquare size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Seller Profile & Key Request
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
                  AGENT: +91 6306348371
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>
                Pehle apni profile complete karein, fir WhatsApp agent (+91 6306348371) pe key lene ka message jayega.
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
              Your Customer ID
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
            ✓ Direct WhatsApp Dispatch Active
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
              <CheckCircle2 size={16} /> Profile Saved & WhatsApp Opened!
            </div>
            <div style={{ marginTop: '4px', color: '#e2e8f0' }}>
              Customer ID <strong>{customerId}</strong> ke sath official Agent <strong>{OFFICIAL_AGENT_DISPLAY_PHONE}</strong> ko message open ho gaya hai. Agent aapko commercial key bhejenge.
            </div>
          </div>
        )}

        {/* Profile Completion Form */}
        <form onSubmit={handleSubmitAndLaunchWhatsApp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Row 1: Name and WhatsApp Number (MANDATORY) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <User size={12} color="#00d2ff" /> 1. Full Name (Pura Naam) *
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                placeholder="Apna Pura Naam daalein"
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
                placeholder="10-digit WhatsApp Mobile Number"
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
                placeholder="Apna Email ID daalein"
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
                placeholder="Apna Shahar (City) daalein"
                style={{ width: '100%', fontSize: '12px' }}
                required
              />
            </div>
          </div>

          {/* Row 3: Store / Brand and Marketplace */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Store size={12} color="#00d2ff" /> Store / Brand Name (Optional)
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Store / Brand ka naam (Optional)"
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

          {/* Action Button */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
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
              <MessageSquare size={16} /> 📲 Profile Save Karein & WhatsApp Agent (+91 6306348371) Pe Message Bhejein 🚀
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
            Profile complete hone par official Agent (+91 6306348371) ke WhatsApp par Customer ID {customerId} ke sath message jayega.
          </div>
        </form>
      </div>
    </div>
  );
}
