import { createClient } from '@supabase/supabase-js';

// 1. Check environment variables (Vite standard)
const ENV_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const ENV_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// 2. Fallback to localStorage configuration (allows instant UI config without rebuilding)
export function getStoredSupabaseConfig() {
  if (typeof window === 'undefined') return { url: '', anonKey: '' };
  try {
    const url = (localStorage.getItem('sidra_supabase_url') || '').trim();
    const anonKey = (localStorage.getItem('sidra_supabase_anon_key') || '').trim();
    return { url, anonKey };
  } catch (e) {
    return { url: '', anonKey: '' };
  }
}

export function getActiveSupabaseConfig() {
  const stored = getStoredSupabaseConfig();
  const url = ENV_SUPABASE_URL || stored.url;
  const anonKey = ENV_SUPABASE_ANON_KEY || stored.anonKey;
  const source = ENV_SUPABASE_URL ? 'environment' : stored.url ? 'custom_storage' : 'none';
  const isConfigured = Boolean(url && anonKey && url.startsWith('http') && anonKey.length > 20);

  return {
    url,
    anonKey,
    source,
    isConfigured
  };
}

let supabaseInstance = null;
let currentConfigKey = '';

export function getSupabase() {
  const config = getActiveSupabaseConfig();
  const key = `${config.url}::${config.anonKey}`;

  if (supabaseInstance && currentConfigKey === key) {
    return supabaseInstance;
  }

  if (config.isConfigured) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      });
      currentConfigKey = key;
      return supabaseInstance;
    } catch (err) {
      console.error('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  supabaseInstance = null;
  currentConfigKey = '';
  return null;
}

export const supabase = getSupabase();

export function isSupabaseConfigured() {
  return getActiveSupabaseConfig().isConfigured;
}

export function saveSupabaseConfig(url, anonKey) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidra_supabase_url', (url || '').trim());
    localStorage.setItem('sidra_supabase_anon_key', (anonKey || '').trim());
    // Force re-init
    supabaseInstance = null;
    currentConfigKey = '';
    return getSupabase();
  }
  return null;
}

export function clearSupabaseConfig() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sidra_supabase_url');
    localStorage.removeItem('sidra_supabase_anon_key');
    supabaseInstance = null;
    currentConfigKey = '';
  }
}

// ================= AUTH HELPER METHODS =================

/**
 * Sign In with Email & Password
 */
export async function signInWithEmail(email, password) {
  const client = getSupabase();
  if (!client) {
    // Demo Mock fallback if credentials not yet linked
    return mockSignIn(email, password);
  }

  const { data, error } = await client.auth.signInWithPassword({
    email: email.trim(),
    password
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign Up with Email, Password & User Metadata
 */
export async function signUpWithEmail(email, password, { fullName = '', phone = '', storeName = '' } = {}) {
  const client = getSupabase();
  if (!client) {
    // Demo Mock fallback
    return mockSignUp(email, password, { fullName, phone, storeName });
  }

  const { data, error } = await client.auth.signUp({
    email: email.trim(),
    password,
    options: {
      data: {
        full_name: fullName.trim(),
        phone: phone.trim(),
        store_name: storeName.trim(),
        role: 'seller'
      }
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign Out Current User
 */
export async function signOutUser() {
  const client = getSupabase();
  if (client) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut error:', err);
    }
  }

  // Clear local mock session if any
  if (typeof window !== 'undefined') {
    localStorage.removeItem('sidra_mock_session');
    localStorage.removeItem('sidra_user_name');
    localStorage.removeItem('sidra_user_email');
    localStorage.removeItem('sidra_user_phone');
    localStorage.removeItem('sidra_auth_type');
  }
}

/**
 * Send Password Reset Email
 */
export async function resetPasswordForEmail(email) {
  const client = getSupabase();
  if (!client) {
    return { success: true, message: 'Demo mode: Password reset email simulation sent.' };
  }

  const { data, error } = await client.auth.resetPasswordForEmail(email.trim(), {
    redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : undefined
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Get active session
 */
export async function getCurrentSession() {
  const client = getSupabase();
  if (!client) {
    if (typeof window !== 'undefined') {
      const mock = localStorage.getItem('sidra_mock_session');
      if (mock) {
        try { return JSON.parse(mock); } catch (e) {}
      }
    }
    return null;
  }

  const { data: { session }, error } = await client.auth.getSession();
  if (error || !session) return null;
  return session;
}

/**
 * Subscribe to Auth State Changes
 */
export function onAuthChange(callback) {
  const client = getSupabase();
  if (!client) {
    return { unsubscribe: () => {} };
  }

  const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });

  return subscription;
}

// ================= DEMO / MOCK FALLBACK HANDLERS =================
// Active only when Supabase keys are not yet configured, allowing instant UI testing.

function mockSignIn(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        return reject(new Error('Email aur Password dono zaroori hain.'));
      }
      if (password.length < 6) {
        return reject(new Error('Password kam se kam 6 characters ka hona chahiye.'));
      }

      // Check if user was registered in mock store
      const registeredUsers = getMockUsers();
      const existing = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

      const mockUser = existing || {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email.trim(),
        user_metadata: {
          full_name: email.split('@')[0],
          phone: '+91 98765 43210'
        }
      };

      const session = {
        user: mockUser,
        access_token: 'mock_jwt_token_' + Date.now(),
        isDemo: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('sidra_mock_session', JSON.stringify(session));
      }

      resolve({ user: mockUser, session });
    }, 600);
  });
}

function mockSignUp(email, password, metadata) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        return reject(new Error('Email aur Password dono required hain.'));
      }
      if (password.length < 6) {
        return reject(new Error('Password kam se kam 6 characters ka hona chahiye.'));
      }

      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email.trim(),
        user_metadata: {
          full_name: metadata.fullName || email.split('@')[0],
          phone: metadata.phone || '',
          store_name: metadata.storeName || ''
        }
      };

      // Save to mock registry
      const registeredUsers = getMockUsers();
      registeredUsers.push(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sidra_mock_users', JSON.stringify(registeredUsers));
      }

      const session = {
        user: mockUser,
        access_token: 'mock_jwt_token_' + Date.now(),
        isDemo: true
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('sidra_mock_session', JSON.stringify(session));
      }

      resolve({ user: mockUser, session });
    }, 700);
  });
}

function getMockUsers() {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('sidra_mock_users');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}
