import api from './api';

const tourService = {
  /**
   * GET /api/b2c/tours
   * Search & filter tours
   * @param {Object} params - { search, category, sort, page, limit, minPrice, maxPrice, rating, location }
   */
  getTours: async (params = {}) => {
    try {
      const cleanParams = {};
      Object.keys(params || {}).forEach(key => {
        const val = params[key];
        if (val !== undefined && val !== null && val !== '') {
          cleanParams[key] = val;
        }
      });
      const response = await api.get('/api/b2c/tours', { params: cleanParams });
      console.log('REAL TOURS API RAW RESPONSE:', response.data);
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
      // If id is a simple number or mock ID, try API but catch 404 gracefully
      const response = await api.get(`/api/b2c/tours/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status !== 404) {
        console.warn(`getTourById (${id}) notice:`, error.message || error);
      }
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
