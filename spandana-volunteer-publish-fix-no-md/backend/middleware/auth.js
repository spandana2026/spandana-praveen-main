import { AdminAccount } from '../models/AdminAccount.js';
import { AdminSession } from '../models/AdminSession.js';
import { TeamSession } from '../models/TeamSession.js';
import { Team } from '../models/Team.js';
import { ADMIN_COOKIE, TEAM_COOKIE } from '../controllers/authController.js';

function cookieValue(req,name){ return (req.headers.cookie||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(name+'='))?.slice(name.length+1) || ''; }
export async function requireAdmin(req,res,next){
  try{
    const raw=cookieValue(req,ADMIN_COOKIE); const session=await AdminSession.find(raw); if(!session)return res.status(401).json({error:'Unauthorized',requestId:req.id});
    const account=await AdminAccount.get(); if(!account)return res.status(401).json({error:'Unauthorized',requestId:req.id});
    const id=String(account._id||account.id); if(String(session.adminId)!==id || Number(session.passwordVersion)!==Number(account.passwordVersion||1))return res.status(401).json({error:'Session expired. Please sign in again.',requestId:req.id});
    req.adminSession=session; req.adminAccount=account; next();
  }catch(err){next(err)}
}
export async function requireTeam(req,res,next){
  try{ const raw=cookieValue(req,TEAM_COOKIE); const s=await TeamSession.find(raw); if(!s)return res.status(401).json({error:'Unauthorized',requestId:req.id}); const member=await Team.findByUsername(s.username); if(!member)return res.status(401).json({error:'Unauthorized',requestId:req.id}); req.teamMember=member; next(); }catch(err){next(err)}
}
