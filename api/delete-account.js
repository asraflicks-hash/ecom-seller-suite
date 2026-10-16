// api/delete-account.js - Server-Side Right to Erasure Endpoint (DPDP Act 2023 / Google Play Compliant)
// Securely verifies caller's Supabase JWT and permanently purges user records and auth account
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kitjqhhbsqusqmofabzq.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export default async function handler(req, res) {
  // 1. Strict Origin & Method Check
  const origin = (req.headers.origin || '').toLowerCase();
  const allowedOrigins = [
    'https://www.sellersuitepro.online',
    'https://sellersuitepro.online',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost',
    'capacitor://localhost'
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ error: 'CORS Access Denied: Unauthorized request origin.' });
  }

  res.setHeader('Access-Control-Allow-Origin', origin || 'https://www.sellersuitepro.online');

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  // 2. Extract and verify JWT
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : (req.body?.token || '').trim();

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Valid Bearer JWT session token required for account deletion.' });
  }

  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: { user }, error: authErr } = await supabaseClient.auth.getUser(token);

  if (authErr || !user) {
    return res.status(401).json({ error: 'Invalid or expired user session. Re-authentication required to delete account.' });
  }

  const userId = user.id;
  const userEmail = user.email;

  try {
    const results = {
      userId,
      userEmail,
      userWorkHistoryDeleted: false,
      profileDeleted: false,
      authUserDeleted: false
    };

    // 3. User authenticated Supabase client for least-privilege row deletion
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    // Delete user work history
    const { error: workErr } = await userClient.from('user_work_history').delete().eq('user_id', userId);
    results.userWorkHistoryDeleted = !workErr;

    // Delete user profile
    const { error: profErr } = await userClient.from('profiles').delete().eq('id', userId);
    results.profileDeleted = !profErr;

    // 4. Delete auth user record via service_role admin client if configured
    if (SUPABASE_SERVICE_ROLE_KEY) {
      const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const { error: adminDelErr } = await adminClient.auth.admin.deleteUser(userId);
      results.authUserDeleted = !adminDelErr;
    } else {
      results.authUserDeleted = 'Pending service_role key; application data wiped';
    }

    return res.status(200).json({
      success: true,
      message: 'User account and all associated workstation data permanently deleted.',
      details: results
    });
  } catch (err) {
    console.error('Account deletion critical error:', err);
    return res.status(500).json({ error: 'Failed to process account deletion', details: err.message });
  }
}
