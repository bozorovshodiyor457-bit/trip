import api from './api';

const tourService = {
  /**
   * GET /api/b2c/tours
   * Search & filter tours
   * @param {Object} params - { search, category, sort, page, limit, minPrice, maxPrice, rating, location }
   */
  getTours: async (params = {}) => {
    try {
      const response = await api.get('/api/b2c/tours', { params });
      return response.data;
    } catch (error) {
      console.error('getTours error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/tours/map
   * Map pins and tour coordinates
   */
  getToursMap: async (params = {}) => {
    try {
      const response = await api.get('/api/b2c/tours/map', { params });
      return response.data;
    } catch (error) {
      console.error('getToursMap error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/tours/:id
   * Tour detail by ID
   */
  getTourById: async (id) => {
    try {
      const response = await api.get(`/api/b2c/tours/${id}`);
      return response.data;
    } catch (error) {
      console.error(`getTourById (${id}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/tours/options/:optionId/departures
   * Available dates and slots for a selected option
   */
  getOptionDepartures: async (optionId, params = {}) => {
    try {
      const response = await api.get(`/api/b2c/tours/options/${optionId}/departures`, { params });
      return response.data;
    } catch (error) {
      console.error(`getOptionDepartures (${optionId}) error:`, error);
      throw error.response?.data || error;
    }
  }
};

export default tourService;
