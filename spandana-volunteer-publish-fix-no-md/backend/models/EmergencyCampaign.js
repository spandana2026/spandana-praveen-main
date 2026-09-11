import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';
import path from 'path';

const jm = jsonModel(path.join(env.DATA_DIR, 'emergency-campaigns.json'));
const schema = new mongoose.Schema({
  title:{type:String,required:true},
  location:String,
  description:String,
  image:String,
  status:{type:String,default:'active'},
  published:{type:Boolean,default:true},
  order:{type:Number,default:0},
  date:String,
}, { timestamps:true });
const EmergencyCampaignMongo = mongoose.models.EmergencyCampaign || mongoose.model('EmergencyCampaign', schema);

export const EmergencyCampaign = {
  async getAll(filter=null) {
    if (isDbConnected()) return filter ? EmergencyCampaignMongo.find(filter).sort({order:1}) : EmergencyCampaignMongo.find().sort({order:1});
    return jm.getAll(filter ? r => Object.entries(filter).every(([k,v]) => r[k] === v) : null);
  },
  async getById(id) { if (isDbConnected()) return EmergencyCampaignMongo.findById(id); return jm.getById(id); },
  async create(data) { if (isDbConnected()) return EmergencyCampaignMongo.create(data); return jm.create(data); },
  async update(id,data) { if (isDbConnected()) return EmergencyCampaignMongo.findByIdAndUpdate(id,data,{new:true}); return jm.update(id,data); },
  async delete(id) { if (isDbConnected()) return EmergencyCampaignMongo.findByIdAndDelete(id); return jm.delete(id); },
  async restore(id, data) { if (isDbConnected()) { const payload={...data}; delete payload.id; return EmergencyCampaignMongo.create({...payload,_id:id}); } return jm.restore(id,data); },
};
