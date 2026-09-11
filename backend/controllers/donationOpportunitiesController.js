import { trash } from '../services/recycleBinService.js';
import { DonationOpportunity } from '../models/DonationOpportunity.js';

const ALLOWED_GEO = new Set(['india', 'international', 'both']);
const ALLOWED_TYPE = new Set(['fixed', 'unit']);

function cleanPricing(input = {}) {
  const clean = {};
  for (const code of ['INR', 'USD']) {
    const src = input?.[code] || {};
    clean[code] = {
      presets: Array.isArray(src.presets) ? src.presets.map(Number).filter(n => Number.isFinite(n) && n > 0) : [],
      monthlyPresets: Array.isArray(src.monthlyPresets) ? src.monthlyPresets.map(Number).filter(n => Number.isFinite(n) && n > 0) : [],
      unitCost: Number.isFinite(Number(src.unitCost)) && Number(src.unitCost) > 0 ? Number(src.unitCost) : null,
      unitName: typeof src.unitName === 'string' ? src.unitName.trim().slice(0, 80) : '',
    };
  }
  return clean;
}

function normalizeInput(body = {}) {
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 120) : '';
  if (!title) throw new Error('Title is required.');
  const type = ALLOWED_TYPE.has(body.type) ? body.type : 'fixed';
  const geography = ALLOWED_GEO.has(body.geography) ? body.geography : 'both';
  const quantityPresets = Array.isArray(body.quantityPresets)
    ? body.quantityPresets.map(Number).filter(n => Number.isInteger(n) && n > 0).slice(0, 20)
    : [];
  return {
    title,
    description: typeof body.description === 'string' ? body.description.trim().slice(0, 500) : '',
    icon: typeof body.icon === 'string' ? body.icon.trim().slice(0, 12) || '❤️' : '❤️',
    type,
    geography,
    pricing: cleanPricing(body.pricing),
    quantityPresets,
    targetQuantity: Number.isFinite(Number(body.targetQuantity)) && Number(body.targetQuantity) > 0 ? Number(body.targetQuantity) : null,
    targetAmountINR: Number.isFinite(Number(body.targetAmountINR)) && Number(body.targetAmountINR) > 0 ? Number(body.targetAmountINR) : null,
    targetAmountUSD: Number.isFinite(Number(body.targetAmountUSD)) && Number(body.targetAmountUSD) > 0 ? Number(body.targetAmountUSD) : null,
    impactText: typeof body.impactText === 'string' ? body.impactText.trim().slice(0, 500) : '',
    active: body.active !== false,
    published: body.published !== false,
    order: Number.isFinite(Number(body.order)) ? Number(body.order) : 0,
  };
}

export async function listPublic(req, res) {
  const { skip, limit } = req.pagination;
  const rows = await DonationOpportunity.getAll({ active: true, published: true });
  res.json(rows.slice(skip, skip + limit));
}

export async function listAdmin(req, res) {
  const { skip, limit } = req.pagination;
  const rows = await DonationOpportunity.getAll();
  res.json(rows.slice(skip, skip + limit));
}

export async function getOne(req, res) {
  const item = await DonationOpportunity.getById(req.params.id);
  if (!item || !item.active || !item.published) return res.status(404).json({ error: 'Donation opportunity not found.' });
  res.json(item);
}

export async function create(req, res) {
  const item = await DonationOpportunity.create(normalizeInput(req.body));
  res.status(201).json(item);
}

export async function update(req, res) {
  const item = await DonationOpportunity.update(req.params.id, normalizeInput(req.body));
  if (!item) return res.status(404).json({ error: 'Donation opportunity not found.' });
  res.json(item);
}

export async function remove(req, res) {
  const item = await trash(req, 'DonationOpportunity', DonationOpportunity, req.params.id, 'Donation Opportunity');
  if (!item) return res.status(404).json({error: 'Donation Opportunity not found'});
  res.json({success:true, trashId:item.id});
}
