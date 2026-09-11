import { RecycleBin } from '../models/RecycleBin.js';

export async function trash(req, entityType, model, id, label='') {
  const existing = await model.getById(id);
  if (!existing) return null;
  const snapshot = existing?.toObject ? existing.toObject() : { ...existing };
  const originalId = String(snapshot.id ?? snapshot._id ?? id);
  const item = await RecycleBin.archive({
    entityType,
    entityLabel: label || snapshot.title || snapshot.name || snapshot.reference || entityType,
    originalId,
    snapshot,
    deletedBy: String(req.adminAccount?._id || req.adminAccount?.id || 'admin'),
  });
  const ok = await model.delete(id);
  if (!ok) { await RecycleBin.remove(item.id); return null; }
  return item;
}

export async function restoreTrashItem(id, model) {
  const item = await RecycleBin.getById(id);
  if (!item) return null;
  const snapshot = { ...(item.snapshot || {}) };
  const originalId = String(item.originalId);
  if (snapshot._id) delete snapshot._id;
  snapshot.id = originalId;
  const alreadyThere = await model.getById(originalId);
  if (alreadyThere) return null;
  const restored = typeof model.restore === 'function'
    ? await model.restore(originalId, snapshot)
    : await model.create(snapshot);
  if (!restored) return null;
  await RecycleBin.remove(id);
  return restored;
}
