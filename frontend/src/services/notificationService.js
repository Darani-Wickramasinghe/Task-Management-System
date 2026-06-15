import api from './api.js';

export const notificationService = {
  // GET /api/notifications
  getAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // PATCH /api/notifications/:id/read
  markRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  // PATCH /api/notifications/read-all
  markAllRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },
};