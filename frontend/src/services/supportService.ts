import { api } from './api.js';
import type { SupportCatalog, FundraisingCampaign, Requirement, Contribution, Transaction, Receipt, PaymentProfile, PaymentAccount, SupportReport } from './supportTypes';

export const supportService = {
  catalog: () => api.get('/support/catalog'),
  adminCatalog: () => api.get('/admin/support/catalog', true),
  campaigns: () => api.get('/admin/fundraising-campaigns', true),
  createCampaign: (data: Partial<FundraisingCampaign>) => api.post('/admin/fundraising-campaigns', data, true),
  updateCampaign: (id: string, data: Partial<FundraisingCampaign>) => api.put(`/admin/fundraising-campaigns/${id}`, data, true),
  deleteCampaign: (id: string) => api.delete(`/admin/fundraising-campaigns/${id}`, true),
  requirements: () => api.get('/admin/requirements', true),
  createRequirement: (data: Partial<Requirement>) => api.post('/admin/requirements', data, true),
  updateRequirement: (id: string, data: Partial<Requirement>) => api.put(`/admin/requirements/${id}`, data, true),
  deleteRequirement: (id: string) => api.delete(`/admin/requirements/${id}`, true),
  contributions: () => api.get('/admin/contributions', true),
  updateContribution: (id: string, data: Record<string, unknown>) => api.put(`/admin/contributions/${id}`, data, true),
  deleteContribution: (id: string) => api.delete(`/admin/contributions/${id}`, true),
  transactions: () => api.get('/admin/transactions', true),
  updateTransaction: (id: string, data: Record<string, unknown>) => api.put(`/admin/transactions/${id}`, data, true),
  createReceipt: (transactionId: string) => api.post(`/admin/transactions/${transactionId}/receipt`, {}, true),
  receipts: () => api.get('/admin/receipts', true),
  paymentProfiles: () => api.get('/admin/payment-profiles', true),
  paymentAccounts: () => api.get('/admin/payment-accounts', true),
  createPaymentAccount: (data: Partial<PaymentAccount>) => api.post('/admin/payment-accounts', data, true),
  updatePaymentAccount: (id: string, data: Partial<PaymentAccount>) => api.put(`/admin/payment-accounts/${id}`, data, true),
  createPaymentProfile: (data: Partial<PaymentProfile>) => api.post('/admin/payment-profiles', data, true),
  updatePaymentProfile: (id: string, data: Partial<PaymentProfile>) => api.put(`/admin/payment-profiles/${id}`, data, true),
  deletePaymentProfile: (id: string) => api.delete(`/admin/payment-profiles/${id}`, true),
  report: () => api.get('/admin/support/reports', true),
  createContribution: (data: Record<string, unknown>) => api.post('/contributions', data),
};

export type { SupportCatalog, FundraisingCampaign, Requirement, Contribution, Transaction, Receipt, PaymentProfile, PaymentAccount, SupportReport };
