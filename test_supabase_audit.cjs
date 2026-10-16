const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kitjqhhbsqusqmofabzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function auditSupabase() {
  console.log('=== RAW EVIDENCE: SUPABASE SECURITY & RLS AUDIT ===\n');

  const tables = ['profiles', 'user_work_history', 'social_audits', 'license_keys', 'sellers', 'users'];

  for (const table of tables) {
    console.log(`--- PROBING TABLE: ${table} ---`);
    
    // 1. SELECT (Unauthenticated / Anon)
    const { data: selectData, error: selectError } = await supabase.from(table).select('*').limit(5);
    console.log(`[ANON SELECT]:`, selectError ? `DENIED / ERROR: ${selectError.message} (code: ${selectError.code})` : `ALLOWED (returned ${selectData.length} rows)`);

    // 2. INSERT (Unauthenticated / Anon spoof attempt)
    const spoofId = '00000000-0000-0000-0000-000000000000';
    const { data: insertData, error: insertError } = await supabase.from(table).insert([{
      id: spoofId,
      user_id: spoofId,
      email: 'attacker@evil.com',
      title: 'Hacked Listing',
      data: { evil: true }
    }]).select();
    console.log(`[ANON INSERT]:`, insertError ? `DENIED: ${insertError.message} (code: ${insertError.code})` : `ALLOWED (Security Vulnerability!)`);

    // 3. UPDATE (Unauthenticated / Anon update attempt)
    const { data: updateData, error: updateError } = await supabase.from(table).update({ email: 'pwned@evil.com' }).neq('id', spoofId);
    console.log(`[ANON UPDATE]:`, updateError ? `DENIED: ${updateError.message} (code: ${updateError.code})` : `ALLOWED (Security Vulnerability!)`);

    // 4. DELETE (Unauthenticated / Anon delete attempt)
    const { data: deleteData, error: deleteError } = await supabase.from(table).delete().neq('id', spoofId);
    console.log(`[ANON DELETE]:`, deleteError ? `DENIED: ${deleteError.message} (code: ${deleteError.code})` : `ALLOWED (Security Vulnerability!)`);

    console.log('');
  }
}

auditSupabase().catch(console.error);
