import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel }     from './base.js';
import { env }           from '../config/env.js';
import path from 'path';
import { writeProgramSnapshot, readCanonicalPrograms, getLegacyProgramKey } from '../services/programCanonicalService.js';

const jm = jsonModel(path.join(env.DATA_DIR, 'health-programs.json'));

const schema = new mongoose.Schema({ title:{type:String,required:true},id:{type:String,index:true},programKey:{type:String,index:true},description:String,pillar:{type:String,default:'physical'},status:{type:String,default:'active'},image:String,imageAlt:String,readMoreLabel:String,heroTitle:String,heroIntro:String,about:String,why:String,whoItServes:String,whatWeDo:String,howItWorks:String,objectives:String,outcomes:String,impact:String,media:Array,ctaHeading:String,ctaDescription:String,ctaButtonLabel:String,ctaButtonHref:String,sectionVisibility:mongoose.Schema.Types.Mixed,published:{type:Boolean,default:true},order:{type:Number,default:0} }, { timestamps: true });
const ProgramMongo = mongoose.models.Program || mongoose.model('Program', schema);

export const Program = {
  async getAll(filter = null) {
    if (isDbConnected()) {
      const rows = await (filter ? ProgramMongo.find(filter).sort({ order: 1, createdAt: 1 }) : ProgramMongo.find().sort({ order: 1, createdAt: 1 }));
      // Mongo is authoritative while connected. Refresh the local snapshot only
      // after a successful read so JSON fallback remains last-known-good.
      writeProgramSnapshot(rows);
      return rows;
    }
    const rows = jm.getAll(filter ? r => Object.entries(filter).every(([k,v]) => r[k] === v) : null);
    return rows.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')));
  },
  async getById(id) {
    if (isDbConnected()) {
      const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: String(id) }] } : { id: String(id) };
      const row = await ProgramMongo.findOne(query);
      if (row) writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 }));
      return row;
    }
    return jm.getById(id);
  },
  async create(data) {
    if (isDbConnected()) {
      const row = await ProgramMongo.create(data);
      writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 }));
      return row;
    }
    return jm.create(data);
  },
  async update(id, data) {
    if (isDbConnected()) {
      const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: String(id) }] } : { id: String(id) };
      const row = await ProgramMongo.findOneAndUpdate(query, data, { new: true });
      if (row) writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 }));
      return row;
    }
    return jm.update(id, data);
  },
  async reorder(id, direction) {
    const all = await Program.getAll();
    const currentIndex = all.findIndex(row => String(row._id || row.id) === String(id));
    if (currentIndex < 0) return null;
    const current = all[currentIndex];
    const pillarRows = all.filter(row => row.pillar === current.pillar)
      .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0) || String(a.createdAt || '').localeCompare(String(b.createdAt || '')) || String(a.title || '').localeCompare(String(b.title || '')));
    const index = pillarRows.findIndex(row => String(row._id || row.id) === String(id));
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (index < 0 || targetIndex < 0 || targetIndex >= pillarRows.length) return { moved: false, program: current };
    const reordered = [...pillarRows];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    if (isDbConnected()) {
      const ops = reordered.map((row, order) => ({ updateOne: { filter: { _id: row._id }, update: { $set: { order: order + 1 } } } }));
      if (ops.length) await ProgramMongo.bulkWrite(ops);
      const after = await ProgramMongo.find().sort({ order: 1, createdAt: 1 });
      writeProgramSnapshot(after);
      const movedRow = after.find(row => String(row._id) === String(id));
      return { moved: true, program: movedRow, order: targetIndex + 1 };
    }
    const jsonRows = jm.getAll();
    const ids = new Set(reordered.map(row => String(row._id || row.id)));
    const byId = new Map(reordered.map((row, order) => [String(row._id || row.id), order + 1]));
    const next = jsonRows.map(row => ids.has(String(row._id || row.id)) ? { ...row, order: byId.get(String(row._id || row.id)), updatedAt: new Date().toISOString() } : row);
    jm.replaceAll(next);
    const movedRow = next.find(row => String(row._id || row.id) === String(id));
    return { moved: true, program: movedRow, order: targetIndex + 1 };
  },
  async delete(id) {
    if (isDbConnected()) {
      const query = mongoose.isValidObjectId(id) ? { $or: [{ _id: id }, { id: String(id) }] } : { id: String(id) };
      const row = await ProgramMongo.findOneAndDelete(query);
      if (row) writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 }));
      return row;
    }
    return jm.delete(id);
  },
  async restore(id, data) {
    if (isDbConnected()) { const payload={...data}; delete payload.id; const row=await ProgramMongo.create({...payload,_id:id}); writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 })); return row; }
    return jm.restore(id, data);
  },
  async replaceAll(data) {
    if (isDbConnected()) { await ProgramMongo.deleteMany({}); if (data.length) await ProgramMongo.insertMany(data); writeProgramSnapshot(await ProgramMongo.find().sort({ order: 1, createdAt: 1 })); return; }
    jm.replaceAll(data);
  },
  async reconcileCanonical() {
    if (!isDbConnected()) throw new Error('MongoDB is not connected. Canonical reconciliation requires the live database.');
    const canonical = readCanonicalPrograms();
    if (canonical.length !== 11) throw new Error(`Expected 11 canonical Sahara programs, found ${canonical.length} in health-programs-canonical.json.`);
    const before = await ProgramMongo.find().lean();
    const matchedIds = new Set();
    const changes = [];

    for (const source of canonical) {
      const key = source.programKey;
      let existing = key ? before.find(row => row.programKey === key) : null;
      if (!existing) existing = before.find(row => String(row.title || '').trim() === String(source.title || '').trim());
      if (!existing) {
        existing = before.find(row => key && key === getLegacyProgramKey(row.title));
      }

      const payload = { ...source };
      delete payload._id;
      if (existing) {
        await ProgramMongo.updateOne({ _id: existing._id }, { $set: payload });
        matchedIds.add(String(existing._id));
        changes.push({ action: 'updated', fromTitle: existing.title, title: source.title, programKey: key });
      } else {
        const created = await ProgramMongo.create(payload);
        matchedIds.add(String(created._id));
        changes.push({ action: 'created', title: source.title, programKey: key });
      }
    }

    const after = await ProgramMongo.find().sort({ order: 1, createdAt: 1 });
    writeProgramSnapshot(after);
    const extras = after.filter(row => !matchedIds.has(String(row._id))).map(row => ({ id: String(row._id), title: row.title, pillar: row.pillar, published: row.published, status: row.status }));
    return { canonicalCount: canonical.length, totalAfter: after.length, changes, extras, snapshotUpdated: true };
  },
};
