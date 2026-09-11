import { trash } from '../services/recycleBinService.js';
import { EmergencyCampaign } from '../models/EmergencyCampaign.js';

export async function listPublic(req,res){
  const {skip,limit}=req.pagination;
  const all=await EmergencyCampaign.getAll({published:true});
  res.json(all.slice(skip,skip+limit));
}
export async function listAdmin(req,res){
  const {skip,limit}=req.pagination;
  const all=await EmergencyCampaign.getAll();
  res.json(all.slice(skip,skip+limit));
}
export async function getOne(req,res){
  const item=await EmergencyCampaign.getById(req.params.id);
  if(!item) return res.status(404).json({error:'Emergency campaign not found'});
  res.json(item);
}
export async function create(req,res){ const item=await EmergencyCampaign.create(req.body); res.status(201).json(item); }
export async function update(req,res){ const item=await EmergencyCampaign.update(req.params.id,req.body); if(!item)return res.status(404).json({error:'Emergency campaign not found'}); res.json(item); }
export async function remove(req,res){ const item=await trash(req,'EmergencyCampaign',EmergencyCampaign,req.params.id,'Emergency Campaign'); if(!item)return res.status(404).json({error:'Emergency campaign not found'}); res.json({success:true,trashId:item.id}); }
