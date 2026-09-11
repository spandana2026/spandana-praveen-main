import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { requireAdmin } from '../../middleware/auth.js';
import { env } from '../../config/env.js';
import { isDbConnected } from '../../config/db.js';
import { recordDiagnostic, listDiagnostics, diagnosticSummary, clearDiagnostics } from '../../services/diagnostics.js';
import { BlogPost } from '../../models/BlogPost.js';
import { Event } from '../../models/Event.js';
import { Program } from '../../models/Program.js';
import { Story } from '../../models/Story.js';
import { Testimonial } from '../../models/Testimonial.js';
import { Volunteer } from '../../models/Volunteer.js';
import { Team } from '../../models/Team.js';
import { EmergencyCampaign } from '../../models/EmergencyCampaign.js';
import { Gallery } from '../../models/Gallery.js';
import { DonationOpportunity } from '../../models/DonationOpportunity.js';
import { FundraisingCampaign, Requirement, Contribution, Transaction, Refund, Receipt } from '../../models/SupportModels.js';
import { listRecoveryPoints } from '../../services/backupService.js';

const router = Router();
const dataDir = env.DATA_DIR;

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const knowledgePath = path.join(repoRoot, 'docs', 'system-knowledge.json');

function loadKnowledgeBase() {
  try { return JSON.parse(fs.readFileSync(knowledgePath, 'utf8')); }
  catch { return { schemaVersion: 2, title: 'Spandana System Knowledge', purpose: '', domains: [] }; }
}

function slug(v) { return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 90); }
function humanize(v) { return String(v).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function flattenSettings(value, prefix = '', out = []) {
  if (value === null || value === undefined) return out;
  if (Array.isArray(value)) {
    value.forEach((v, i) => {
      if (typeof v === 'object' && v !== null) flattenSettings(v, `${prefix}[${i}]`, out);
      else out.push({ path: `${prefix}[${i}]`, label: `${humanize(prefix)} ${i + 1}`, value: v });
    });
    return out;
  }
  if (typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      const next = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === 'object') flattenSettings(v, next, out);
      else out.push({ path: next, label: humanize(k), value: v });
    }
    return out;
  }
  out.push({ path: prefix, label: humanize(prefix.split('.').pop() || prefix), value });
  return out;
}
function settingExplanation(item) {
  const p = item.path.toLowerCase();
  if (/label/.test(p)) return 'Controls the user-facing wording shown for this action or element. It exists so administrators can change presentation language without changing application code.';
  if (/destination|href|url/.test(p)) return 'Controls where the related action takes the visitor. It is a configuration value so destinations can change without editing the component.';
  if (/enabled|visible|show|hide/.test(p)) return 'Controls whether this feature or element is active/visible. Visibility changes preserve the configured record rather than requiring deletion.';
  if (/color|font|size|gap|padding|height|width|offset|position|scale/.test(p)) return 'Controls presentation only. It exists so the visual system can be tuned centrally while the underlying navigation/content structure remains canonical.';
  if (/order|ids/.test(p)) return 'Controls presentation order or membership of a canonical structure. It changes sequence/placement without creating duplicate records.';
  return 'A persisted system setting used by the application. The Knowledge Center exposes its current path and value so the setting can be understood and traced to its implementation.';
}
function knowledgeRecords() {
  const base = loadKnowledgeBase();
  const records = [];
  for (const domain of base.domains || []) for (const r of domain.records || []) records.push({ ...r, domainId: domain.id, domainLabel: domain.label });
  let settings = {};
  for (const candidate of [path.join(dataDir, 'settings.json'), path.join(dataDir, 'settings_draft.json')]) {
    try { settings = JSON.parse(fs.readFileSync(candidate, 'utf8')); break; } catch {}
  }
  for (const item of flattenSettings(settings).slice(0, 1500)) {
    records.push({ id: `setting:${slug(item.path)}`, title: `${item.label} (${item.path})`, domainId: 'settings', domainLabel: 'Settings & Design', tags: ['setting', ...item.path.split('.'), item.label.toLowerCase()], answer: settingExplanation(item), currentValue: redactValue(item.path.split('.').pop(), item.value), status: 'implemented', settingPath: item.path });
  }
  return records;
}
function repositoryReferences(q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  const roots = ['frontend/src', 'backend', 'scripts', 'docs', 'nginx'].map(r => path.join(repoRoot, r));
  const matches = [];
  const walk = dir => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
      if (['node_modules','.git','dist'].includes(entry.name)) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      const rel = path.relative(repoRoot, full).replaceAll('\\','/');
      const name = entry.name.toLowerCase();
      if (name.includes(needle) || rel.toLowerCase().includes(needle)) {
        const st=fs.statSync(full);
        matches.push({ id:`repo:${rel}`, title:entry.name, domainId:'repository', domainLabel:'Repository Reference', path:rel, bytes:st.size, modifiedAt:st.mtime.toISOString(), answer:'This is the actual repository source reference. The Knowledge Center does not duplicate the code here; it points to the repository so implementation stays in one place.', status:'repository-source' });
      }
      if (matches.length >= 80) return;
    }
  };
  roots.forEach(walk);
  return matches.slice(0,80);
}



function redactValue(key, value) {
  const k = String(key || '').toLowerCase();
  if (/(password|secret|token|api[_-]?key|private[_-]?key|app[_-]?password|authorization)/i.test(k)) return '[REDACTED]';
  if (value && typeof value.toHexString === 'function') return value.toHexString();
  if (value instanceof Date) return value.toISOString();
  if (typeof value === 'string' && /^mongodb(?:\+srv)?:\/\//i.test(value)) return value.replace(/:\/\/[^\s/]+:[^\s@]+@/, '://[REDACTED]@');
  if (Array.isArray(value)) return value.map(v => redactValue('', v));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k,v]) => [k, redactValue(k,v)]));
  return value;
}

function packageInventory() {
  const roots = [repoRoot, path.join(repoRoot, 'frontend'), path.join(repoRoot, 'backend')];
  const out = {};
  for (const dir of roots) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      out[path.relative(repoRoot, dir) || '.'] = redactValue('', pkg);
    } catch {}
  }
  return out;
}

function envInventory() {
  const keys = Object.keys(process.env).filter(k => /^(NODE_ENV|PORT|HOST|MONGO_URI|DATA_DIR|UPLOADS_DIR|FRONTEND|PUBLIC|SMTP|GMAIL|MAIL|DNS|DOMAIN|ADMIN|SESSION)/i.test(k));
  return Object.fromEntries(keys.sort().map(k => [k, redactValue(k, process.env[k])]));
}

async function mongoSnapshot() {
  if (!isDbConnected() || !mongoose.connection.db) return { connected: false, collections: [] };
  const infos = await mongoose.connection.db.listCollections().toArray();
  const collections = [];
  for (const info of infos) {
    try {
      const docs = await mongoose.connection.db.collection(info.name).find({}).limit(10000).toArray();
      collections.push({ name: info.name, exportedDocuments: docs.length, documents: redactValue('', docs) });
    } catch (err) {
      collections.push({ name: info.name, error: err.message });
    }
  }
  return { connected: true, collections };
}

function fileInventory() {
  const roots = ['frontend/src', 'backend', 'docs', 'tests', 'scripts'].map(r => path.join(repoRoot, r));
  const files = [];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const walk = dir => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.name === 'node_modules' || entry.name === '.git') continue;
        if (entry.isDirectory()) walk(full);
        else { const st = fs.statSync(full); files.push({ path: path.relative(repoRoot, full).replaceAll('\\','/'), bytes: st.size, modifiedAt: st.mtime.toISOString() }); }
      }
    };
    walk(root);
  }
  return files;
}

router.get('/admin/system/knowledge', requireAdmin, (_req, res) => {
  try {
    const docsPath = path.join(repoRoot, 'docs', 'SPANDANA_SYSTEM_KNOWLEDGE.md');
    const documentation = fs.existsSync(docsPath) ? fs.readFileSync(docsPath, 'utf8') : '';
    const kb = loadKnowledgeBase();
    const records = knowledgeRecords();
    res.json({
      generatedAt: new Date().toISOString(),
      documentation,
      knowledgeBase: { schemaVersion: kb.schemaVersion, purpose: kb.purpose, domains: kb.domains || [], recordCount: records.length },
      manifest: {
        system: { name: 'Spandana Care Aid Foundation', generatedAt: new Date().toISOString() },
        runtime: { node: process.version, environment: env.NODE_ENV, pid: process.pid },
        database: { configured: !!env.MONGO_URI, connected: isDbConnected(), readyState: mongoose.connection.readyState },
        packages: packageInventory(), environment: envInventory(),
        repository: { root: repoRoot, sourceOfTruth: 'Git repository', filesIndexed: fileInventory().length },
        documentation: { canonicalFile: 'docs/system-knowledge.json', legacyExportFile: 'docs/SPANDANA_SYSTEM_KNOWLEDGE.md' },
        recovery: (() => { const r = listRecoveryPoints(); return { passwordRecoveryOutsidePanel: true, independentRecoveryConsole: fs.existsSync(path.join(repoRoot,'scripts/recovery/recovery-console.mjs')), dockerRestartPolicy: fs.existsSync(path.join(repoRoot,'docker-compose.yml')), pm2DeploymentSupport: fs.existsSync(path.join(repoRoot,'deploy.sh')), recoveryTooling: fs.existsSync(path.join(repoRoot,'scripts/recovery')), latestGoodRecoveryPoint: r.latestGood || null, recoveryPointCount: (r.backups || []).length, backupRetention: env.BACKUP_RETENTION, secondaryDestinationConfigured: !!env.BACKUP_EXTERNAL_DIR }; })()
      },
    });
  } catch (err) { res.status(500).json({ error: 'Could not load system knowledge', details: err.message }); }
});

router.get('/admin/system/knowledge/search', requireAdmin, (req, res) => {
  try {
    const q = String(req.query.q || '').trim().toLowerCase();
    const area = String(req.query.area || '').trim().toLowerCase();
    if (q.length < 2 && !area) return res.json({ query:q, results:[] });
    const records = knowledgeRecords();
    const scored = records.map(r => {
      const hay = [r.title, r.answer, ...(r.tags || []), r.settingPath || '', r.domainLabel || ''].join(' ').toLowerCase();
      let score = area && !q ? 1 : 0;
      if (q && r.title?.toLowerCase() === q) score += 100;
      if (q && r.title?.toLowerCase().includes(q)) score += 45;
      if (q && hay.includes(q)) score += 20;
      for (const token of q.split(/\s+/).filter(Boolean)) if (token && hay.includes(token)) score += 4;
      if (area && r.domainId === area) score += 30;
      return {...r, score};
    }).filter(r => r.score > 0 && (!area || r.domainId === area)).sort((a,b)=>b.score-a.score).slice(0,50);
    const repos = repositoryReferences(q);
    res.json({ query:q, results:[...scored, ...repos].slice(0,70) });
  } catch (err) { res.status(500).json({error:'Knowledge search failed',details:err.message}); }
});

router.get('/admin/system/knowledge/item', requireAdmin, (req, res) => {
  const id = String(req.query.id || '');
  const item = knowledgeRecords().find(r => r.id === id);
  if (item) return res.json({ item });
  if (id.startsWith('repo:')) {
    const rel=id.slice(5); const full=path.resolve(repoRoot, rel);
    if (!full.startsWith(repoRoot + path.sep) || !fs.existsSync(full) || fs.statSync(full).isDirectory()) return res.status(404).json({error:'Repository item not found'});
    const st=fs.statSync(full); return res.json({item:{id,title:path.basename(full),domainId:'repository',domainLabel:'Repository Reference',path:rel,bytes:st.size,modifiedAt:st.mtime.toISOString(),answer:'Actual repository source. The Knowledge Center references this file rather than maintaining a duplicate copy.'}});
  }
  res.status(404).json({error:'Knowledge item not found'});
});

router.get('/admin/system/export', requireAdmin, async (_req, res) => {
  try {
    const docsPath = path.resolve(process.cwd(), '..', 'docs', 'SPANDANA_SYSTEM_KNOWLEDGE.md');
    const docs = fs.existsSync(docsPath) ? fs.readFileSync(docsPath, 'utf8') : '';
    let settings = null;
    for (const candidate of [path.join(dataDir, 'settings.json'), path.join(dataDir, 'settings_draft.json')]) {
      try { if (!settings) settings = JSON.parse(fs.readFileSync(candidate, 'utf8')); } catch {}
    }
    const apiDocs = { baseUrl: '/api/v1', generatedAt: new Date().toISOString(), note: 'See /api/v1/docs for the live endpoint inventory.' };
    const mongo = await mongoSnapshot();
    res.json({
      exportType: 'Spandana Complete System Snapshot',
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      warning: 'Secrets, passwords, tokens and private keys are redacted. This JSON snapshot is an operational record, not a byte-for-byte code archive.',
      manifest: {
        runtime: { node: process.version, environment: env.NODE_ENV, platform: process.platform, arch: process.arch },
        database: { configured: !!env.MONGO_URI, connected: isDbConnected(), readyState: mongoose.connection.readyState },
        packages: packageInventory(),
        environment: envInventory(),
        files: fileInventory(),
      },
      siteSettings: redactValue('', settings),
      knowledgeBase: loadKnowledgeBase(),
      recovery: (() => { const r = listRecoveryPoints(); return { passwordRecoveryOutsidePanel: true, independentRecoveryConsole: fs.existsSync(path.join(repoRoot,'scripts/recovery/recovery-console.mjs')), dockerRestartPolicy: fs.existsSync(path.join(repoRoot, 'docker-compose.yml')), pm2DeploymentSupport: fs.existsSync(path.join(repoRoot, 'deploy.sh')), recoveryTooling: fs.existsSync(path.join(repoRoot, 'scripts', 'recovery')), latestGoodRecoveryPoint: r.latestGood || null, recoveryPointCount: (r.backups || []).length, backupRetention: env.BACKUP_RETENTION, secondaryDestinationConfigured: !!env.BACKUP_EXTERNAL_DIR, note: 'External backup destinations and hosting failover remain operational dependencies.' }; })(),
      api: apiDocs,
      documentation: docs,
      mongodb: mongo,
    });
  } catch (err) { res.status(500).json({ error: 'System export failed', details: err.message }); }
});

router.get('/admin/system/health', requireAdmin, async (_req, res) => {
  const frontendDist = path.resolve(process.cwd(), '..', 'frontend', 'dist');
  const checks = {
    frontend: { status: 'ok', message: 'Admin frontend is responding' },
    backend: { status: 'ok', message: `Node ${process.version}` },
    database: isDbConnected() ? { status: 'ok', message: 'MongoDB connected' } : { status: env.MONGO_URI ? 'warn' : 'warn', message: env.MONGO_URI ? 'MongoDB unavailable; JSON fallback may be active' : 'MONGO_URI not configured; JSON fallback mode' },
    media: { status: fs.existsSync(env.UPLOADS_DIR) ? 'ok' : 'warn', message: fs.existsSync(env.UPLOADS_DIR) ? 'Upload directory available' : 'Upload directory missing' },
    authentication: { status: 'ok', message: 'Admin route protection is enabled' },
    api: { status: 'ok', message: 'API router responding' },
    docs: { status: 'ok', message: '/api/v1/docs available' },
  };
  let recent = listDiagnostics({ limit: 1 })[0] || null;
  res.json({ status: Object.values(checks).some(c => c.status === 'error') ? 'error' : Object.values(checks).some(c => c.status === 'warn') ? 'warn' : 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV, pid: process.pid, uptimeSeconds: Math.round(process.uptime()), mongodbReadyState: mongoose.connection.readyState, frontendDistPresent: fs.existsSync(frontendDist), checks, lastError: recent?.type === 'ERROR' ? recent : null, summary: diagnosticSummary() });
});

router.get('/admin/system/diagnostics', requireAdmin, (_req, res) => {
  res.json({ summary: diagnosticSummary(), events: listDiagnostics({ type: _req.query.type || undefined, area: _req.query.area || undefined, limit: _req.query.limit || 100 }) });
});

router.delete('/admin/system/diagnostics', requireAdmin, (_req, res) => {
  clearDiagnostics();
  res.json({ ok: true });
});

function text(v) {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map(text).join(' ');
  if (typeof v === 'object') return Object.values(v).map(text).join(' ');
  return '';
}

router.get('/admin/search', requireAdmin, async (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const limit = Math.min(Math.max(Number(req.query.limit) || 40, 1), 100);
  if (q.length < 2) return res.json({ query: q, results: [] });
  const results = [];
  const seen = new Set();

  // Search canonical model records first. Each model supports MongoDB and JSON fallback.
  const sources = [
    ['Blog', BlogPost], ['Events', Event], ['Programs', Program], ['Stories', Story],
    ['Testimonials', Testimonial], ['Volunteers', Volunteer], ['Team', Team], ['Donation Opportunities', DonationOpportunity], ['Fundraising Campaigns', FundraisingCampaign], ['Requirements', Requirement], ['Contributions', Contribution], ['Transactions', Transaction], ['Refunds', Refund], ['Receipts', Receipt],
    ['Emergency Campaigns', EmergencyCampaign], ['Media', Gallery],
  ];
  for (const [moduleName, model] of sources) {
    if (results.length >= limit) break;
    try {
      const rows = await model.getAll();
      for (const row of (rows || [])) {
        if (results.length >= limit || !row) break;
        const haystack = text(row).toLowerCase();
        if (!haystack.includes(q)) continue;
        const recordId = String(row.id || row._id || `${moduleName}-${results.length}`);
        const key = `${moduleName}:${recordId}`;
        if (seen.has(key)) continue;
        seen.add(key);
        results.push({ type: 'content', module: moduleName, recordId, title: row.title || row.name || row.label || row.username || row.sponsor || moduleName, excerpt: haystack.slice(0, 180) });
      }
    } catch (err) {
      recordDiagnostic({ area: 'DB', type: 'WARN', code: 'DB-SEARCH-001', message: `Search failed in ${moduleName}`, details: { error: err.message } });
    }
  }

  // Search remaining JSON-backed configuration/data so navigation/settings are discoverable too.
  const files = fs.existsSync(dataDir) ? fs.readdirSync(dataDir).filter(f => f.endsWith('.json')) : [];
  for (const file of files) {
    if (results.length >= limit) break;
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf8'));
      const rows = Array.isArray(raw) ? raw : [raw];
      rows.forEach((row, idx) => {
        if (results.length >= limit || !row) return;
        const haystack = text(row).toLowerCase();
        if (!haystack.includes(q)) return;
        const moduleName = file.replace(/\.json$/, '').replace(/[-_]+/g, ' ');
        const recordId = String(row.id || row._id || idx);
        const key = `${moduleName}:${recordId}`;
        if (seen.has(key)) return;
        seen.add(key);
        results.push({ type: 'content', module: moduleName, recordId, title: row.title || row.name || row.label || row.username || row.sponsor || moduleName, excerpt: haystack.slice(0, 180) });
      });
    } catch (err) {
      recordDiagnostic({ area: 'DB', type: 'WARN', code: 'DB-SEARCH-001', message: `Could not read ${file} during Admin search`, details: { error: err.message } });
    }
  }
  const navPath = path.join(dataDir, 'settings.json');
  try {
    const settings = JSON.parse(fs.readFileSync(navPath, 'utf8'));
    const links = settings?.nav?.links || [];
    const walk = (items, parent = '') => items.forEach(item => { if (results.length >= limit) return; const label = `${parent}${item.label || ''}`; if (label.toLowerCase().includes(q)) results.push({ type: 'navigation', module: 'Main Menu / Navigation', recordId: item.id || label, title: label, excerpt: item.href || item.destination || 'Navigation item' }); walk(item.children || [], `${label} → `); });
    walk(links);
  } catch {}
  res.json({ query: q, results });
});

export default router;
