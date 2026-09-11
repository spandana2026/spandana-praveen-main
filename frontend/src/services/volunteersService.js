import { api } from './api.js';
export const volunteersService = {
  submit:    (data) => api.post('/volunteers', data),
  listAdmin: (p=1,l=20) => api.get(`/admin/volunteers?page=${p}&limit=${l}`, true),
  delete:    (id)   => api.delete(`/admin/volunteers/${id}`, true),
  updateStatus: (id, status) => api.put(`/admin/volunteers/${id}/status`, { status }, true),
};
