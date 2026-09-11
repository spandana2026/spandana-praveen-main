import mongoose from 'mongoose';
import crypto from 'node:crypto';
import path from 'node:path';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';

const jm = jsonModel(path.join(env.DATA_DIR, 'admin-sessions.json'));
const schema = new mongoose.Schema({
  tokenHash: { type: String, unique: true, required: true },
  adminId: { type: String, required: true },
  passwordVersion: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  lastActivityAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
  ip: { type: String, default: '' },
  userAgent: { type: String, default: '' },
}, { timestamps: false });
const SessionMongo = mongoose.models.AdminSession || mongoose.model('AdminSession', schema);

export const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
export const hashToken = token => crypto.createHash('sha256').update(token).digest('hex');
export const newToken = () => crypto.randomBytes(32).toString('base64url');

export const AdminSession = {
  async create({ adminId, passwordVersion, ip='', userAgent='' }) {
    const raw = newToken();
    const doc = { tokenHash: hashToken(raw), adminId: String(adminId), passwordVersion,
      createdAt: new Date(), lastActivityAt: new Date(), expiresAt: new Date(Date.now()+SESSION_TTL_MS), ip, userAgent };
    if (isDbConnected()) await SessionMongo.create(doc); else jm.create({ ...doc, id: crypto.randomUUID(), createdAt: doc.createdAt.toISOString(), lastActivityAt: doc.lastActivityAt.toISOString(), expiresAt: doc.expiresAt.toISOString() });
    return raw;
  },
  async find(raw) {
    if (!raw) return null;
    const h = hashToken(raw);
    if (isDbConnected()) return SessionMongo.findOne({ tokenHash: h, revokedAt: null, expiresAt: { $gt: new Date() } });
    return jm.getAll().find(s => s.tokenHash===h && !s.revokedAt && new Date(s.expiresAt).getTime()>Date.now()) || null;
  },
  async touch(session) {
    const now = new Date();
    if (isDbConnected()) return SessionMongo.findByIdAndUpdate(session._id, { lastActivityAt: now, expiresAt: new Date(Date.now()+SESSION_TTL_MS) });
    return jm.update(session.id, { lastActivityAt: now.toISOString(), expiresAt: new Date(Date.now()+SESSION_TTL_MS).toISOString() });
  },
  async revoke(raw) {
    const h = hashToken(raw);
    if (isDbConnected()) return SessionMongo.updateOne({ tokenHash:h }, { revokedAt:new Date() });
    const item = jm.getAll().find(s=>s.tokenHash===h); return item ? jm.update(item.id,{revokedAt:new Date().toISOString()}) : null;
  },
  async revokeAllForAdmin(adminId) {
    if (isDbConnected()) return SessionMongo.updateMany({adminId:String(adminId), revokedAt:null},{revokedAt:new Date()});
    jm.getAll().filter(s=>s.adminId===String(adminId)&&!s.revokedAt).forEach(s=>jm.update(s.id,{revokedAt:new Date().toISOString()}));
  },
};
