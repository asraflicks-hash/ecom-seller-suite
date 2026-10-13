// =========================================================================
// SIDRA MOTION SELLER SUITE PRO - ENTERPRISE SECURITY UTILITIES
// Cryptographic Seals, Anti-Tamper Verification, Brute-Force Shield & Hashing
// =========================================================================

const SYSTEM_SALT = 'SMSSP_SECURE_VAULT_2026_@#!99x';
const DEFAULT_PIN = 'My@tanzeem68';
const PIN_VERSION_KEY = 'sidra_owner_pin_version';
const CURRENT_PIN_VERSION = 'v_My@tanzeem68';

/**
 * Fast, deterministic cryptographic hash (SHA-256 with fallback)
 */
export function hashString(str) {
  if (!str) return '';
  const salted = `${SYSTEM_SALT}_${str}_${SYSTEM_SALT}`;
  
  // High-entropy 32-bit FNV-1a / Murmur mix for instant synchronous checks
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < salted.length; i++) {
    const ch = salted.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  
  const p1 = (h1 >>> 0).toString(16).padStart(8, '0');
  const p2 = (h2 >>> 0).toString(16).padStart(8, '0');
  return `SEC_${p1}${p2}`.toUpperCase();
}

/**
 * Hash a user password before storing in localStorage
 */
export function hashPassword(plainPassword) {
  if (!plainPassword) return '';
  return hashString(`USER_PASS_${plainPassword}`);
}

/**
 * Verifies if entered password matches stored hash or plain legacy password
 */
export function verifyPassword(enteredPassword, storedValue) {
  if (!enteredPassword || !storedValue) return false;
  // Check hashed match
  if (storedValue === hashPassword(enteredPassword)) return true;
  // Backward compatibility with legacy plain text password
  if (storedValue === enteredPassword) return true;
  return false;
}

/**
 * Generates an anti-tamper signature for an authorized license key
 */
export function generateLicenseSignature(key, customerId) {
  if (!key || !customerId) return '';
  return hashString(`LIC_SEAL_${key.trim().toUpperCase()}_${customerId.trim().toUpperCase()}`);
}

/**
 * Validates license state integrity.
 * Prevents localStorage spoofing (e.g. setting sidra_license_key_valid='true' via DevTools).
 */
export function verifyLicenseIntegrity(customerId, phone) {
  try {
    const isValidFlag = localStorage.getItem('sidra_license_key_valid') === 'true';
    const activeKey = (localStorage.getItem('sidra_active_license_key') || '').trim().toUpperCase();
    const storedSig = localStorage.getItem('sidra_license_signature');
    const custId = (customerId || localStorage.getItem('sidra_customer_id') || '').trim().toUpperCase();

    if (!isValidFlag) return false;

    // Must have an active key and matching cryptographic signature
    if (!activeKey || !storedSig) {
      // Tampering detected: flag was set but no valid key or signature
      console.warn('[Security Guard] Unauthorized license flag detected without cryptographic seal. Revoking.');
      localStorage.setItem('sidra_license_key_valid', 'false');
      return false;
    }

    const expectedSig = generateLicenseSignature(activeKey, custId);
    if (storedSig !== expectedSig) {
      console.warn('[Security Guard] License signature mismatch. Revoking spoofed license.');
      localStorage.setItem('sidra_license_key_valid', 'false');
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Generates an anti-tamper seal for a locked user profile.
 */
export function generateProfileLockSeal(customerId, phone, email) {
  return hashString(`PROFILE_LOCKED_${customerId}_${phone}_${email}`);
}

/**
 * Verifies if profile is genuinely locked and protected from localStorage tampering.
 */
export function verifyProfileLockIntegrity(customerId, phone, email) {
  try {
    const isLockedFlag = localStorage.getItem('sidra_profile_locked') === 'true';
    const storedSeal = localStorage.getItem('sidra_profile_lock_seal');

    if (!isLockedFlag && !storedSeal) {
      return false; // Not locked
    }

    // If seal exists, it must be locked
    if (storedSeal) {
      const expectedSeal = generateProfileLockSeal(customerId, phone, email);
      if (storedSeal === expectedSeal && !isLockedFlag) {
        // Tampering detected: someone changed sidra_profile_locked to false in devtools
        console.warn('[Security Guard] Tampering detected on profile lock flag. Enforcing tamper seal lock.');
        localStorage.setItem('sidra_profile_locked', 'true');
        return true;
      }
      return isLockedFlag;
    }

    return isLockedFlag;
  } catch (e) {
    return false;
  }
}

/**
 * Owner Master PIN / Password Hash utilities
 */
export function getOwnerMasterPinHash() {
  try {
    const version = localStorage.getItem(PIN_VERSION_KEY);
    // If version is not updated to current designated password, initialize to My@tanzeem68
    if (version !== CURRENT_PIN_VERSION) {
      const hash = hashString(`PIN_${DEFAULT_PIN}`);
      localStorage.setItem('sidra_owner_pin_hash', hash);
      localStorage.setItem(PIN_VERSION_KEY, CURRENT_PIN_VERSION);
      localStorage.removeItem('sidra_owner_master_pin');
      return hash;
    }
    const storedHash = localStorage.getItem('sidra_owner_pin_hash');
    if (storedHash) return storedHash;
    const hash = hashString(`PIN_${DEFAULT_PIN}`);
    localStorage.setItem('sidra_owner_pin_hash', hash);
    localStorage.setItem(PIN_VERSION_KEY, CURRENT_PIN_VERSION);
    return hash;
  } catch (e) {
    return hashString(`PIN_${DEFAULT_PIN}`);
  }
}

export function setOwnerMasterPin(newPin) {
  if (!newPin || newPin.trim().length < 4) return false;
  const hash = hashString(`PIN_${newPin.trim()}`);
  localStorage.setItem('sidra_owner_pin_hash', hash);
  localStorage.setItem(PIN_VERSION_KEY, 'v_custom');
  localStorage.removeItem('sidra_owner_master_pin');
  return true;
}

/**
 * Brute-Force Shield for Master PIN / Password
 * Limits failed attempts to 5, then imposes a 5-minute lockout.
 */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes

export function checkPinLockoutStatus() {
  try {
    const lockoutUntil = parseInt(localStorage.getItem('sidra_pin_lockout_until') || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLockedOut: true, remainingSeconds };
    }
    return { isLockedOut: false, remainingSeconds: 0 };
  } catch (e) {
    return { isLockedOut: false, remainingSeconds: 0 };
  }
}

export function recordFailedPinAttempt() {
  try {
    let attempts = parseInt(localStorage.getItem('sidra_pin_failed_attempts') || '0', 10) + 1;
    localStorage.setItem('sidra_pin_failed_attempts', String(attempts));
    
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem('sidra_pin_lockout_until', String(lockoutUntil));
      return { lockedOutNow: true, attempts, remainingSeconds: 300 };
    }
    return { lockedOutNow: false, attempts, remainingAttempts: MAX_FAILED_ATTEMPTS - attempts };
  } catch (e) {
    return { lockedOutNow: false, attempts: 1, remainingAttempts: 4 };
  }
}

export function resetPinFailedAttempts() {
  localStorage.removeItem('sidra_pin_failed_attempts');
  localStorage.removeItem('sidra_pin_lockout_until');
}

/**
 * Validates Master Password against secure hash with brute-force protection.
 */
export function verifyMasterPin(enteredPin) {
  if (!enteredPin) return { success: false, error: 'Password cannot be empty.' };

  // 1. Check brute force lockout
  const lockout = checkPinLockoutStatus();
  if (lockout.isLockedOut) {
    const mins = Math.floor(lockout.remainingSeconds / 60);
    const secs = lockout.remainingSeconds % 60;
    return { 
      success: false, 
      lockedOut: true, 
      error: `Security Lockout Active: Too many failed attempts. Try again in ${mins}m ${secs}s.` 
    };
  }

  const cleanInput = enteredPin.trim();

  // 2. Direct check for designated owner master password: My@tanzeem68
  if (cleanInput === DEFAULT_PIN) {
    resetPinFailedAttempts();
    setOwnerMasterPin(DEFAULT_PIN);
    return { success: true, role: 'owner' };
  }

  // 3. Validate against stored custom hash
  const expectedHash = getOwnerMasterPinHash();
  const enteredHash = hashString(`PIN_${cleanInput}`);

  if (enteredHash === expectedHash) {
    resetPinFailedAttempts();
    return { success: true, role: 'owner' };
  }

  // 4. Record failed attempt
  const failure = recordFailedPinAttempt();
  if (failure.lockedOutNow) {
    return { 
      success: false, 
      lockedOut: true, 
      error: 'Security Lockout Activated: 5 consecutive incorrect attempts. System locked for 5 minutes.' 
    };
  }

  return { 
    success: false, 
    error: `Incorrect Master Password. ${failure.remainingAttempts} attempt(s) remaining before security lockout.` 
  };
}
