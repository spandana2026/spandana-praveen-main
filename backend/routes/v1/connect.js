import { Router } from 'express';
import { z } from 'zod';
import { requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import * as ctrl from '../../controllers/connectController.js';

const connectSchema = z.object({
  fullName: z.string().min(2),
  whatsapp: z.string().min(7),
  profession: z.string().optional(),
  location: z.string().optional(),
  interest: z.array(z.string()).optional(),
  message: z.string().optional(),
  sourceCode: z.string().optional(),
  sourceType: z.string().optional(),
  consentWhatsApp: z.boolean().optional(),
});
const profileSchema = z.object({
  personName: z.string().min(2),
  role: z.string().min(2),
  profession: z.string().optional(),
  organisation: z.string().optional(),
  location: z.string().optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});
const updateSchema = z.object({ engagementStatus: z.enum(['new','contacted','interested','information_shared','follow_up','engaged','joined']).optional(), joined: z.boolean().optional() });

const router = Router();
router.post('/connect', validate(connectSchema), asyncHandler(ctrl.submitConnect));
router.get('/connect/:code', asyncHandler(ctrl.publicProfile));
router.get('/admin/connect', requireAdmin, asyncHandler(ctrl.listConnections));
router.patch('/admin/connect/:id', requireAdmin, validate(updateSchema), asyncHandler(ctrl.updateConnection));
router.delete('/admin/connect/:id', requireAdmin, asyncHandler(ctrl.deleteConnection));
router.get('/admin/connect-profiles', requireAdmin, asyncHandler(ctrl.listProfiles));
router.post('/admin/connect-profiles', requireAdmin, validate(profileSchema), asyncHandler(ctrl.createProfile));
router.patch('/admin/connect-profiles/:id', requireAdmin, validate(profileSchema.partial()), asyncHandler(ctrl.updateProfile));
export default router;
