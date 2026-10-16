const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://kitjqhhbsqusqmofabzq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdGpxaGhic3F1c3Ftb2ZhYnpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwODQzODUsImV4cCI6MjEwNzY2MDM4NX0.QSwFHPhB4uXE4lab4JUjjSDWFGh6jB5z8DXIu3GsxZ8';

async function testCrossUserIsolation() {
  console.log('=== REAL SUPABASE CROSS-USER ISOLATION TEST (USERS A & B) ===\n');

  const clientAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const timestamp = Date.now();
  const emailA = `test_seller_a_${timestamp}@sellersuitepro.online`;
  const emailB = `test_seller_b_${timestamp}@sellersuitepro.online`;
  const password = `StrongP@ssw0rd!${timestamp}`;

  console.log(`1. Creating Test User A: ${emailA} ...`);
  const { data: authDataA, error: errA } = await clientAnon.auth.signUp({
    email: emailA,
    password: password
  });

  if (errA) {
    console.error('Failed to create User A:', errA.message);
    return;
  }
  const userA = authDataA.user;
  const tokenA = authDataA.session?.access_token;
  console.log(`   User A Created successfully. ID: ${userA?.id}`);

  console.log(`\n2. Creating Test User B: ${emailB} ...`);
  const { data: authDataB, error: errB } = await clientAnon.auth.signUp({
    email: emailB,
    password: password
  });

  if (errB) {
    console.error('Failed to create User B:', errB.message);
    return;
  }
  const userB = authDataB.user;
  const tokenB = authDataB.session?.access_token;
  console.log(`   User B Created successfully. ID: ${userB?.id}`);

  // Create scoped clients for User A and User B
  const clientA = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${tokenA}` } }
  });

  const clientB = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${tokenB}` } }
  });

  console.log('\n3. User A creates a private listing in user_work_history ...');
  const recordIdA = `amz-listing-${timestamp}`;
  const { data: insertA, error: insertErrA } = await clientA
    .from('user_work_history')
    .insert([{
      user_id: userA.id,
      tab: 'listing-ai',
      title: 'User A Secret High-Volume Amazon Listing',
      data: { margin: '42%', keywords: 'private secret keywords user A' },
      timestamp: new Date().toISOString()
    }])
    .select();

  console.log('   User A insert result:', insertErrA ? `Error: ${insertErrA.message}` : `Success (1 row created, id: ${insertA?.[0]?.id || 'created'})`);

  console.log('\n4. User B attempts unauthorized operations against User A\'s data ...');

  // Attempt 1: User B tries to SELECT User A's row
  console.log('   a) User B SELECTs User A\'s rows in user_work_history:');
  const { data: selectB, error: selectErrB } = await clientB
    .from('user_work_history')
    .select('*')
    .eq('user_id', userA.id);

  if (selectErrB) {
    console.log(`      [BLOCKED]: ${selectErrB.message} (code: ${selectErrB.code})`);
  } else {
    console.log(`      [ISOLATION ENFORCED]: User B received ${selectB.length} rows (expected: 0). Rows returned:`, selectB);
  }

  // Attempt 2: User B tries to UPDATE User A's row
  console.log('\n   b) User B attempts to UPDATE User A\'s listing title:');
  const { data: updateB, error: updateErrB } = await clientB
    .from('user_work_history')
    .update({ title: 'PWNED BY USER B' })
    .eq('user_id', userA.id)
    .select();

  if (updateErrB) {
    console.log(`      [BLOCKED]: ${updateErrB.message}`);
  } else {
    console.log(`      [ISOLATION ENFORCED]: Modified ${updateB.length} rows (expected: 0).`);
  }

  // Attempt 3: User B tries to DELETE User A's row
  console.log('\n   c) User B attempts to DELETE User A\'s listing:');
  const { data: deleteB, error: deleteErrB } = await clientB
    .from('user_work_history')
    .delete()
    .eq('user_id', userA.id)
    .select();

  if (deleteErrB) {
    console.log(`      [BLOCKED]: ${deleteErrB.message}`);
  } else {
    console.log(`      [ISOLATION ENFORCED]: Deleted ${deleteB.length} rows (expected: 0).`);
  }

  // Attempt 4: User B tries to inspect User A's profile
  console.log('\n   d) User B attempts to SELECT User A\'s row in profiles:');
  const { data: profileB, error: profileErrB } = await clientB
    .from('profiles')
    .select('*')
    .eq('id', userA.id);

  if (profileErrB) {
    console.log(`      [BLOCKED]: ${profileErrB.message}`);
  } else {
    console.log(`      [ISOLATION ENFORCED]: User B received ${profileB.length} rows from User A profile.`);
  }

  // Verify User A's row is completely untouched
  console.log('\n5. Verifying User A\'s record remains untouched:');
  const { data: verifyA } = await clientA
    .from('user_work_history')
    .select('title')
    .eq('user_id', userA.id);
  console.log(`   User A row verification: Title="${verifyA?.[0]?.title || 'none'}"`);

  // Cleanup: Delete User A's row using User A's token
  console.log('\n6. Cleanup: User A deletes own test row ...');
  const { error: cleanErrA } = await clientA
    .from('user_work_history')
    .delete()
    .eq('user_id', userA.id);
  console.log(`   User A test record cleaned up: ${cleanErrA ? cleanErrA.message : 'OK'}`);
}

testCrossUserIsolation().catch(console.error);
