import { trash } from '../services/recycleBinService.js';
import { Volunteer } from '../models/Volunteer.js';
import { sendVolunteerAlert } from '../services/emailService.js';

function normalizeEmail(value='') { return String(value).trim().toLowerCase(); }
function normalizePhone(value='') { return String(value).replace(/\D/g, ''); }

export async function lookup(req, res) {
  const email = normalizeEmail(req.body?.email);
  const phone = normalizePhone(req.body?.phone);
  if (!email || !phone) return res.json({ exists: false });
  const match = await Volunteer.findExactPerson(email, phone);
  if (!match) return res.json({ exists: false });
  return res.json({ exists: true, id: match.id || match._id, profile: { fullName: match.fullName, email: match.email, phone: match.phone, location: match.location, mainProfession: match.mainProfession || match.profession, additionalProfessions: match.additionalProfessions || [], skills: match.skills || [], interests: match.areasOfInterest || [] } });
}

export async function submit(req, res) {
  const incomingEmail = normalizeEmail(req.body.email);
  const incomingPhone = normalizePhone(req.body.phone);
  const exact = await Volunteer.findExactPerson(incomingEmail, incomingPhone);
  const payload = { ...req.body, email: incomingEmail, phone: req.body.phone, status: 'New' };
  let doc;
  let enriched = false;
  if (exact) {
    // Returning visitors enrich the same person; they are never blocked and remain New.
    const existing = exact.toObject ? exact.toObject() : exact;
    const merged = { ...existing, ...payload, status: 'New' };
    delete merged._id; delete merged.id; delete merged.createdAt; delete merged.updatedAt;
    doc = await Volunteer.update(exact.id || exact._id, merged);
    enriched = true;
  } else {
    doc = await Volunteer.create(payload);
  }
  sendVolunteerAlert({ ...payload, enriched }).catch(() => {});
  res.status(201).json({ success: true, id: doc.id || doc._id, enriched });
}

export async function suggestions(_req, res) {
  const rows = await Volunteer.getAll();
  const buckets = { additionalProfessions: new Set(), specializations: new Set(), skills: new Set(), interests: new Set(), contributions: new Set(), connections: new Set(), help: new Set() };
  for (const row of rows) {
    const r = row.toObject ? row.toObject() : row;
    for (const v of (r.additionalProfessionsOther || [])) if (String(v).trim()) buckets.additionalProfessions.add(String(v).trim());
    for (const v of (r.specializationOther || [])) if (String(v).trim()) buckets.specializations.add(String(v).trim());
    for (const v of (r.skillsOther || [])) if (String(v).trim()) buckets.skills.add(String(v).trim());
    for (const v of (r.interestsOther || [])) if (String(v).trim()) buckets.interests.add(String(v).trim());
    for (const v of (r.contributionOther || [])) if (String(v).trim()) buckets.contributions.add(String(v).trim());
    if (String(r.connectionOther || '').trim()) buckets.connections.add(String(r.connectionOther).trim());
    for (const v of (r.helpRequestedOther || [])) if (String(v).trim()) buckets.help.add(String(v).trim());
  }
  res.json(Object.fromEntries(Object.entries(buckets).map(([k,v]) => [k, [...v]])));
}

export async function listAll(req, res) {
  const { skip, limit } = req.pagination;
  const all = await Volunteer.getAll();
  const total = all.length;
  res.json(all.slice(skip, skip + limit));
}
export async function remove(req, res) {
  const item = await trash(req, 'Volunteer', Volunteer, req.params.id, 'Volunteer');
  if (!item) return res.status(404).json({error: 'Volunteer not found'});
  res.json({success:true, trashId:item.id});
}
export async function updateStatus(req, res) {
  const item = await Volunteer.update(req.params.id, { status: req.body.status });
  if (!item) return res.status(404).json({ error: 'Volunteer not found' });
  res.json({ success: true, volunteer: item });
}
