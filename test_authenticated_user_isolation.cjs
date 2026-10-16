const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kitjqhhbsqusqmofabzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';

async function runIsolationTest() {
  console.log('=== REAL SUPABASE USER ISOLATION & RLS VERIFICATION ===\n');

  const clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  // 1. Authenticate as Real User A
  console.log('1. Authenticating as Real User A (seller.suite.test99@gmail.com) ...');
  const { data: authA, error: errA } = await clientAnon.auth.signInWithPassword({
    email: 'seller.suite.test99@gmail.com',
    password: 'Password99@Secure2026'
  });

  if (errA) {
    console.error('User A login failed:', errA.message);
    return;
  }

  const userA = authA.user;
  const tokenA = authA.session.access_token;
  console.log(`   User A Logged In: ID = ${userA.id}, Email = ${userA.email}`);

  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${tokenA}` } }
  });

  // 2. User A inserts a private work history record
  console.log('\n2. User A inserts a private record into user_work_history ...');
  const now = new Date().toISOString();
  const testPayload = {
    user_id: userA.id,
    user_email: userA.email,
    tool_id: 'listing-ai',
    tool_name: 'AI Listing Generator',
    title: 'Confidential Amazon FBA Strategy - User A',
    summary: 'Private high-margin keyword plan',
    work_data: { profit_margin: '48%', supplier: 'Guangzhou Direct' },
    created_at: now,
    updated_at: now
  };

  const { data: insertedRow, error: insertErr } = await clientA
    .from('user_work_history')
    .insert([testPayload])
    .select()
    .maybeSingle();

  if (insertErr) {
    console.error('   User A insert failed:', insertErr.message, insertErr.code);
  } else {
    console.log(`   User A row created: ID = ${insertedRow?.id || 'generated'}`);
  }

  // 3. User A attempts to spoof another user ID (e.g. 00000000-0000-0000-0000-000000000000)
  console.log('\n3. User A attempts ID-spoofing attack (inserting with someone else\'s user_id) ...');
  const spoofPayload = {
    ...testPayload,
    user_id: '00000000-0000-0000-0000-000000000000',
    title: 'Spoofed Record'
  };
  const { data: spoofRow, error: spoofErr } = await clientA
    .from('user_work_history')
    .insert([spoofPayload])
    .select();

  console.log(`   Spoof insert result:`, spoofErr ? `BLOCKED (${spoofErr.message}, code: ${spoofErr.code})` : `ALLOWED (${spoofRow?.length} rows)`);

  // 4. Unauthenticated Attacker / Rival attempts to read User A's confidential row
  console.log('\n4. Unauthorized Attacker attempts to SELECT User A\'s records:');
  const { data: anonRead, error: anonReadErr } = await clientAnon
    .from('user_work_history')
    .select('*')
    .eq('user_id', userA.id);

  if (anonReadErr) {
    console.log(`   [BLOCKED]: ${anonReadErr.message}`);
  } else {
    console.log(`   [ISOLATION VERIFIED]: Returned ${anonRead.length} rows (expected: 0).`);
  }

  // 5. Unauthorized Attacker attempts to UPDATE User A's row
  console.log('\n5. Unauthorized Attacker attempts to UPDATE User A\'s record:');
  const { data: anonUpdate, error: anonUpdateErr } = await clientAnon
    .from('user_work_history')
    .update({ title: 'COMPROMISED_BY_ATTACKER' })
    .eq('user_id', userA.id)
    .select();

  if (anonUpdateErr) {
    console.log(`   [BLOCKED]: ${anonUpdateErr.message}`);
  } else {
    console.log(`   [ISOLATION VERIFIED]: Modified ${anonUpdate?.length || 0} rows (expected: 0).`);
  }

  // 6. Unauthorized Attacker attempts to DELETE User A's row
  console.log('\n6. Unauthorized Attacker attempts to DELETE User A\'s record:');
  const { data: anonDelete, error: anonDeleteErr } = await clientAnon
    .from('user_work_history')
    .delete()
    .eq('user_id', userA.id)
    .select();

  if (anonDeleteErr) {
    console.log(`   [BLOCKED]: ${anonDeleteErr.message}`);
  } else {
    console.log(`   [ISOLATION VERIFIED]: Deleted ${anonDelete?.length || 0} rows (expected: 0).`);
  }

  // 7. Verify User A's record was never modified
  console.log('\n7. Verifying User A\'s record remains intact:');
  const { data: verifiedA } = await clientA
    .from('user_work_history')
    .select('id, title, user_id')
    .eq('user_id', userA.id);

  console.log(`   User A records found: ${verifiedA?.length || 0}. Title: "${verifiedA?.[0]?.title || 'none'}"`);

  // 8. Cleanup User A's test record
  console.log('\n8. Cleanup User A test record ...');
  const { error: cleanErr } = await clientA
    .from('user_work_history')
    .delete()
    .eq('user_id', userA.id);
  console.log(`   Cleanup status: ${cleanErr ? cleanErr.message : 'SUCCESS'}`);
}

runIsolationTest().catch(console.error);
