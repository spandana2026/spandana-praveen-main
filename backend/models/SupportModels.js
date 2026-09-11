import mongoose from 'mongoose';
import { isDbConnected } from '../config/db.js';
import { jsonModel } from './base.js';
import path from 'path';
import { env } from '../config/env.js';

function makeMongo(name, schema) {
  return mongoose.models[name] || mongoose.model(name, schema);
}
function normalize(doc) {
  if (!doc) return null;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  return { ...obj, id: String(obj._id ?? obj.id) };
}
function makeStore(file, name, schema) {
  const jm = jsonModel(path.join(env.DATA_DIR, file));
  const mm = makeMongo(name, schema);
  return {
    async getAll(filter = null, sort = { createdAt: -1 }) {
      if (isDbConnected()) return (await mm.find(filter || {}).sort(sort)).map(normalize);
      return jm.getAll(filter ? r => Object.entries(filter).every(([k,v]) => r[k] === v) : null);
    },
    async getById(id) {
      if (isDbConnected()) return normalize(await mm.findById(id));
      return jm.getById(id);
    },
    async create(data) {
      if (isDbConnected()) return normalize(await mm.create(data));
      return jm.create(data);
    },
    async update(id, data) {
      if (isDbConnected()) return normalize(await mm.findByIdAndUpdate(id, data, { new: true }));
      return jm.update(id, data);
    },
    async delete(id) {
      if (isDbConnected()) return !!(await mm.findByIdAndDelete(id));
      return jm.delete(id);
    },
  };
}

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, default: '' },
  description: { type: String, default: '' },
  type: { type: String, enum: ['fundraising', 'emergency'], default: 'fundraising' },
  geography: { type: String, enum: ['india', 'international', 'both'], default: 'both' },
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  targetAmount: { type: Number, default: null },
  targetQuantity: { type: Number, default: null },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  status: { type: String, enum: ['draft', 'active', 'paused', 'completed', 'archived'], default: 'draft' },
  published: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  image: { type: String, default: '' },
  campaignDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  donationOptions: {
    allowCustomAmount: { type: Boolean, default: true },
    presetAmountsINR: { type: [Number], default: [] },
    presetAmountsUSD: { type: [Number], default: [] },
    showPerUnit: { type: Boolean, default: false },
    perUnitName: { type: String, default: '' },
    perUnitCost: { type: Number, default: null },
    quantityPresets: { type: [Number], default: [1, 2, 5, 10] },
  },
  order: { type: Number, default: 0 },
  metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

const requirementSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  parentType: { type: String, enum: ['program', 'project', 'campaign', 'emergency-campaign', 'organization'], default: 'organization' },
  parentId: { type: String, default: null },
  geography: { type: String, enum: ['india', 'international', 'both'], default: 'both' },
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  unitName: { type: String, default: '' },
  unitCost: { type: Number, default: null },
  targetQuantity: { type: Number, default: null },
  targetAmount: { type: Number, default: null },
  visibility: { type: String, enum: ['public', 'private'], default: 'public' },
  fundable: { type: Boolean, default: true },
  status: { type: String, enum: ['draft', 'active', 'fulfilled', 'archived'], default: 'active' },
  published: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const contributionSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  personId: { type: String, default: null },
  anonymous: { type: Boolean, default: false },
  communicationConsent: { type: Boolean, default: false },
  donor: {
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    mobile: { type: String, default: '' },
    country: { type: String, default: '' },
  },
  supportType: { type: String, enum: ['cash', 'in-kind'], default: 'cash' },
  targetType: { type: String, enum: ['opportunity', 'program', 'project', 'campaign', 'emergency-campaign', 'requirement', 'general'], default: 'general' },
  targetId: { type: String, default: null },
  title: { type: String, default: '' },
  quantity: { type: Number, default: null },
  unitName: { type: String, default: '' },
  amount: { type: Number, default: 0 },
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  note: { type: String, default: '' },
  recurring: { type: Boolean, default: false },
  inKindStatus: { type: String, enum: ['pledged', 'verifying', 'approved', 'received', 'acknowledged', 'cancelled'], default: 'pledged' },
  status: { type: String, enum: ['initiated', 'pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded', 'in-kind'], default: 'pending' },
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  reference: { type: String, required: true, unique: true },
  contributionId: { type: String, required: true },
  donorName: { type: String, default: '' },
  donorEmail: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['INR', 'USD'], required: true },
  paymentMethod: { type: String, default: 'manual' },
  provider: { type: String, default: 'manual' },
  providerReference: { type: String, default: '' },
  transactionType: { type: String, enum: ['donation', 'sponsorship', 'event_ticket', 'other'], default: 'donation' },
  paymentAccountId: { type: String, default: null },
  verification: {
    status: { type: String, enum: ['not_required', 'pending', 'verified', 'rejected'], default: 'pending' },
    utr: { type: String, default: '' },
    paymentDate: { type: Date, default: null },
    proofUrl: { type: String, default: '' },
    verifiedBy: { type: String, default: '' },
    verifiedAt: { type: Date, default: null },
    rejectionReason: { type: String, default: '' },
  },
  status: { type: String, enum: ['initiated', 'pending', 'paid', 'failed', 'cancelled', 'refunded', 'partially_refunded'], default: 'initiated' },
  notes: { type: String, default: '' },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

const paymentAccountSchema = new mongoose.Schema({
  name: { type: String, required: true },
  geography: { type: String, enum: ['india', 'international', 'both'], default: 'both' },
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  accountType: { type: String, enum: ['bank', 'upi', 'gateway', 'other'], default: 'bank' },
  accountName: { type: String, default: '' },
  accountNumber: { type: String, default: '' },
  ifscSwift: { type: String, default: '' },
  upiId: { type: String, default: '' },
  provider: { type: String, default: '' },
  active: { type: Boolean, default: true },
  publicDisplay: { type: Boolean, default: false },
}, { timestamps: true });

const paymentProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  geography: { type: String, enum: ['india', 'international', 'both'], default: 'both' },
  currency: { type: String, enum: ['INR', 'USD'], default: 'INR' },
  paymentAccountIds: { type: [String], default: [] },
  publicDisplay: { type: Boolean, default: false },
  methods: [{
    type: { type: String, required: true },
    label: { type: String, required: true },
    enabled: { type: Boolean, default: true },
    checkoutUrl: { type: String, default: '' },
    accountName: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifscSwift: { type: String, default: '' },
    notes: { type: String, default: '' },
  }],
  active: { type: Boolean, default: true },
}, { timestamps: true });

const refundSchema = new mongoose.Schema({
  refundNumber: { type: String, required: true, unique: true },
  transactionId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  reason: { type: String, default: '' },
  status: { type: String, enum: ['requested', 'approved', 'processed', 'rejected'], default: 'requested' },
  processedAt: { type: Date, default: null },
}, { timestamps: true });

const personSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, default: '' },
  mobile: { type: String, default: '' },
  country: { type: String, default: '' },
  roles: { type: [String], default: ['donor'] },
  anonymousDefault: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
}, { timestamps: true });

const recurringDonationSchema = new mongoose.Schema({
  personId: { type: String, default: null },
  contributionId: { type: String, default: null },
  campaignId: { type: String, default: null },
  targetType: { type: String, default: 'general' },
  targetId: { type: String, default: null },
  amount: { type: Number, required: true },
  currency: { type: String, enum: ['INR', 'USD'], required: true },
  frequency: { type: String, enum: ['monthly'], default: 'monthly' },
  provider: { type: String, default: '' },
  subscriptionId: { type: String, default: '' },
  startDate: { type: Date, default: null },
  nextPaymentDate: { type: Date, default: null },
  status: { type: String, enum: ['pending', 'active', 'paused', 'cancelled', 'completed', 'failed'], default: 'pending' },
  cancelledAt: { type: Date, default: null },
}, { timestamps: true });

const auditEventSchema = new mongoose.Schema({
  actorId: { type: String, default: '' },
  actorName: { type: String, default: '' },
  actorRole: { type: String, default: '' },
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String, default: '' },
  before: { type: mongoose.Schema.Types.Mixed, default: null },
  after: { type: mongoose.Schema.Types.Mixed, default: null },
  requestId: { type: String, default: '' },
  ip: { type: String, default: '' },
  reason: { type: String, default: '' },
}, { timestamps: true });

const receiptSchema = new mongoose.Schema({
  receiptNumber: { type: String, required: true, unique: true },
  transactionId: { type: String, required: true },
  contributionId: { type: String, required: true },
  donorName: { type: String, default: '' },
  donorEmail: { type: String, default: '' },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
  generatedBy: { type: String, default: '' },
}, { timestamps: true });

export const Person = makeStore('people.json', 'Person', personSchema);
export const PaymentAccount = makeStore('payment-accounts.json', 'PaymentAccount', paymentAccountSchema);
export const RecurringDonation = makeStore('recurring-donations.json', 'RecurringDonation', recurringDonationSchema);
export const AuditEvent = makeStore('audit-events.json', 'AuditEvent', auditEventSchema);

export const FundraisingCampaign = makeStore('fundraising-campaigns.json', 'FundraisingCampaign', campaignSchema);
export const Requirement = makeStore('requirements.json', 'Requirement', requirementSchema);
export const Contribution = makeStore('contributions.json', 'Contribution', contributionSchema);
export const Transaction = makeStore('transactions.json', 'Transaction', transactionSchema);
export const PaymentProfile = makeStore('payment-profiles.json', 'PaymentProfile', paymentProfileSchema);
export const Receipt = makeStore('receipts.json', 'Receipt', receiptSchema);
export const Refund = makeStore('refunds.json', 'Refund', refundSchema);

export function newReference(prefix = 'SPN') {
  const d = new Date();
  const stamp = d.toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
  return `${prefix}-${stamp}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}
