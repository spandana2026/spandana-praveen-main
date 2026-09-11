import { trash } from '../services/recycleBinService.js';
import { Gallery }    from '../models/Gallery.js';
import { fileToUrl }  from '../services/uploadService.js';
import path from 'path';
import fs   from 'fs';
import { env } from '../config/env.js';

export async function listPublic(req, res) {
  const { skip, limit } = req.pagination;
  const all   = (await Gallery.getAll({ published: true })).sort((a, b) => a.order - b.order);
  res.json(all.slice(skip, skip + limit));
}
export async function listAdmin(req, res) {
  const { skip, limit } = req.pagination;
  const all   = (await Gallery.getAll()).sort((a, b) => a.order - b.order);
  res.json(all.slice(skip, skip + limit));
}
export async function create(req, res) {
  const item = await Gallery.create(req.body);
  res.status(201).json(item);
}

export async function uploadMedia(req, res) {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const mimeType = req.file.mimetype || '';
  const mediaType = mimeType.startsWith('video/') ? 'video' : 'image';
  const all = await Gallery.getAll();
  const maxOrder = all.reduce((m, i) => Math.max(m, i.order || 0), 0);
  const url = fileToUrl(req.file.filename);
  const item = await Gallery.create({ title: req.file.originalname, caption: '', imageUrl: url, url, mediaType, mimeType, category: 'General', published: true, order: maxOrder + 1 });
  res.status(201).json(item);
}

export async function uploadBulk(req, res) {
  const files = req.files;
  if (!files || files.length === 0) return res.status(400).json({ error: 'No files uploaded' });
  const all     = await Gallery.getAll();
  let maxOrder  = all.reduce((m, i) => Math.max(m, i.order || 0), 0);
  const created = await Promise.all(files.map(f => Gallery.create({
    title: '', caption: '', imageUrl: fileToUrl(f.filename), url: fileToUrl(f.filename), mediaType: 'image', mimeType: f.mimetype,
    category: 'General', published: true, order: ++maxOrder,
  })));
  res.status(201).json(created);
}
export async function update(req, res) {
  const item = await Gallery.update(req.params.id, req.body);
  if (!item) return res.status(404).json({ error: 'Gallery item not found' });
  res.json(item);
}
export async function remove(req, res) {
  const item = await trash(req, 'Gallery', Gallery, req.params.id, 'Media');
  if (!item) return res.status(404).json({error: 'Media not found'});
  res.json({success:true, trashId:item.id});
}
