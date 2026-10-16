const dns = require('dns').promises;

(async () => {
  console.log('=== RAW EVIDENCE: DNS EMAIL SECURITY AUDIT (sellersuitepro.online) ===\n');

  // 1. MX Records
  try {
    const mx = await dns.resolveMx('sellersuitepro.online');
    console.log('1. MX Records (Mail Exchange):', mx);
  } catch (e) {
    console.log('1. MX Records (Mail Exchange): None found / Error:', e.code || e.message);
  }

  // 2. SPF (TXT records on root domain)
  try {
    const txt = await dns.resolveTxt('sellersuitepro.online');
    console.log('\n2. Root TXT Records (SPF):', txt);
    const spf = txt.flat().find(t => t.startsWith('v=spf1'));
    console.log('   SPF Record Extracted:', spf || 'NOT FOUND (Missing v=spf1 at root)');
  } catch (e) {
    console.log('\n2. Root TXT Records (SPF): None found / Error:', e.code || e.message);
  }

  // 3. DMARC TXT record
  try {
    const dmarc = await dns.resolveTxt('_dmarc.sellersuitepro.online');
    console.log('\n3. DMARC Record (_dmarc.sellersuitepro.online):');
    console.log('   Raw Value:', dmarc.flat().join(''));
  } catch (e) {
    console.log('\n3. DMARC Record: Error:', e.code || e.message);
  }

  // 4. DKIM Selectors check
  const selectors = ['google', 'default', 'k1', 'smtp', 'mail'];
  console.log('\n4. DKIM Selectors Probe:');
  for (const s of selectors) {
    try {
      const dkim = await dns.resolveTxt(`${s}._domainkey.sellersuitepro.online`);
      console.log(`   Selector [${s}]: FOUND ->`, dkim.flat().join(''));
    } catch (e) {
      console.log(`   Selector [${s}]: ${e.code || e.message}`);
    }
  }
})();
