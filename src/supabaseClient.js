import { createClient } from '@supabase/supabase-js';

// 1. Check environment variables (Vite standard)
const ENV_SUPABASE_URL = (import.meta.env?.VITE_SUPABASE_URL || '').trim();
const ENV_SUPABASE_ANON_KEY = (import.meta.env?.VITE_SUPABASE_ANON_KEY || '').trim();

// 2. Official Production Supabase Project Credentials (kitjqhhbsqusqmofabzq)
const PRODUCTION_SUPABASE_URL = 'https://kitjqhhbsqusqmofabzq.supabase.co';
const PRODUCTION_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';

// 3. Fallback to localStorage configuration (allows custom override if needed)
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
  const url = ENV_SUPABASE_URL || stored.url || PRODUCTION_SUPABASE_URL;
  const anonKey = ENV_SUPABASE_ANON_KEY || stored.anonKey || PRODUCTION_SUPABASE_ANON_KEY;
  const source = ENV_SUPABASE_URL ? 'environment' : stored.url ? 'custom_storage' : 'production_default';
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
    throw new Error('Supabase Database connect nahi hai! Kripya "Project API Keys" par click karke apna Supabase Project URL aur Anon Key enter karein.');
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
    throw new Error('Supabase Database connect nahi hai! Real user registration ke liye apna Supabase Project URL aur Anon Key enter karein.');
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
 * Sign In with Google OAuth
 */
export async function signInWithGoogle() {
  const client = getSupabase();
  if (!client) {
    throw new Error('Google Sign-In ke liye Supabase database connect hona zaroori hai. Kripya apna Supabase Project URL aur Anon Key enter karein.');
  }

  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/` : undefined
    }
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Update Current User Password (for Reset Password flow)
 */
export async function updateUserPassword(newPassword) {
  const client = getSupabase();
  if (!client) {
    return { success: true };
  }

  const { data, error } = await client.auth.updateUser({
    password: newPassword
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Save Seller Profile to Supabase PostgreSQL Database (profiles table)
 */
export async function saveProfileToDatabase(profile) {
  const client = getSupabase();
  if (!client) return null;

  try {
    const session = await getCurrentSession();
    if (!session?.user) return null;

    const payload = {
      id: session.user.id,
      email: session.user.email,
      full_name: profile.name || session.user.user_metadata?.full_name || '',
      phone: profile.phone || session.user.user_metadata?.phone || '',
      city: profile.city || '',
      store_name: profile.storeName || session.user.user_metadata?.store_name || '',
      brand_name: profile.brandName || '',
      platform: profile.platform || 'Amazon & Flipkart',
      updated_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('profiles')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase profiles upsert notice:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('saveProfileToDatabase error:', err);
    return null;
  }
}

/**
 * Save Social Media Audit to Supabase PostgreSQL (social_audits table)
 */
export async function saveAuditToDatabase(audit) {
  const client = getSupabase();
  if (!client) return null;

  try {
    const session = await getCurrentSession();
    const userId = session?.user?.id || null;

    const payload = {
      user_id: userId,
      platform: audit.platform,
      handle: audit.handle,
      display_name: audit.displayName,
      followers: audit.followers,
      health_score: audit.healthScore,
      ghost_count: audit.ghostCount,
      is_real_scan: Boolean(audit.isRealScan),
      created_at: new Date().toISOString()
    };

    const { data, error } = await client
      .from('social_audits')
      .insert([payload]);

    if (error) {
      console.warn('Supabase social_audits insert notice:', error.message);
    }
    return data;
  } catch (err) {
    console.warn('saveAuditToDatabase error:', err);
    return null;
  }
}

/**
 * Load Seller Profile from Supabase PostgreSQL Database (profiles table)
 */
export async function loadProfileFromDatabase() {
  const client = getSupabase();
  if (!client) return null;

  try {
    const session = await getCurrentSession();
    if (!session?.user?.id) return null;

    const { data, error } = await client
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      console.warn('loadProfileFromDatabase notice:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('loadProfileFromDatabase error:', err);
    return null;
  }
}

/**
 * Save User Work / Project / History item to Supabase & Account-keyed LocalStorage
 */
export async function saveUserWork({ toolId, toolName, title, summary = '', workData = {} }) {
  const client = getSupabase();
  const session = await getCurrentSession();
  const user = session?.user || null;
  const userEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('sidra_user_email') : '') || 'guest_seller';
  const userId = user?.id || null;

  const newItem = {
    id: 'work_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    user_id: userId,
    user_email: userEmail,
    tool_id: toolId,
    tool_name: toolName,
    title: title || `${toolName} Project`,
    summary: summary || '',
    work_data: workData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Save to Account-bound LocalStorage Cache (Immediate offline safety)
  if (typeof window !== 'undefined') {
    try {
      const storageKey = `ssp_work_history_${userEmail.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const existingRaw = localStorage.getItem(storageKey);
      const list = existingRaw ? JSON.parse(existingRaw) : [];
      // Prepend newest item
      const updatedList = [newItem, ...list.filter(i => i.title !== newItem.title || i.tool_id !== newItem.tool_id)].slice(0, 100);
      localStorage.setItem(storageKey, JSON.stringify(updatedList));
      
      // Dispatch event for UI reactivity
      window.dispatchEvent(new CustomEvent('ssp_work_saved', { detail: newItem }));
    } catch (e) {
      console.warn('Local work history cache notice:', e);
    }
  }

  // 2. Persist to Supabase Database (if user is authenticated & table exists)
  if (client && userId) {
    try {
      const dbPayload = {
        user_id: userId,
        user_email: userEmail,
        tool_id: toolId,
        tool_name: toolName,
        title: newItem.title,
        summary: newItem.summary,
        work_data: workData,
        created_at: newItem.created_at,
        updated_at: newItem.updated_at
      };

      const { data, error } = await client
        .from('user_work_history')
        .insert([dbPayload])
        .select()
        .maybeSingle();

      if (error) {
        console.warn('Supabase user_work_history insert notice:', error.message);
      } else if (data && data.id) {
        newItem.db_id = data.id;
      }
    } catch (err) {
      console.warn('saveUserWork Supabase sync error:', err);
    }
  }

  return newItem;
}

/**
 * Fetch User Work History (combines Supabase cloud database + user-bound local cache)
 */
export async function getUserWorkHistory() {
  const client = getSupabase();
  const session = await getCurrentSession();
  const user = session?.user || null;
  const userEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('sidra_user_email') : '') || '';

  let cloudItems = [];
  if (client && user?.id) {
    try {
      const { data, error } = await client
        .from('user_work_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && Array.isArray(data)) {
        cloudItems = data;
      }
    } catch (e) {
      console.warn('Supabase getUserWorkHistory notice:', e);
    }
  }

  // Retrieve user local cache
  let localItems = [];
  if (typeof window !== 'undefined' && userEmail) {
    try {
      const storageKey = `ssp_work_history_${userEmail.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const existingRaw = localStorage.getItem(storageKey);
      if (existingRaw) {
        localItems = JSON.parse(existingRaw);
      }
    } catch (e) {}
  }

  // Merge unique items by title and timestamp
  const map = new Map();
  cloudItems.forEach(item => {
    const k = `${item.tool_id}::${item.title}`;
    map.set(k, item);
  });
  localItems.forEach(item => {
    const k = `${item.tool_id}::${item.title}`;
    if (!map.has(k)) {
      map.set(k, item);
    }
  });

  const merged = Array.from(map.values()).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return merged;
}

/**
 * Delete a saved work item from Supabase and local cache
 */
export async function deleteUserWork(item) {
  const client = getSupabase();
  const session = await getCurrentSession();
  const user = session?.user || null;
  const userEmail = user?.email || (typeof window !== 'undefined' ? localStorage.getItem('sidra_user_email') : '') || '';

  // Delete from local cache
  if (typeof window !== 'undefined' && userEmail) {
    try {
      const storageKey = `ssp_work_history_${userEmail.replace(/[^a-zA-Z0-9_]/g, '_')}`;
      const existingRaw = localStorage.getItem(storageKey);
      if (existingRaw) {
        const list = JSON.parse(existingRaw);
        const filtered = list.filter(i => i.id !== item.id && i.id !== item.db_id && i.title !== item.title);
        localStorage.setItem(storageKey, JSON.stringify(filtered));
      }
    } catch (e) {}
  }

  // Delete from Supabase
  if (client && user?.id && (item.db_id || item.id)) {
    try {
      const targetId = item.db_id || (typeof item.id === 'number' ? item.id : null);
      if (targetId) {
        await client.from('user_work_history').delete().eq('id', targetId);
      } else {
        await client.from('user_work_history').delete().eq('user_id', user.id).eq('title', item.title);
      }
    } catch (e) {
      console.warn('deleteUserWork Supabase error:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('ssp_work_deleted', { detail: item }));
  }
}

/**
 * Copy-pasteable SQL Schema for Supabase SQL Editor
 */
export const SUPABASE_SQL_SCHEMA = `-- 1. Profiles Table (Automatically synced with Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  store_name TEXT,
  brand_name TEXT,
  platform TEXT DEFAULT 'Amazon & Flipkart',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. User Work History Table (Stores all seller work across all 8 modules)
CREATE TABLE IF NOT EXISTS public.user_work_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  work_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Social Audits Log Table
CREATE TABLE IF NOT EXISTS public.social_audits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  platform TEXT NOT NULL,
  handle TEXT NOT NULL,
  display_name TEXT,
  followers BIGINT,
  health_score INT,
  ghost_count BIGINT,
  is_real_scan BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_work_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_audits ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Allow users to view & edit their own data
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" 
  ON public.profiles FOR ALL 
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage their own work history" ON public.user_work_history;
CREATE POLICY "Users can manage their own work history" 
  ON public.user_work_history FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL);

DROP POLICY IF EXISTS "Users can manage their own audits" ON public.social_audits;
CREATE POLICY "Users can manage their own audits" 
  ON public.social_audits FOR ALL 
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 6. Auto-create / sync profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Sync any existing users
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, COALESCE(raw_user_meta_data->>'full_name', raw_user_meta_data->>'name', split_part(email, '@', 1))
FROM auth.users
ON CONFLICT (id) DO NOTHING;
`;

/**
 * Send Password Reset Email
 */
export async function resetPasswordForEmail(email) {
  const client = getSupabase();
  if (!client) {
    throw new Error('Password reset ke liye Supabase database connect hona zaroori hai.');
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
  try {
    const client = getSupabase();
    if (!client) {
      return null;
    }

    const { data, error } = await client.auth.getSession();
    if (error || !data?.session) return null;
    return data.session;
  } catch (err) {
    console.warn('getCurrentSession error notice:', err);
    return null;
  }
}

/**
 * Subscribe to Auth State Changes
 */
export function onAuthChange(callback) {
  try {
    const client = getSupabase();
    if (!client) {
      return { unsubscribe: () => {} };
    }

    const res = client.auth.onAuthStateChange((event, session) => {
      try {
        if (typeof callback === 'function') {
          callback(event, session);
        }
      } catch (err) {
        console.warn('onAuthStateChange callback notice:', err);
      }
    });

    return res?.data?.subscription || { unsubscribe: () => {} };
  } catch (err) {
    console.warn('onAuthChange registration error notice:', err);
    return { unsubscribe: () => {} };
  }
}
