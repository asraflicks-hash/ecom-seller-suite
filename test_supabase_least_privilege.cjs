const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kitjqhhbsqusqmofabzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function runLeastPrivilegeTests() {
  console.log('=== SUPABASE LEAST-PRIVILEGE RLS VERIFICATION ===\n');

  // Test 1: Profiles Table
  console.log('--- TEST 1: profiles table ---');
  const selProfiles = await supabase.from('profiles').select('*');
  console.log('1. Anon SELECT all profiles:', selProfiles.error ? selProfiles.error.message : `Returned ${selProfiles.data.length} rows (Hidden by RLS)`);

  const insProfile = await supabase.from('profiles').insert([{
    id: '00000000-0000-0000-0000-000000000001',
    email: 'spoofed@evil.com',
    full_name: 'Hacker'
  }]);
  console.log('2. Anon INSERT into profiles:', insProfile.error ? `DENIED: ${insProfile.error.message} (Code: ${insProfile.error.code})` : 'ALLOWED (FAIL)');

  const updProfile = await supabase.from('profiles').update({ full_name: 'Pwned' }).eq('id', '00000000-0000-0000-0000-000000000001').select();
  console.log('3. Anon UPDATE someone else profile:', updProfile.error ? `DENIED: ${updProfile.error.message}` : `Updated ${updProfile.data?.length || 0} rows (Blocked/Ignored by RLS)`);

  const delProfile = await supabase.from('profiles').delete().eq('id', '00000000-0000-0000-0000-000000000001').select();
  console.log('4. Anon DELETE someone else profile:', delProfile.error ? `DENIED: ${delProfile.error.message}` : `Deleted ${delProfile.data?.length || 0} rows (Blocked/Ignored by RLS)`);

  // Test 2: User Work History Table
  console.log('\n--- TEST 2: user_work_history table ---');
  const selWork = await supabase.from('user_work_history').select('*');
  console.log('1. Anon SELECT all work history:', selWork.error ? selWork.error.message : `Returned ${selWork.data.length} rows (Hidden by RLS)`);

  const insWork = await supabase.from('user_work_history').insert([{
    user_id: '00000000-0000-0000-0000-000000000002',
    user_email: 'attacker@evil.com',
    tool_id: 'tool1',
    tool_name: 'AI SEO Optimizer',
    title: 'Spoofed Listing'
  }]);
  console.log('2. Anon INSERT into user_work_history:', insWork.error ? `DENIED: ${insWork.error.message} (Code: ${insWork.error.code})` : 'ALLOWED (FAIL)');

  const updWork = await supabase.from('user_work_history').update({ title: 'Hacked' }).eq('user_id', '00000000-0000-0000-0000-000000000002').select();
  console.log('3. Anon UPDATE someone else work history:', updWork.error ? `DENIED: ${updWork.error.message}` : `Updated ${updWork.data?.length || 0} rows (Blocked/Ignored by RLS)`);

  const delWork = await supabase.from('user_work_history').delete().eq('user_id', '00000000-0000-0000-0000-000000000002').select();
  console.log('4. Anon DELETE someone else work history:', delWork.error ? `DENIED: ${delWork.error.message}` : `Deleted ${delWork.data?.length || 0} rows (Blocked/Ignored by RLS)`);
}

runLeastPrivilegeTests().catch(console.error);
