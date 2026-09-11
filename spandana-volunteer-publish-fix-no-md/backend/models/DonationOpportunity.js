import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';
import path from 'path';

const jm = jsonModel(path.join(env.DATA_DIR, 'donation-opportunities.json'));

const priceSchema = new mongoose.Schema({
  presets: { type: [Number], default: [] },
  monthlyPresets: { type: [Number], default: [] },
  unitCost: { type: Number, default: null },
  unitName: { type: String, default: '' },
}, { _id: false });

const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '❤️' },
  type: { type: String, enum: ['fixed', 'unit'], default: 'fixed' },
  geography: { type: String, enum: ['india', 'international', 'both'], default: 'both' },
  pricing: {
    INR: { type: priceSchema, default: () => ({}) },
    USD: { type: priceSchema, default: () => ({}) },
  },
  quantityPresets: { type: [Number], default: [] },
  targetQuantity: { type: Number, default: null },
  targetAmountINR: { type: Number, default: null },
  targetAmountUSD: { type: Number, default: null },
  impactText: { type: String, default: '' },
  active: { type: Boolean, default: true },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const DonationOpportunityMongo = mongoose.models.DonationOpportunity || mongoose.model('DonationOpportunity', schema);

function normalizeMongo(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...obj, id: String(obj._id ?? obj.id) };
}

export const DonationOpportunity = {
  async getAll(filter = null) {
    if (isDbConnected()) {
      const rows = await DonationOpportunityMongo.find(filter || {}).sort({ order: 1, createdAt: 1 });
      return rows.map(normalizeMongo);
    }
    const rows = jm.getAll(filter ? r => Object.entries(filter).every(([k, v]) => r[k] === v) : null);
    return rows.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
  },
  async getById(id) {
    if (isDbConnected()) return normalizeMongo(await DonationOpportunityMongo.findById(id));
    return jm.getById(id);
  },
  async create(data) {
    if (isDbConnected()) return normalizeMongo(await DonationOpportunityMongo.create(data));
    return jm.create(data);
  },
  async update(id, data) {
    if (isDbConnected()) return normalizeMongo(await DonationOpportunityMongo.findByIdAndUpdate(id, data, { new: true }));
    return jm.update(id, data);
  },
  async delete(id) {
    if (isDbConnected()) {
      const deleted = await DonationOpportunityMongo.findByIdAndDelete(id);
      return !!deleted;
    }
    return jm.delete(id);
  },
  async restore(id, data) {
    if (isDbConnected()) { const payload={...data}; delete payload.id; return normalizeMongo(await DonationOpportunityMongo.create({...payload,_id:id})); }
    return jm.restore(id,data);
  },
  async replaceAll(data) {
    if (isDbConnected()) {
      await DonationOpportunityMongo.deleteMany({});
      if (data.length) await DonationOpportunityMongo.insertMany(data);
      return;
    }
    jm.replaceAll(data);
  },
};
