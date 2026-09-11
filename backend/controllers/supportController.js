import { trash } from '../services/recycleBinService.js';
import { DonationOpportunity } from '../models/DonationOpportunity.js';
import { FundraisingCampaign, Requirement, Contribution, Transaction, PaymentProfile, PaymentAccount, Receipt, Refund, Person, RecurringDonation, AuditEvent, newReference } from '../models/SupportModels.js';
import { EmergencyCampaign } from '../models/EmergencyCampaign.js';
import { getUsdRates, SUPPORTED_INTERNATIONAL } from '../services/currencyService.js';

function cleanText(v, max=500){ return typeof v === 'string' ? v.trim().slice(0,max) : ''; }
function num(v){ const n=Number(v); return Number.isFinite(n) ? n : 0; }
function normalizeDonationOptions(v={}, fallback={}){
  return {
    allowCustomAmount: v.allowCustomAmount ?? fallback.allowCustomAmount ?? true,
    presetAmountsINR: Array.isArray(v.presetAmountsINR) ? v.presetAmountsINR.map(Number).filter(n=>Number.isFinite(n)&&n>0) : (fallback.presetAmountsINR ?? []),
    presetAmountsUSD: Array.isArray(v.presetAmountsUSD) ? v.presetAmountsUSD.map(Number).filter(n=>Number.isFinite(n)&&n>0) : (fallback.presetAmountsUSD ?? []),
    showPerUnit: v.showPerUnit ?? fallback.showPerUnit ?? false,
    perUnitName: cleanText(v.perUnitName ?? fallback.perUnitName,80),
    perUnitCost: Number.isFinite(Number(v.perUnitCost ?? fallback.perUnitCost)) && Number(v.perUnitCost ?? fallback.perUnitCost)>0 ? Number(v.perUnitCost ?? fallback.perUnitCost) : null,
    quantityPresets: Array.isArray(v.quantityPresets) ? v.quantityPresets.map(Number).filter(n=>Number.isInteger(n)&&n>0) : (fallback.quantityPresets ?? [1,2,5,10]),
  };
}
function publicCampaign(c){ return c && c.published && ['active'].includes(c.status); }
function publicRequirement(r){ return r && r.published && r.visibility === 'public' && r.fundable && ['active'].includes(r.status); }
function audit(req, action, entityType, entityId, before, after, reason=''){ return AuditEvent.create({actorId:String(req.adminAccount?._id||req.adminAccount?.id||''),actorName:req.adminAccount?.name||req.adminAccount?.email||'',actorRole:'admin',action,entityType,entityId:String(entityId||''),before,after,requestId:req.id||'',ip:req.ip||'',reason:cleanText(reason,500)}); }
async function publicCampaignData(c){ const d=c?.campaignDetails||{}; const sections=d.sections||{}; const allowedSections=['basic','goal','beneficiaries','logistics','updates','communication']; const publicSections={}; for(const k of allowedSections){ const v=sections[k]; if(v?.public!==false && v?.enabled!==false && v) publicSections[k]=v; } const lists={}; for(const k of ['needs','volunteers','skills','sponsorship','inkind','team','documents','partners','updates']){ lists[k]=Array.isArray(d[k]) ? d[k].filter(x=>x?.public!==false && x?.visibility!=='private' && (x?.display!==false)) : []; } const metrics=await campaignMetrics(c.id); const raised=Number(metrics.raisedByCurrency?.[c.currency]||0); return {id:c.id,title:c.title,description:c.description,type:c.type,geography:c.geography,currency:c.currency,targetAmount:c.targetAmount,targetQuantity:c.targetQuantity,startDate:c.startDate,endDate:c.endDate,status:c.status,published:c.published,image:c.image,donationOptions:c.donationOptions,order:c.order,metrics:{raised,remaining:c.targetAmount!=null?Math.max(0,Number(c.targetAmount)-raised):null,progress:c.targetAmount?Math.min(100,(raised/Number(c.targetAmount))*100):null,donorCount:metrics.donorCount},campaignDetails:{sections:publicSections,...lists}}; }
async function campaignMetrics(campaignId){ const [cs,txs]=await Promise.all([Contribution.getAll({targetType:'campaign',targetId:String(campaignId)}),Transaction.getAll({})]); const ids=new Set(cs.map(c=>String(c.id))); const paid=txs.filter(t=>ids.has(String(t.contributionId))&&t.status==='paid'); const byCurrency={}; for(const t of paid) byCurrency[t.currency]=(byCurrency[t.currency]||0)+Number(t.amount||0); const donors=new Set(paid.map(t=>t.donorEmail||t.donorName).filter(Boolean)); const pending=txs.filter(t=>ids.has(String(t.contributionId))&&['initiated','pending'].includes(t.status)).reduce((a,t)=>a+Number(t.amount||0),0); return {raisedByCurrency:byCurrency,donorCount:donors.size,pendingAmount:pending}; }

export async function publicCurrencyRates(req,res){ const codes=String(req.query.currencies||'USD,AUD,EUR,GBP,CAD,SGD,AED').split(',').map(s=>s.trim().toUpperCase()).filter(Boolean); res.json({base:'USD',rates:await getUsdRates(codes)}); }

export async function publicCatalog(req,res){
  const [opportunities,campaigns,requirements,emergencyCampaigns] = await Promise.all([
    DonationOpportunity.getAll({ active:true, published:true }),
    FundraisingCampaign.getAll(),
    Requirement.getAll(),
    EmergencyCampaign.getAll(),
  ]);
  res.json({
    opportunities,
    campaigns: await Promise.all(campaigns.filter(publicCampaign).map(async c=>{
      const options=c.donationOptions||{};
      const req=requirements.find(r=>r.parentType==='campaign'&&r.parentId===c.id&&publicRequirement(r));
      const safe=await publicCampaignData(c); safe.donationOptions={...options, ...(options.showPerUnit && !options.perUnitCost && req ? {perUnitCost:req.unitCost,perUnitName:req.unitName} : {})}; return safe;
    })),
    emergencyCampaigns: emergencyCampaigns.filter(c=>c && c.published && ['active'].includes(c.status)).map(c=>({...c,id:String(c.id||c._id)})),
    requirements: requirements.filter(publicRequirement),
  });
}

export async function adminCatalog(req,res){
  const [opportunities,campaigns,requirements,contributions,transactions,profiles,refunds,accounts,recurring,audits] = await Promise.all([DonationOpportunity.getAll(),FundraisingCampaign.getAll(),Requirement.getAll(),Contribution.getAll(),Transaction.getAll(),PaymentProfile.getAll(),Refund.getAll(),PaymentAccount.getAll(),RecurringDonation.getAll(),AuditEvent.getAll()]);
  const metrics={}; for(const c of campaigns) metrics[c.id]=await campaignMetrics(c.id);
  res.json({ opportunities, campaigns, campaignMetrics:metrics, requirements, contributions, transactions, refunds, paymentProfiles:profiles, paymentAccounts:accounts, recurringDonations:recurring, auditEvents:audits.slice(0,200) });
}

export async function listCampaigns(req,res){ const rows=await FundraisingCampaign.getAll(); const out=await Promise.all(rows.map(async c=>({...c,metrics:await campaignMetrics(c.id)}))); res.json(out); }
export async function createCampaign(req,res){
  const body=req.body||{}; const item=await FundraisingCampaign.create({
    title:cleanText(body.title,120), slug:cleanText(body.slug,160), description:cleanText(body.description,1000), type:body.type==='emergency'?'emergency':'fundraising', geography:['india','international','both'].includes(body.geography)?body.geography:'both',
    currency:body.currency==='USD'?'USD':'INR', targetAmount:num(body.targetAmount)||null, targetQuantity:num(body.targetQuantity)||null,
    startDate:body.startDate||null,endDate:body.endDate||null,status:['draft','active','paused','completed','archived'].includes(body.status)?body.status:'draft',published:body.published===true,featured:body.featured===true,image:cleanText(body.image,500),campaignDetails:body.campaignDetails && typeof body.campaignDetails==='object' ? body.campaignDetails : {},donationOptions:normalizeDonationOptions(body.donationOptions),order:num(body.order)
  }); await audit(req,'create','FundraisingCampaign',item.id,null,item,''); res.status(201).json(item);
}
export async function updateCampaign(req,res){ const existing=await FundraisingCampaign.getById(req.params.id); if(!existing)return res.status(404).json({error:'Campaign not found'}); const b=req.body||{}; const item=await FundraisingCampaign.update(req.params.id,{title:cleanText(b.title??existing.title,120),slug:cleanText(b.slug??existing.slug,160),description:cleanText(b.description??existing.description,1000),type:b.type??existing.type,geography:b.geography??existing.geography,currency:b.currency??existing.currency,targetAmount:num(b.targetAmount??existing.targetAmount)||null,targetQuantity:num(b.targetQuantity??existing.targetQuantity)||null,startDate:b.startDate??existing.startDate,endDate:b.endDate??existing.endDate,status:b.status??existing.status,published:b.published??existing.published,featured:b.featured??existing.featured,image:cleanText(b.image??existing.image,500),campaignDetails:b.campaignDetails && typeof b.campaignDetails==='object' ? b.campaignDetails : (existing.campaignDetails||{}),donationOptions:b.donationOptions ? normalizeDonationOptions(b.donationOptions, existing.donationOptions) : existing.donationOptions,order:num(b.order??existing.order)}); await audit(req,'update','FundraisingCampaign',existing.id,existing,item,''); res.json(item); }
export async function deleteCampaign(req,res){ const item=await trash(req,'FundraisingCampaign',FundraisingCampaign,req.params.id,'Fundraising Campaign'); if(!item)return res.status(404).json({error:'Campaign not found'}); await audit(req,'delete','FundraisingCampaign',item.originalId,item.snapshot,null,'Moved to Recycle Bin'); res.json({success:true,trashId:item.id}); }

export async function listRequirements(req,res){ res.json(await Requirement.getAll()); }
export async function createRequirement(req,res){ const b=req.body||{}; const item=await Requirement.create({title:cleanText(b.title,120),description:cleanText(b.description,1000),parentType:b.parentType||'organization',parentId:cleanText(b.parentId,120)||null,geography:b.geography||'both',currency:b.currency==='USD'?'USD':'INR',unitName:cleanText(b.unitName,80),unitCost:num(b.unitCost)||null,targetQuantity:num(b.targetQuantity)||null,targetAmount:num(b.targetAmount)||null,visibility:b.visibility==='private'?'private':'public',fundable:b.fundable!==false,status:b.status||'active',published:b.published!==false,order:num(b.order)}); await audit(req,'create','Requirement',item.id,null,item,''); res.status(201).json(item); }
export async function updateRequirement(req,res){ const e=await Requirement.getById(req.params.id); if(!e)return res.status(404).json({error:'Requirement not found'}); const b=req.body||{}; const item=await Requirement.update(req.params.id,{title:cleanText(b.title??e.title,120),description:cleanText(b.description??e.description,1000),parentType:b.parentType??e.parentType,parentId:cleanText(b.parentId??e.parentId,120)||null,geography:b.geography??e.geography,currency:b.currency??e.currency,unitName:cleanText(b.unitName??e.unitName,80),unitCost:num(b.unitCost??e.unitCost)||null,targetQuantity:num(b.targetQuantity??e.targetQuantity)||null,targetAmount:num(b.targetAmount??e.targetAmount)||null,visibility:b.visibility??e.visibility,fundable:b.fundable??e.fundable,status:b.status??e.status,published:b.published??e.published,order:num(b.order??e.order)}); await audit(req,'update','Requirement',e.id,e,item,''); res.json(item); }
export async function deleteRequirement(req,res){ const item=await trash(req,'Requirement',Requirement,req.params.id,'Requirement'); if(!item)return res.status(404).json({error:'Requirement not found'}); await audit(req,'delete','Requirement',item.originalId,item.snapshot,null,'Moved to Recycle Bin'); res.json({success:true,trashId:item.id}); }

export async function createContribution(req,res){
  const b=req.body||{}; const supportType=b.supportType==='in-kind'?'in-kind':'cash'; const amount=Math.max(0,num(b.amount)); const quantity=num(b.quantity)||null;
  if (supportType==='cash' && amount<=0) return res.status(422).json({error:'Amount must be greater than zero.'});
  if (supportType==='in-kind' && !quantity && amount<=0) return res.status(422).json({error:'Quantity or value is required for an in-kind pledge.'});
  let person=null; const email=cleanText(b.donorEmail,160); if(email){ person=(await Person.getAll({email}))[0] || await Person.create({name:cleanText(b.donorName,120),email,mobile:cleanText(b.donorMobile,40),country:cleanText(b.country,80),roles:['donor']}); }
  const contribution=await Contribution.create({reference:newReference('CON'),personId:person?.id||null,anonymous:b.anonymous===true,communicationConsent:b.communicationConsent===true,donor:{name:cleanText(b.donorName,120),email,mobile:cleanText(b.donorMobile,40),country:cleanText(b.country,80)},supportType,targetType:b.targetType||'general',targetId:cleanText(b.targetId,120)||null,title:cleanText(b.title,160),quantity,unitName:cleanText(b.unitName,80),amount,currency:b.currency==='USD'?'USD':'INR',note:cleanText(b.note,1000),recurring:b.recurring===true,inKindStatus:supportType==='in-kind'?'pledged':undefined,status:supportType==='in-kind'?'in-kind':'pending'});
  if (supportType==='in-kind') return res.status(201).json({contribution,transaction:null,message:'In-kind contribution pledge received.'});
  const tx=await Transaction.create({reference:newReference('TXN'),contributionId:contribution.id,donorName:contribution.donor.name,donorEmail:contribution.donor.email,amount,currency:contribution.currency,paymentMethod:cleanText(b.paymentMethod,60)||'manual',provider:cleanText(b.provider,60)||'manual',providerReference:cleanText(b.providerReference,120),transactionType:b.transactionType==='sponsorship'?'sponsorship':'donation',paymentAccountId:cleanText(b.paymentAccountId,120)||null,status:'pending',verification:{status:['upi','qr','bank','manual'].includes(cleanText(b.paymentMethod,60))?'pending':'not_required',utr:cleanText(b.utr,120),paymentDate:b.paymentDate||null,proofUrl:cleanText(b.proofUrl,500)}});
  res.status(201).json({contribution,transaction:tx,message:'Contribution recorded. Complete or verify payment using the selected payment method.'});
}

export async function listContributions(req,res){ res.json(await Contribution.getAll()); }
export async function updateContribution(req,res){
  const existing=await Contribution.getById(req.params.id);
  if(!existing) return res.status(404).json({error:'Contribution not found'});
  if(existing.supportType!=='in-kind') return res.status(422).json({error:'Only in-kind contributions use the contribution status workflow.'});
  const allowed=['pledged','verifying','approved','received','acknowledged','cancelled'];
  const next=allowed.includes(req.body?.inKindStatus)?req.body.inKindStatus:existing.inKindStatus;
  const updated=await Contribution.update(req.params.id,{
    reference:existing.reference, donor:existing.donor, supportType:existing.supportType, targetType:existing.targetType, targetId:existing.targetId,
    title:existing.title, quantity:existing.quantity, unitName:existing.unitName, amount:existing.amount, currency:existing.currency, note:existing.note,
    inKindStatus:next, status:existing.status
  });
  res.json(updated);
}
export async function deleteContribution(req,res){ const item=await trash(req,'Contribution',Contribution,req.params.id,'Contribution'); if(!item)return res.status(404).json({error:'Contribution not found'}); await audit(req,'delete','Contribution',item.originalId,item.snapshot,null,'Moved to Recycle Bin'); res.json({success:true,trashId:item.id}); }
export async function listTransactions(req,res){ res.json(await Transaction.getAll()); }
export async function updateTransaction(req,res){
  const e=await Transaction.getById(req.params.id); if(!e)return res.status(404).json({error:'Transaction not found'}); const b=req.body||{}; const next=b.status||e.status;
  if(next==='paid' && e.status!=='paid' && e.verification?.status==='pending' && b.verificationStatus!=='verified') return res.status(422).json({error:'Manual payment must be verified before it can be marked paid.',code:'MANUAL_PAYMENT_VERIFICATION_REQUIRED'});
  if(next==='paid' && e.status!=='paid' && e.verification?.status==='pending' && !cleanText(b.utr??e.verification?.utr,120) && !cleanText(b.providerReference??e.providerReference,120)) return res.status(422).json({error:'UTR or payment reference is required before verification.',code:'PAYMENT_REFERENCE_REQUIRED'});
  const verification={...(e.verification||{})}; if(b.verificationStatus) verification.status=b.verificationStatus; if(b.utr!==undefined) verification.utr=cleanText(b.utr,120); if(b.paymentDate!==undefined) verification.paymentDate=b.paymentDate||null; if(b.proofUrl!==undefined) verification.proofUrl=cleanText(b.proofUrl,500); if(b.rejectionReason!==undefined) verification.rejectionReason=cleanText(b.rejectionReason,500); if(b.verificationStatus==='verified'){verification.verifiedBy=String(req.adminAccount?._id||req.adminAccount?.id||'');verification.verifiedAt=new Date().toISOString();}
  const item=await Transaction.update(req.params.id,{reference:e.reference,contributionId:e.contributionId,donorName:e.donorName,donorEmail:e.donorEmail,amount:e.amount,currency:e.currency,paymentMethod:e.paymentMethod,provider:e.provider,transactionType:e.transactionType||'donation',paymentAccountId:e.paymentAccountId||null,status:next,providerReference:cleanText(b.providerReference??e.providerReference,120),verification,notes:cleanText(b.notes??e.notes,1000),paidAt:next==='paid'?(e.paidAt||new Date().toISOString()):e.paidAt});
  if(next==='paid'){ const c=await Contribution.getById(e.contributionId); if(c) await Contribution.update(c.id,{...c,status:'paid'}); const existingReceipt=(await Receipt.getAll({transactionId:e.id}))[0]; if(!existingReceipt) await Receipt.create({receiptNumber:newReference('RCT'),transactionId:e.id,contributionId:e.contributionId,donorName:e.donorName,donorEmail:e.donorEmail,amount:e.amount,currency:e.currency,notes:c?.title||'',generatedBy:String(req.adminAccount?._id||req.adminAccount?.id||'')}); await audit(req,'verify_payment','Transaction',e.id,e,item,'Payment verified and marked paid'); }
  if(next==='failed'||next==='cancelled'||b.verificationStatus==='rejected') await audit(req,'payment_exception','Transaction',e.id,e,item,b.rejectionReason||'Payment exception');
  res.json(item);
}
export async function createReceipt(req,res){ const tx=await Transaction.getById(req.body?.transactionId || req.params.transactionId); if(!tx || tx.status!=='paid') return res.status(422).json({error:'Only paid transactions can receive a receipt.'}); const existing=(await Receipt.getAll({transactionId:tx.id}))[0]; if(existing)return res.json(existing); const c=await Contribution.getById(tx.contributionId); const receipt=await Receipt.create({receiptNumber:newReference('RCT'),transactionId:tx.id,contributionId:tx.contributionId,donorName:tx.donorName,donorEmail:tx.donorEmail,amount:tx.amount,currency:tx.currency,notes:c?.title||'',generatedBy:String(req.adminAccount?._id||req.adminAccount?.id||'')}); await audit(req,'create_receipt','Receipt',receipt.id,null,receipt,''); res.status(201).json(receipt); }
export async function listReceipts(req,res){ res.json(await Receipt.getAll()); }
export async function listRefunds(req,res){ res.json(await Refund.getAll()); }
export async function createRefund(req,res){ const tx=await Transaction.getById(req.body?.transactionId); if(!tx)return res.status(404).json({error:'Transaction not found'}); if(!['paid','partially_refunded'].includes(tx.status))return res.status(422).json({error:'Only paid transactions can be refunded.'}); const requested=num(req.body?.amount); if(requested<=0 || requested>tx.amount)return res.status(422).json({error:'Refund amount is invalid.'}); const existing=(await Refund.getAll({transactionId:tx.id})).filter(r=>['requested','approved','processed'].includes(r.status)); const already=existing.reduce((sum,r)=>sum+Number(r.amount||0),0); if(already+requested>tx.amount)return res.status(422).json({error:'Refund amount exceeds remaining refundable balance.'}); const refund=await Refund.create({refundNumber:newReference('REF'),transactionId:tx.id,amount:requested,currency:tx.currency,reason:cleanText(req.body?.reason,500),status:'requested'}); res.status(201).json(refund); }
export async function updateRefund(req,res){ const r=await Refund.getById(req.params.id); if(!r)return res.status(404).json({error:'Refund not found'}); const status=['requested','approved','processed','rejected'].includes(req.body?.status)?req.body.status:r.status; const updated=await Refund.update(r.id,{refundNumber:r.refundNumber,transactionId:r.transactionId,amount:r.amount,currency:r.currency,reason:r.reason,status,processedAt:status==='processed'?(r.processedAt||new Date().toISOString()):r.processedAt}); if(status==='processed'){ const tx=await Transaction.getById(r.transactionId); if(tx){ const refunds=(await Refund.getAll({transactionId:tx.id})).filter(x=>x.status==='processed'); const total=refunds.reduce((sum,x)=>sum+Number(x.amount||0),0); await Transaction.update(tx.id,{reference:tx.reference,contributionId:tx.contributionId,donorName:tx.donorName,donorEmail:tx.donorEmail,amount:tx.amount,currency:tx.currency,paymentMethod:tx.paymentMethod,provider:tx.provider,status:total>=Number(tx.amount)?'refunded':'partially_refunded',providerReference:tx.providerReference,notes:tx.notes,paidAt:tx.paidAt}); } } res.json(updated); }

export async function listPaymentProfiles(req,res){ const rows=await PaymentProfile.getAll(); const publicOnly=!req.path.includes('/admin/'); res.json(rows.filter(p=>p.active && (!publicOnly || p.publicDisplay===true)).map(p=>({...p,methods:(p.methods||[]).filter(m=>m.enabled).map(({accountNumber,...m})=>m)}))); }
export async function createPaymentProfile(req,res){ const b=req.body||{}; const item=await PaymentProfile.create({name:cleanText(b.name,120),geography:b.geography||'both',currency:b.currency==='USD'?'USD':'INR',paymentAccountIds:Array.isArray(b.paymentAccountIds)?b.paymentAccountIds.map(String):[],publicDisplay:b.publicDisplay===true,methods:Array.isArray(b.methods)?b.methods.map(m=>({type:cleanText(m.type,40),label:cleanText(m.label,100),enabled:m.enabled!==false,checkoutUrl:cleanText(m.checkoutUrl,500),accountName:cleanText(m.accountName,120),accountNumber:cleanText(m.accountNumber,120),ifscSwift:cleanText(m.ifscSwift,80),notes:cleanText(m.notes,500)})):[],active:b.active!==false}); res.status(201).json(item); }
export async function updatePaymentProfile(req,res){ const e=await PaymentProfile.getById(req.params.id); if(!e)return res.status(404).json({error:'Payment profile not found'}); const b=req.body||{}; return res.json(await PaymentProfile.update(req.params.id,{name:cleanText(b.name??e.name,120),geography:b.geography??e.geography,currency:b.currency??e.currency,paymentAccountIds:Array.isArray(b.paymentAccountIds)?b.paymentAccountIds:e.paymentAccountIds||[],publicDisplay:b.publicDisplay??e.publicDisplay,methods:Array.isArray(b.methods)?b.methods:e.methods,active:b.active??e.active})); }
export async function deletePaymentProfile(req,res){ const item=await trash(req,'PaymentProfile',PaymentProfile,req.params.id,'Payment Profile'); if(!item)return res.status(404).json({error:'Payment profile not found'}); await audit(req,'delete','PaymentProfile',item.originalId,item.snapshot,null,'Moved to Recycle Bin'); res.json({success:true,trashId:item.id}); }

export async function listPaymentAccounts(req,res){ res.json(await PaymentAccount.getAll()); }
export async function createPaymentAccount(req,res){ const item=await PaymentAccount.create(req.body||{}); await audit(req,'create','PaymentAccount',item.id,null,item,''); res.status(201).json(item); }
export async function updatePaymentAccount(req,res){ const e=await PaymentAccount.getById(req.params.id); if(!e)return res.status(404).json({error:'Payment account not found'}); const patch={...e}; delete patch.id; delete patch._id; const item=await PaymentAccount.update(req.params.id,{...patch,...(req.body||{})}); await audit(req,'update_payment_destination','PaymentAccount',e.id,e,item,'Payment destination changed'); res.json(item); }
export async function listPeople(req,res){ res.json(await Person.getAll()); }
export async function listRecurring(req,res){ res.json(await RecurringDonation.getAll()); }
export async function createRecurring(req,res){ const b=req.body||{}; if(Number(b.amount)<=0)return res.status(422).json({error:'Amount must be greater than zero.'}); const item=await RecurringDonation.create({personId:b.personId||null,contributionId:b.contributionId||null,campaignId:b.campaignId||null,targetType:b.targetType||'general',targetId:b.targetId||null,amount:Number(b.amount),currency:b.currency==='USD'?'USD':'INR',frequency:'monthly',provider:cleanText(b.provider,60),subscriptionId:cleanText(b.subscriptionId,160),startDate:b.startDate||new Date().toISOString(),nextPaymentDate:b.nextPaymentDate||null,status:b.status||'pending'}); res.status(201).json(item); }
export async function cancelRecurring(req,res){ const e=await RecurringDonation.getById(req.params.id); if(!e)return res.status(404).json({error:'Recurring donation not found'}); const item=await RecurringDonation.update(req.params.id,{...e,status:'cancelled',cancelledAt:new Date().toISOString()}); await audit(req,'cancel_recurring','RecurringDonation',e.id,e,item,''); res.json(item); }

export async function reportSummary(req,res){
  const [contributions,transactions,receipts,refunds,opportunities,campaigns,requirements]=await Promise.all([Contribution.getAll(),Transaction.getAll(),Receipt.getAll(),Refund.getAll(),DonationOpportunity.getAll(),FundraisingCampaign.getAll(),Requirement.getAll()]);
  const paid=transactions.filter(t=>t.status==='paid');
  const byCurrency={INR:0,USD:0}; paid.forEach(t=>{byCurrency[t.currency]=(byCurrency[t.currency]||0)+Number(t.amount||0)});
  const inKind=contributions.filter(c=>c.supportType==='in-kind');
  res.json({counts:{opportunities:opportunities.length,campaigns:campaigns.length,requirements:requirements.length,contributions:contributions.length,transactions:transactions.length,receipts:receipts.length,refunds:refunds.length},financial:{paidTransactions:paid.length,byCurrency},inKind:{pledges:inKind.length,received:inKind.filter(c=>c.inKindStatus==='received').length}});
}
