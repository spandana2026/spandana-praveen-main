import { trash } from '../services/recycleBinService.js';
import { Program } from '../models/Program.js';
import { isDbConnected } from '../config/db.js';

export async function listPublic(req, res) {
  const { skip, limit } = req.pagination;
  const all   = await Program.getAll({ published: true, status: 'active' });
  const total = all.length;
  res.json(all.slice(skip, skip + limit));
}
export async function listAdmin(req, res) {
  const { skip, limit } = req.pagination;
  const all   = await Program.getAll();
  const total = all.length;
  res.json(all.slice(skip, skip + limit));
}
export async function getOne(req, res) {
  const item = await Program.getById(req.params.id);
  if (!item || item.published === false || item.status !== 'active') return res.status(404).json({ error: 'Program not found' });
  res.json(item);
}
export async function create(req, res) {
  const item = await Program.create(req.body);
  res.status(201).json(item);
}
export async function update(req, res) {
  const item = await Program.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ error: 'Program not found' });
  res.json(item);
}
export async function reorder(req, res) {
  const direction = req.body?.direction;
  if (direction !== 'up' && direction !== 'down') return res.status(400).json({ error: 'Direction must be up or down.' });
  try {
    const result = await Program.reorder(req.params.id, direction);
    if (!result) return res.status(404).json({ error: 'Program not found' });
    res.json(result);
  } catch (err) {
    res.status(409).json({ error: err?.message || 'Could not reorder program.' });
  }
}

export async function remove(req, res) {
  const item = await trash(req, 'Program', Program, req.params.id, 'Program');
  if (!item) return res.status(404).json({error: 'Program not found'});
  res.json({success:true, trashId:item.id});
}


export async function canonicalStatus(req, res) {
  const { readCanonicalPrograms } = await import('../services/programCanonicalService.js');
  const canonical = readCanonicalPrograms();
  const rows = await Program.getAll();
  const physical = rows.filter(r => r.pillar === 'physical' && r.published !== false && r.status === 'active');
  const mental = rows.filter(r => r.pillar === 'mental' && r.published !== false && r.status === 'active');
  res.json({ source: isDbConnected() ? 'mongodb' : 'json-fallback', canonicalCount: canonical.length, currentCount: rows.length, activePublished: { physical: physical.length, mental: mental.length, total: physical.length + mental.length }, canonicalTitles: canonical.map(p => ({ title: p.title, pillar: p.pillar, programKey: p.programKey })) });
}

export async function reconcileCanonical(req, res) {
  try {
    const result = await Program.reconcileCanonical();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(409).json({ success: false, error: err?.message || 'Could not reconcile canonical programs.' });
  }
}
