import mongoose from 'mongoose';
import crypto from 'node:crypto';
import path from 'node:path';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import { env } from '../config/env.js';

const jm = jsonModel(path.join(env.DATA_DIR,'admin-recovery-challenges.json'));
const schema = new mongoose.Schema({
  challengeHash:{type:String,unique:true,required:true}, adminId:{type:String,required:true},
  purpose:{type:String,default:'recovery'}, channel:{type:String,enum:['email','mobile'],required:true}, target:{type:String,required:true},
  otpHash:{type:String,required:true}, otpExpiresAt:{type:Date,required:true}, attempts:{type:Number,default:0},
  verified:{type:Boolean,default:false}, backupVerified:{type:Boolean,default:false}, resetExpiresAt:{type:Date,default:null},
  createdAt:{type:Date,default:Date.now}
});
const RecoveryMongo = mongoose.models.AdminRecoveryChallenge || mongoose.model('AdminRecoveryChallenge',schema);
export const hashChallenge = v=>crypto.createHash('sha256').update(v).digest('hex');
export const hashOtp = v=>crypto.createHash('sha256').update(v).digest('hex');
export const newChallenge = ()=>crypto.randomBytes(32).toString('base64url');
export const newOtp = ()=>String(crypto.randomInt(100000,1000000));

export const AdminRecoveryChallenge = {
  async create(doc){
    const raw=newChallenge(); const payload={...doc,challengeHash:hashChallenge(raw),createdAt:new Date(),otpExpiresAt:new Date(Date.now()+10*60*1000)};
    if(isDbConnected()) await RecoveryMongo.create(payload); else jm.create({...payload,id:crypto.randomUUID(),createdAt:payload.createdAt.toISOString(),otpExpiresAt:payload.otpExpiresAt.toISOString()});
    return raw;
  },
  async find(raw){ if(!raw) return null; const h=hashChallenge(raw); if(isDbConnected()) return RecoveryMongo.findOne({challengeHash:h}); return jm.getAll().find(c=>c.challengeHash===h)||null; },
  async update(item,patch){ if(isDbConnected()) return RecoveryMongo.findByIdAndUpdate(item._id,patch,{new:true}); return jm.update(item.id,patch); },
};
