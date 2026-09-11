import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';
import path from 'path';

const jm = jsonModel(path.join(env.DATA_DIR, 'connect-profiles.json'));
const schema = new mongoose.Schema({
  personName: { type: String, required: true },
  role: { type: String, required: true },
  profession: String,
  organisation: String,
  location: String,
  code: { type: String, unique: true, required: true },
  active: { type: Boolean, default: true },
  description: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Mongo = mongoose.models.ConnectProfile || mongoose.model('ConnectProfile', schema);

export const ConnectProfile = {
  async getAll() { return isDbConnected() ? Mongo.find().sort({ createdAt: -1 }) : jm.getAll(); },
  async getById(id) { return isDbConnected() ? Mongo.findById(id) : jm.getById(id); },
  async getByCode(code) { if (isDbConnected()) return Mongo.findOne({ code }); return (await jm.getAll()).find(x => x.code === code) || null; },
  async create(data) { return isDbConnected() ? Mongo.create(data) : jm.create(data); },
  async update(id, data) { return isDbConnected() ? Mongo.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }) : jm.update(id, data); },
};
