import api from './api';

const reviewService = {
  /**
   * GET /api/b2c/reviews/tour/:tourId
   * Load reviews and ratings for a tour
   */
  getTourReviews: async (tourId, params = {}) => {
    try {
      const response = await api.get(`/api/b2c/reviews/tour/${tourId}`, { params });
      return response.data;
    } catch (error) {
      console.error(`getTourReviews (${tourId}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/reviews
   * Submit new review and rating
   * @param {Object} payload - { tourId, bookingId, rating, comment, images }
   */
  createReview: async (payload) => {
    try {
      const response = await api.post('/api/b2c/reviews', payload);
      return response.data;
    } catch (error) {
      console.error('createReview error:', error);
      throw error.response?.data || error;
    }
  }
};

export default reviewService;
