import { Settings } from '../models/Settings.js';
import { createRecoveryPoint, snapshotSettings } from '../services/backupService.js';

export async function getPublicSettings(_req, res) {
  res.json(await Settings.getLive());
}
export async function getDraft(_req, res) {
  res.json(await Settings.getDraft());
}
export async function getStatus(_req, res) {
  const history = await Settings.getHistory();
  res.json({ hasDraft: true, historyCount: history.length, history: history.map((h, i) => ({ index: i, publishedAt: h.publishedAt })) });
}
export async function saveDraft(req, res) {
  const merged = { ...(await Settings.getDraft()), ...req.body };
  await Settings.saveDraft(merged);
  // Keep a lightweight, current settings state in the recovery system.
  // Full verified recovery points are created on publish.
  try { snapshotSettings(merged, { reason: 'settings-draft-saved' }); } catch (backupError) { console.warn('[recovery] settings draft snapshot failed:', backupError.message); }
  res.json({ success: true, status: 'draft', settings: merged });
}
export async function publishSettings(_req, res) {
  const published = await Settings.publish();
  // Publishing is a system-state boundary: create a verified recovery point
  // so the published settings and the rest of the system can be restored together.
  let recoveryPoint = null;
  try { recoveryPoint = await createRecoveryPoint({ reason: 'settings-published' }); } catch (backupError) { console.warn('[recovery] publish recovery point failed:', backupError.message); }
  res.json({ success: true, status: 'published', settings: published, recoveryPoint: recoveryPoint ? { id: recoveryPoint.id, status: recoveryPoint.status } : null });
}
export async function getHistoryEntry(req, res) {
  const history = await Settings.getHistory();
  const idx     = parseInt(req.params.index, 10);
  if (isNaN(idx) || !history[idx]) return res.status(404).json({ error: 'History entry not found' });
  res.json(history[idx]);
}

// Fix: footer.tsx's visitor counter had no matching backend routes (repeated 404s).
export async function getVisitorCount(_req, res) {
  const settings = await Settings.getLive();
  res.json({ enabled: settings.visitorCountEnabled === true, count: settings.visitorCount ?? 0 });
}
export async function incrementVisitorCount(_req, res) {
  const settings = await Settings.getLive();
  if (settings.visitorCountEnabled !== true) {
    return res.json({ count: settings.visitorCount ?? 0 });
  }
  const count = await Settings.incrementVisitorCount();
  res.json({ count });
}
