import api from './api.js';

export const authService = {
  // POST /api/auth/login
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data; // { token, user }
  },

  // POST /api/auth/reset-password
  resetPassword: async (newPassword) => {
    const response = await api.post('/auth/reset-password', { new_password: newPassword });
    return response.data;
  },
};