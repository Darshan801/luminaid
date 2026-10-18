import api from './api';

const userService = {
  // Get all users (admin)
  getAllUsers: async (page = 1, limit = 20, filters = {}) => {
    const params = new URLSearchParams({
      page,
      limit,
      ...filters
    });
    return await api.get(`/users?${params}`);
  },

  // Get user by ID (admin)
  getUserById: async (userId) => {
    return await api.get(`/users/${userId}`);
  },

  // Update user (admin)
  updateUser: async (userId, userData) => {
    return await api.put(`/users/${userId}`, userData);
  },

  // Delete user (admin)
  deleteUser: async (userId) => {
    return await api.delete(`/users/${userId}`);
  },

  // Get user statistics (admin)
  getUserStats: async () => {
    return await api.get('/users/stats');
  }
};

export default userService;
