import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import path from 'node:path';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';

const ROUNDS = 12;
const jm = jsonModel(path.join(env.DATA_DIR, 'admin-account.json'));

const schema = new mongoose.Schema({
  username: { type: String, unique: true, default: 'admin' },
  passwordHash: { type: String, required: true },
  recoveryEmail: { type: String, default: '' },
  recoveryMobile: { type: String, default: '' },
  recoveryEmailVerified: { type: Boolean, default: false },
  recoveryMobileVerified: { type: Boolean, default: false },
  backupQuestions: [{ question: String, answerHash: String }],
  passwordVersion: { type: Number, default: 1 },
  failedLoginCount: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },
  lastLoginAt: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: null },
}, { timestamps: true });

const AdminMongo = mongoose.models.AdminAccount || mongoose.model('AdminAccount', schema);

function normalize(o) {
  if (!o) return null;
  const c = { ...o };
  delete c.passwordHash;
  delete c.backupQuestions;
  delete c.failedLoginCount;
  delete c.lockedUntil;
  return c;
}

export async function hashSecret(value) { return bcrypt.hash(value, ROUNDS); }
export async function verifySecret(value, hash) { return bcrypt.compare(value, hash); }
export function normalizeEmail(v='') { return String(v).trim().toLowerCase(); }
export function normalizeMobile(v='') { return String(v).trim(); }

export const AdminAccount = {
  async get() {
    if (isDbConnected()) return AdminMongo.findOne({ username: 'admin' });
    return jm.getAll()[0] || null;
  },
  async getSafe() { return normalize(await this.get()); },
  async ensureBootstrap() {
    let a = await this.get();
    if (a) return a;
    const passwordHash = await hashSecret(env.ADMIN_PASSWORD);
    const doc = {
      id: crypto.randomUUID(), username: 'admin', passwordHash,
      recoveryEmail: normalizeEmail(env.ADMIN_RECOVERY_EMAIL || ''),
      recoveryMobile: normalizeMobile(env.ADMIN_RECOVERY_MOBILE || ''),
      recoveryEmailVerified: !!env.ADMIN_RECOVERY_EMAIL,
      recoveryMobileVerified: false,
      backupQuestions: [], passwordVersion: 1, failedLoginCount: 0,
      lockedUntil: null, lastLoginAt: null, passwordChangedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    };
    if (isDbConnected()) {
      const m = await AdminMongo.create(doc); a = m;
    } else {
      a = jm.create(doc);
    }
    return a;
  },
  async update(id, patch) {
    if (isDbConnected()) return AdminMongo.findByIdAndUpdate(id, patch, { new: true });
    const current = await this.get();
    if (!current) return null;
    return jm.update(current.id, patch);
  },
  async verifyPassword(password) {
    const a = await this.get();
    return a ? verifySecret(password, a.passwordHash) : false;
  },
  safe: normalize,
};
