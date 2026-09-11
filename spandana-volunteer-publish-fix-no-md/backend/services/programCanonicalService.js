import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

const canonicalFile = path.join(env.DATA_DIR, 'health-programs-canonical.json');
const snapshotFile = path.join(env.DATA_DIR, 'health-programs.json');

const legacyTitleMap = new Map([
  ['Medical Aid Camp', 'health-wellness'],
  ['Skill Development', 'skills-vocational-development'],
  ['Mental Health Awareness', 'talk-connect'],
]);

function atomicWrite(filePath, data) {
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
}

export function readCanonicalPrograms() {
  try {
    const rows = JSON.parse(fs.readFileSync(canonicalFile, 'utf8'));
    return Array.isArray(rows) ? rows : [];
  } catch {
    return [];
  }
}

let lastSnapshotSignature = '';

export function writeProgramSnapshot(rows) {
  if (!Array.isArray(rows)) return;
  const snapshot = rows.map(row => {
    if (row && typeof row.toObject === 'function') return row.toObject({ depopulate: true });
    return row;
  });
  const serialized = JSON.stringify(snapshot);
  if (serialized === lastSnapshotSignature) return;
  lastSnapshotSignature = serialized;
  atomicWrite(snapshotFile, snapshot);
}

export function getLegacyProgramKey(title) {
  return legacyTitleMap.get(String(title || '').trim()) || null;
}

export function canonicalProgramKeys() {
  return new Set(readCanonicalPrograms().map(p => p.programKey).filter(Boolean));
}
