import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { paginate } from '../../middleware/paginate.js';
import * as ctrl from '../../controllers/emergencyCampaignsController.js';

const router=Router();
router.get('/emergency-campaigns',paginate,asyncHandler(ctrl.listPublic));
router.get('/emergency-campaigns/:id',asyncHandler(ctrl.getOne));
router.get('/admin/emergency-campaigns',requireAdmin,paginate,asyncHandler(ctrl.listAdmin));
router.post('/admin/emergency-campaigns',requireAdmin,asyncHandler(ctrl.create));
router.put('/admin/emergency-campaigns/:id',requireAdmin,asyncHandler(ctrl.update));
router.delete('/admin/emergency-campaigns/:id',requireAdmin,asyncHandler(ctrl.remove));
export default router;
