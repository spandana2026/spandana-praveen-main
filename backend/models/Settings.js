import mongoose  from 'mongoose';
import fs         from 'fs';
import path       from 'path';
import { isDbConnected } from '../config/db.js';
import { env }           from '../config/env.js';

// ── Atomic write helper ────────────────────────────────────────────────────
function atomicWrite(fp, data) {
  const tmp = fp + '.tmp';
  if (!fs.existsSync(path.dirname(fp))) fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, fp);
}
function readJson(fp, fallback) {
  try { return fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : fallback; }
  catch { return fallback; }
}

const liveFile    = path.join(env.DATA_DIR, 'settings.json');
const draftFile   = path.join(env.DATA_DIR, 'settings_draft.json');
const historyFile = path.join(env.DATA_DIR, 'settings_history.json');

// ── Mongoose schema (used when MongoDB available) ──────────────────────────
const schema = new mongoose.Schema({
  key:  { type: String, required: true, unique: true },
  data: mongoose.Schema.Types.Mixed,
}, { timestamps: true });
const SettingsMongo = mongoose.models.Settings || mongoose.model('Settings', schema);
function canonicalizeSettings(input) {
  const data = (input && typeof input === 'object') ? { ...input } : {};
  // Canonical owners: floatingMenu, navigation.design.mobile.accessibility.
  // Legacy floating_menu is accepted only as a migration input, never as a
  // second live configuration surface.
  if ((!data.floatingMenu || typeof data.floatingMenu !== 'object') && data.floating_menu && typeof data.floating_menu === 'object') {
    data.floatingMenu = { ...data.floating_menu };
    if (data.floatingMenu.timerSeconds != null && data.floatingMenu.autoHideSeconds == null) {
      data.floatingMenu.autoHideSeconds = data.floatingMenu.timerSeconds;
    }
  }
  if (data.floatingMenu && typeof data.floatingMenu === 'object') {
    const fm = { ...data.floatingMenu };
    delete fm.timerSeconds;
    delete fm.showDesktop;
    delete fm.position;
    delete fm.scrollTriggerPx;
    delete fm.buttonSizePx;
    delete fm.colorButtonBg;
    delete fm.colorButtonIcon;
    delete fm.colorActiveHighlight;
    data.floatingMenu = fm;
  }
  delete data.floating_menu;

  // Canonical name for the Vision & Mission media panel mobile visibility.
  // Migrate the older videoSectionMobile flag once, without overwriting a
  // deliberate newer value.
  if (data.featuredSpotlightMobile == null && data.videoSectionMobile != null) {
    data.featuredSpotlightMobile = data.videoSectionMobile;
  }
  delete data.videoSectionMobile;

  // Navigation uses the structured design.mobile settings as the canonical
  // mobile header layout. These older derived fields are no longer active.
  if (data.nav && typeof data.nav === 'object') {
    const nav = { ...data.nav };
    if (nav.mobile && typeof nav.mobile === 'object') {
      const mobile = { ...nav.mobile };
      if (nav.design?.mobile?.logoPosition == null && mobile.logoPosition != null) {
        nav.design = { ...(nav.design || {}), mobile: { ...(nav.design?.mobile || {}), logoPosition: mobile.logoPosition } };
      }
      delete mobile.stripItems;
      delete mobile.headerHeight;
      if (Object.keys(mobile).length === 0) delete nav.mobile; else nav.mobile = mobile;
    }
    data.nav = nav;
  }

  // Page Builder migration: Emergency Aid is now a canonical homepage section.
  // Existing saved orders did not contain it because it was previously rendered
  // outside the Page Builder flow. Insert it after Hero without disturbing any
  // other saved ordering.
  for (const key of ['sectionOrder', 'sectionOrderDesktop', 'sectionOrderMobile']) {
    if (Array.isArray(data[key]) && !data[key].includes('emergencyAid')) {
      const order = [...data[key]];
      const heroIndex = order.indexOf('hero');
      if (heroIndex >= 0) order.splice(heroIndex + 1, 0, 'emergencyAid');
      else order.unshift('emergencyAid');
      data[key] = order;
    }
  }
  if (data.visibilityDesktop && data.visibilityDesktop.emergencyAid == null) {
    data.visibilityDesktop = { ...data.visibilityDesktop, emergencyAid: true };
  }
  if (data.visibilityMobile && data.visibilityMobile.emergencyAid == null) {
    data.visibilityMobile = { ...data.visibilityMobile, emergencyAid: true };
  }

  // One-time, narrowly-scoped legacy Hero CTA migration. If the live/draft
  // setting still contains the old Sahara label, move only that old value to
  // the current Emergency Aid & Relief CTA. Any other customized label wins.
  if (data.hero && typeof data.hero === 'object') {
    const hero = { ...data.hero };
    if (typeof hero.button1 === 'string' && hero.button1.trim() === 'Sahara Community Centers') {
      hero.button1 = 'Emergency Aid & Relief';
      hero.button1Href = '/#emergency-aid';
      data.hero = hero;
    }
  }
  return data;
}


function snapshotSettingsFile(file, data) {
  const next = JSON.stringify(data || {}, null, 2);
  try { if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') === next) return; } catch {}
  atomicWrite(file, data || {});
}

async function readMongoData(key) {
  return SettingsMongo.findOne({ key });
}

// ── Unified API ────────────────────────────────────────────────────────────
export const Settings = {
  async getLive() {
    if (isDbConnected()) {
      let d = await readMongoData('live');
      // A newly connected/empty Mongo database may not have settings yet.
      // Bootstrap only when the live Mongo document is genuinely absent; never
      // overwrite an existing Mongo document with a local JSON file.
      if (!d) {
        const seed = readJson(liveFile, {});
        d = await SettingsMongo.findOneAndUpdate({ key: 'live' }, { data: seed }, { upsert: true, new: true });
      }
      const original = d?.data || {};
      const data = canonicalizeSettings(original);
      if (d && JSON.stringify(original) !== JSON.stringify(data)) {
        d.data = data;
        await d.save();
      }
      snapshotSettingsFile(liveFile, data);
      return data;
    }
    return readJson(liveFile, {});
  },
  async getDraft() {
    if (isDbConnected()) {
      const d = await readMongoData('draft');
      if (d?.data) {
        const original = d.data;
        const data = canonicalizeSettings(original);
        if (JSON.stringify(original) !== JSON.stringify(data)) { d.data = data; await d.save(); }
        snapshotSettingsFile(draftFile, data);
        return data;
      }
      const live = await this.getLive();
      snapshotSettingsFile(draftFile, live);
      return live;
    }
    return canonicalizeSettings(readJson(draftFile, null) || readJson(liveFile, {}));
  },
  async saveDraft(data) {
    data = canonicalizeSettings(data);
    if (isDbConnected()) {
      const saved = await SettingsMongo.findOneAndUpdate({ key: 'draft' }, { data }, { upsert: true, new: true });
      snapshotSettingsFile(draftFile, saved?.data || data);
      return;
    }
    atomicWrite(draftFile, data);
  },
  async publish() {
    const draft = canonicalizeSettings(await this.getDraft());
    if (isDbConnected()) {
      const saved = await SettingsMongo.findOneAndUpdate({ key: 'live' }, { data: draft }, { upsert: true, new: true });
      const live = saved?.data || draft;
      snapshotSettingsFile(liveFile, live);
      snapshotSettingsFile(draftFile, draft);
      return live;
    }
    const history = readJson(historyFile, []);
    const current = readJson(liveFile, {});
    history.unshift({ ...current, publishedAt: new Date().toISOString() });
    atomicWrite(historyFile, history.slice(0, 30));
    atomicWrite(liveFile, draft);
    return draft;
  },
  async getHistory() {
    if (isDbConnected()) return [];
    return readJson(historyFile, []);
  },
  // Fix: footer.tsx calls GET /api/visitor-count and POST /api/visitor-count/increment,
  // neither of which had a matching backend route. The counter is a live number
  // (not a draft-then-publish CMS field), so it's written straight to live settings.
  async incrementVisitorCount() {
    const current = await this.getLive();
    const next = (current.visitorCount || 0) + 1;
    const updated = { ...current, visitorCount: next };
    if (isDbConnected()) {
      const saved = await SettingsMongo.findOneAndUpdate({ key: 'live' }, { data: updated }, { upsert: true, new: true });
      snapshotSettingsFile(liveFile, saved?.data || updated);
      return next;
    }
    atomicWrite(liveFile, updated);
    return next;
  },
};
