import { Router } from 'express';
import { requireAdmin } from '../../middleware/auth.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';
import * as ctrl from '../../controllers/supportController.js';

const Geography = z.enum(['india', 'international', 'both']);
const Currency = z.enum(['INR', 'USD']);
const CampaignSchema = z.object({
  title: z.string().trim().min(1).max(120), description: z.string().max(2000).optional(),
  type: z.enum(['fundraising', 'emergency']).optional(), geography: Geography.optional(), currency: Currency.optional(),
  targetAmount: z.number().nonnegative().nullable().optional(), targetQuantity: z.number().nonnegative().nullable().optional(),
  startDate: z.union([z.string(), z.date()]).nullable().optional(), endDate: z.union([z.string(), z.date()]).nullable().optional(),
  status: z.enum(['draft', 'active', 'paused', 'completed', 'archived']).optional(), published: z.boolean().optional(), featured: z.boolean().optional(),
  image: z.string().max(500).optional(),
  slug: z.string().max(160).optional(),
  campaignDetails: z.record(z.any()).optional(),
  donationOptions: z.object({
    allowCustomAmount: z.boolean().optional(),
    presetAmountsINR: z.array(z.number().positive()).max(20).optional(),
    presetAmountsUSD: z.array(z.number().positive()).max(20).optional(),
    showPerUnit: z.boolean().optional(),
    perUnitName: z.string().max(80).optional(),
    perUnitCost: z.number().positive().nullable().optional(),
    quantityPresets: z.array(z.number().int().positive()).max(20).optional(),
  }).optional(),
  order: z.number().finite().optional()
});
const RequirementSchema = z.object({
  title: z.string().trim().min(1).max(120), description: z.string().max(2000).optional(),
  parentType: z.enum(['program', 'project', 'campaign', 'emergency-campaign', 'organization']).optional(), parentId: z.string().max(120).nullable().optional(),
  geography: Geography.optional(), currency: Currency.optional(), unitName: z.string().max(80).optional(),
  unitCost: z.number().nonnegative().nullable().optional(), targetQuantity: z.number().nonnegative().nullable().optional(), targetAmount: z.number().nonnegative().nullable().optional(),
  visibility: z.enum(['public', 'private']).optional(), fundable: z.boolean().optional(), status: z.enum(['draft', 'active', 'fulfilled', 'archived']).optional(),
  published: z.boolean().optional(), order: z.number().finite().optional()
});
const ContributionSchema = z.object({
  donorName: z.string().max(120).optional(), donorEmail: z.string().email().max(160).optional().or(z.literal('')),
  donorMobile: z.string().max(40).optional(), country: z.string().max(80).optional(),
  anonymous: z.boolean().optional(), communicationConsent: z.boolean().optional(),
  supportType: z.enum(['cash', 'in-kind']).optional(), targetType: z.enum(['opportunity','program','project','campaign','emergency-campaign','requirement','general']).optional(),
  targetId: z.string().max(120).nullable().optional(), title: z.string().max(160).optional(), quantity: z.number().positive().nullable().optional(),
  unitName: z.string().max(80).optional(), amount: z.number().nonnegative().optional(), currency: Currency.optional(), note: z.string().max(1000).optional(),
  paymentMethod: z.string().max(60).optional(), provider: z.string().max(60).optional(), providerReference: z.string().max(120).optional(), transactionType: z.enum(['donation','sponsorship','event_ticket','other']).optional(), paymentAccountId: z.string().max(120).optional(), utr: z.string().max(120).optional(), paymentDate: z.union([z.string(),z.date()]).optional(), proofUrl: z.string().max(500).optional(), recurring: z.boolean().optional()
});
const ContributionUpdateSchema = z.object({ inKindStatus: z.enum(['pledged','verifying','approved','received','acknowledged','cancelled']) });
const TransactionUpdateSchema = z.object({
  status: z.enum(['initiated','pending','paid','failed','cancelled','refunded','partially_refunded']).optional(),
  verificationStatus: z.enum(['not_required','pending','verified','rejected']).optional(),
  providerReference: z.string().max(120).optional(), utr: z.string().max(120).optional(), paymentDate: z.union([z.string(),z.date()]).optional(), proofUrl: z.string().max(500).optional(), rejectionReason: z.string().max(500).optional(), notes: z.string().max(1000).optional()
});
const RefundCreateSchema = z.object({ transactionId: z.string().min(1), amount: z.number().positive(), reason: z.string().max(500).optional() });
const RefundUpdateSchema = z.object({ status: z.enum(['requested','approved','processed','rejected']) });
const PaymentMethodSchema = z.object({ type: z.string().min(1).max(40), label: z.string().min(1).max(100), enabled: z.boolean().optional(), checkoutUrl: z.string().max(500).optional(), accountName: z.string().max(120).optional(), accountNumber: z.string().max(120).optional(), ifscSwift: z.string().max(80).optional(), notes: z.string().max(500).optional() });
const PaymentProfileSchema = z.object({
  name: z.string().trim().min(1).max(120), geography: Geography.optional(), currency: Currency.optional(),
  paymentAccountIds: z.array(z.string().max(120)).max(20).optional(), publicDisplay: z.boolean().optional(), methods: z.array(PaymentMethodSchema).max(20).optional(), active: z.boolean().optional()
});
const PaymentAccountSchema = z.object({name:z.string().trim().min(1).max(120),geography:Geography.optional(),currency:Currency.optional(),accountType:z.enum(['bank','upi','gateway','other']).optional(),accountName:z.string().max(120).optional(),accountNumber:z.string().max(120).optional(),ifscSwift:z.string().max(80).optional(),upiId:z.string().max(160).optional(),provider:z.string().max(80).optional(),active:z.boolean().optional(),publicDisplay:z.boolean().optional()});
const RecurringSchema = z.object({personId:z.string().max(120).nullable().optional(),contributionId:z.string().max(120).nullable().optional(),campaignId:z.string().max(120).nullable().optional(),targetType:z.string().max(60).optional(),targetId:z.string().max(120).nullable().optional(),amount:z.number().positive(),currency:Currency.optional(),provider:z.string().max(60).optional(),subscriptionId:z.string().max(160).optional(),startDate:z.union([z.string(),z.date()]).optional(),nextPaymentDate:z.union([z.string(),z.date()]).nullable().optional(),status:z.enum(['pending','active','paused','cancelled','completed','failed']).optional()});

const router = Router();
router.get('/support/catalog', asyncHandler(ctrl.publicCatalog));
router.get('/support/currency-rates', asyncHandler(ctrl.publicCurrencyRates));
router.get('/support/payment-profiles', asyncHandler(ctrl.listPaymentProfiles));
router.post('/contributions', validate(ContributionSchema), asyncHandler(ctrl.createContribution));
router.get('/admin/support/catalog', requireAdmin, asyncHandler(ctrl.adminCatalog));
router.get('/admin/fundraising-campaigns', requireAdmin, asyncHandler(ctrl.listCampaigns));
router.post('/admin/fundraising-campaigns', requireAdmin, validate(CampaignSchema), asyncHandler(ctrl.createCampaign));
router.put('/admin/fundraising-campaigns/:id', requireAdmin, validate(CampaignSchema.partial()), asyncHandler(ctrl.updateCampaign));
router.delete('/admin/fundraising-campaigns/:id', requireAdmin, asyncHandler(ctrl.deleteCampaign));
router.get('/admin/requirements', requireAdmin, asyncHandler(ctrl.listRequirements));
router.post('/admin/requirements', requireAdmin, validate(RequirementSchema), asyncHandler(ctrl.createRequirement));
router.put('/admin/requirements/:id', requireAdmin, validate(RequirementSchema.partial()), asyncHandler(ctrl.updateRequirement));
router.delete('/admin/requirements/:id', requireAdmin, asyncHandler(ctrl.deleteRequirement));
router.get('/admin/contributions', requireAdmin, asyncHandler(ctrl.listContributions));
router.put('/admin/contributions/:id', requireAdmin, validate(ContributionUpdateSchema), asyncHandler(ctrl.updateContribution));
router.delete('/admin/contributions/:id', requireAdmin, asyncHandler(ctrl.deleteContribution));
router.get('/admin/transactions', requireAdmin, asyncHandler(ctrl.listTransactions));
router.put('/admin/transactions/:id', requireAdmin, validate(TransactionUpdateSchema), asyncHandler(ctrl.updateTransaction));
router.post('/admin/transactions/:transactionId/receipt', requireAdmin, asyncHandler(ctrl.createReceipt));
router.get('/admin/receipts', requireAdmin, asyncHandler(ctrl.listReceipts));
router.get('/admin/refunds', requireAdmin, asyncHandler(ctrl.listRefunds));
router.post('/admin/refunds', requireAdmin, validate(RefundCreateSchema), asyncHandler(ctrl.createRefund));
router.put('/admin/refunds/:id', requireAdmin, validate(RefundUpdateSchema), asyncHandler(ctrl.updateRefund));
router.get('/admin/payment-accounts', requireAdmin, asyncHandler(ctrl.listPaymentAccounts));
router.post('/admin/payment-accounts', requireAdmin, validate(PaymentAccountSchema), asyncHandler(ctrl.createPaymentAccount));
router.put('/admin/payment-accounts/:id', requireAdmin, validate(PaymentAccountSchema.partial()), asyncHandler(ctrl.updatePaymentAccount));
router.get('/admin/people', requireAdmin, asyncHandler(ctrl.listPeople));
router.get('/admin/recurring-donations', requireAdmin, asyncHandler(ctrl.listRecurring));
router.post('/admin/recurring-donations', requireAdmin, validate(RecurringSchema), asyncHandler(ctrl.createRecurring));
router.put('/admin/recurring-donations/:id/cancel', requireAdmin, asyncHandler(ctrl.cancelRecurring));
router.get('/admin/payment-profiles', requireAdmin, asyncHandler(ctrl.listPaymentProfiles));
router.post('/admin/payment-profiles', requireAdmin, validate(PaymentProfileSchema), asyncHandler(ctrl.createPaymentProfile));
router.put('/admin/payment-profiles/:id', requireAdmin, validate(PaymentProfileSchema.partial()), asyncHandler(ctrl.updatePaymentProfile));
router.delete('/admin/payment-profiles/:id', requireAdmin, asyncHandler(ctrl.deletePaymentProfile));
router.get('/admin/support/reports', requireAdmin, asyncHandler(ctrl.reportSummary));
export default router;
