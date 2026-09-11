import { api } from './api.js';

export const donationOpportunitiesService = {
  list: (page = 1, limit = 1000) => api.get(`/donation-opportunities?page=${page}&limit=${limit}`),
  listAdmin: (page = 1, limit = 1000) => api.get(`/admin/donation-opportunities?page=${page}&limit=${limit}`, true),
  create: (data) => api.post('/admin/donation-opportunities', data, true),
  update: (id, data) => api.put(`/admin/donation-opportunities/${id}`, data, true),
  delete: (id) => api.delete(`/admin/donation-opportunities/${id}`, true),
};
