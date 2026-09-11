import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';
import { createRecoveryPoint, listRecoveryPoints, getRecoveryPoint } from '../../backend/services/backupService.js';
import { AdminAccount, normalizeEmail } from '../../backend/models/AdminAccount.js';
import { sendMail, verifyMailTransport } from '../../backend/services/emailService.js';
import { env } from '../../backend/config/env.js';
import { connectDB } from '../../backend/config/db.js';

const exec = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const PORT = Number(process.env.RECOVERY_PORT || 5051);
const RECOVERY_EMAIL_CONFIGURED = Boolean((env.ADMIN_RECOVERY_EMAIL || process.env.ADMIN_RECOVERY_EMAIL || '').trim());
const SMTP_CONFIGURED = Boolean((env.GMAIL_USER || process.env.GMAIL_USER || '').trim() && (env.GMAIL_APP_PASSWORD || process.env.GMAIL_APP_PASSWORD || '').trim());
const APP_URL = process.env.RECOVERY_APP_URL || (process.env.NODE_ENV === 'production' ? 'http://spandana:5000' : 'http://localhost:3000');
const APP_HEALTH_PATH = process.env.RECOVERY_APP_HEALTH_PATH || '/api/v1/status';
const BACKUP_ROOT = path.resolve(process.env.BACKUP_ROOT || path.join(ROOT, 'backups'));
const COOKIE = 'spandana_recovery_session';
const OTP_TTL_MS = 10 * 60 * 1000;
const SESSION_TTL_MS = 15 * 60 * 1000;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const MAX_OTP_REQUESTS = 5;
const MAX_VERIFY_ATTEMPTS = 5;
const challenges = new Map();
const sessions = new Map();
const requestLog = new Map();
const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

function cleanExpired() {
  const now = Date.now();
  for (const [k, v] of challenges) if (v.expiresAt < now || v.usedAt) challenges.delete(k);
  for (const [k, v] of sessions) if (v.expiresAt < now) sessions.delete(k);
  for (const [k, v] of requestLog) if (v.resetAt < now) requestLog.delete(k);
}
setInterval(cleanExpired, 60_000).unref();

function clientKey(req) { return `${req.ip || 'unknown'}:${normalizeEmail(req.body?.email || '')}`; }
function limited(req) {
  const key = clientKey(req), now = Date.now();
  const item = requestLog.get(key) || { count: 0, resetAt: now + RATE_WINDOW_MS };
  if (item.resetAt < now) { item.count = 0; item.resetAt = now + RATE_WINDOW_MS; }
  item.count += 1; requestLog.set(key, item);
  return item.count > MAX_OTP_REQUESTS;
}
function sameOrigin(req) {
  const origin = req.get('origin');
  return !origin || origin === `${req.protocol}://${req.get('host')}`;
}
function setSession(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}; HttpOnly; SameSite=Strict${secure}`);
}
function clearSession(res) { res.setHeader('Set-Cookie', `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict`); }
function sessionFrom(req) {
  const raw = req.get('cookie') || '';
  const match = raw.match(new RegExp(`${COOKIE}=([^;]+)`));
  if (!match) return null;
  const token = decodeURIComponent(match[1]);
  const s = sessions.get(token);
  if (!s || s.expiresAt < Date.now()) { sessions.delete(token); return null; }
  return s;
}
function guard(req, res, next) {
  if (!sameOrigin(req)) return res.status(403).json({ error: 'Invalid recovery request origin.' });
  const session = sessionFrom(req);
  if (!session) return res.status(401).json({ error: 'Recovery verification required.' });
  req.recoverySession = session;
  next();
}
function dockerAvailable() { try { execFileSync('docker', ['version'], { stdio: 'ignore' }); return true; } catch { return false; } }
function runScript(script, args = []) { return exec('node', [path.join(ROOT, 'scripts/recovery', script), ...args], { cwd: ROOT, timeout: 10 * 60 * 1000, maxBuffer: 2 * 1024 * 1024 }); }
async function appHealth() { try { const r = await fetch(`${APP_URL}${APP_HEALTH_PATH}`, { signal: AbortSignal.timeout(3000) }); const body = await r.text(); return { ok: r.ok, status: r.status, body }; } catch (e) { return { ok: false, error: e.message }; } }
async function dockerAction(action, args=[]) { if (!dockerAvailable()) return { ok:false, error:'Docker is not available to the recovery console.' }; try { const r = await exec('docker', [action, ...args], { timeout: 120000, maxBuffer: 2*1024*1024 }); return { ok:true, stdout:r.stdout, stderr:r.stderr }; } catch(e) { return { ok:false, error:e.message, stdout:e.stdout, stderr:e.stderr }; } }
function configuredRecoveryEmail() { return normalizeEmail(process.env.ADMIN_RECOVERY_EMAIL || env.ADMIN_RECOVERY_EMAIL || ''); }
async function resolveRecoveryEmail() {
  const configured = configuredRecoveryEmail();
  if (configured) return configured;
  try { const account = await AdminAccount.get(); return normalizeEmail(account?.recoveryEmail || ''); } catch { return ''; }
}
function genericStartResponse(res) { return res.json({ success: true, message: 'If the recovery email matches, a verification code has been sent.' }); }
function maskEmail(value) { const e = normalizeEmail(value || ''); const [local, domain] = e.split('@'); if (!local || !domain) return ''; return `${local.slice(0,1)}${'*'.repeat(Math.max(1, Math.min(6, local.length - 1)))}@${domain}`; }
function envDuplicateWarnings() {
  try {
    const file = path.join(ROOT, 'backend', '.env');
    if (!fs.existsSync(file)) return [];
    const seen = new Map(), duplicates = [];
    for (const raw of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const line = raw.trim(); if (!line || line.startsWith('#')) continue;
      const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=/); if (!m) continue;
      const key = m[1]; if (seen.has(key)) duplicates.push(key); else seen.set(key, true);
    }
    return [...new Set(duplicates)];
  } catch { return []; }
}

app.get('/api/config-status', async (_req, res) => {
  // Keep the initial page load fast and reliable. SMTP verification is a separate diagnostic.
  res.json({
    recoveryEmailConfigured: RECOVERY_EMAIL_CONFIGURED,
    emailDeliveryConfigured: SMTP_CONFIGURED,
    smtpVerified: null,
    smtpError: SMTP_CONFIGURED ? null : 'Gmail delivery variables are missing.',
    sender: maskEmail(process.env.GMAIL_USER || env.GMAIL_USER || ''),
    recoveryEmail: maskEmail(configuredRecoveryEmail()),
    duplicateEnvKeys: envDuplicateWarnings(),
    otpReady: RECOVERY_EMAIL_CONFIGURED && SMTP_CONFIGURED,
    port: PORT
  });
});

app.get('/api/email-diagnostics', async (_req, res) => {
  const smtp = await verifyMailTransport();
  res.json({
    recoveryEmailConfigured: RECOVERY_EMAIL_CONFIGURED,
    sender: maskEmail(process.env.GMAIL_USER || env.GMAIL_USER || ''),
    recoveryEmail: maskEmail(configuredRecoveryEmail()),
    smtp,
    duplicateEnvKeys: envDuplicateWarnings(),
    checkedAt: new Date().toISOString()
  });
});

app.get('/recovery-console.js', (_req,res)=>res.type('application/javascript').sendFile(fileURLToPath(new URL('./recovery-console.js', import.meta.url))));

app.get('/', (_req, res) => res.type('html').send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Spandana Emergency Recovery</title><style>
body{font-family:system-ui,sans-serif;max-width:980px;margin:40px auto;padding:0 20px;background:#f7f7f7;color:#222}main{background:#fff;border:1px solid #ddd;border-radius:18px;padding:28px;box-shadow:0 8px 30px #0001}button{padding:12px 16px;border:0;border-radius:10px;margin:5px;cursor:pointer;font-weight:700}button.primary{background:#222;color:#fff}.danger{background:#fce8e8}.ok{color:#18794e}.warn{color:#a15c00}pre{white-space:pre-wrap;background:#f3f3f3;padding:14px;border-radius:10px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px}.card{border:1px solid #eee;border-radius:12px;padding:14px;margin:10px 0}input{box-sizing:border-box;padding:12px;width:100%;margin:6px 0 10px;border:1px solid #ccc;border-radius:8px}.hidden{display:none}.muted{color:#666}.recovery-summary{display:flex;justify-content:space-between;align-items:center;gap:12px;cursor:pointer;font-weight:700;padding:2px 0}.recovery-summary small{font-weight:500;color:#666}.recovery-list{margin-top:10px}.recovery-list .card:first-child{margin-top:0}details.recovery-points{border:1px solid #ddd;border-radius:12px;background:#fff;padding:12px 14px;margin:12px 0}details.recovery-points summary{list-style:none}details.recovery-points summary::-webkit-details-marker{display:none}.chevron{font-size:18px;transition:transform .15s ease}details[open] .chevron{transform:rotate(180deg)}</style></head><body><main>
<h1>🔐 Spandana Emergency Recovery</h1><p class="muted">This recovery console is independent of the Admin Panel. Email OTP recovery must be configured in backend/.env before recovery can be used.</p><div id="config" class="card"><b class="ok">🟢 Email OTP: CONFIGURED</b><br>SMTP credentials: <b>CONFIGURED</b><br>Sender: '+maskEmail(process.env.GMAIL_USER || env.GMAIL_USER || '')+'<br>Recovery email: '+maskEmail(configuredRecoveryEmail())+'</div>
<section id="login"><label>Recovery email<input id="email" type="email" autocomplete="email" placeholder="your registered recovery email"></label><button class="primary" onclick="sendCode()">Send Recovery Code</button><div id="loginMsg"></div><div id="otpBox" class="hidden"><label>One-time code<input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="6-digit code"></label><button class="primary" onclick="verifyCode()">Verify & Unlock</button></div></section>
<section id="console" class="hidden"><div id="status"></div><h2>Recovery</h2><div class="grid"><button type="button" class="primary" onclick="recover()">🔄 Recover Last Good</button><button type="button" onclick="backup()">💾 Create Backup Now</button><button type="button" onclick="restart()">♻️ Restart Application</button><button type="button" onclick="health()">🩺 Check System</button><button type="button" onclick="selfTest()">🧪 Verify SER Safely</button></div><details class="recovery-points"><summary class="recovery-summary"><span>🗂️ Recovery Points <small id="pointsSummary">Loading…</small></span><span class="chevron">⌄</span></summary><div id="points" class="recovery-list">Loading…</div></details><button onclick="logout()">🔒 Lock / Sign Out</button><pre id="log"></pre></section>
<script src="/recovery-console.js" defer></script></main></body></html>`));

app.post('/api/auth/start', async (req,res)=>{
  if (!sameOrigin(req)) return res.status(403).json({error:'Invalid recovery request origin.'});
  if (limited(req)) return res.status(429).json({error:'Too many recovery code requests. Please wait and try again.'});
  const supplied=normalizeEmail(req.body?.email||'');
  const target=await resolveRecoveryEmail();
  if (!supplied || !target || supplied!==target) return genericStartResponse(res);
  const otp=String(crypto.randomInt(100000,1000000));
  const challenge=crypto.randomBytes(32).toString('base64url');
  challenges.set(challenge,{email:target,otpHash:crypto.createHash('sha256').update(otp).digest('hex'),attempts:0,expiresAt:Date.now()+OTP_TTL_MS});
  let delivery;
  try {
    delivery=await sendMail({to:target,subject:'Spandana Emergency Recovery Code',html:`<p>Your Spandana emergency recovery verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes and can be used once.</p><p>If you did not request emergency recovery, ignore this email.</p>`});
    if (delivery?.skipped) return res.status(503).json({error:'Recovery email delivery is not configured. Configure the recovery email service before using emergency recovery.'});
  } catch (e) {
    challenges.delete(challenge);
    console.error('[recovery] OTP email delivery failed:', JSON.stringify({ code:e?.code||null, responseCode:e?.responseCode||null, command:e?.command||null, message:e?.message||'SMTP send failed' }));
    return res.status(503).json({error:'Recovery email could not be sent. Check Gmail SMTP authentication and the recovery email configuration.'});
  }
  console.log('[recovery] OTP email accepted by SMTP:', JSON.stringify({ messageId: delivery?.messageId || null, responseCode: delivery?.responseCode || null, response: delivery?.response || null }));
  res.json({success:true,challenge,message:'A recovery code has been accepted by the configured Gmail SMTP service. Check Inbox, Spam, Promotions, and All Mail.'});
});

app.post('/api/auth/verify', (req,res)=>{
  if (!sameOrigin(req)) return res.status(403).json({error:'Invalid recovery request origin.'});
  const item=challenges.get(String(req.body?.challenge||''));
  const email=normalizeEmail(req.body?.email||'');
  if (!item || item.email!==email || item.expiresAt<Date.now() || item.usedAt) return res.status(400).json({error:'Recovery code expired or invalid.'});
  if (item.attempts>=MAX_VERIFY_ATTEMPTS) return res.status(429).json({error:'Too many verification attempts.'});
  const suppliedHash=crypto.createHash('sha256').update(String(req.body?.otp||'')).digest('hex');
  if (!crypto.timingSafeEqual(Buffer.from(suppliedHash),Buffer.from(item.otpHash))) { item.attempts++; return res.status(401).json({error:'Invalid recovery code.'}); }
  item.usedAt=Date.now(); challenges.delete(String(req.body.challenge));
  const session=crypto.randomBytes(32).toString('base64url');
  sessions.set(session,{email,createdAt:Date.now(),expiresAt:Date.now()+SESSION_TTL_MS});
  setSession(res,session); res.json({success:true,expiresAt:Date.now()+SESSION_TTL_MS});
});

app.get('/api/session',(req,res)=>{const s=sessionFrom(req);res.json({authenticated:!!s,expiresAt:s?.expiresAt||null});});
app.post('/api/logout',(req,res)=>{const raw=req.get('cookie')||'';const m=raw.match(new RegExp(`${COOKIE}=([^;]+)`));if(m)sessions.delete(decodeURIComponent(m[1]));clearSession(res);res.json({success:true});});
app.get('/api/status', guard, async (_req,res)=>{const r=listRecoveryPoints();res.json({health:await appHealth(),latestGood:r.latestGood||null,backupCount:(r.backups||[]).length,backups:r.backups||[],docker:dockerAvailable(),generatedAt:new Date().toISOString()});});
app.get('/api/health', async (_req,res)=>res.json({status:'ok',service:'recovery-console',port:PORT}));
app.post('/api/health', guard, async (_req,res)=>res.json(await appHealth()));
app.post('/api/self-test', guard, async (_req,res)=>{
  const checks=[];
  const add=(name,ok,detail)=>checks.push({name,ok:Boolean(ok),detail:detail||null});
  const smtp=await verifyMailTransport();
  add('Recovery email configured', RECOVERY_EMAIL_CONFIGURED, RECOVERY_EMAIL_CONFIGURED ? 'Configured' : 'Missing ADMIN_RECOVERY_EMAIL');
  add('Gmail SMTP', smtp.verified, smtp.verified ? 'SMTP credentials accepted' : (smtp.message||smtp.error||'SMTP verification failed'));
  const healthResult=await appHealth();
  add('Main application health', healthResult.ok, healthResult.ok ? `HTTP ${healthResult.status}` : (healthResult.error || `HTTP ${healthResult.status||'unreachable'}`));
  const points=listRecoveryPoints();
  add('Recovery point index', Array.isArray(points.backups), Array.isArray(points.backups) ? `${points.backups.length} recovery points found` : 'Recovery point index unavailable');
  const dockerRequired = process.env.NODE_ENV === 'production' || process.env.RECOVERY_REQUIRE_DOCKER === 'true';
  const dockerOk = dockerAvailable();
  add('Docker availability', dockerRequired ? dockerOk : true, dockerOk ? 'Docker CLI available' : 'Not required for local testing');
  const failed=checks.filter(c=>!c.ok);
  res.json({ok:failed.length===0, summary:`${checks.length-failed.length}/${checks.length} checks passed`, checks, testedAt:new Date().toISOString(), appUrl:APP_URL, healthPath:APP_HEALTH_PATH});
});
app.post('/api/backup', guard, async (_req,res)=>{
  try {
    const result = await createRecoveryPoint({ reason: 'manual-ser', verifyUrl: `${APP_URL}${APP_HEALTH_PATH}` });
    const ok = result.status === 'good';
    res.status(200).json({
      ok: true,
      verified: ok,
      recoveryPoint: { id: result.id, status: result.status, createdAt: result.createdAt, path: result.path },
      verification: result.verification,
      included: result.included,
      mongo: result.mongo,
      application: result.application,
      message: ok ? 'Verified GOOD Recovery Point created.' : 'Recovery Point created, but verification did not pass. It remains CANDIDATE and is not safe for restore.',
      reasons: result.verification?.reasons || [],
      note: result.note
    });
  } catch (e) {
    console.error('[recovery] manual backup failed:', e);
    res.status(500).json({ ok:false, error:e.message, stack:process.env.NODE_ENV==='production'?undefined:e.stack });
  }
});
app.post('/api/restore', guard, async (req,res)=>{const id=String(req.body?.id||'');const point=getRecoveryPoint(id);if(!point||!/^recovery-[A-Za-z0-9_.-]+$/.test(id))return res.status(400).json({error:'Invalid recovery point.'});if(point.status!=='good')return res.status(409).json({error:'Only a VERIFIED GOOD recovery point can be restored from the Recovery Console.'});try{let pre=null;try{pre=await createRecoveryPoint({reason:`pre-restore-${id}`});}catch(e){return res.status(409).json({error:`Safety backup before restore failed: ${e.message}`});}const {stdout,stderr}=await runScript('restore-system.mjs',[path.join('backups',id)]);const restart=await dockerAction('restart',['spandana-app']);res.json({ok:true,recoveryPoint:id,preRestoreBackup:pre.id,restore:{stdout,stderr},restart,health:await appHealth()});}catch(e){res.status(500).json({ok:false,error:e.message,stdout:e.stdout,stderr:e.stderr});}});
app.post('/api/recover', guard, async (_req,res)=>{const idx=listRecoveryPoints();if(!idx.latestGood)return res.status(409).json({error:'No VERIFIED GOOD recovery point exists yet. Create and verify a backup first.'});try{const point=getRecoveryPoint(idx.latestGood);if(!point||point.status!=='good')return res.status(409).json({error:'The recorded last-good recovery point is not currently restorable.'});let pre=null;try{pre=await createRecoveryPoint({reason:`pre-recovery-${idx.latestGood}`});}catch(e){return res.status(409).json({error:`Safety backup before recovery failed: ${e.message}`});}const {stdout,stderr}=await runScript('restore-system.mjs',[path.join('backups',idx.latestGood)]);const restart=await dockerAction('restart',['spandana-app']);res.json({ok:true,recoveryPoint:idx.latestGood,preRecoveryBackup:pre.id,restore:{stdout,stderr},restart,health:await appHealth()});}catch(e){res.status(500).json({ok:false,error:e.message,stdout:e.stdout,stderr:e.stderr});}});
app.post('/api/restart', guard, async (_req,res)=>res.json(await dockerAction('restart',['spandana-app'])));

app.listen(PORT,()=>console.log(`[recovery] console listening on ${PORT} — email OTP protection enabled`));
const intervalMs=Math.max(6,Number(process.env.BACKUP_INTERVAL_HOURS||24))*60*60*1000;
setTimeout(async()=>{try{await createRecoveryPoint({reason:'scheduled-daily'});}catch(e){console.error('[recovery] scheduled backup failed:',e.message);}setInterval(async()=>{try{await createRecoveryPoint({reason:'scheduled-daily'});}catch(e){console.error('[recovery] scheduled backup failed:',e.message);}},intervalMs);},60*1000);
