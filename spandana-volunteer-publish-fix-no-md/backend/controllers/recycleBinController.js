import { RecycleBin } from '../models/RecycleBin.js';
import { restoreTrashItem } from '../services/recycleBinService.js';
import { Program } from '../models/Program.js';
import { Volunteer } from '../models/Volunteer.js';
import { DonationOpportunity } from '../models/DonationOpportunity.js';
import { Gallery } from '../models/Gallery.js';
import { Team } from '../models/Team.js';
import { Story } from '../models/Story.js';
import { Event } from '../models/Event.js';
import { CommunityInitiative } from '../models/CommunityInitiative.js';
import { GameListing } from '../models/GameListing.js';
import { Testimonial } from '../models/Testimonial.js';
import { EmergencyCampaign } from '../models/EmergencyCampaign.js';
import { Value } from '../models/Value.js';
import { BlogPost } from '../models/BlogPost.js';
import { FundraisingCampaign, Requirement, Contribution, PaymentProfile } from '../models/SupportModels.js';

const MODELS = { Program, Volunteer, DonationOpportunity, Gallery, Team, Story, Event, CommunityInitiative, GameListing, Testimonial, EmergencyCampaign, Value, BlogPost, FundraisingCampaign, Requirement, Contribution, PaymentProfile };

export async function list(req,res){ res.json(await RecycleBin.list()); }
export async function restore(req,res){
  const item=await RecycleBin.getById(req.params.id);
  if(!item)return res.status(404).json({error:'Recycle Bin item not found'});
  const model=MODELS[item.entityType];
  if(!model)return res.status(422).json({error:`Restore is not supported for ${item.entityType}`});
  const restored=await restoreTrashItem(req.params.id,model);
  if(!restored)return res.status(409).json({error:'Could not restore this item. The original record may already exist.'});
  res.json({success:true,item:restored});
}
export async function permanentDelete(req,res){
  const item=await RecycleBin.getById(req.params.id);
  if(!item)return res.status(404).json({error:'Recycle Bin item not found'});
  await RecycleBin.remove(req.params.id);
  res.json({success:true});
}
export async function empty(req,res){ await RecycleBin.clear(); res.json({success:true}); }
