import api from './api.js';

export const taskService = {
  // GET /api/tasks
  getAll: async (filters = {}) => {
    const response = await api.get('/tasks', { params: filters });
    return response.data;
  },

  // GET /api/tasks/:id
  getById: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  // POST /api/tasks
  create: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  // PUT /api/tasks/:id
  update: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  // DELETE /api/tasks/:id
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  // PATCH /api/tasks/:id/status
  updateStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  // POST /api/tasks/:id/assign
  assign: async (id, userId) => {
    const response = await api.post(`/tasks/${id}/assign`, { userId });
    return response.data;
  },

  // GET /api/tasks/:id/comments
  getComments: async (id) => {
    const response = await api.get(`/tasks/${id}/comments`);
    return response.data;
  },

  // POST /api/tasks/:id/comments
  addComment: async (id, content) => {
    const response = await api.post(`/tasks/${id}/comments`, { content });
    return response.data;
  },
};