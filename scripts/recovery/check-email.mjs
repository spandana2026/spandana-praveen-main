import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { env } from '../../backend/config/env.js';
import { verifyMailTransport } from '../../backend/services/emailService.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const maskEmail = value => { const e=String(value||'').trim().toLowerCase(); const [local,domain]=e.split('@'); return local&&domain ? `${local.slice(0,1)}${'*'.repeat(Math.max(1,Math.min(6,local.length-1)))}@${domain}` : '(not configured)'; };
const duplicates=[];
try {
  const file=path.join(ROOT,'backend','.env');
  if (fs.existsSync(file)) {
    const seen=new Set();
    for (const raw of fs.readFileSync(file,'utf8').split(/\r?\n/)) { const line=raw.trim(); if(!line||line.startsWith('#')) continue; const m=line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/); if(!m) continue; if(seen.has(m[1])) duplicates.push(m[1]); seen.add(m[1]); }
  }
} catch {}

console.log('\n[recovery] Email diagnostic');
console.log(`  Sender:          ${maskEmail(env.GMAIL_USER)}`);
console.log(`  Recovery email:  ${maskEmail(env.ADMIN_RECOVERY_EMAIL)}`);
console.log(`  App Password:    ${env.GMAIL_APP_PASSWORD ? 'configured' : 'missing'} (value hidden)`);
if (duplicates.length) console.log(`  .env duplicates: ${[...new Set(duplicates)].join(', ')}`);
const result = await verifyMailTransport();
if (result.verified) {
  console.log('  SMTP status:     VERIFIED');
  console.log('  Gmail accepted the SMTP credentials.');
  console.log('  Next step: click Send Recovery Code in the Recovery Console.');
  process.exit(0);
}
console.error('  SMTP status:     FAILED');
console.error(`  Error:           ${result.message || result.error || 'SMTP verification failed'}`);
if (result.code) console.error(`  Code:            ${result.code}`);
if (result.responseCode) console.error(`  Response code:   ${result.responseCode}`);
console.error('  The App Password itself is never printed.');
process.exit(1);
