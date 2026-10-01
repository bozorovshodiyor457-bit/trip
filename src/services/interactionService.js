import api from './api';

const interactionService = {
  /**
   * GET /api/b2c/interactions/favorites
   * User favorite tours
   */
  getFavorites: async () => {
    try {
      const response = await api.get('/api/b2c/interactions/favorites');
      return response.data;
    } catch (error) {
      console.error('getFavorites error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/interactions/favorites/:tourId
   * Toggle favorite state for a tour
   */
  toggleFavorite: async (tourId) => {
    try {
      const response = await api.post(`/api/b2c/interactions/favorites/${tourId}`);
      return response.data;
    } catch (error) {
      console.error(`toggleFavorite (${tourId}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/interactions/promocodes/validate
   * Validate promo code during checkout
   * @param {Object} payload - { code, amount, tourId }
   */
  validatePromocode: async (payload) => {
    try {
      const response = await api.post('/api/b2c/interactions/promocodes/validate', payload);
      return response.data;
    } catch (error) {
      console.error('validatePromocode error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/interactions/custom-requests
   * Send custom tour request ("Men uchun tur")
   * @param {Object} payload - { name, phone, email, destination, dates, budget, guestsCount, notes }
   */
  submitCustomRequest: async (payload) => {
    try {
      const response = await api.post('/api/b2c/interactions/custom-requests', payload);
      return response.data;
    } catch (error) {
      console.error('submitCustomRequest error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/interactions/notifications
   * Get user notifications
   */
  getNotifications: async () => {
    try {
      const response = await api.get('/api/b2c/interactions/notifications');
      return response.data;
    } catch (error) {
      console.error('getNotifications error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * PATCH /api/b2c/interactions/notifications/:id/read
   * Mark notification as read
   */
  markNotificationRead: async (id) => {
    try {
      const response = await api.patch(`/api/b2c/interactions/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      console.error(`markNotificationRead (${id}) error:`, error);
      throw error.response?.data || error;
    }
  }
};

export default interactionService;
