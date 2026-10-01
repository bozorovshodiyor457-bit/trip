import api from './api';

const bookingService = {
  /**
   * POST /api/b2c/bookings/hold
   * Hold seats temporarily (15 mins)
   * @param {Object} payload - { departureId, optionId, adultCount, childCount, infantCount, customerNotes }
   */
  holdBooking: async (payload) => {
    try {
      const response = await api.post('/api/b2c/bookings/hold', payload);
      return response.data;
    } catch (error) {
      console.error('holdBooking error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/bookings/:id/pay
   * Get real inPAY (Payme/Click) link
   * @param {string} id - Booking ID
   * @param {Object} payload - { provider: 'payme'|'click' }
   */
  payBooking: async (id, payload = {}) => {
    try {
      const response = await api.post(`/api/b2c/bookings/${id}/pay`, payload);
      return response.data;
    } catch (error) {
      console.error(`payBooking (${id}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/bookings/:id/pay-mock
   * Test mode payment simulation
   * @param {string} id - Booking ID
   */
  payMockBooking: async (id) => {
    try {
      const response = await api.post(`/api/b2c/bookings/${id}/pay-mock`);
      return response.data;
    } catch (error) {
      console.error(`payMockBooking (${id}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/bookings/my-trips
   * User trips list
   */
  getMyTrips: async (params = {}) => {
    try {
      const response = await api.get('/api/b2c/bookings/my-trips', { params });
      return response.data;
    } catch (error) {
      console.error('getMyTrips error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/bookings/:id/voucher
   * Download voucher details & QR code info
   * @param {string} id - Booking ID
   */
  getVoucher: async (id) => {
    try {
      const response = await api.get(`/api/b2c/bookings/${id}/voucher`);
      return response.data;
    } catch (error) {
      console.error(`getVoucher (${id}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/bookings/:id/cancel
   * Cancel booking
   * @param {string} id - Booking ID
   * @param {Object} payload - { reason }
   */
  cancelBooking: async (id, payload = {}) => {
    try {
      const response = await api.post(`/api/b2c/bookings/${id}/cancel`, payload);
      return response.data;
    } catch (error) {
      console.error(`cancelBooking (${id}) error:`, error);
      throw error.response?.data || error;
    }
  }
};

export default bookingService;
