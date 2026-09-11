import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';
import path from 'path';

const jm = jsonModel(path.join(env.DATA_DIR, 'connect-people.json'));
const schema = new mongoose.Schema({
  fullName: { type: String, required: true },
  whatsapp: { type: String, required: true },
  profession: String,
  location: String,
  interest: [String],
  message: String,
  sourceType: { type: String, default: 'general' },
  sourcePersonId: String,
  sourcePersonName: String,
  sourceCode: String,
  sourceLabel: String,
  engagementStatus: { type: String, default: 'new' },
  consentWhatsApp: { type: Boolean, default: false },
  joined: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });
const Mongo = mongoose.models.ConnectPerson || mongoose.model('ConnectPerson', schema);

export const ConnectPerson = {
  async getAll() { return isDbConnected() ? Mongo.find().sort({ createdAt: -1 }) : jm.getAll(); },
  async getById(id) { return isDbConnected() ? Mongo.findById(id) : jm.getById(id); },
  async create(data) { return isDbConnected() ? Mongo.create(data) : jm.create(data); },
  async update(id, data) { return isDbConnected() ? Mongo.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true }) : jm.update(id, data); },
  async delete(id) { return isDbConnected() ? Mongo.findByIdAndDelete(id) : jm.delete(id); },
};
