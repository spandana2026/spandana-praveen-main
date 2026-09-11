import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { isDbConnected, connectDB } from '../config/db.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BACKUP_ROOT = path.resolve(env.BACKUP_ROOT || process.env.BACKUP_ROOT || path.join(ROOT, 'backups'));
const EXTERNAL_ROOT = env.BACKUP_EXTERNAL_DIR ? path.resolve(env.BACKUP_EXTERNAL_DIR) : (process.env.BACKUP_EXTERNAL_DIR ? path.resolve(process.env.BACKUP_EXTERNAL_DIR) : '');
const RETENTION = Math.max(3, Number.parseInt(env.BACKUP_RETENTION || process.env.BACKUP_RETENTION || '14', 10));

const ensureDir = p => fs.mkdirSync(p, { recursive: true });
const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return false;
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
  return true;
};
const copyFile = (src, dest) => {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
};
const redacted = (value, key = '') => {
  if (/(password|secret|token|api[_-]?key|private[_-]?key|authorization)/i.test(key)) return '[REDACTED]';
  if (typeof value === 'string' && /^mongodb(?:\+srv)?:\/\//i.test(value)) return value.replace(/:\/\/[^\s/@]+:[^\s@]+@/, '://[REDACTED]@');
  if (Array.isArray(value)) return value.map(v => redacted(v));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, redacted(v, k)]));
  return value;
};

function gitCommit() {
  try { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); } catch { return null; }
}
function gitBranch() {
  try { return execFileSync('git', ['branch', '--show-current'], { cwd: ROOT, encoding: 'utf8' }).trim() || null; } catch { return null; }
}

function encodeBsonValue(value) {
  if (value === null || value === undefined) return value;
  if (value instanceof Date) return { $date: value.toISOString() };
  if (Buffer.isBuffer(value)) return { $binary: value.toString('base64') };
  if (value && value._bsontype === 'ObjectId') return { $oid: value.toString() };
  if (value && value._bsontype === 'Decimal128') return { $numberDecimal: value.toString() };
  if (value && value._bsontype === 'Long') return { $numberLong: value.toString() };
  if (value && value._bsontype === 'Int32') return { $numberInt: value.toString() };
  if (value && value._bsontype === 'Double') return { $numberDouble: value.valueOf() };
  if (Array.isArray(value)) return value.map(encodeBsonValue);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, encodeBsonValue(v)]));
  return value;
}

async function mongoDump(outDir) {
  if (!env.MONGO_URI) return { status: 'not-configured', collections: [] };
  // The Recovery Console runs as a separate Node process from the main application.
  // Establish its own MongoDB connection before taking a native snapshot.
  if (!isDbConnected() || !mongoose.connection.db) {
    await connectDB();
  }
  if (!isDbConnected() || !mongoose.connection.db) return { status: 'unavailable', collections: [] };
  ensureDir(outDir);
  try {
    const db = mongoose.connection.db;
    const infos = await db.listCollections({}, { nameOnly: false }).toArray();
    const collections = [];
    for (const info of infos) {
      if (info.name.startsWith('system.')) continue;
      const collection = db.collection(info.name);
      const documents = [];
      for await (const doc of collection.find({})) documents.push(encodeBsonValue(doc));
      let indexes = [];
      try { indexes = await collection.listIndexes().toArray(); } catch {}
      fs.writeFileSync(path.join(outDir, `${info.name}.json`), JSON.stringify({
        name: info.name,
        type: info.type || 'collection',
        options: info.options || {},
        indexes: encodeBsonValue(indexes),
        documents,
      }, null, 2));
      collections.push({ name: info.name, documents: documents.length, indexes: indexes.length });
    }
    fs.writeFileSync(path.join(outDir, 'database-manifest.json'), JSON.stringify({
      schemaVersion: 1,
      databaseName: db.databaseName,
      capturedAt: new Date().toISOString(),
      collections,
      format: 'spandana-native-bson-json',
    }, null, 2));
    return { status: 'complete', format: 'spandana-native-bson-json', databaseName: db.databaseName, collections };
  } catch (error) {
    return { status: 'failed', error: error.message, collections: [] };
  }
}


function decodeBsonValue(value) {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map(decodeBsonValue);
  if (typeof value !== 'object') return value;
  if (value.$oid) return new mongoose.Types.ObjectId(value.$oid);
  if (value.$date) return new Date(value.$date);
  if (value.$binary) return Buffer.from(value.$binary, 'base64');
  if (value.$numberDecimal) return mongoose.Types.Decimal128.fromString(value.$numberDecimal);
  if (value.$numberLong) return mongoose.mongo.Long.fromString(value.$numberLong);
  if (value.$numberInt) return Number.parseInt(value.$numberInt, 10);
  if (value.$numberDouble !== undefined) return Number(value.$numberDouble);
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, decodeBsonValue(v)]));
}

export async function restoreMongoSnapshot(mongoDir) {
  if (!env.MONGO_URI) return { status: 'not-configured' };
  const dbManifestFile = path.join(mongoDir, 'database-manifest.json');
  if (!fs.existsSync(dbManifestFile)) throw new Error('Native MongoDB backup manifest is missing.');
  const dbManifest = JSON.parse(fs.readFileSync(dbManifestFile, 'utf8'));
  if (dbManifest.format !== 'spandana-native-bson-json') throw new Error('Unsupported MongoDB recovery format.');
  await mongoose.connect(env.MONGO_URI);
  try {
    const db = mongoose.connection.db;
    const current = await db.listCollections({}, { nameOnly: true }).toArray();
    for (const info of current) {
      if (!info.name.startsWith('system.')) {
        try { await db.collection(info.name).drop(); } catch {}
      }
    }
    for (const item of dbManifest.collections || []) {
      const file = path.join(mongoDir, `${item.name}.json`);
      if (!fs.existsSync(file)) throw new Error(`Missing collection backup: ${item.name}`);
      const snapshot = JSON.parse(fs.readFileSync(file, 'utf8'));
      const collection = db.collection(item.name);
      const docs = (snapshot.documents || []).map(decodeBsonValue);
      if (docs.length) await collection.insertMany(docs, { ordered: false });
      const indexes = (snapshot.indexes || []).filter(i => i.name !== '_id_');
      for (const index of indexes) {
        try {
          const keys = decodeBsonValue(index.key);
          const options = { ...decodeBsonValue(index), name: index.name };
          delete options.key; delete options.v; delete options.ns;
          await collection.createIndex(keys, options);
        } catch (indexError) {
          console.warn(`[recovery] index restore skipped for ${item.name}/${index.name}: ${indexError.message}`);
        }
      }
    }
    return { status: 'complete', databaseName: db.databaseName, collections: dbManifest.collections || [] };
  } finally {
    await mongoose.disconnect();
  }
}

function loadJson(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return null; }
}

async function mongoSettingsSnapshot() {
  if (!isDbConnected()) return null;
  try {
    const docs = await mongoose.connection.db.collection('settings').find({ key: { $in: ['live', 'draft'] } }).toArray();
    return redacted(docs);
  } catch { return null; }
}

function updateIndex(record) {
  ensureDir(BACKUP_ROOT);
  const file = path.join(BACKUP_ROOT, 'index.json');
  let index = { schemaVersion: 2, updatedAt: null, latestGood: null, backups: [] };
  try { index = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
  index.backups = [record, ...(index.backups || []).filter(x => x.id !== record.id)].slice(0, RETENTION * 2);
  if (record.status === 'good') index.latestGood = record.id;
  index.updatedAt = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(index, null, 2));
}

function applyRetention() {
  if (!fs.existsSync(BACKUP_ROOT)) return;
  const dirs = fs.readdirSync(BACKUP_ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name.startsWith('recovery-'))
    .map(e => e.name)
    .sort()
    .reverse();
  dirs.slice(RETENTION).forEach(name => fs.rmSync(path.join(BACKUP_ROOT, name), { recursive: true, force: true }));
}

export async function createRecoveryPoint({ reason = 'manual', verifyUrl = `http://127.0.0.1:${env.PORT}/api/v1/status` } = {}) {
  const now = new Date();
  const id = `recovery-${now.toISOString().replace(/[:.]/g, '-')}`;
  const out = path.join(BACKUP_ROOT, id);
  ensureDir(out);

  const included = {
    database: false,
    settings: false,
    data: copyDir(env.DATA_DIR, path.join(out, 'backend-data')),
    uploads: copyDir(env.UPLOADS_DIR, path.join(out, 'uploads')),
    docs: copyDir(path.join(ROOT, 'docs'), path.join(out, 'docs')),
    knowledge: copyFile(path.join(ROOT, 'docs', 'system-knowledge.json'), path.join(out, 'system-knowledge.json')),
  };

  const liveSettings = loadJson(path.join(env.DATA_DIR, 'settings.json'));
  const draftSettings = loadJson(path.join(env.DATA_DIR, 'settings_draft.json'));
  const settingsHistory = loadJson(path.join(env.DATA_DIR, 'settings_history.json'));
  fs.writeFileSync(path.join(out, 'settings-snapshot.json'), JSON.stringify(redacted({ live: liveSettings, draft: draftSettings, history: settingsHistory }), null, 2));
  const mongoSettings = await mongoSettingsSnapshot();
  if (mongoSettings) fs.writeFileSync(path.join(out, 'settings-mongodb-snapshot.json'), JSON.stringify(mongoSettings, null, 2));
  included.settings = true;

  const mongoResult = await mongoDump(path.join(out, 'mongodb'));
  included.database = mongoResult.status === 'complete' || mongoResult.status === 'not-configured';

  const manifest = {
    schemaVersion: 2,
    id,
    createdAt: now.toISOString(),
    reason,
    status: 'candidate',
    verifiedAt: null,
    application: { gitCommit: gitCommit(), gitBranch: gitBranch(), node: process.version, platform: process.platform },
    included,
    mongo: mongoResult,
    settings: { livePresent: !!liveSettings, draftPresent: !!draftSettings, historyPresent: !!settingsHistory, mongoSnapshotPresent: !!mongoSettings },
    secondaryDestination: EXTERNAL_ROOT || null,
    verification: { applicationHealth: 'not-checked', requiredFilesPresent: included.settings && included.data && included.docs },
    note: 'A recovery point is marked GOOD only after its required artifacts are present and application health is verified.'
  };

  try {
    const response = await fetch(verifyUrl, { signal: AbortSignal.timeout(3000) });
    manifest.verification.applicationHealth = response.ok ? 'healthy' : `http-${response.status}`;
  } catch (error) {
    manifest.verification.applicationHealth = `unreachable:${error.message}`;
  }

  const verificationReasons = [];
  if (!manifest.verification.requiredFilesPresent) verificationReasons.push('Required backup files are missing.');
  if (!included.database) verificationReasons.push(`MongoDB backup did not complete${mongoResult.error ? `: ${mongoResult.error}` : '.'}`);
  if (manifest.verification.applicationHealth !== 'healthy') verificationReasons.push(`Main application health check did not pass: ${manifest.verification.applicationHealth}.`);
  manifest.verification.reasons = verificationReasons;
  const good = manifest.verification.requiredFilesPresent && included.database && manifest.verification.applicationHealth === 'healthy';
  manifest.status = good ? 'good' : 'candidate';
  manifest.verifiedAt = good ? new Date().toISOString() : null;
  fs.writeFileSync(path.join(out, 'backup-manifest.json'), JSON.stringify(redacted(manifest), null, 2));
  updateIndex({ id, createdAt: manifest.createdAt, status: manifest.status, reason, gitCommit: manifest.application.gitCommit, sizeBytes: fs.statSync(path.join(out, 'backup-manifest.json')).size });

  if (EXTERNAL_ROOT) {
    const secondary = path.join(EXTERNAL_ROOT, id);
    try {
      copyDir(out, secondary);
      manifest.secondaryCopy = { status: 'complete', path: secondary };
      fs.writeFileSync(path.join(out, 'backup-manifest.json'), JSON.stringify(redacted(manifest), null, 2));
    } catch (error) {
      manifest.secondaryCopy = { status: 'failed', error: error.message };
      fs.writeFileSync(path.join(out, 'backup-manifest.json'), JSON.stringify(redacted(manifest), null, 2));
    }
  }

  applyRetention();
  return { ...manifest, path: out };
}

export function snapshotSettings(settings, { reason = 'settings-changed' } = {}) {
  const dir = path.join(BACKUP_ROOT, 'settings-history');
  ensureDir(dir);
  const now = new Date();
  const id = `settings-${now.toISOString().replace(/[:.]/g, '-')}`;
  const file = path.join(dir, `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(redacted({ schemaVersion: 1, id, createdAt: now.toISOString(), reason, settings }), null, 2));
  const entries = fs.readdirSync(dir).filter(x => x.endsWith('.json')).sort().reverse();
  entries.slice(RETENTION * 4).forEach(x => fs.rmSync(path.join(dir, x), { force: true }));
  return { id, file };
}

export function listRecoveryPoints() {
  try { return JSON.parse(fs.readFileSync(path.join(BACKUP_ROOT, 'index.json'), 'utf8')); }
  catch { return { schemaVersion: 2, updatedAt: null, latestGood: null, backups: [] }; }
}

export function getRecoveryPoint(id) {
  if (!id) return null;
  const dir = path.resolve(BACKUP_ROOT, id);
  if (!dir.startsWith(BACKUP_ROOT + path.sep) || !fs.existsSync(dir)) return null;
  try { return JSON.parse(fs.readFileSync(path.join(dir, 'backup-manifest.json'), 'utf8')); } catch { return null; }
}

export function getBackupRoot() { return BACKUP_ROOT; }
