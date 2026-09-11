import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { paginate } from '../../middleware/paginate.js';
import * as ctrl from '../../controllers/donationOpportunitiesController.js';

const router = Router();
router.get('/donation-opportunities', paginate, asyncHandler(ctrl.listPublic));
router.get('/donation-opportunities/:id', asyncHandler(ctrl.getOne));
router.get('/admin/donation-opportunities', requireAdmin, paginate, asyncHandler(ctrl.listAdmin));
router.post('/admin/donation-opportunities', requireAdmin, asyncHandler(ctrl.create));
router.put('/admin/donation-opportunities/:id', requireAdmin, asyncHandler(ctrl.update));
router.delete('/admin/donation-opportunities/:id', requireAdmin, asyncHandler(ctrl.remove));
export default router;
