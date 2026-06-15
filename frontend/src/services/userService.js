import api from './api.js';

export const userService = {
  // GET /api/users
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // GET /api/users/:id
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // POST /api/users
  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // PUT /api/users/:id
  update: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // PATCH /api/users/:id/deactivate
  deactivate: async (id) => {
    const response = await api.patch(`/users/${id}/deactivate`);
    return response.data;
  },

  // PATCH /api/users/:id/role
  updateRole: async (id, role) => {
    const response = await api.patch(`/users/${id}/role`, { role });
    return response.data;
  },
};