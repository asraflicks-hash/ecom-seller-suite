import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Key, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Lock, 
  Unlock, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Store, 
  ShoppingBag, 
  Phone, 
  Mail, 
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Zap,
  Edit3,
  Save,
  X,
  User,
  ShieldAlert,
  Radio,
  Pin,
  Bell,
  Send,
  Eye,
  EyeOff,
  DollarSign
} from 'lucide-react';
import { 
  generateBoundKeyForCustomer, 
  getOrAssignCustomerId, 
  isProfileLocked, 
  lockProfile, 
  unlockProfile,
  OFFICIAL_AGENT_WHATSAPP,
  OFFICIAL_AGENT_DISPLAY_PHONE,
  getNextSequentialCustomerNumber
} from './licenseManager.js';
import { verifyMasterPin, setOwnerMasterPin, checkPinLockoutStatus } from './securityUtils.js';
import { getStoredOfficialUpdates, saveOfficialUpdates } from './CommunityUpdatesModal.jsx';
import { getAdConfig, saveAdConfig } from './adConfig.js';

const OFFICIAL_PRESEED_KEYS = [
  'SM26-MASTER-ADMIN-KEY',
  'SM26-TRY-COMMERCIAL-2026'
];

export default function OwnerPortal({ onNavigateToPublic }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('sidra_owner_session_unlocked') === 'true';
  });

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPinPassword, setShowPinPassword] = useState(false);

  // Authorized keys synchronized with localStorage
  const [authorizedKeys, setAuthorizedKeys] = useState(() => {
    const saved = localStorage.getItem('sidra_authorized_keys');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...OFFICIAL_PRESEED_KEYS, ...parsed]));
        }
      } catch (e) {}
    }
    return OFFICIAL_PRESEED_KEYS;
  });

  // Claimed customer profiles
  const [claimedProfiles, setClaimedProfiles] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sidra_claimed_profiles') || '[]');
    } catch (e) {
      return [];
    }
  });

  // Form states for key generation
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [validityDuration, setValidityDuration] = useState('14-Day Free Trial');
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [copiedKeyText, setCopiedKeyText] = useState('');
  const [notification, setNotification] = useState('');
  const [activeSubTab, setActiveSubTab] = useState('keys'); // 'keys' | 'templates' | 'claims' | 'settings'

  // Agent Session & Fast Dispatch state (+91 6306348371)
  const [isAgentSession, setIsAgentSession] = useState(() => {
    return sessionStorage.getItem('sidra_agent_session') === 'true';
  });
  const [agentCustIdInput, setAgentCustIdInput] = useState('');
  const [agentPhoneInput, setAgentPhoneInput] = useState('');
  const [agentNameInput, setAgentNameInput] = useState('');

  // Pending profile modification request from sellers
  const [activeChangeRequest, setActiveChangeRequest] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sidra_profile_change_request') || 'null');
    } catch (e) {
      return null;
    }
  });

  // Admin Profile Editor state
  const [editingClaim, setEditingClaim] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerId: '',
    sellerName: '',
    whatsapp: '',
    email: '',
    city: '',
    brandName: '',
    marketplace: 'Amazon India',
    isLocked: true
  });

  // PIN change state
  const [newPin, setNewPin] = useState('');
  const [confirmNewPin, setConfirmNewPin] = useState('');

  // Official Broadcast Announcements state
  const [officialUpdates, setOfficialUpdates] = useState(() => getStoredOfficialUpdates());
  const [bTitle, setBTitle] = useState('');
  const [bCategory, setBCategory] = useState('RELEASE UPDATE');
  const [bContent, setBContent] = useState('');
  const [bPinned, setBPinned] = useState(false);
  const [bActionLabel, setBActionLabel] = useState('');
  const [bActionTab, setBActionTab] = useState('listing-audit');

  // Google AdSense & Monetization state
  const [adConfigState, setAdConfigState] = useState(() => getAdConfig());
  const [pubIdInput, setPubIdInput] = useState(() => getAdConfig().pubId || 'ca-pub-XXXXXXXXXXXXXXXX');
  const [topSlotInput, setTopSlotInput] = useState(() => getAdConfig().topSlotId || '');
  const [inFeedSlotInput, setInFeedSlotInput] = useState(() => getAdConfig().inFeedSlotId || '');
  const [footerSlotInput, setFooterSlotInput] = useState(() => getAdConfig().footerSlotId || '');
  const [adsActiveToggle, setAdsActiveToggle] = useState(() => getAdConfig().adsEnabled !== false);

  const handleSaveAdSettings = (e) => {
    e?.preventDefault();
    const cleanPubId = pubIdInput.trim();
    const updated = saveAdConfig({
      pubId: cleanPubId,
      topSlotId: topSlotInput.trim(),
      inFeedSlotId: inFeedSlotInput.trim(),
      footerSlotId: footerSlotInput.trim(),
      adsEnabled: adsActiveToggle
    });
    setAdConfigState(updated);
    setNotification('✅ Google AdSense & Monetization settings updated and live across sellersuitepro.online!');
    setTimeout(() => setNotification(''), 4500);
  };

  // Persist keys to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem('sidra_authorized_keys', JSON.stringify(authorizedKeys));
  }, [authorizedKeys]);

  // Listen to cross-tab storage changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'sidra_authorized_keys' && e.newValue) {
        try {
          setAuthorizedKeys(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'sidra_claimed_profiles' && e.newValue) {
        try {
          setClaimedProfiles(JSON.parse(e.newValue));
        } catch (err) {}
      }
      if (e.key === 'sidra_profile_change_request') {
        try {
          setActiveChangeRequest(e.newValue ? JSON.parse(e.newValue) : null);
        } catch (err) {}
      }
      if (e.key === 'sidra_official_app_updates' && e.newValue) {
        try {
          setOfficialUpdates(JSON.parse(e.newValue));
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleVerifyPin = (e) => {
    e?.preventDefault();
    const result = verifyMasterPin(pinInput);
    if (result.success) {
      setIsUnlocked(true);
      sessionStorage.setItem('sidra_owner_session_unlocked', 'true');
      if (result.isAgent) {
        sessionStorage.setItem('sidra_agent_session', 'true');
        setIsAgentSession(true);
      } else {
        sessionStorage.removeItem('sidra_agent_session');
        setIsAgentSession(false);
      }
      setPinError('');
      setPinInput('');
    } else {
      setPinError(result.error || 'Incorrect Owner Master PIN or Agent Code. Access Denied.');
      setPinInput('');
    }
  };

  const handleLockPortal = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('sidra_owner_session_unlocked');
    sessionStorage.removeItem('sidra_agent_session');
    setIsAgentSession(false);
    setPinInput('');
  };

  // Instant WhatsApp Agent Quick Dispatch (+91 6306348371)
  const handleAgentQuickDispatch = () => {
    const custId = (agentCustIdInput.trim() || `SMSSP/${getNextSequentialCustomerNumber()}`).toUpperCase();
    const cleanPhone = agentPhoneInput.replace(/[^0-9]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      alert('Please enter a valid Customer WhatsApp Phone Number (e.g. 9876543210).');
      return;
    }
    const boundKey = generateBoundKeyForCustomer(custId, cleanPhone);
    setAuthorizedKeys(prev => [boundKey, ...prev.filter(k => k !== boundKey)]);

    // Save/update in claimedProfiles list
    const existingIndex = claimedProfiles.findIndex(c => c.customerId === custId || c.whatsapp === cleanPhone);
    let updatedProfiles = [...claimedProfiles];
    if (existingIndex >= 0) {
      updatedProfiles[existingIndex] = {
        ...updatedProfiles[existingIndex],
        assignedKey: boundKey,
        keyDispatched: true
      };
    } else {
      updatedProfiles.unshift({
        id: Date.now(),
        customerId: custId,
        sellerName: agentNameInput.trim() || 'Seller Partner',
        whatsapp: cleanPhone,
        email: '',
        city: 'Verified',
        brandName: agentNameInput.trim() || 'Store',
        marketplace: 'Amazon India',
        trialDuration: '14-Day Pro Commercial',
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        assignedKey: boundKey,
        keyDispatched: true
      });
    }
    setClaimedProfiles(updatedProfiles);
    localStorage.setItem('sidra_claimed_profiles', JSON.stringify(updatedProfiles));

    setNotification(`✓ Dispatched bound license key ${boundKey} to ${cleanPhone} (${custId})`);
    setTimeout(() => setNotification(''), 4500);

    const waMsg = `Hello ${agentNameInput.trim() || 'Seller Partner'}! 👋

Thank you for contacting Sidra Motion Agent (${OFFICIAL_AGENT_DISPLAY_PHONE}). Your Pro Commercial License Key has been generated and activated:

🔑 License Key: ${boundKey}
• Customer ID: ${custId}
• Bound Mobile: ${cleanPhone}

📌 Activation Steps:
1. Open https://sellersuitepro.online/
2. Enter your License Key: ${boundKey}
3. Click "Verify License & Unlock Suite"

All 7 modules are now unlocked for your store! 🚀
— Sidra Motion Official Agent (${OFFICIAL_AGENT_DISPLAY_PHONE})`;

    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
  };

  const copyToClipboard = (text, identifier) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyText(identifier);
    setTimeout(() => setCopiedKeyText(''), 2200);
  };

  // 1-Click Key Generator
  const handleGenerateKey = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const rand = (n) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    let prefix = 'SM26';
    if (validityDuration.includes('7-Day')) prefix = 'SM07';
    if (validityDuration.includes('VIP')) prefix = 'SVIP';

    const newKey = `${prefix}-${rand(4)}-${rand(4)}-${rand(2)}`;
    setAuthorizedKeys(prev => [newKey, ...prev.filter(k => k !== newKey)]);
    
    setNotification(`New Commercial Key generated: ${newKey}`);
    setTimeout(() => setNotification(''), 4500);

    // If buyer phone provided, allow 1-click WhatsApp message
    if (buyerPhone.trim()) {
      const waMsg = `Hello ${buyerName || 'Partner'}! Here is your Sidra Motion Seller Suite Pro 2026 Commercial License Key: ${newKey}. Access portal: https://sellersuitepro.online`;
      window.open(`https://wa.me/${buyerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Add Custom Key
  const handleAddCustomKey = (e) => {
    e?.preventDefault();
    const clean = customKeyInput.trim().toUpperCase();
    if (clean.length < 14) {
      alert('Custom key must be at least 14 characters long.');
      return;
    }
    if (authorizedKeys.includes(clean)) {
      alert('This key is already whitelisted and active.');
      return;
    }

    setAuthorizedKeys(prev => [clean, ...prev]);
    setCustomKeyInput('');
    setNotification(`Custom key added: ${clean}`);
    setTimeout(() => setNotification(''), 4500);
  };

  // Revoke / Delete Key
  const handleRevokeKey = (keyToRevoke) => {
    if (authorizedKeys.length <= 1) {
      alert('Cannot delete the last remaining key.');
      return;
    }
    if (window.confirm(`Are you sure you want to revoke key: ${keyToRevoke}? Users with this key will no longer have access.`)) {
      setAuthorizedKeys(prev => prev.filter(k => k !== keyToRevoke));
      setNotification(`Revoked license key: ${keyToRevoke}`);
      setTimeout(() => setNotification(''), 4500);
    }
  };

  // Update Master Password with Cryptographic Hashing
  const handleUpdatePin = (e) => {
    e?.preventDefault();
    if (newPin.trim().length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }
    if (newPin !== confirmNewPin) {
      alert('Password confirmation does not match.');
      return;
    }
    setOwnerMasterPin(newPin.trim());
    setNewPin('');
    setConfirmNewPin('');
    setNotification('✓ Master Security Password updated and securely hashed (SHA-256)!');
    setTimeout(() => setNotification(''), 4500);
  };

  // Official Community Broadcast Handlers
  const handlePublishBroadcast = (e) => {
    e?.preventDefault();
    if (!bTitle.trim() || !bContent.trim()) {
      alert('Please enter both Title and Announcement Content.');
      return;
    }

    const categoryColors = {
      'RELEASE UPDATE': '#00d2ff',
      'ALGORITHM ALERT': '#f43f5e',
      'POLICY NOTICE': '#fbbf24',
      'SELLER TIP': '#10b981',
      'SYSTEM NOTICE': '#a855f7'
    };

    const newUpdate = {
      id: `upd-${Date.now()}`,
      title: bTitle.trim(),
      category: bCategory,
      categoryColor: categoryColors[bCategory] || '#00d2ff',
      date: 'Just now (Official)',
      pinned: bPinned,
      author: 'Sidra Motion Product Engineering (HQ)',
      content: bContent.trim(),
      actionLabel: bActionLabel.trim() || undefined,
      actionTab: bActionLabel.trim() ? bActionTab : undefined
    };

    let updatedList;
    if (bPinned) {
      updatedList = [newUpdate, ...officialUpdates];
    } else {
      const pinnedList = officialUpdates.filter(u => u.pinned);
      const regularList = officialUpdates.filter(u => !u.pinned);
      updatedList = [...pinnedList, newUpdate, ...regularList];
    }

    setOfficialUpdates(updatedList);
    saveOfficialUpdates(updatedList);

    setBTitle('');
    setBContent('');
    setBPinned(false);
    setBActionLabel('');
    setNotification('✓ Official Update broadcasted to all seller workstations!');
    setTimeout(() => setNotification(''), 4500);
  };

  const handleDeleteBroadcast = (updateId) => {
    if (window.confirm('Are you sure you want to delete this broadcast update?')) {
      const updatedList = officialUpdates.filter(u => u.id !== updateId);
      setOfficialUpdates(updatedList);
      saveOfficialUpdates(updatedList);
      setNotification('✓ Broadcast announcement removed.');
      setTimeout(() => setNotification(''), 3500);
    }
  };

  const handleTogglePinBroadcast = (updateId) => {
    const updatedList = officialUpdates.map(u => {
      if (u.id === updateId) {
        return { ...u, pinned: !u.pinned };
      }
      return u;
    });
    setOfficialUpdates(updatedList);
    saveOfficialUpdates(updatedList);
  };

  // 5 Dedicated WhatsApp AI Auto-Reply Templates
  const WHATSAPP_AI_TEMPLATES = [
    {
      id: 1,
      name: 'Template 1: Official 14-Day Commercial Access Key',
      key: 'SM26-TRY-COMMERCIAL-2026',
      tag: '14 Days Access',
      text: `Hello! 👋 Thank you for choosing Sidra Motion Seller Suite Pro (https://sellersuitepro.online).

We have reviewed your store profile and approved your Pro Commercial Access! Here is your official license key:

🔑 License Key: SM26-TRY-COMMERCIAL-2026

📌 How to activate:
1. Open https://sellersuitepro.online/ in your browser
2. Select "License Key" tab
3. Enter: SM26-TRY-COMMERCIAL-2026
4. Click "Verify License & Unlock Suite"

All modules are now unlocked for your store. Happy Selling! 🚀
— Sidra Motion AI Seller Support Team`
    },
    {
      id: 2,
      name: 'Template 2: 14-Day Growth Seller Key',
      key: 'SM26-TRY-COMMERCIAL-2026',
      tag: '14 Days Pro',
      text: `Greetings from Sidra Motion! 🌟

Thank you for registering your store and requesting access. Your Full Commercial License Key has been activated:

🔑 License Key: SM26-TRY-COMMERCIAL-2026

📌 Quick Start Steps:
1. Go to https://sellersuitepro.online/
2. Enter your key: SM26-TRY-COMMERCIAL-2026
3. Enjoy instant AI SEO Listings, #FFFFFF Pure White Studio, RGB Listing Score & Cross-Platform Catalog Converter!

For enterprise upgrades or queries, reply here. Have a profitable week! 💼`
    },
    {
      id: 3,
      name: 'Template 3: VIP Marketplace Seller Key',
      key: 'SM26-TRY-COMMERCIAL-2026',
      tag: 'VIP Commercial',
      text: `Hi there! Thank you for connecting with Sidra Motion Support. 💎

Your VIP Commercial Seller Pass is ready for activation:

🔑 License Key: SM26-TRY-COMMERCIAL-2026

✅ Included Features:
• Amazon, Flipkart & Meesho High-CTR SEO Generator
• 100% Compliant #FFFFFF Pure White Studio
• Real-time BuyBox Repricer & RTO Stop-Loss Guard
• Marketplace Sync & RGB Listing Quality Score (LQS)

Launch now at https://sellersuitepro.online/ and start boosting your marketplace conversions today! 🔥
— Best regards, Sidra Motion Team`
    },
    {
      id: 4,
      name: 'Template 4: E-Commerce Catalog Boost Key',
      key: 'SM26-TRY-COMMERCIAL-2026',
      tag: 'Catalog Boost',
      text: `Hello Seller Partner! 📦

Thank you for submitting your store details for Sidra Motion Seller Suite Pro. We are excited to support your growth!

Here is your Access License Key:
🔑 License Key: SM26-TRY-COMMERCIAL-2026

Enter this key on the login screen at https://sellersuitepro.online/ to access all modules.
WhatsApp Help: Available 24/7.`
    },
    {
      id: 5,
      name: 'Template 5: All-Access Commercial Pass Key',
      key: 'SM26-TRY-COMMERCIAL-2026',
      tag: 'All-Access Pass',
      text: `Welcome to Sidra Motion - Visuals That Matter! ✨

Thank you for applying for access. Here is your Official Access Pass:

🔑 License Key: SM26-TRY-COMMERCIAL-2026

👉 Access Portal: https://sellersuitepro.online/
Unlock high-converting titles, clean white product images, and cross-platform listing tools in seconds!

Best regards,
Sidra Motion AI Seller Support Team`
    }
  ];

  // Send approved key directly to a seller who claimed on public form (strictly bound to Customer ID)
  const handleSendKeyToClaimant = (profile, chosenKey) => {
    const custId = profile.customerId || getOrAssignCustomerId();
    // Generate or use chosen key bound specifically to this Customer ID and WhatsApp phone
    const boundKey = chosenKey && chosenKey.startsWith('SMSSP-') 
      ? chosenKey 
      : generateBoundKeyForCustomer(custId, profile.whatsapp);

    // Refresh local authorizedKeys
    setAuthorizedKeys(prev => [boundKey, ...prev.filter(k => k !== boundKey)]);

    const waNumber = profile.whatsapp ? profile.whatsapp.replace(/[^0-9]/g, '') : '';
    const message = `Hello ${profile.sellerName || 'Partner'}!

Thank you for registering on Sidra Motion Seller Suite Pro (https://sellersuitepro.online). We have approved your ${profile.trialDuration || '14-Day'} Pro Commercial Access Key:

🔑 License Key: ${boundKey}
• Bound Customer ID: ${custId}
• Registered Phone: ${profile.whatsapp || 'Registered'}
• City: ${profile.city || 'Verified'}

Portal URL: https://sellersuitepro.online/
Note: This key is strictly bound to Customer ID ${custId} and your mobile number. Enter it to unlock all 7 modules! 🚀
— Sidra Motion Team`;

    const url = waNumber 
      ? `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  // Open Admin Profile Edit Modal
  const handleOpenEditModal = (claim) => {
    const isCustLocked = claim.customerId === localStorage.getItem('sidra_customer_id')
      ? (localStorage.getItem('sidra_profile_locked') === 'true')
      : (claim.isLocked !== false);

    setEditingClaim(claim);
    setEditFormData({
      customerId: claim.customerId || getOrAssignCustomerId(),
      sellerName: claim.sellerName || '',
      whatsapp: claim.whatsapp || '',
      email: claim.email || '',
      city: claim.city || '',
      brandName: claim.brandName || '',
      marketplace: claim.marketplace || 'Amazon India',
      isLocked: isCustLocked
    });
  };

  // Save profile updates directly as Admin
  const handleSaveClaimantEdit = (e, notifyViaWhatsApp = false) => {
    e?.preventDefault();
    if (!editFormData.sellerName.trim()) {
      alert('Seller Name is required.');
      return;
    }
    if (!editFormData.whatsapp.trim()) {
      alert('WhatsApp Phone Number is required.');
      return;
    }

    // 1. Update in claimedProfiles state and localStorage
    const updatedList = claimedProfiles.map(item => {
      if (item.customerId === editFormData.customerId || item.id === editingClaim?.id) {
        return {
          ...item,
          sellerName: editFormData.sellerName.trim(),
          whatsapp: editFormData.whatsapp.trim(),
          email: editFormData.email.trim(),
          city: editFormData.city.trim(),
          brandName: editFormData.brandName.trim(),
          marketplace: editFormData.marketplace,
          isLocked: editFormData.isLocked,
          changeRequest: null,
          changeRequestTime: null
        };
      }
      return item;
    });

    const exists = updatedList.some(item => item.customerId === editFormData.customerId || item.id === editingClaim?.id);
    const finalList = exists ? updatedList : [
      {
        id: Date.now(),
        customerId: editFormData.customerId,
        sellerName: editFormData.sellerName.trim(),
        whatsapp: editFormData.whatsapp.trim(),
        email: editFormData.email.trim(),
        city: editFormData.city.trim(),
        brandName: editFormData.brandName.trim(),
        marketplace: editFormData.marketplace,
        isLocked: editFormData.isLocked,
        trialDuration: editingClaim?.trialDuration || 'Commercial Licensed',
        timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      },
      ...updatedList
    ];

    setClaimedProfiles(finalList);
    localStorage.setItem('sidra_claimed_profiles', JSON.stringify(finalList));

    // 2. Synchronize to active local user if matching
    const activeCustId = localStorage.getItem('sidra_customer_id');
    if (!activeCustId || activeCustId === editFormData.customerId) {
      localStorage.setItem('sidra_user_name', editFormData.sellerName.trim());
      localStorage.setItem('sidra_user_phone', editFormData.whatsapp.trim());
      localStorage.setItem('sidra_user_email', editFormData.email.trim());
      localStorage.setItem('sidra_user_city', editFormData.city.trim());
      localStorage.setItem('sidra_store_name', editFormData.brandName.trim());
      localStorage.setItem('sidra_brand_name', editFormData.brandName.trim());
      localStorage.setItem('sidra_platform', editFormData.marketplace);
      if (editFormData.isLocked) {
        lockProfile();
      } else {
        unlockProfile();
      }
    }

    // 3. Clear active change request if matching
    if (activeChangeRequest && activeChangeRequest.customerId === editFormData.customerId) {
      localStorage.removeItem('sidra_profile_change_request');
      setActiveChangeRequest(null);
    }

    setEditingClaim(null);
    setNotification(`✓ Profile for Customer ID ${editFormData.customerId} successfully updated by Admin!`);
    setTimeout(() => setNotification(''), 4500);

    // If requested, open WhatsApp with confirmation to seller
    if (notifyViaWhatsApp) {
      const waNumber = editFormData.whatsapp.replace(/[^0-9]/g, '');
      const waMsg = `Hello ${editFormData.sellerName}! Your profile details have been successfully updated and verified by Sidra Motion Admin.

Customer ID: ${editFormData.customerId}
Brand: ${editFormData.brandName}
Lock Status: ${editFormData.isLocked ? 'Locked & Verified' : 'Unlocked (Editable)'}

You can now refresh your dashboard at https://sellersuitepro.online/`;
      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`, '_blank', 'noopener,noreferrer');
    }
  };

  // Instant 1-click lock/unlock toggle by Admin
  const handleToggleLockClaimant = (claim) => {
    const isCustLocked = claim.customerId === localStorage.getItem('sidra_customer_id')
      ? isProfileLocked()
      : (claim.isLocked !== false);

    const newLockState = !isCustLocked;

    const updatedList = claimedProfiles.map(item => {
      if (item.customerId === claim.customerId || item.id === claim.id) {
        return { ...item, isLocked: newLockState };
      }
      return item;
    });

    setClaimedProfiles(updatedList);
    localStorage.setItem('sidra_claimed_profiles', JSON.stringify(updatedList));

    const activeCustId = localStorage.getItem('sidra_customer_id');
    if (!activeCustId || activeCustId === claim.customerId) {
      if (newLockState) {
        lockProfile();
      } else {
        unlockProfile();
      }
    }

    setNotification(newLockState 
      ? `🔒 Profile for ${claim.customerId || claim.sellerName} is now LOCKED.` 
      : `🔓 Profile for ${claim.customerId || claim.sellerName} is now UNLOCKED (Seller can edit).`
    );
    setTimeout(() => setNotification(''), 4500);
  };

  // -------------------------------------------------------------
  // PIN LOCKED STATE: OWNER LOGIN FORM
  // -------------------------------------------------------------
  if (!isUnlocked) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(circle at 50% 20%, #1e1b4b 0%, #0f172a 50%, #020617 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div className="glass-panel" style={{
          maxWidth: '420px',
          width: '100%',
          padding: '36px 30px',
          borderRadius: '24px',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.2)',
          textAlign: 'center'
        }}>
          {/* Logo with animated glow */}
          <div style={{ position: 'relative', width: '74px', height: '74px', margin: '0 auto 16px' }}>
            <img 
              src="/sidra-logo.png" 
              alt="Sidra Motion Logo" 
              className="gold-glow-animated"
              style={{
                width: '74px',
                height: '74px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #eab308'
              }}
            />
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
            SIDRA MOTION
          </h2>
          <span style={{
            display: 'inline-block',
            background: 'rgba(245, 158, 11, 0.15)',
            color: '#fbbf24',
            fontSize: '11px',
            fontWeight: '800',
            padding: '3px 12px',
            borderRadius: '20px',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            marginTop: '4px',
            marginBottom: '16px'
          }}>
            OWNER MASTER KEY VAULT
          </span>

          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '14px' }}>
            Enter Admin Master Security Password to unlock license key management & dispatch desk.
          </p>

          <div style={{
            background: 'rgba(37, 211, 102, 0.12)',
            border: '1px solid rgba(37, 211, 102, 0.35)',
            borderRadius: '10px',
            padding: '8px 12px',
            marginBottom: '16px',
            fontSize: '11px',
            color: '#25d366',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            fontWeight: '700'
          }}>
            <MessageSquare size={13} /> Official WhatsApp Agent Desk: {OFFICIAL_AGENT_DISPLAY_PHONE} Active 🟢
          </div>

          {pinError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              color: '#f43f5e',
              padding: '10px 14px',
              borderRadius: '10px',
              fontSize: '12px',
              marginBottom: '16px',
              fontWeight: '600'
            }}>
              {pinError}
            </div>
          )}

          <form onSubmit={handleVerifyPin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPinPassword ? 'text' : 'password'}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter Admin Master Password"
                style={{
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  fontWeight: '700',
                  padding: '12px 44px 12px 14px',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowPinPassword(!showPinPassword)}
                title={showPinPassword ? 'Hide Password' : 'Show Password'}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPinPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                color: '#070d19',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(245, 158, 11, 0.35)'
              }}
            >
              <Unlock size={16} /> Unlock Vault
            </button>
          </form>

          <div style={{ marginTop: '22px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onNavigateToPublic}
              style={{
                background: 'none',
                border: 'none',
                color: '#00d2ff',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                margin: '0 auto'
              }}
            >
              <ExternalLink size={13} /> Switch to Public Storefront (Client View)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // UNLOCKED STATE: OWNER COMMAND CENTER & KEY VAULT
  // -------------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(circle at 50% 10%, #1e1b4b 0%, #0c1527 45%, #050b14 100%)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Header */}
      <header style={{
        background: 'rgba(10, 18, 34, 0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/sidra-logo.png" 
            alt="Sidra Motion Logo" 
            className="gold-glow-animated"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #eab308'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: "'Space Grotesk', sans-serif" }}>
                SIDRA MOTION
              </h1>
              {isAgentSession ? (
                <span style={{
                  background: 'rgba(37, 211, 102, 0.2)',
                  color: '#25d366',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 10px',
                  borderRadius: '16px',
                  border: '1px solid rgba(37, 211, 102, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25d366' }}></span>
                  AGENT DISPATCH DESK ({OFFICIAL_AGENT_DISPLAY_PHONE})
                </span>
              ) : (
                <span style={{
                  background: 'rgba(245, 158, 11, 0.15)',
                  color: '#fbbf24',
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '2px 10px',
                  borderRadius: '16px',
                  border: '1px solid rgba(245, 158, 11, 0.4)'
                }}>
                  OWNER COMMAND CENTER
                </span>
              )}
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8' }}>
              LICENSE VAULT & KEY DISPATCH DESK • OFFICIAL AGENT: {OFFICIAL_AGENT_DISPLAY_PHONE}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={onNavigateToPublic}
            style={{
              background: 'rgba(0, 210, 255, 0.12)',
              border: '1px solid rgba(0, 210, 255, 0.35)',
              color: '#00d2ff',
              padding: '7px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={14} /> View Public Suite (Client View)
          </button>

          <button
            onClick={handleLockPortal}
            style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.35)',
              color: '#f43f5e',
              padding: '7px 14px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Lock size={14} /> Lock Vault
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ flex: 1, padding: '26px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        {notification && (
          <div style={{
            background: 'rgba(37, 211, 102, 0.15)',
            border: '1px solid rgba(37, 211, 102, 0.4)',
            color: '#25d366',
            padding: '12px 18px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle2 size={18} /> {notification}
          </div>
        )}

        {/* Sync & Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Active Whitelisted Keys
              </span>
              <Key size={18} color="#00d2ff" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#fff', marginTop: '6px' }}>
              {authorizedKeys.length}
            </div>
            <div style={{ fontSize: '11px', color: '#25d366', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● 100% Synced with Public Workstation
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(37, 211, 102, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                WhatsApp Trial Requests
              </span>
              <MessageSquare size={18} color="#25d366" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#25d366', marginTop: '6px' }}>
              {claimedProfiles.length}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              Registered buyer profiles waiting for keys
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Security Master Password
              </span>
              <Shield size={18} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#10b981', marginTop: '6px' }}>
              •••• Active
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              SHA-256 Salted Vault Protected
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(0, 210, 255, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Community Broadcasts
              </span>
              <Radio size={18} color="#00d2ff" />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: '#00d2ff', marginTop: '6px' }}>
              {officialUpdates.length}
            </div>
            <div style={{ fontSize: '11px', color: '#25d366', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ● Live on Public Seller Feed
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', border: '1px solid rgba(37, 211, 102, 0.4)', background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(10, 20, 36, 0.7) 100%)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Key Dispatch Agent
              </span>
              <MessageSquare size={18} color="#25d366" />
            </div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#25d366', marginTop: '6px' }}>
              {OFFICIAL_AGENT_DISPLAY_PHONE}
            </div>
            <div style={{ fontSize: '11px', color: '#cbd5e1', marginTop: '4px' }}>
              🟢 100% WhatsApp Key Requests Routed
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '22px',
          background: 'rgba(10, 20, 36, 0.65)',
          padding: '4px',
          borderRadius: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'keys', label: '1. License Key Management & Generator', icon: Key },
            { id: 'templates', label: '2. WhatsApp AI Auto-Reply Templates (5 Keys)', icon: MessageSquare },
            { id: 'claims', label: `3. Seller Profiles & Lock Control (${claimedProfiles.length}${activeChangeRequest ? ' • 🔔 Request' : ''})`, icon: UserCheck },
            { id: 'broadcast', label: `4. Community Updates Broadcast 📢 (${officialUpdates.length})`, icon: Radio },
            { id: 'settings', label: '5. Security & Password Settings', icon: Shield },
            { id: 'monetization', label: '6. 💰 Ads & Google AdSense Monetization', icon: DollarSign }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isActive ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'transparent',
                  color: isActive ? '#070d19' : '#94a3b8',
                  fontSize: '12px',
                  fontWeight: isActive ? '800' : '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={14} color={isActive ? '#070d19' : '#94a3b8'} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: KEY MANAGEMENT & GENERATOR */}
        {activeSubTab === 'keys' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* WhatsApp Agent Instant Key Dispatch Card */}
            <div className="glass-panel" style={{
              padding: '20px 24px',
              borderRadius: '18px',
              border: '1px solid rgba(37, 211, 102, 0.45)',
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.1) 0%, rgba(10, 20, 36, 0.85) 100%)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 25px rgba(37, 211, 102, 0.15)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MessageSquare size={18} color="#25d366" />
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                    WhatsApp Agent Key Dispatch Desk ({OFFICIAL_AGENT_DISPLAY_PHONE})
                  </h3>
                  <span style={{ fontSize: '10px', background: 'rgba(37, 211, 102, 0.25)', color: '#25d366', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                    DIRECT AGENT DISPATCH
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  Next Sequential Customer ID: <strong style={{ color: '#00d2ff', fontFamily: 'monospace' }}>SMSSP/{getNextSequentialCustomerNumber()}</strong>
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
                Key application received on WhatsApp {OFFICIAL_AGENT_DISPLAY_PHONE}? Enter Customer ID & Phone below to generate their strictly bound commercial key and dispatch it to them in 1 click:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1.2fr auto', gap: '10px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={agentCustIdInput}
                  onChange={(e) => setAgentCustIdInput(e.target.value)}
                  placeholder={`Customer ID (e.g. SMSSP/${getNextSequentialCustomerNumber()})`}
                  style={{ fontSize: '12px', fontFamily: 'monospace' }}
                />
                <input
                  type="tel"
                  value={agentPhoneInput}
                  onChange={(e) => setAgentPhoneInput(e.target.value)}
                  placeholder="Customer WhatsApp (e.g. 9876543210)"
                  style={{ fontSize: '12px' }}
                />
                <input
                  type="text"
                  value={agentNameInput}
                  onChange={(e) => setAgentNameInput(e.target.value)}
                  placeholder="Seller / Store Name (Optional)"
                  style={{ fontSize: '12px' }}
                />
                <button
                  type="button"
                  onClick={handleAgentQuickDispatch}
                  style={{
                    background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 18px rgba(37, 211, 102, 0.4)'
                  }}
                >
                  <Zap size={14} /> ⚡ Generate & Send Key
                </button>
              </div>
            </div>
            {/* 1-Click Key Generator */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Zap size={18} color="#fbbf24" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                  1-Click Commercial License Key Generator
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                Create a 16-character license key instantly. It is immediately active on the public client portal.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr auto', gap: '12px', alignItems: 'center' }}>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Buyer / Brand Name (e.g. Rahul - Apex Mart)"
                  style={{ fontSize: '12px' }}
                />
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  placeholder="Buyer WhatsApp (e.g. 919876543210)"
                  style={{ fontSize: '12px' }}
                />
                <select
                  value={validityDuration}
                  onChange={(e) => setValidityDuration(e.target.value)}
                  style={{ fontSize: '12px' }}
                >
                  <option value="14-Day Free Trial">14-Day Free Access</option>
                  <option value="7-Day Express Trial">7-Day Express Access</option>
                  <option value="30-Day Pro Pass">30-Day Pro Pass</option>
                  <option value="1-Year Commercial">1-Year Commercial</option>
                  <option value="Lifetime VIP">Lifetime VIP Enterprise</option>
                </select>
                <button
                  onClick={handleGenerateKey}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#070d19',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Plus size={15} /> Generate & Activate Key
                </button>
              </div>
            </div>

            {/* Custom Key Add Form */}
            <form onSubmit={handleAddCustomKey} style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="Or whitelist a custom key (14+ characters, e.g. PRO-PARTNER-2026-VIP)"
                style={{ flex: 1, textTransform: 'uppercase', fontFamily: 'monospace', fontSize: '12px', letterSpacing: '1px' }}
              />
              <button
                type="submit"
                style={{
                  background: 'rgba(0, 210, 255, 0.15)',
                  border: '1px solid rgba(0, 210, 255, 0.4)',
                  color: '#00d2ff',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Whitelist Custom Key
              </button>
            </form>

            {/* Active Keys Table */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#fff' }}>
                  Authorized Commercial Keys ({authorizedKeys.length})
                </h3>
                <span style={{ fontSize: '11px', color: '#25d366' }}>
                  ● All keys are active and synced with the public login screen
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {authorizedKeys.map((keyStr, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(0, 0, 0, 0.45)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      flexWrap: 'wrap'
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: 'monospace', fontWeight: '800', color: '#00d2ff', fontSize: '14px', letterSpacing: '1.5px' }}>
                        {keyStr}
                      </div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                        Length: {keyStr.length} chars • Status: <span style={{ color: '#25d366', fontWeight: '700' }}>Active 🟢</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        onClick={() => copyToClipboard(keyStr, keyStr)}
                        style={{
                          background: 'rgba(0, 210, 255, 0.12)',
                          border: '1px solid rgba(0, 210, 255, 0.3)',
                          color: '#00d2ff',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {copiedKeyText === keyStr ? <Check size={12} color="#25d366" /> : <Copy size={12} />}
                        {copiedKeyText === keyStr ? 'Copied' : 'Copy Key'}
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hello! Here is your Sidra Motion Seller Suite Pro 2026 Commercial License Key: ${keyStr}\n\nLogin portal: http://localhost:5173/\nEnjoy your access!`)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          background: 'rgba(37, 211, 102, 0.15)',
                          border: '1px solid rgba(37, 211, 102, 0.35)',
                          color: '#25d366',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '11px',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Share2 size={12} /> Send WA
                      </a>

                      {authorizedKeys.length > 1 && (
                        <button
                          onClick={() => handleRevokeKey(keyStr)}
                          title="Revoke / Delete Key"
                          style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#f43f5e',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px'
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WHATSAPP AI AUTO-REPLY TEMPLATES */}
        {activeSubTab === 'templates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', border: '1px solid rgba(37, 211, 102, 0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MessageSquare size={18} color="#25d366" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#25d366' }}>
                  WhatsApp AI Agent Auto-Reply Templates (5 Pre-Activated Keys)
                </h3>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
                Configure your WhatsApp AI Bot or Business Auto-Responder with these 5 messages. When a seller sends the trial request message, your bot thanks them and automatically delivers one of these active keys!
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {WHATSAPP_AI_TEMPLATES.map((tmpl) => (
                <div 
                  key={tmpl.id} 
                  className="glass-card" 
                  style={{ 
                    padding: '20px', 
                    borderRadius: '16px',
                    border: '1px solid rgba(255, 255, 255, 0.1)' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        background: 'rgba(37, 211, 102, 0.2)',
                        color: '#25d366',
                        fontSize: '11px',
                        fontWeight: '800',
                        padding: '3px 10px',
                        borderRadius: '12px',
                        border: '1px solid rgba(37, 211, 102, 0.4)'
                      }}>
                        {tmpl.tag}
                      </span>
                      <strong style={{ fontSize: '14px', color: '#fff' }}>{tmpl.name}</strong>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontFamily: 'monospace', color: '#00d2ff', fontSize: '12px', fontWeight: '800', background: 'rgba(0,0,0,0.4)', padding: '4px 10px', borderRadius: '6px' }}>
                        🔑 {tmpl.key}
                      </span>
                      <button
                        onClick={() => copyToClipboard(tmpl.text, `tmpl-${tmpl.id}`)}
                        style={{
                          background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                          color: '#fff',
                          border: 'none',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {copiedKeyText === `tmpl-${tmpl.id}` ? <Check size={13} /> : <Copy size={13} />}
                        {copiedKeyText === `tmpl-${tmpl.id}` ? 'Copied Message!' : 'Copy AI Message'}
                      </button>
                    </div>
                  </div>

                  <pre style={{
                    margin: 0,
                    fontSize: '12px',
                    fontFamily: 'monospace',
                    color: '#cbd5e1',
                    background: 'rgba(0, 0, 0, 0.5)',
                    padding: '14px',
                    borderRadius: '10px',
                    whiteSpace: 'pre-wrap',
                    lineHeight: '1.5'
                  }}>
                    {tmpl.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SELLER PROFILES & LOCK CONTROL LOG */}
        {activeSubTab === 'claims' && (
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                  Registered Seller Profiles & Lock Control Log ({claimedProfiles.length})
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Admin authorization center: Edit verified seller details, manage lock states, and review modification requests
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => {
                    const custId = localStorage.getItem('sidra_customer_id') || getOrAssignCustomerId();
                    handleOpenEditModal({
                      customerId: custId,
                      sellerName: localStorage.getItem('sidra_user_name') || '',
                      whatsapp: localStorage.getItem('sidra_user_phone') || '',
                      email: localStorage.getItem('sidra_user_email') || '',
                      city: localStorage.getItem('sidra_user_city') || '',
                      brandName: localStorage.getItem('sidra_brand_name') || localStorage.getItem('sidra_store_name') || '',
                      marketplace: localStorage.getItem('sidra_platform') || 'Amazon India',
                      isLocked: localStorage.getItem('sidra_profile_locked') === 'true'
                    });
                  }}
                  style={{
                    background: 'rgba(0, 210, 255, 0.15)',
                    border: '1px solid rgba(0, 210, 255, 0.4)',
                    color: '#00d2ff',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit3 size={13} /> Edit Active Workstation Profile
                </button>

                {claimedProfiles.length > 0 && (
                  <button
                    onClick={() => {
                      if (window.confirm('Clear all logged profile submissions?')) {
                        localStorage.removeItem('sidra_claimed_profiles');
                        setClaimedProfiles([]);
                      }
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid rgba(244, 63, 94, 0.4)',
                      color: '#f43f5e',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Clear Log
                  </button>
                )}
              </div>
            </div>

            {/* WHATSAPP AGENT DISPATCH BANNER */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(37, 211, 102, 0.15) 0%, rgba(10, 20, 36, 0.7) 100%)',
              border: '1px solid rgba(37, 211, 102, 0.4)',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MessageSquare size={18} color="#25d366" />
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  All website license key applications are automatically routed to WhatsApp Agent <strong style={{ color: '#25d366' }}>{OFFICIAL_AGENT_DISPLAY_PHONE}</strong> with sequential Customer IDs.
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#25d366', fontWeight: '800', background: 'rgba(37, 211, 102, 0.2)', padding: '3px 10px', borderRadius: '10px', border: '1px solid rgba(37, 211, 102, 0.4)' }}>
                🟢 1-Click WhatsApp Key Dispatch Enabled
              </span>
            </div>

            {/* PENDING SELLER CHANGE REQUEST ALERT BANNER */}
            {activeChangeRequest && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.15) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.55)',
                borderRadius: '14px',
                padding: '16px 20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: '260px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <AlertTriangle size={17} color="#fbbf24" />
                      <strong style={{ color: '#fbbf24', fontSize: '13px' }}>
                        Action Required: Seller Profile Modification Request
                      </strong>
                      <span style={{ fontSize: '10px', background: 'rgba(245, 158, 11, 0.35)', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontWeight: '800' }}>
                        PENDING ADMIN APPROVAL
                      </span>
                    </div>

                    <div style={{ color: '#fff', fontSize: '12px', marginTop: '6px' }}>
                      <strong>Customer ID:</strong> <span style={{ fontFamily: 'monospace', color: '#00d2ff', fontWeight: '800' }}>{activeChangeRequest.customerId}</span>
                      <span style={{ margin: '0 8px', color: '#64748b' }}>•</span>
                      <strong>Requested:</strong> {activeChangeRequest.timestamp}
                    </div>

                    <div style={{
                      marginTop: '8px',
                      background: 'rgba(0,0,0,0.45)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      color: '#cbd5e1',
                      fontSize: '12px'
                    }}>
                      "{activeChangeRequest.reason}"
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const matchingClaim = claimedProfiles.find(c => c.customerId === activeChangeRequest.customerId) || {
                          customerId: activeChangeRequest.customerId,
                          sellerName: localStorage.getItem('sidra_user_name') || 'Seller',
                          whatsapp: localStorage.getItem('sidra_user_phone') || '',
                          email: localStorage.getItem('sidra_user_email') || '',
                          city: localStorage.getItem('sidra_user_city') || '',
                          brandName: localStorage.getItem('sidra_brand_name') || localStorage.getItem('sidra_store_name') || '',
                          marketplace: localStorage.getItem('sidra_platform') || 'Amazon India',
                          isLocked: true
                        };
                        handleOpenEditModal(matchingClaim);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        color: '#070d19',
                        border: 'none',
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit3 size={13} /> Review & Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Dismiss this modification request?')) {
                          localStorage.removeItem('sidra_profile_change_request');
                          setActiveChangeRequest(null);
                        }
                      }}
                      style={{
                        background: 'none',
                        border: '1px solid rgba(255,255,255,0.2)',
                        color: '#94a3b8',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE WORKSTATION PROFILE CARD */}
            {(() => {
              const activeCustId = localStorage.getItem('sidra_customer_id') || getOrAssignCustomerId();
              const activeName = localStorage.getItem('sidra_user_name');
              const activePhone = localStorage.getItem('sidra_user_phone');
              const activeEmail = localStorage.getItem('sidra_user_email');
              const activeCity = localStorage.getItem('sidra_user_city');
              const activeBrand = localStorage.getItem('sidra_brand_name') || localStorage.getItem('sidra_store_name');
              const activePlatform = localStorage.getItem('sidra_platform') || 'Amazon India';
              const activeLocked = isProfileLocked();

              if (!activeName && !activePhone && !activeEmail) return null;

              return (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(0, 210, 255, 0.08) 0%, rgba(10, 20, 36, 0.7) 100%)',
                  border: '1px solid rgba(0, 210, 255, 0.35)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '10px', background: 'rgba(0, 210, 255, 0.25)', color: '#00d2ff', padding: '2px 8px', borderRadius: '8px', fontWeight: '800' }}>
                          💻 ACTIVE WORKSTATION
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', color: '#00d2ff' }}>
                          ID: {activeCustId}
                        </span>
                        <strong style={{ fontSize: '14px', color: '#fff' }}>{activeName || 'Current User'}</strong>
                        {activeCity && (
                          <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px' }}>
                            📍 {activeCity}
                          </span>
                        )}
                        {activeBrand && (
                          <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '2px 8px', borderRadius: '10px' }}>
                            🏷️ {activeBrand}
                          </span>
                        )}
                        <span style={{
                          fontSize: '11px',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          background: activeLocked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(37, 211, 102, 0.2)',
                          color: activeLocked ? '#f43f5e' : '#25d366',
                          border: `1px solid ${activeLocked ? 'rgba(244, 63, 94, 0.4)' : 'rgba(37, 211, 102, 0.4)'}`
                        }}>
                          {activeLocked ? '🔒 Locked (One-Time)' : '🔓 Unlocked'}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                        {activePhone && <span><strong>WhatsApp:</strong> {activePhone}</span>}
                        {activeEmail && <span><strong>Email:</strong> {activeEmail}</span>}
                        <span><strong>Marketplace:</strong> {activePlatform}</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal({
                          customerId: activeCustId,
                          sellerName: activeName,
                          whatsapp: activePhone,
                          email: activeEmail,
                          city: activeCity,
                          brandName: activeBrand,
                          marketplace: activePlatform,
                          isLocked: activeLocked
                        })}
                        style={{
                          background: 'rgba(0, 210, 255, 0.15)',
                          border: '1px solid rgba(0, 210, 255, 0.4)',
                          color: '#00d2ff',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <Edit3 size={13} /> Edit Profile
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleLockClaimant({ customerId: activeCustId, sellerName: activeName, isLocked: activeLocked })}
                        style={{
                          background: activeLocked ? 'rgba(37, 211, 102, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                          border: `1px solid ${activeLocked ? 'rgba(37, 211, 102, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                          color: activeLocked ? '#25d366' : '#f43f5e',
                          padding: '7px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {activeLocked ? <Unlock size={13} /> : <Lock size={13} />}
                        {activeLocked ? 'Unlock Profile' : 'Lock Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {claimedProfiles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <UserCheck size={36} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>No Trial Claim Requests Yet</div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>
                  When buyers submit their store profile on the public site, their registered details will appear here with full Admin edit and lock controls.
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {claimedProfiles.map((claim, idx) => {
                  const isItemLocked = claim.customerId === localStorage.getItem('sidra_customer_id')
                    ? isProfileLocked()
                    : (claim.isLocked !== false);

                  return (
                    <div
                      key={claim.id || idx}
                      style={{
                        background: 'rgba(0, 0, 0, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '260px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', fontFamily: 'monospace', background: 'rgba(0, 210, 255, 0.2)', color: '#00d2ff', padding: '3px 9px', borderRadius: '8px', border: '1px solid rgba(0, 210, 255, 0.4)' }}>
                            ID: {claim.customerId || 'SMSSP/110892'}
                          </span>
                          <strong style={{ fontSize: '14px', color: '#fff' }}>{claim.sellerName}</strong>
                          {claim.city && (
                            <span style={{ fontSize: '11px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                              📍 {claim.city}
                            </span>
                          )}
                          <span style={{ fontSize: '11px', background: 'rgba(255, 255, 255, 0.08)', color: '#cbd5e1', padding: '2px 8px', borderRadius: '10px' }}>
                            {claim.brandName}
                          </span>
                          <span style={{
                            fontSize: '11px',
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontWeight: '800',
                            background: isItemLocked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(37, 211, 102, 0.2)',
                            color: isItemLocked ? '#f43f5e' : '#25d366',
                            border: `1px solid ${isItemLocked ? 'rgba(244, 63, 94, 0.4)' : 'rgba(37, 211, 102, 0.4)'}`
                          }}>
                            {isItemLocked ? '🔒 Locked' : '🔓 Unlocked'}
                          </span>
                          <span style={{ fontSize: '10px', color: '#94a3b8' }}>{claim.timestamp}</span>
                        </div>

                        <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                          <span><strong>WhatsApp:</strong> {claim.whatsapp}</span>
                          {claim.email && <span><strong>Email:</strong> {claim.email}</span>}
                          <span><strong>Marketplace:</strong> {claim.marketplace}</span>
                          <span><strong>Plan:</strong> {claim.trialDuration}</span>
                        </div>

                        {claim.changeRequest && (
                          <div style={{
                            marginTop: '8px',
                            background: 'rgba(245, 158, 11, 0.15)',
                            border: '1px solid rgba(245, 158, 11, 0.35)',
                            borderRadius: '8px',
                            padding: '6px 10px',
                            fontSize: '11px',
                            color: '#fbbf24',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}>
                            <AlertTriangle size={13} />
                            <span><strong>Seller Request:</strong> "{claim.changeRequest}" ({claim.changeRequestTime})</span>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(claim)}
                          style={{
                            background: 'rgba(0, 210, 255, 0.15)',
                            border: '1px solid rgba(0, 210, 255, 0.4)',
                            color: '#00d2ff',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          <Edit3 size={13} /> Edit Profile
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleLockClaimant(claim)}
                          style={{
                            background: isItemLocked ? 'rgba(37, 211, 102, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                            border: `1px solid ${isItemLocked ? 'rgba(37, 211, 102, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                            color: isItemLocked ? '#25d366' : '#f43f5e',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '700',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px'
                          }}
                        >
                          {isItemLocked ? <Unlock size={13} /> : <Lock size={13} />}
                          {isItemLocked ? 'Unlock' : 'Lock'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSendKeyToClaimant(claim)}
                          style={{
                            background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: '800',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 10px rgba(37, 211, 102, 0.35)'
                          }}
                        >
                          <MessageSquare size={13} /> 🔑 Send Key
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMMUNITY & OFFICIAL APP UPDATES BROADCAST */}
        {activeSubTab === 'broadcast' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Broadcast Composer */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px', border: '1px solid rgba(0, 210, 255, 0.35)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Radio size={20} color="#00d2ff" />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                    Broadcast Official App Announcement
                  </h3>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(0, 210, 255, 0.15)', color: '#00d2ff', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(0, 210, 255, 0.3)', fontWeight: '700' }}>
                  Admin Broadcast Only • Instant Cross-Tab Sync
                </span>
              </div>

              <div style={{
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '10px',
                padding: '10px 14px',
                marginBottom: '18px',
                fontSize: '12px',
                color: '#fbbf24',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={15} />
                <span><strong>Policy Restriction:</strong> Strictly software releases, marketplace algorithm alerts (Amazon/Flipkart/Meesho), and e-commerce seller notices only. No external marketing or ads.</span>
              </div>

              <form onSubmit={handlePublishBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Announcement Headline / Title *
                    </label>
                    <input
                      type="text"
                      value={bTitle}
                      onChange={(e) => setBTitle(e.target.value)}
                      placeholder="e.g. 🚀 Seller Suite Pro v2.7 Released: New Bulk Keyword Generator"
                      style={{ fontSize: '12px', width: '100%' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Category Tag *
                    </label>
                    <select
                      value={bCategory}
                      onChange={(e) => setBCategory(e.target.value)}
                      style={{ fontSize: '12px', width: '100%' }}
                    >
                      <option value="RELEASE UPDATE">🚀 RELEASE UPDATE (App Features & Tools)</option>
                      <option value="ALGORITHM ALERT">⚠️ ALGORITHM ALERT (Amazon/FK/Meesho)</option>
                      <option value="POLICY NOTICE">📢 POLICY NOTICE (Marketplace Compliance)</option>
                      <option value="SELLER TIP">💡 SELLER TIP (SEO & Margin Strategy)</option>
                      <option value="SYSTEM NOTICE">⚙️ SYSTEM NOTICE (Platform Status)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                    Full Announcement Details & Seller Guidance *
                  </label>
                  <textarea
                    rows={4}
                    value={bContent}
                    onChange={(e) => setBContent(e.target.value)}
                    placeholder="Provide clear details, policy impacts, and instructions for sellers..."
                    style={{ fontSize: '12px', width: '100%', resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr auto', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Action Button Label (Optional)
                    </label>
                    <input
                      type="text"
                      value={bActionLabel}
                      onChange={(e) => setBActionLabel(e.target.value)}
                      placeholder="e.g. Audit Listing LQS, Open Studio"
                      style={{ fontSize: '12px', width: '100%' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Target App Tab (Shortcut)
                    </label>
                    <select
                      value={bActionTab}
                      onChange={(e) => setBActionTab(e.target.value)}
                      style={{ fontSize: '12px', width: '100%' }}
                    >
                      <option value="listing-audit">Tool 4: Listing Quality Audit</option>
                      <option value="image-studio">Tool 2: Pure White Image Studio</option>
                      <option value="listing-ai">Tool 1: High-CTR SEO Generator</option>
                      <option value="rto-calculator">Tool 6: RTO Profit Calculator</option>
                      <option value="marketplace-seo">Tool 5: Marketplace SEO Hub</option>
                      <option value="catalog-converter">Tool 3: Cross-Platform Converter</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '18px' }}>
                    <input
                      type="checkbox"
                      id="bPinnedCheck"
                      checked={bPinned}
                      onChange={(e) => setBPinned(e.target.checked)}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <label htmlFor="bPinnedCheck" style={{ fontSize: '12px', color: '#cbd5e1', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      📌 Pin to Top of Feed
                    </label>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #00d2ff 0%, #0072ff 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 15px rgba(0, 210, 255, 0.3)'
                    }}
                  >
                    <Send size={15} /> Publish Official Broadcast to All Sellers
                  </button>
                </div>
              </form>
            </div>

            {/* Current Broadcast List */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                    Active Broadcast Feed ({officialUpdates.length} Published Updates)
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    These updates appear immediately in the seller public workstation via the "Community & Updates" modal.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset official feed back to standard default app notices?')) {
                      localStorage.removeItem('sidra_official_app_updates');
                      window.location.reload();
                    }
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    color: '#f43f5e',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}
                >
                  Reset to Defaults
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {officialUpdates.map(upd => (
                  <div
                    key={upd.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${upd.pinned ? 'rgba(0, 210, 255, 0.5)' : 'rgba(255, 255, 255, 0.08)'}`,
                      borderRadius: '14px',
                      padding: '16px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: '800',
                          color: upd.categoryColor || '#00d2ff',
                          background: `${upd.categoryColor || '#00d2ff'}22`,
                          border: `1px solid ${upd.categoryColor || '#00d2ff'}55`,
                          padding: '2px 8px',
                          borderRadius: '6px'
                        }}>
                          {upd.category}
                        </span>
                        {upd.pinned && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            color: '#00d2ff',
                            background: 'rgba(0, 210, 255, 0.15)',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <Pin size={10} /> PINNED
                          </span>
                        )}
                        <span style={{ fontSize: '11px', color: '#64748b' }}>• {upd.date}</span>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>• By {upd.author}</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => handleTogglePinBroadcast(upd.id)}
                          title={upd.pinned ? 'Unpin Announcement' : 'Pin to Top'}
                          style={{
                            background: upd.pinned ? 'rgba(0, 210, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: upd.pinned ? '#00d2ff' : '#cbd5e1',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Pin size={12} /> {upd.pinned ? 'Unpin' : 'Pin'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteBroadcast(upd.id)}
                          title="Delete Broadcast"
                          style={{
                            background: 'rgba(244, 63, 94, 0.15)',
                            border: '1px solid rgba(244, 63, 94, 0.3)',
                            color: '#f43f5e',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '11px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>

                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#fff', margin: 0 }}>
                      {upd.title}
                    </h4>

                    <p style={{ fontSize: '12px', color: '#cbd5e1', margin: 0, lineHeight: 1.55 }}>
                      {upd.content}
                    </p>

                    {upd.actionLabel && (
                      <div style={{ fontSize: '11px', color: '#00d2ff', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <span>Attached Action: <strong>{upd.actionLabel}</strong></span>
                        <span style={{ color: '#64748b' }}>({upd.actionTab})</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SECURITY & MASTER PASSWORD SETTINGS */}
        {activeSubTab === 'settings' && (
          <div className="glass-panel" style={{ maxWidth: '480px', padding: '26px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
              Change Master Security Password
            </h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
              Current Master Password is: <strong style={{ color: '#10b981' }}>Active & Hashed (Salted SHA-256 Vault)</strong>. You can update it below.
            </p>

            <form onSubmit={handleUpdatePin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                  New Master Password (4+ Characters)
                </label>
                <input
                  type="password"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new Master Password"
                  style={{ width: '100%', fontSize: '13px', textAlign: 'center', letterSpacing: '2px' }}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                  Confirm New Master Password
                </label>
                <input
                  type="password"
                  value={confirmNewPin}
                  onChange={(e) => setConfirmNewPin(e.target.value)}
                  placeholder="Repeat new Master Password"
                  style={{ width: '100%', fontSize: '13px', textAlign: 'center', letterSpacing: '2px' }}
                  required
                />
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: '#070d19',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '800',
                  cursor: 'pointer'
                }}
              >
                Save Master Password
              </button>
            </form>
          </div>
        )}

        {/* TAB 6: GOOGLE ADSENSE & SITE MONETIZATION DESK */}
        {activeSubTab === 'monetization' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Top Overview & Status Banner */}
            <div className="glass-panel" style={{
              padding: '24px',
              borderRadius: '18px',
              border: '1px solid rgba(0, 210, 255, 0.35)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 20, 36, 0.95) 100%)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#070d19'
                  }}>
                    <DollarSign size={26} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#fff', margin: 0 }}>
                      Google AdSense & Website Monetization Desk
                    </h3>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                      Monetize traffic on <strong style={{ color: '#25d366' }}>https://sellersuitepro.online</strong> with High-CPM Banner, In-feed & Anchor Ads
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: adConfigState.adsEnabled ? 'rgba(37, 211, 102, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                    border: `1px solid ${adConfigState.adsEnabled ? '#25d366' : '#f43f5e'}`,
                    color: adConfigState.adsEnabled ? '#25d366' : '#f43f5e',
                    fontSize: '11px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: adConfigState.adsEnabled ? '#25d366' : '#f43f5e' }}></span>
                    {adConfigState.adsEnabled ? 'MONETIZATION ACTIVE 🟢' : 'ADS PAUSED 🛑'}
                  </span>

                  <a
                    href="https://sellersuitepro.online/ads.txt"
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      background: 'rgba(0, 210, 255, 0.15)',
                      border: '1px solid rgba(0, 210, 255, 0.4)',
                      color: '#00d2ff',
                      fontSize: '11px',
                      fontWeight: '700',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <span>View ads.txt</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* 3 Active Ad Slots Visual Badges */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '20px' }}>
                <div className="glass-card" style={{ padding: '12px 16px', border: '1px solid rgba(0, 210, 255, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>Slot 1: Top Leaderboard</span>
                    <span style={{ fontSize: '10px', color: '#25d366', fontWeight: '800' }}>728x90 Auto</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '800', marginTop: '4px' }}>
                    Header Nav Below Placement
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    100% viewability on tool switch & page load
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px 16px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>Slot 2: In-Workspace Feed</span>
                    <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: '800' }}>Native Responsive</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '800', marginTop: '4px' }}>
                    Mid-Content High Engagement
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    Directly below tool generator outputs
                  </div>
                </div>

                <div className="glass-card" style={{ padding: '12px 16px', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>Slot 3: Floating Sticky Footer</span>
                    <span style={{ fontSize: '10px', color: '#a855f7', fontWeight: '800' }}>Anchor 100% CPM</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#fff', fontWeight: '800', marginTop: '4px' }}>
                    Fixed Bottom Viewport Anchor
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
                    Continuous impressions while sellers work
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form & Setup Guide Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(360px, 1.2fr)', gap: '22px' }}>
              {/* Left Column: Form Settings */}
              <div className="glass-panel" style={{ padding: '24px', borderRadius: '18px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
                  ⚙️ Google AdSense Publisher Settings
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                  Paste your real AdSense Publisher ID here to link all ads to your Google account.
                </p>

                <form onSubmit={handleSaveAdSettings} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Master Toggle */}
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>Show Ads Across Entire Site</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Turn off anytime to run 100% ad-free</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAdsActiveToggle(!adsActiveToggle)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: adsActiveToggle ? '#25d366' : '#64748b',
                        color: '#070d19',
                        fontWeight: '800',
                        fontSize: '11px',
                        cursor: 'pointer'
                      }}
                    >
                      {adsActiveToggle ? 'ENABLED ✓' : 'PAUSED ✕'}
                    </button>
                  </div>

                  {/* Publisher ID Input */}
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Google AdSense Publisher ID (ca-pub-XXXXXXXXXX) *</span>
                      <span style={{ color: '#00d2ff' }}>Required</span>
                    </label>
                    <input
                      type="text"
                      value={pubIdInput}
                      onChange={(e) => setPubIdInput(e.target.value)}
                      placeholder="e.g. ca-pub-1234567890123456"
                      style={{
                        width: '100%',
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        color: pubIdInput.includes('XXXX') ? '#f59e0b' : '#25d366'
                      }}
                    />
                    <div style={{ fontSize: '10px', color: pubIdInput.includes('XXXX') ? '#f59e0b' : '#25d366', marginTop: '4px' }}>
                      {pubIdInput.includes('XXXX')
                        ? '⚠️ Currently in demo mode. Replace with your real Publisher ID from AdSense.'
                        : '✓ Real Google AdSense ID active! Ads are linked to your account.'}
                    </div>
                  </div>

                  {/* Slot IDs (Optional) */}
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: '#cbd5e1', display: 'block', marginBottom: '10px' }}>
                      Custom Ad Slot IDs (Optional - for manual ad units):
                    </span>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div>
                        <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                          Top Leaderboard Slot ID
                        </label>
                        <input
                          type="text"
                          value={topSlotInput}
                          onChange={(e) => setTopSlotInput(e.target.value)}
                          placeholder="e.g. 1234567890 (or leave blank for Auto)"
                          style={{ width: '100%', fontSize: '11px', padding: '8px 10px' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                          In-Feed Mid-Content Slot ID
                        </label>
                        <input
                          type="text"
                          value={inFeedSlotInput}
                          onChange={(e) => setInFeedSlotInput(e.target.value)}
                          placeholder="e.g. 9876543210 (or leave blank for Auto)"
                          style={{ width: '100%', fontSize: '11px', padding: '8px 10px' }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '10px', color: '#94a3b8', display: 'block', marginBottom: '3px' }}>
                          Sticky Footer Anchor Slot ID
                        </label>
                        <input
                          type="text"
                          value={footerSlotInput}
                          onChange={(e) => setFooterSlotInput(e.target.value)}
                          placeholder="e.g. 5678901234 (or leave blank for Auto)"
                          style={{ width: '100%', fontSize: '11px', padding: '8px 10px' }}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      background: 'linear-gradient(135deg, #25d366 0%, #00d2ff 100%)',
                      color: '#070d19',
                      border: 'none',
                      padding: '13px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      marginTop: '8px',
                      boxShadow: '0 4px 18px rgba(0, 210, 255, 0.3)'
                    }}
                  >
                    💾 Save AdSense & Monetization Settings
                  </button>
                </form>
              </div>

              {/* Right Column: Step-by-Step Hindi Guide & Instant Monetization */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Hindi Step-by-step setup guide */}
                <div className="glass-panel" style={{ padding: '22px', borderRadius: '18px', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '800', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <Sparkles size={16} /> Google AdSense से पैसे कमाने के 4 आसान स्टेप्स:
                  </h4>

                  <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px', color: '#e2e8f0', lineHeight: '1.5' }}>
                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #00d2ff' }}>
                      <strong style={{ color: '#00d2ff' }}>Step 1: AdSense पर अकाउंट बनाएं</strong>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>
                        👉 <a href="https://adsense.google.com/" target="_blank" rel="noreferrer" style={{ color: '#00d2ff', textDecoration: 'underline' }}>adsense.google.com</a> खोलें और अपने Gmail से Sign Up / Login करें।
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #25d366' }}>
                      <strong style={{ color: '#25d366' }}>Step 2: अपनी साइट जोड़ें (Add Site)</strong>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>
                        AdSense में "Sites" पर क्लिक करें ➔ "New Site" दबाएं ➔ URL में <strong>https://sellersuitepro.online</strong> डालें।
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #fbbf24' }}>
                      <strong style={{ color: '#fbbf24' }}>Step 3: अपना Publisher ID यहां पेस्ट करें</strong>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>
                        AdSense आपको <strong>ca-pub-XXXXXXXXXX</strong> देगा। उसे कॉपी करके बायीं तरफ वाले बॉक्स में पेस्ट करके "Save" कर दें।
                      </div>
                    </div>

                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 14px', borderRadius: '10px', borderLeft: '3px solid #a855f7' }}>
                      <strong style={{ color: '#a855f7' }}>Step 4: ads.txt पहले से लाइव है!</strong>
                      <div style={{ color: '#94a3b8', marginTop: '2px' }}>
                        आपकी साइट पर <strong>sellersuitepro.online/ads.txt</strong> पहले से तैयार है। Google 24-48 घंटों में अप्रूव कर देगा और विज्ञापन शुरू हो जाएंगे।
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instant Monetization Network (No Waiting) */}
                <div className="glass-panel" style={{ padding: '20px', borderRadius: '18px', border: '1px solid rgba(37, 211, 102, 0.35)' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#25d366', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={16} /> बिना इंतजार तुरंत कमाई शुरू करनी है? (Instant Approval)
                  </h4>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', lineHeight: '1.4' }}>
                    AdSense में 2-3 दिन लग सकते हैं। अगर आपको आज ही से डॉलर या रुपये कमाने हैं, तो आप इन 100% Instant Approval नेटवर्क्स का इस्तेमाल भी कर सकते हैं:
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                    <a
                      href="https://monetag.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(0, 210, 255, 0.3)',
                        textDecoration: 'none',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#00d2ff' }}>1. Monetag</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>Instant 1-min Approval • Bank / PayPal payout</div>
                    </a>

                    <a
                      href="https://adsterra.com/"
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(244, 63, 94, 0.3)',
                        textDecoration: 'none',
                        color: '#fff',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                    >
                      <div style={{ fontSize: '12px', fontWeight: '800', color: '#f43f5e' }}>2. Adsterra</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8' }}>High CPM Banners • ₹800+ minimum threshold</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: ADMIN SELLER PROFILE EDIT & LOCK CONTROL */}
        {editingClaim && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(12px)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div className="glass-panel" style={{
              maxWidth: '560px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '28px',
              borderRadius: '22px',
              border: '1px solid rgba(245, 158, 11, 0.5)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 158, 11, 0.25)'
            }}>
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#070d19',
                    padding: '8px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Edit3 size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#fff' }}>
                      Admin Profile Management & Modification
                    </h3>
                    <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                      Edit verified seller details and toggle lock status directly
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setEditingClaim(null)}
                  style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                >
                  <X size={15} />
                </button>
              </div>

              {/* Customer ID info bar */}
              <div style={{
                background: 'rgba(0, 210, 255, 0.1)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: '#cbd5e1' }}>Bound Customer ID:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '800', color: '#00d2ff', fontSize: '13px' }}>
                  {editFormData.customerId}
                </span>
              </div>

              {/* Form Fields */}
              <form onSubmit={(e) => handleSaveClaimantEdit(e, false)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editFormData.sellerName}
                    onChange={(e) => setEditFormData({ ...editFormData, sellerName: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={editFormData.whatsapp}
                      onChange={(e) => setEditFormData({ ...editFormData, whatsapp: e.target.value })}
                      placeholder="e.g. 919876543210"
                      style={{ width: '100%', fontSize: '13px' }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      City *
                    </label>
                    <input
                      type="text"
                      value={editFormData.city}
                      onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                      placeholder="e.g. Mumbai, Surat"
                      style={{ width: '100%', fontSize: '13px' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    placeholder="e.g. seller@brand.com"
                    style={{ width: '100%', fontSize: '13px' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Brand / Store Name
                    </label>
                    <input
                      type="text"
                      value={editFormData.brandName}
                      onChange={(e) => setEditFormData({ ...editFormData, brandName: e.target.value })}
                      placeholder="e.g. Apex Mart"
                      style={{ width: '100%', fontSize: '13px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: '700', color: '#cbd5e1', marginBottom: '4px', display: 'block' }}>
                      Marketplace
                    </label>
                    <select
                      value={editFormData.marketplace}
                      onChange={(e) => setEditFormData({ ...editFormData, marketplace: e.target.value })}
                      style={{ width: '100%', fontSize: '13px', background: '#0a1628', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', padding: '10px', borderRadius: '10px' }}
                    >
                      <option value="Amazon India">Amazon India</option>
                      <option value="Flipkart">Flipkart</option>
                      <option value="Meesho">Meesho</option>
                      <option value="Myntra">Myntra</option>
                      <option value="JioMart">JioMart</option>
                      <option value="Etsy">Etsy</option>
                      <option value="Shopify">Shopify</option>
                    </select>
                  </div>
                </div>

                {/* Lock Status Control */}
                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginTop: '4px'
                }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'block' }}>
                    Profile Lock Status (Seller Permissions)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, isLocked: true })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: editFormData.isLocked ? '2px solid #f43f5e' : '1px solid rgba(255,255,255,0.15)',
                        background: editFormData.isLocked ? 'rgba(244, 63, 94, 0.2)' : 'rgba(0,0,0,0.3)',
                        color: editFormData.isLocked ? '#f43f5e' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Lock size={14} /> 🔒 Locked (One-Time)
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, isLocked: false })}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: !editFormData.isLocked ? '2px solid #25d366' : '1px solid rgba(255,255,255,0.15)',
                        background: !editFormData.isLocked ? 'rgba(37, 211, 102, 0.2)' : 'rgba(0,0,0,0.3)',
                        color: !editFormData.isLocked ? '#25d366' : '#94a3b8',
                        fontWeight: '700',
                        fontSize: '11px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Unlock size={14} /> 🔓 Unlocked (Editable)
                    </button>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
                    {editFormData.isLocked
                      ? 'When locked, the seller cannot modify their details and must submit an Admin request.'
                      : 'When unlocked, the seller can update their profile from their workstation.'}
                  </div>
                </div>

                {/* Modal Buttons */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                      color: '#070d19',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Save size={15} /> Save & Apply Changes
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleSaveClaimantEdit(e, true)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)',
                      color: '#fff',
                      border: 'none',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <MessageSquare size={15} /> Save & Notify via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
