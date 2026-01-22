import axiosInstance from '../api/axiosConfig';

const API_BASE = '/user';

export const userService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}/auth/register`, {
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobile || userData.mobileNumber,
        address: userData.address,
        password: userData.password,
        profilePhotoUrl: userData.profilePhotoUrl || '',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(`${API_BASE}/auth/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all users (admin only)
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get('/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axiosInstance.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await axiosInstance.put(`/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Deactivate user
  deactivateUser: async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin: Create user with specific role (for seller registration)
  createUserWithRole: async (userData) => {
    try {
      const response = await axiosInstance.post('/users/admin/create', {
        name: userData.name,
        email: userData.email,
        mobileNumber: userData.mobileNumber || userData.mobile,
        address: userData.address,
        password: userData.password,
        role: userData.role || 'SELLER',
        profilePhotoUrl: userData.profilePhotoUrl || '',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userService;
