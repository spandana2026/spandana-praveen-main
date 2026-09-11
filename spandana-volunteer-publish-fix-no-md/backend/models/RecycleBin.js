import mongoose from 'mongoose';
import crypto from 'node:crypto';
import path from 'node:path';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';

const jm = jsonModel(path.join(env.DATA_DIR, 'recycle-bin.json'));
const schema = new mongoose.Schema({
  entityType: { type: String, required: true, index: true },
  entityLabel: { type: String, default: '' },
  originalId: { type: String, required: true },
  snapshot: { type: mongoose.Schema.Types.Mixed, required: true },
  deletedAt: { type: Date, default: Date.now, index: true },
  deletedBy: { type: String, default: '' },
}, { timestamps: false });
const Mongo = mongoose.models.RecycleBinItem || mongoose.model('RecycleBinItem', schema);

function clean(v) { return v?.toObject ? v.toObject() : v; }

export const RecycleBin = {
  async list() {
    if (isDbConnected()) return (await Mongo.find({}).sort({ deletedAt: -1 })).map(clean).map(x => ({ ...x, id: String(x._id) }));
    return jm.getAll().sort((a,b) => String(b.deletedAt||'').localeCompare(String(a.deletedAt||'')));
  },
  async archive({ entityType, entityLabel='', originalId, snapshot, deletedBy='' }) {
    const payload = { entityType, entityLabel, originalId: String(originalId), snapshot, deletedAt: new Date(), deletedBy };
    if (isDbConnected()) { const x = await Mongo.create(payload); return { ...clean(x), id: String(x._id) }; }
    return jm.create({ ...payload, id: crypto.randomUUID(), deletedAt: payload.deletedAt.toISOString() });
  },
  async getById(id) {
    if (isDbConnected()) return clean(await Mongo.findById(id));
    return jm.getById(id);
  },
  async remove(id) {
    if (isDbConnected()) return !!(await Mongo.findByIdAndDelete(id));
    return jm.delete(id);
  },
  async clear() {
    if (isDbConnected()) { await Mongo.deleteMany({}); return; }
    jm.replaceAll([]);
  }
};
