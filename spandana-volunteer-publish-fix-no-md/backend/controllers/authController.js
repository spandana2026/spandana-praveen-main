import crypto from 'node:crypto';
import { AdminAccount, hashSecret, verifySecret, normalizeEmail, normalizeMobile } from '../models/AdminAccount.js';
import { AdminSession } from '../models/AdminSession.js';
import { AdminRecoveryChallenge, hashOtp, newOtp } from '../models/AdminRecoveryChallenge.js';
import { Team, verifyPassword } from '../models/Team.js';
import { TeamSession } from '../models/TeamSession.js';
import { env } from '../config/env.js';
import { sendMail } from '../services/emailService.js';

export const ADMIN_COOKIE = 'spandana_admin_session';
export const TEAM_COOKIE = 'spandana_team_session';
const COOKIE = (name, value, maxAgeMs) => `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${Math.floor(maxAgeMs/1000)}; HttpOnly; SameSite=Lax${env.NODE_ENV === 'production' ? '; Secure' : ''}`;
const CLEAR = name => `${name}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${env.NODE_ENV === 'production' ? '; Secure' : ''}`;
const otpTarget = (channel, a) => channel === 'email' ? normalizeEmail(a.recoveryEmail || '') : normalizeMobile(a.recoveryMobile || '');

async function bootstrap() { return AdminAccount.ensureBootstrap(); }

export async function adminLogin(req, res) {
  const { password } = req.body;
  const account = await bootstrap();
  if (!password) return res.status(400).json({ error: 'Password is required' });
  if (account.lockedUntil && new Date(account.lockedUntil).getTime() > Date.now()) return res.status(423).json({ error: 'Admin access temporarily locked. Try again later.' });
  const valid = await verifySecret(password, account.passwordHash);
  if (!valid) {
    const count = Number(account.failedLoginCount || 0) + 1;
    const patch = { failedLoginCount: count, ...(count >= 5 ? { lockedUntil: new Date(Date.now() + 15*60*1000) } : {}) };
    await AdminAccount.update(account._id || account.id, patch);
    return res.status(401).json({ error: 'Invalid password' });
  }
  const updated = await AdminAccount.update(account._id || account.id, { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() });
  const id = String(account._id || account.id);
  const token = await AdminSession.create({ adminId: id, passwordVersion: account.passwordVersion || 1, ip: req.ip, userAgent: req.get('user-agent') || '' });
  res.setHeader('Set-Cookie', COOKIE(ADMIN_COOKIE, token, 8*60*60*1000));
  // Deliberately do not return the session token to JavaScript.
  res.json({ success: true, role: 'admin', account: AdminAccount.safe(updated || account) });
}

export async function adminSession(req, res) {
  if (!req.adminAccount) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, account: AdminAccount.safe(req.adminAccount) });
}

export async function changeAdminPassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword || newPassword.length < 12) return res.status(400).json({ error: 'Current password and a new password of at least 12 characters are required.' });
  const account = req.adminAccount;
  if (!(await verifySecret(currentPassword, account.passwordHash))) return res.status(401).json({ error: 'Current password is incorrect.' });
  if (await verifySecret(newPassword, account.passwordHash)) return res.status(400).json({ error: 'New password must be different.' });
  const newHash = await hashSecret(newPassword);
  const nextVersion = Number(account.passwordVersion || 1) + 1;
  await AdminAccount.update(account._id || account.id, { passwordHash: newHash, passwordVersion: nextVersion, passwordChangedAt: new Date(), failedLoginCount: 0, lockedUntil: null });
  await AdminSession.revokeAllForAdmin(String(account._id || account.id));
  const token = await AdminSession.create({ adminId: String(account._id || account.id), passwordVersion: nextVersion, ip: req.ip, userAgent: req.get('user-agent') || '' });
  res.setHeader('Set-Cookie', COOKIE(ADMIN_COOKIE, token, 8*60*60*1000));
  res.json({ success: true, message: 'Password changed. Other sessions were invalidated.' });
}

async function deliverOtp(channel, target, otp) {
  if (channel === 'email') {
    if (!target || !env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) { if (env.DEV_SHOW_OTP) console.info(`[auth][DEV] OTP for ${target}: ${otp}`); return { delivered: false, reason: 'email_delivery_not_configured' }; }
    await sendMail({ to: target, subject: 'Spandana Admin verification code', html: `<p>Your Spandana Admin verification code is <strong>${otp}</strong>.</p><p>This code expires in 10 minutes and can be used once.</p>` });
    return { delivered: true };
  }
  if (!target || !env.MOBILE_OTP_WEBHOOK_URL) { if (env.DEV_SHOW_OTP) console.info(`[auth][DEV] OTP for ${target}: ${otp}`); return { delivered: false, reason: 'mobile_delivery_not_configured' }; }
  const response = await fetch(env.MOBILE_OTP_WEBHOOK_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ mobile:target, otp, purpose:'spandana-admin-recovery' }) });
  return { delivered: response.ok };
}

export async function recoveryStart(req, res) {
  const { channel, identifier } = req.body;
  const account = await bootstrap();
  const normalized = channel === 'email' ? normalizeEmail(identifier || '') : normalizeMobile(identifier || '');
  const actual = otpTarget(channel, account);
  // Do not reveal whether the identifier exists.
  if (!['email','mobile'].includes(channel) || !normalized || !actual || normalized !== actual) return res.json({ success:true, message:'If the recovery details match, a verification code has been sent.' });
  const otp = newOtp();
  const purpose = ['recovery','change-email','change-mobile'].includes(req.body.purpose) ? req.body.purpose : 'recovery';
  const challenge = await AdminRecoveryChallenge.create({ adminId:String(account._id||account.id), purpose, channel, target:actual, otpHash:hashOtp(otp), attempts:0, verified:false, backupVerified:false, resetExpiresAt:null });
  const delivery = await deliverOtp(channel, actual, otp);
  if (!delivery.delivered) return res.status(503).json({ error: 'Recovery delivery is not configured for this channel.', challenge, delivery: delivery.reason });
  res.json({ success:true, challenge, message:'Verification code sent.' });
}

export async function recoveryVerifyOtp(req,res){
  const { challenge, otp }=req.body; const item=await AdminRecoveryChallenge.find(challenge);
  if(!item || item.verified || new Date(item.otpExpiresAt).getTime()<Date.now()) return res.status(400).json({error:'Code expired or invalid.'});
  if(Number(item.attempts||0)>=5) return res.status(429).json({error:'Too many verification attempts.'});
  if(hashOtp(String(otp||''))!==item.otpHash){ await AdminRecoveryChallenge.update(item,{attempts:Number(item.attempts||0)+1}); return res.status(401).json({error:'Invalid verification code.'}); }
  await AdminRecoveryChallenge.update(item,{verified:true});
  if (item.purpose === 'change-email' || item.purpose === 'change-mobile') {
    const patch = item.purpose === 'change-email' ? { recoveryEmail: item.target, recoveryEmailVerified: true } : { recoveryMobile: item.target, recoveryMobileVerified: true };
    const a = await AdminAccount.get(); await AdminAccount.update(a._id||a.id, patch);
    return res.json({success:true, challenge, contactVerified:true, message:'Recovery contact verified and updated.'});
  }
  return res.json({success:true, challenge, requiresBackupQuestions:(await AdminAccount.get()).backupQuestions?.length>0});
}

export async function recoveryVerifyAnswers(req,res){
  const { challenge, answers=[] }=req.body; const item=await AdminRecoveryChallenge.find(challenge); const account=await AdminAccount.get();
  if(!item || !item.verified || item.backupVerified) return res.status(400).json({error:'Recovery challenge is invalid.'});
  const qs=account?.backupQuestions||[];
  if(!qs.length) { await AdminRecoveryChallenge.update(item,{backupVerified:true,resetExpiresAt:new Date(Date.now()+15*60*1000)}); return res.json({success:true}); }
  if(!Array.isArray(answers) || answers.length!==qs.length) return res.status(400).json({error:'Please answer all backup recovery questions.'});
  for(let i=0;i<qs.length;i++){ if(!(await verifySecret(String(answers[i]||''),qs[i].answerHash))) return res.status(401).json({error:'Backup recovery answers did not match.'}); }
  await AdminRecoveryChallenge.update(item,{backupVerified:true,resetExpiresAt:new Date(Date.now()+15*60*1000)}); res.json({success:true});
}

export async function recoveryReset(req,res){
  const { challenge, newPassword }=req.body; const item=await AdminRecoveryChallenge.find(challenge); const account=await AdminAccount.get();
  if(!item || !item.verified || !item.backupVerified || !item.resetExpiresAt || new Date(item.resetExpiresAt).getTime()<Date.now()) return res.status(400).json({error:'Recovery session is invalid or expired.'});
  if(!newPassword || newPassword.length<12) return res.status(400).json({error:'New password must be at least 12 characters.'});
  const nextVersion=Number(account.passwordVersion||1)+1; await AdminAccount.update(account._id||account.id,{passwordHash:await hashSecret(newPassword),passwordVersion:nextVersion,passwordChangedAt:new Date(),failedLoginCount:0,lockedUntil:null}); await AdminSession.revokeAllForAdmin(String(account._id||account.id));
  await AdminRecoveryChallenge.update(item,{usedAt:new Date(),resetExpiresAt:new Date(0)});
  res.json({success:true,message:'Password reset successfully. All existing Admin sessions were invalidated.'});
}

export async function updateRecoveryDetails(req,res){
  const account=req.adminAccount; const {email,mobile}=req.body; const patch={};
  if(email!==undefined) patch.recoveryEmail=normalizeEmail(email); if(mobile!==undefined) patch.recoveryMobile=normalizeMobile(mobile);
  if(email!==undefined) patch.recoveryEmailVerified=false; if(mobile!==undefined) patch.recoveryMobileVerified=false;
  await AdminAccount.update(account._id||account.id,patch); res.json({success:true,message:'Recovery details updated. New contact details must be verified before they are usable for recovery.'});
}

export async function updateBackupQuestions(req,res){
  const account=req.adminAccount; const {questions=[], currentPassword}=req.body; if(!(await verifySecret(currentPassword||'',account.passwordHash))) return res.status(401).json({error:'Current password is required.'});
  if(!Array.isArray(questions) || questions.length>3) return res.status(400).json({error:'Provide up to 3 backup recovery questions.'});
  const cleaned=[]; for(const q of questions){ if(!q?.question || !q?.answer || String(q.answer).length<6) return res.status(400).json({error:'Each question needs an answer of at least 6 characters.'}); cleaned.push({question:String(q.question).trim(),answerHash:await hashSecret(String(q.answer))}); }
  await AdminAccount.update(account._id||account.id,{backupQuestions:cleaned}); res.json({success:true,message:'Backup recovery questions updated.'});
}

export async function securityOverview(req,res){ const a=req.adminAccount; res.json({account:AdminAccount.safe(a), backupQuestionCount:(a.backupQuestions||[]).length, recovery:{email:!!a.recoveryEmail,emailVerified:!!a.recoveryEmailVerified,mobile:!!a.recoveryMobile,mobileVerified:!!a.recoveryMobileVerified}, passwordChangedAt:a.passwordChangedAt||null}); }

export async function teamSession(req,res){ if(!req.teamMember)return res.status(401).json({authenticated:false}); res.json({authenticated:true,member:{name:req.teamMember.name,username:req.teamMember.username,role:req.teamMember.role}}); }

export async function teamLogin(req, res) {
  const { username, password } = req.body; if(!username||!password)return res.status(400).json({error:'username and password required'});
  const member=await Team.findByUsername(username); if(!member || !(await verifyPassword(password,member.passwordHash))) return res.status(401).json({error:'Invalid credentials'});
  const token=await TeamSession.create({memberId:String(member._id||member.id),username,ip:req.ip,userAgent:req.get('user-agent')||''}); res.setHeader('Set-Cookie',COOKIE(TEAM_COOKIE,token,8*60*60*1000)); const safeMember={name:member.name,username,role:member.role}; res.json({success:true,name:member.name,role:member.role,member:safeMember});
}
export async function logout(req,res){ const c=(req.headers.cookie||'').split(';').map(v=>v.trim()); const ac=c.find(v=>v.startsWith(ADMIN_COOKIE+'='))?.split('=').slice(1).join('='); const tc=c.find(v=>v.startsWith(TEAM_COOKIE+'='))?.split('=').slice(1).join('='); if(ac) await AdminSession.revoke(decodeURIComponent(ac)); if(tc) await TeamSession.revoke(decodeURIComponent(tc)); res.setHeader('Set-Cookie',[CLEAR(ADMIN_COOKIE),CLEAR(TEAM_COOKIE)]); res.json({success:true,message:'Logged out'}); }
