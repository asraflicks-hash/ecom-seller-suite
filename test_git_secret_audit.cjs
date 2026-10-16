const { execSync } = require('child_process');

console.log('=== FULL GIT HISTORY SECRET AUDIT (Gitleaks / Trufflehog Ruleset) ===\n');

// Standard Gitleaks & Trufflehog high-signal patterns
const SECRET_PATTERNS = [
  { name: 'AWS Access Key ID', regex: /AKIA[0-9A-Z]{16}/ },
  { name: 'Google API Key', regex: /AIza[0-9A-Za-z\\-_]{35}/ },
  { name: 'GitHub Personal Access Token', regex: /gh[pousr]_[A-Za-z0-9_]{36,}/ },
  { name: 'OpenAI Secret API Key', regex: /sk-[A-Za-z0-9_-]{32,}/ },
  { name: 'Slack Bot Token', regex: /xoxb-[0-9]{11}-[0-9]{11}-[a-zA-Z0-9]{24}/ },
  { name: 'RSA/EC/OpenSSH Private Key', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
  { name: 'Supabase Service Role Key', regex: /service_role/i }
];

try {
  // Extract all git diffs across the entire commit history
  const gitLogDiff = execSync('git log -p --full-history', { maxBuffer: 50 * 1024 * 1024, encoding: 'utf8' });
  console.log(`Audited git history diff size: ${(gitLogDiff.length / 1024).toFixed(1)} KB across all commits.`);

  let leaksFound = 0;
  const lines = gitLogDiff.split('\n');

  lines.forEach((line, idx) => {
    // Only inspect added lines
    if (!line.startsWith('+') || line.startsWith('+++')) return;
    
    SECRET_PATTERNS.forEach(pat => {
      if (pat.regex.test(line)) {
        // Exclude test mocks and false positives if any
        if (line.includes('AKIAIOSFODNN7EXAMPLE') || line.includes('sk-test-') || line.includes('NODE_MODULES')) return;
        console.log(`[ALERT] Matched Pattern: ${pat.name}`);
        console.log(`Line ${idx + 1}: ${line.trim().slice(0, 80)}...`);
        leaksFound++;
      }
    });
  });

  if (leaksFound === 0) {
    console.log('>>> ZERO (0) SECRETS DETECTED ACROSS ENTIRE GIT COMMIT HISTORY.');
    console.log('>>> NO AWS KEYS, NO GOOGLE KEYS, NO GITHUB TOKENS, NO OPENAI KEYS, NO SERVICE_ROLE KEYS.');
  } else {
    console.log(`>>> TOTAL DETECTED LEAKS: ${leaksFound}`);
  }
} catch (err) {
  console.error('Git log inspection error:', err.message);
}
