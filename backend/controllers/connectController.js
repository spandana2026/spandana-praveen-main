import { ConnectPerson } from '../models/ConnectPerson.js';
import { ConnectProfile } from '../models/ConnectProfile.js';

export async function submitConnect(req, res) {
  const sourceCode = req.body.sourceCode || '';
  const source = sourceCode ? await ConnectProfile.getByCode(sourceCode) : null;
  const doc = await ConnectPerson.create({
    ...req.body,
    sourcePersonId: source?.id || source?._id || req.body.sourcePersonId,
    sourcePersonName: source?.personName || req.body.sourcePersonName,
    sourceLabel: source?.role || req.body.sourceLabel,
    sourceType: source ? 'personal_qr' : (req.body.sourceType || 'general'),
    engagementStatus: 'new',
  });
  res.status(201).json({ success: true, id: doc.id || doc._id, source: source ? { personName: source.personName, role: source.role } : null });
}

export async function listConnections(req, res) {
  const all = await ConnectPerson.getAll();
  const q = String(req.query.search || '').trim().toLowerCase();
  const status = String(req.query.status || '').trim();
  const filtered = all.filter(x => {
    const hay = [x.fullName, x.whatsapp, x.profession, x.location, x.sourcePersonName, x.message, ...(x.interest || [])].join(' ').toLowerCase();
    return (!q || hay.includes(q)) && (!status || x.engagementStatus === status);
  });
  res.json(filtered);
}

export async function updateConnection(req, res) {
  const doc = await ConnectPerson.update(req.params.id, req.body);
  if (!doc) return res.status(404).json({ error: 'Connection not found' });
  res.json(doc);
}

export async function deleteConnection(req, res) {
  const ok = await ConnectPerson.delete(req.params.id);
  if (!ok) return res.status(404).json({ error: 'Connection not found' });
  res.json({ success: true });
}

function nextCode(role, all) {
  const prefix = ({ Ambassador: 'AMB', Patron: 'PAT', Representative: 'REP', 'Life Member': 'LIF', 'Volunteer Leader': 'VLD', 'Community Connector': 'CON' }[role] || 'CON');
  const n = all.filter(x => String(x.code || '').startsWith(`SC-${prefix}-`)).length + 1;
  return `SC-${prefix}-${String(n).padStart(4, '0')}`;
}

export async function listProfiles(_req, res) { res.json(await ConnectProfile.getAll()); }
export async function createProfile(req, res) {
  const all = await ConnectProfile.getAll();
  const profile = await ConnectProfile.create({ ...req.body, code: nextCode(req.body.role, all), active: req.body.active !== false });
  res.status(201).json(profile);
}
export async function updateProfile(req, res) {
  const doc = await ConnectProfile.update(req.params.id, req.body);
  if (!doc) return res.status(404).json({ error: 'Connect profile not found' });
  res.json(doc);
}
export async function publicProfile(req, res) {
  const profile = await ConnectProfile.getByCode(req.params.code);
  if (!profile || profile.active === false) return res.status(404).json({ error: 'Connect profile not found or inactive' });
  res.json({ personName: profile.personName, role: profile.role, profession: profile.profession, organisation: profile.organisation, location: profile.location, description: profile.description, code: profile.code });
}
