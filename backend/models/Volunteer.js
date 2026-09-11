import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';
import path from 'path';

const jm = jsonModel(path.join(env.DATA_DIR, 'volunteers.json'));

const schema = new mongoose.Schema({
  fullName:{type:String,required:true}, email:{type:String,required:true}, phone:String, phoneNormalized:String, age:String, dob:String,
  address:String, location:String, occupation:String, profession:String, mainProfession:String, mainProfessionOther:String, additionalProfessions:[String], additionalProfessionsOther:[String],
  associationTypes:[String], qualification:String, qualificationOther:String, specialization:[String], specializationOther:[String], organization:String, role:String, yearsExperience:String,
  associations:String, sourceType:String, sourceId:String, connectorName:String, connectorType:String, referralName:String, referralPhone:String, referralCity:String, sourceDetail:String, consent:Boolean,
  businessName:String, industry:String, medicalServiceYears:String, legalRole:String, practiceArea:[String], studentCourse:String, institution:String, previousProfession:String, expertise:String,
  skills:[String], skillsOther:[String], medicalExpertise:[String], areasOfInterest:[String], interestsOther:[String], contributionTypes:[String], contributionOther:[String], programsOfInterest:[String], availability:[String],
  motivation:String, message:String, helpRequested:[String], helpRequestedOther:[String], helpMessage:String, connectionOther:String, futureRoles:[String], professionalProfiles:mongoose.Schema.Types.Mixed, emergencyContactName:String, emergencyContactPhone:String,
  declaration:Boolean, childrenDeclaration:Boolean,
  status:{type:String,enum:['New','Under Review','Approved','Rejected','Waitlisted','Withdrawn'],default:'New'},
  formType:{type:String,default:'join-us'}, submittedAt:{type:Date,default:Date.now}
}, { timestamps: true });
const VolunteerMongo = mongoose.models.Volunteer || mongoose.model('Volunteer', schema);

export const Volunteer = {
  async getAll(filter = null) {
    if (isDbConnected()) return filter ? VolunteerMongo.find(filter).sort({ createdAt: -1 }) : VolunteerMongo.find().sort({ createdAt: -1 });
    return jm.getAll(filter ? r => Object.entries(filter).every(([k,v]) => r[k] === v) : null);
  },
  async getById(id) { if (isDbConnected()) return VolunteerMongo.findById(id); return jm.getById(id); },
  async findExactPerson(email, phone) {
    if (!email || !phone) return null;
    if (isDbConnected()) {
      return VolunteerMongo.findOne({ email, $or: [{ phoneNormalized: phone }, { phone: phone }] });
    }
    const rows = jm.getAll();
    return rows.find(r => String(r.email || '').trim().toLowerCase() === email && String(r.phone || '').replace(/\D/g, '') === phone) || null;
  },
  async findPotentialDuplicate(email, phone) {
    if (isDbConnected()) {
      const rows = await VolunteerMongo.find({ $or: [
        ...(email ? [{ email: email }] : []),
        ...(phone ? [{ phoneNormalized: phone }, { phone: phone }] : []),
      ] }).limit(10).lean();
      if (!rows.length) return null;
      return { emailMatch: rows.some(r => String(r.email || '').trim().toLowerCase() === email), phoneMatch: rows.some(r => String(r.phone || '').replace(/\D/g, '') === phone) };
    }
    const rows = jm.getAll();
    const emailMatch = !!email && rows.some(r => String(r.email || '').trim().toLowerCase() === email);
    const phoneMatch = !!phone && rows.some(r => String(r.phone || '').replace(/\D/g, '') === phone);
    return emailMatch || phoneMatch ? { emailMatch, phoneMatch } : null;
  },
  async create(data) { const payload={...data, phoneNormalized:String(data.phone||"").replace(/\D/g, "")}; if (isDbConnected()) return VolunteerMongo.create(payload); return jm.create(payload); },
  async update(id, data) { const payload={...data}; if (Object.prototype.hasOwnProperty.call(payload,"phone")) payload.phoneNormalized=String(payload.phone||"").replace(/\D/g, ""); if (isDbConnected()) return VolunteerMongo.findByIdAndUpdate(id, payload, { new: true }); return jm.update(id, payload); },
  async delete(id) { if (isDbConnected()) return VolunteerMongo.findByIdAndDelete(id); return jm.delete(id); },
  async restore(id, data) { if (isDbConnected()) { const payload={...data}; delete payload.id; return VolunteerMongo.create({...payload,_id:id}); } return jm.restore(id, data); },
  async replaceAll(data) { if (isDbConnected()) { await VolunteerMongo.deleteMany({}); if (data.length) await VolunteerMongo.insertMany(data); return; } jm.replaceAll(data); },
};
