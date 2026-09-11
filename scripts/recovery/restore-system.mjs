import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRecoveryPoint, getRecoveryPoint, getBackupRoot, restoreMongoSnapshot } from '../../backend/services/backupService.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const requested = process.argv[2];
if (!requested) { console.error('Usage: node scripts/recovery/restore-system.mjs <recovery-id-or-directory>'); process.exit(2); }
const id = path.basename(requested);
const B = path.resolve(getBackupRoot(), id);
if (!B.startsWith(getBackupRoot() + path.sep) || !fs.existsSync(B)) { console.error(`Recovery point not found: ${id}`); process.exit(2); }
const manifest = getRecoveryPoint(id);
if (!manifest) { console.error(`Recovery point manifest missing: ${id}`); process.exit(2); }
if (manifest.status !== 'good') { console.error(`Refusing to restore a non-GOOD recovery point: ${id}`); process.exit(2); }

// Always preserve the current state before destructive restoration.
try { await createRecoveryPoint({ reason: `pre-restore-${id}` }); } catch (e) { console.warn(`[recovery] pre-restore backup could not be completed: ${e.message}`); }

const copy = (src, dest) => {
  if (!fs.existsSync(src)) throw new Error(`Missing backup artifact: ${src}`);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(src, dest, { recursive: true, force: true });
};
copy(path.join(B, 'backend-data'), path.join(ROOT, 'backend', 'data'));
if (fs.existsSync(path.join(B, 'uploads'))) copy(path.join(B, 'uploads'), path.join(ROOT, 'backend', 'uploads'));
if (fs.existsSync(path.join(B, 'docs'))) copy(path.join(B, 'docs'), path.join(ROOT, 'docs'));

const mongoDir = path.join(B, 'mongodb');
if (fs.existsSync(mongoDir) && process.env.MONGO_URI) {
  try { await restoreMongoSnapshot(mongoDir); }
  catch (e) { console.error(`[recovery] MongoDB restore failed: ${e.message}`); process.exit(1); }
}
console.log(`Restored verified recovery point ${id}.`);
console.log('Restart/redeploy the application and verify health.');
