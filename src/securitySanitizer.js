/**
 * Security & Privacy Sanitization Module - Seller Suite Pro
 * Defends against:
 * 1. XSS (Cross-Site Scripting) via DOMPurify
 * 2. CSV Formula Injection (CWE-1236)
 * 3. Malicious File Uploads / DOS (Image & CSV validation)
 * 4. DPDP Act 2023 Compliant Data Erasure (Right to be Forgotten)
 */
import DOMPurify from 'dompurify';
import { getSupabase } from './supabaseClient.js';

/**
 * Validate that a URL uses safe protocols (http, https, mailto)
 * Rejects javascript:, data:, vbscript:, etc.
 */
export function isValidUrlProtocol(url) {
  if (typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  return (
    trimmed.startsWith('https://') ||
    trimmed.startsWith('http://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  );
}

/**
 * Sanitize untrusted HTML or text string using DOMPurify
 * Restricts protocols to http, https, mailto, and enforces rel="noopener noreferrer"
 */
export function sanitizeHtml(dirty) {
  if (typeof dirty !== 'string') return '';
  const purify = typeof DOMPurify?.sanitize === 'function'
    ? DOMPurify
    : (typeof window !== 'undefined' && typeof DOMPurify === 'function' ? DOMPurify(window) : null);

  if (purify && typeof purify.sanitize === 'function') {
    if (typeof purify.addHook === 'function') {
      try {
        purify.addHook('afterSanitizeAttributes', function(node) {
          if (node.tagName === 'A') {
            node.setAttribute('rel', 'noopener noreferrer');
            const href = node.getAttribute('href') || '';
            if (!isValidUrlProtocol(href)) {
              node.removeAttribute('href');
            }
          }
        });
      } catch (e) {}
    }

    return purify.sanitize(dirty, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'span', 'br', 'ul', 'li', 'ol', 'code'],
      ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'style'],
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    });
  }
  // Robust fallback HTML entity escape for non-DOM environments
  return dirty
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sanitize CSV cell to prevent Spreadsheet Formula Injection (CWE-1236)
 * Characters '=', '+', '-', '@', '\t', '\r' trigger execution in Excel/Google Sheets.
 */
export function sanitizeCsvCell(value) {
  if (value === null || value === undefined) return '""';
  
  // If native number, keep it as a pure number representation
  if (typeof value === 'number' && !isNaN(value)) {
    return String(value);
  }

  let str = String(value);
  const trimmed = str.trim();

  // Allow genuine negative and positive numeric values (e.g. -500, +100, -25.5, 0.99)
  const isPureNumber = /^[+\-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trimmed);

  if (!isPureNumber && (/^[=+\-@\t\r]/.test(str) || /^[=+\-@\t\r]/.test(trimmed))) {
    // Prefix string formulas to neutralize spreadsheet execution (CWE-1236)
    str = "'" + str;
  }

  // Escape internal double quotes by doubling them
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Validate image file upload for type, size, and header signature
 * Max 15MB size limit to prevent client DOS memory exhaustion
 */
export async function validateImageFile(file, maxMb = 15) {
  if (!file) return { isValid: false, error: 'No file provided.' };

  // 1. Size check
  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { 
      isValid: false, 
      error: `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${maxMb} MB.` 
    };
  }

  // 2. MIME type check
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validMimes.includes(file.type.toLowerCase())) {
    return { 
      isValid: false, 
      error: 'Invalid file format. Only JPG, PNG, and WebP product images are supported.' 
    };
  }

  // 3. Magic bytes inspection
  try {
    const buffer = await file.slice(0, 12).arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // JPEG magic bytes: FF D8 FF
    const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
    // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
    // WebP magic bytes: RIFF....WEBP
    const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                   bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

    if (!isJpeg && !isPng && !isWebp) {
      return { 
        isValid: false, 
        error: 'File content does not match genuine image header signatures. Please upload an authentic image file.' 
      };
    }
  } catch (err) {
    // If arrayBuffer fails, fall back to safe MIME check
  }

  return { isValid: true };
}

/**
 * Validate catalog spreadsheet file (.csv)
 * Max 5MB size limit
 */
export function validateCatalogFile(file, maxMb = 5) {
  if (!file) return { isValid: false, error: 'No file provided.' };

  const maxBytes = maxMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return { 
      isValid: false, 
      error: `Catalog file is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${maxMb} MB.` 
    };
  }

  const name = (file.name || '').toLowerCase();
  if (!name.endsWith('.csv') && !name.endsWith('.txt')) {
    return { 
      isValid: false, 
      error: 'Invalid file extension. Please upload a standard comma-separated .CSV catalog file.' 
    };
  }

  return { isValid: true };
}

/**
 * Comprehensive "Delete All My Data" (Right to Erasure / DPDP Act 2023)
 * Completely purges all local storage, session storage, cookies, Cache Storage,
 * service workers, and IndexedDB databases.
 */
export async function purgeAllUserData() {
  if (typeof window === 'undefined') return { success: true };

  const results = {
    localStorageCleared: false,
    sessionStorageCleared: false,
    cookiesCleared: false,
    indexedDBCleared: false,
    cacheStorageCleared: false,
    serviceWorkersUnregistered: false
  };

  try {
    // 1. Clear all localStorage keys
    try {
      localStorage.clear();
      results.localStorageCleared = true;
    } catch (e) {
      console.warn('localStorage clear error:', e);
    }

    // 2. Clear sessionStorage
    try {
      sessionStorage.clear();
      results.sessionStorageCleared = true;
    } catch (e) {
      console.warn('sessionStorage clear error:', e);
    }

    // 3. Clear all Cookies
    try {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i];
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        if (name) {
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname};`;
        }
      }
      results.cookiesCleared = true;
    } catch (e) {
      console.warn('Cookies clear error:', e);
    }

    // 4. Clear IndexedDB
    try {
      if (window.indexedDB && typeof window.indexedDB.databases === 'function') {
        const dbs = await window.indexedDB.databases();
        await Promise.all(
          dbs.map(db => {
            return new Promise((resolve) => {
              if (!db.name) return resolve();
              const req = window.indexedDB.deleteDatabase(db.name);
              req.onsuccess = () => resolve();
              req.onerror = () => resolve();
              req.onblocked = () => resolve();
            });
          })
        );
      }
      results.indexedDBCleared = true;
    } catch (e) {
      console.warn('IndexedDB clear error:', e);
    }

    // 5. Clear Cache Storage
    try {
      if ('caches' in window) {
        const cacheKeys = await window.caches.keys();
        await Promise.all(cacheKeys.map(k => window.caches.delete(k)));
      }
      results.cacheStorageCleared = true;
    } catch (e) {
      console.warn('Cache Storage clear error:', e);
    }

    // 6. Unregister Service Workers
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg => reg.unregister()));
      }
      results.serviceWorkersUnregistered = true;
    } catch (e) {
      console.warn('Service Worker unregister error:', e);
    }

    // 7. Delete User's Cloud Database Records & Auth Account (if authenticated)
    results.serverSideDataDeleted = false;
    try {
      const client = typeof getSupabase === 'function' ? getSupabase() : null;
      if (client && client.auth) {
        const { data: sessionData } = await client.auth.getSession();
        const user = sessionData?.session?.user;
        const accessToken = sessionData?.session?.access_token;
        if (user && user.id) {
          // Trigger server-side account deletion endpoint
          if (accessToken) {
            try {
              await fetch('/api/delete-account', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                }
              });
            } catch (err) {
              console.warn('/api/delete-account proxy error:', err);
            }
          }

          // Direct client delete fallback under least-privilege RLS
          await client.from('user_work_history').delete().eq('user_id', user.id);
          await client.from('profiles').delete().eq('id', user.id);
          await client.auth.signOut();
          results.serverSideDataDeleted = true;
        }
      }
    } catch (e) {
      console.warn('Supabase cloud data purge notice:', e);
    }

    // 8. Dispatch purge event for UI reactivity
    window.dispatchEvent(new CustomEvent('ssp_all_data_purged', { detail: results }));
    return { success: true, results };
  } catch (err) {
    console.error('Data purge critical error:', err);
    return { success: false, error: err.message };
  }
}
