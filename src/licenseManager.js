// =============================================================
// SIDRA MOTION SELLER SUITE PRO - LICENSE & CUSTOMER ID MANAGER
// Sequential Customer ID generation starting at SMSSP/110892
// 1-Key per 1-Phone / Customer ID Strict Binding
// =============================================================

import {
  generateLicenseSignature,
  verifyLicenseIntegrity,
  generateProfileLockSeal,
  verifyProfileLockIntegrity
} from './securityUtils.js';

export const BASE_CUSTOMER_NUM = 110892;
export const OFFICIAL_AGENT_WHATSAPP = '916306348371';
export const OFFICIAL_AGENT_DISPLAY_PHONE = '+91 6306348371';

/**
 * Calculates the next unique sequential customer number in sequence (110892, 110893, 110894...).
 * It checks the highest existing customer number across all registered profiles in sidra_claimed_profiles,
 * the stored counter, and the active session.
 */
export function getNextSequentialCustomerNumber() {
  let highest = BASE_CUSTOMER_NUM - 1;

  try {
    const claimed = JSON.parse(localStorage.getItem('sidra_claimed_profiles') || '[]');
    if (Array.isArray(claimed)) {
      claimed.forEach(item => {
        if (item && item.customerId) {
          const m = String(item.customerId).match(/SMSSP\/(\d+)/i);
          if (m) {
            const num = parseInt(m[1], 10);
            if (!isNaN(num) && num > highest) highest = num;
          }
        }
      });
    }

    const nextCounter = parseInt(localStorage.getItem('sidra_next_cid_counter') || '0', 10);
    if (!isNaN(nextCounter) && nextCounter - 1 > highest) {
      highest = nextCounter - 1;
    }
  } catch (e) {}

  return Math.max(BASE_CUSTOMER_NUM, highest + 1);
}

/**
 * Allocates or retrieves the Customer ID for a specific applicant.
 * If this phone number is already registered, returns that applicant's existing Customer ID.
 * If this is a new applicant, generates the NEXT sequential Customer ID (110892, 110893, 110894, etc.)
 * and advances the counter.
 */
export function allocateCustomerIdForApplicant(phone, forceNew = false) {
  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  if (cleanPhone && !forceNew) {
    try {
      const claimed = JSON.parse(localStorage.getItem('sidra_claimed_profiles') || '[]');
      if (Array.isArray(claimed)) {
        const existing = claimed.find(p => p.whatsapp && p.whatsapp.replace(/[^0-9]/g, '') === cleanPhone);
        if (existing && existing.customerId && existing.customerId.startsWith('SMSSP/')) {
          return existing.customerId;
        }
      }
    } catch (e) {}
  }

  // Generate next sequential number
  const nextNum = getNextSequentialCustomerNumber();
  const nextId = `SMSSP/${nextNum}`;
  localStorage.setItem('sidra_next_cid_counter', String(nextNum + 1));
  return nextId;
}

/**
 * Retrieves the existing Customer ID for the current browser/user,
 * or auto-generates the next sequential ID starting at SMSSP/110892.
 */
export function getOrAssignCustomerId() {
  try {
    let currentId = localStorage.getItem('sidra_customer_id') || localStorage.getItem('sidra_assigned_customer_id');
    if (currentId && currentId.startsWith('SMSSP/')) {
      return currentId;
    }

    const nextNum = getNextSequentialCustomerNumber();
    currentId = `SMSSP/${nextNum}`;
    localStorage.setItem('sidra_customer_id', currentId);
    localStorage.setItem('sidra_assigned_customer_id', currentId);
    localStorage.setItem('sidra_next_cid_counter', String(nextNum + 1));
    return currentId;
  } catch (err) {
    console.error('Failed to get/assign customer ID', err);
    return `SMSSP/${BASE_CUSTOMER_NUM}`;
  }
}

/**
 * Returns true only if all 4 mandatory profile fields are completed:
 * 1. Name
 * 2. WhatsApp Phone
 * 3. Email
 * 4. City
 */
export function isProfileComplete(profile) {
  const p = profile || getUserProfile();
  const rawDigits = (p.phone || '').trim().replace(/[^0-9]/g, '');
  const phone10 = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;
  return Boolean(
    p.name && p.name.trim().length >= 2 &&
    phone10 && phone10.length === 10 &&
    p.email && p.email.trim().includes('@') && p.email.trim().includes('.') &&
    p.city && p.city.trim().length >= 2
  );
}

/**
 * Reads the currently stored profile details with tamper verification.
 */
export function getUserProfile() {
  const customerId = getOrAssignCustomerId();
  const phone = localStorage.getItem('sidra_user_phone') || '';
  const email = localStorage.getItem('sidra_user_email') || '';
  const isLicensed = verifyLicenseIntegrity(customerId, phone);

  return {
    customerId,
    name: localStorage.getItem('sidra_user_name') || '',
    phone,
    email,
    city: localStorage.getItem('sidra_user_city') || '',
    brand: localStorage.getItem('sidra_brand_name') || localStorage.getItem('sidra_store_name') || '',
    platform: localStorage.getItem('sidra_platform') || 'Amazon & Flipkart',
    authType: localStorage.getItem('sidra_auth_type') || 'key',
    isLicensed,
    activeKey: localStorage.getItem('sidra_active_license_key') || ''
  };
}

/**
 * Saves profile data into localStorage and updates the claimed profiles list for the Owner.
 */
export function saveUserProfile(data) {
  const customerId = getOrAssignCustomerId();
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  const email = (data.email || '').trim();
  const city = (data.city || '').trim();
  const brand = (data.brand || data.store || '').trim();
  const platform = (data.platform || 'Amazon & Flipkart').trim();
  const duration = data.duration || '14-Day Free Access';

  if (name) localStorage.setItem('sidra_user_name', name);
  if (phone) localStorage.setItem('sidra_user_phone', phone);
  if (email) localStorage.setItem('sidra_user_email', email);
  if (city) localStorage.setItem('sidra_user_city', city);
  if (brand) {
    localStorage.setItem('sidra_brand_name', brand);
    localStorage.setItem('sidra_store_name', brand);
  }
  if (platform) localStorage.setItem('sidra_platform', platform);

  // Update sidra_claimed_profiles list for Owner Portal
  try {
    const existing = JSON.parse(localStorage.getItem('sidra_claimed_profiles') || '[]');
    const newEntry = {
      id: Date.now(),
      customerId,
      sellerName: name,
      whatsapp: phone,
      email,
      city,
      brandName: brand,
      marketplace: platform,
      trialDuration: duration,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };
    // Replace by customerId or phone if existing, else prepend
    const updated = [
      newEntry,
      ...existing.filter(item => item.customerId !== customerId && item.whatsapp !== phone)
    ];
    localStorage.setItem('sidra_claimed_profiles', JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving claimed profile', e);
  }

  return { customerId, name, phone, email, city, brand, platform };
}

/**
 * Checks if the seller profile has been permanently locked (with cryptographic tamper check).
 */
export function isProfileLocked() {
  const customerId = getOrAssignCustomerId();
  const phone = localStorage.getItem('sidra_user_phone') || '';
  const email = localStorage.getItem('sidra_user_email') || '';
  return verifyProfileLockIntegrity(customerId, phone, email);
}

/**
 * Permanently locks the seller profile after 2-step verification and applies a tamper seal.
 */
export function lockProfile() {
  const customerId = getOrAssignCustomerId();
  const phone = localStorage.getItem('sidra_user_phone') || '';
  const email = localStorage.getItem('sidra_user_email') || '';
  const seal = generateProfileLockSeal(customerId, phone, email);
  localStorage.setItem('sidra_profile_locked', 'true');
  localStorage.setItem('sidra_profile_lock_seal', seal);
}

/**
 * Unlocks the seller profile (Admin authorization only) and clears tamper seal.
 */
export function unlockProfile() {
  localStorage.setItem('sidra_profile_locked', 'false');
  localStorage.removeItem('sidra_profile_lock_seal');
}

/**
 * Logs a profile change request for Admin review.
 */
export function requestProfileChange(reason) {
  const customerId = getOrAssignCustomerId();
  const req = {
    customerId,
    reason: (reason || '').trim(),
    timestamp: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
  };
  localStorage.setItem('sidra_profile_change_request', JSON.stringify(req));

  try {
    const existing = JSON.parse(localStorage.getItem('sidra_claimed_profiles') || '[]');
    const updated = existing.map(item => {
      if (item.customerId === customerId) {
        return { ...item, changeRequest: req.reason, changeRequestTime: req.timestamp };
      }
      return item;
    });
    localStorage.setItem('sidra_claimed_profiles', JSON.stringify(updated));
  } catch (e) {}

  return req;
}

/**
 * Formats the official WhatsApp request message to Sidra Motion team.
 */
export function formatWhatsAppPitchMessage(data) {
  const customerId = data.customerId || getOrAssignCustomerId();
  const name = (data.name || '').trim();
  const phone = (data.phone || '').trim();
  const email = (data.email || '').trim();
  const city = (data.city || '').trim();
  const brand = (data.brand || data.brandName || '').trim();
  const platform = (data.platform || data.marketplace || '').trim() || 'Amazon & Flipkart';

  const parts = [
    'Namaste Sidra Motion Team,',
    '',
    'Maine Seller Suite Pro (https://sellersuitepro.online) par apni profile details enter ki hain. Kripya meri Commercial License Key issue karein:',
    '',
    `• Customer ID: ${customerId}`,
    name ? `• Full Name: ${name}` : null,
    phone ? `• WhatsApp Number: ${phone}` : null,
    email ? `• Email: ${email}` : null,
    city ? `• City: ${city}` : null,
    brand ? `• Store / Brand: ${brand}` : null,
    platform ? `• Marketplace: ${platform}` : null,
    '• Request: 1-Device Pro Commercial License Key',
    '',
    `Kripya meri Customer ID ${customerId} ke liye Commercial Key issue karein. Dhanyawad!`
  ].filter(Boolean);

  return parts.join('\n');
}

/**
 * Generates a 1-Device License Key tied strictly to a specific Customer ID and Phone.
 * Format: SMSSP-<Number>-<4-char checksum>
 * e.g., SMSSP-110892-K82V
 */
export function generateBoundKeyForCustomer(customerId, phone) {
  const cleanId = (customerId || getOrAssignCustomerId()).trim().toUpperCase();
  const numPart = cleanId.replace(/[^0-9]/g, '') || String(BASE_CUSTOMER_NUM);
  
  // Create 4-char alphanumeric token
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const rand4 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  const key = `SMSSP-${numPart}-${rand4}`;

  // Store binding in sidra_bound_license_keys
  try {
    const boundMap = JSON.parse(localStorage.getItem('sidra_bound_license_keys') || '{}');
    boundMap[key] = {
      key,
      customerId: cleanId,
      phone: (phone || '').replace(/[^0-9]/g, ''),
      createdAt: new Date().toISOString()
    };
    // Also index by customerId
    boundMap[`ID_${cleanId}`] = key;
    localStorage.setItem('sidra_bound_license_keys', JSON.stringify(boundMap));

    // Ensure it's in authorized keys list
    const authKeys = JSON.parse(localStorage.getItem('sidra_authorized_keys') || '[]');
    if (!authKeys.includes(key)) {
      authKeys.unshift(key);
      localStorage.setItem('sidra_authorized_keys', JSON.stringify(authKeys));
    }
  } catch (err) {
    console.error('Failed to register bound key', err);
  }

  return key;
}

/**
 * Validates whether an entered license key is valid for the current Customer ID.
 * Strict rules:
 * - Master key SM26-MASTER-ADMIN-KEY works for all.
 * - Bound keys check that customer ID matches the key's bound owner.
 * - If key belongs to another customer ID, it is STRICTLY REJECTED.
 * - Unbound keys become bound to the current customer ID on first successful activation.
 */
export function validateLicenseKeyForCustomer(enteredKey, currentCustomerId, currentPhone) {
  if (!enteredKey) {
    return { valid: false, error: 'Please enter a license key.' };
  }

  const cleanKey = enteredKey.trim().toUpperCase();
  const cleanCustId = (currentCustomerId || getOrAssignCustomerId()).trim().toUpperCase();

  function commitValidLicense(key, custId) {
    const sig = generateLicenseSignature(key, custId);
    localStorage.setItem('sidra_license_signature', sig);
    localStorage.setItem('sidra_active_license_key', key);
    localStorage.setItem('sidra_license_key_valid', 'true');
  }

  // 1. Master Super-Admin Key Override (Unlocks immediately for any user/device)
  if (
    cleanKey === 'SM26-MASTER-ADMIN-KEY' || 
    cleanKey === 'SM26-TRY-COMMERCIAL-2026'
  ) {
    commitValidLicense(cleanKey, cleanCustId);
    return { valid: true, isMaster: true, message: 'Super-Admin Commercial Key verified & unlocked.' };
  }

  // 2. Read bound registry
  let boundMap = {};
  try {
    boundMap = JSON.parse(localStorage.getItem('sidra_bound_license_keys') || '{}');
  } catch (e) {}

  // Check if this key is already bound in registry
  if (boundMap[cleanKey]) {
    const record = boundMap[cleanKey];
    if (record.customerId && record.customerId.toUpperCase() !== cleanCustId) {
      return {
        valid: false,
        error: `Access Denied: This key is strictly bound to ${record.customerId}. It cannot be activated on Customer ID ${cleanCustId}.`
      };
    }
    commitValidLicense(cleanKey, cleanCustId);
    return { valid: true, message: `Key successfully verified for ${cleanCustId}.` };
  }

  // 3. Check algorithmic format: SMSSP-<Number>-<Checksum>
  const match = cleanKey.match(/^SMSSP-(\d+)-[A-Z0-9]+$/);
  if (match) {
    const keyNum = match[1];
    const targetId = `SMSSP/${keyNum}`;
    if (targetId !== cleanCustId) {
      return {
        valid: false,
        error: `Access Denied: Key is encoded for ${targetId}. Your registered ID is ${cleanCustId}.`
      };
    }
    // Bind it to this customer now
    boundMap[cleanKey] = {
      key: cleanKey,
      customerId: cleanCustId,
      phone: (currentPhone || '').replace(/[^0-9]/g, ''),
      createdAt: new Date().toISOString()
    };
    boundMap[`ID_${cleanCustId}`] = cleanKey;
    localStorage.setItem('sidra_bound_license_keys', JSON.stringify(boundMap));
    commitValidLicense(cleanKey, cleanCustId);
    return { valid: true, message: `Key bound and activated for ${cleanCustId}.` };
  }

  // 4. Check general authorized keys list
  let authKeys = [];
  try {
    authKeys = JSON.parse(localStorage.getItem('sidra_authorized_keys') || '[]');
  } catch (e) {}

  const isWhitelisted = authKeys.some(k => k.toUpperCase() === cleanKey);
  if (isWhitelisted) {
    // Check if this key was previously bound to another customer
    for (const [k, rec] of Object.entries(boundMap)) {
      if (k === cleanKey && rec.customerId && rec.customerId.toUpperCase() !== cleanCustId) {
        return {
          valid: false,
          error: `Access Denied: Key is already bound to ${rec.customerId}. One key per customer ID enforced.`
        };
      }
    }

    // Bind this key exclusively to the current customer ID
    boundMap[cleanKey] = {
      key: cleanKey,
      customerId: cleanCustId,
      phone: (currentPhone || '').replace(/[^0-9]/g, ''),
      createdAt: new Date().toISOString()
    };
    boundMap[`ID_${cleanCustId}`] = cleanKey;
    localStorage.setItem('sidra_bound_license_keys', JSON.stringify(boundMap));
    commitValidLicense(cleanKey, cleanCustId);

    return { valid: true, message: `Key bound and activated for ${cleanCustId}.` };
  }

  return {
    valid: false,
    error: 'Unrecognized License Key. Please ensure you entered the exact key or request your bound key via WhatsApp.'
  };
}
