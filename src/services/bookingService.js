import api from './api';

const bookingService = {
  /**
   * POST /api/b2c/bookings/hold
   * Hold seats temporarily (15 mins)
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
   * GET /api/b2c/bookings/:id
   * Fetch booking details by ID
   */
  getBookingById: async (id) => {
    try {
      const response = await api.get(`/api/b2c/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`getBookingById (${id}) error:`, error);
      throw error.response?.data || error;
    }
  },

  getBookingDetails: async (id) => {
    return await bookingService.getBookingById(id);
  },

  /**
   * POST /api/b2c/bookings/:id/pay
   * initiatePayment(bookingId, paymentMethod = 'cardsystem')
   * Body: { payment_method: paymentMethod } ('cardsystem', 'click', 'payme')
   * Returns inPAY payment URL (res.data.pay_url || res.data.paymentUrl || res.data.data?.pay_url)
   */
  initiatePayment: async (bookingId, paymentMethod = 'cardsystem') => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/b2c/bookings/${bookingId}/pay`,
        { payment_method: paymentMethod },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      
      const payUrl = response.data?.pay_url || response.data?.paymentUrl || response.data?.data?.pay_url || response.data?.url;
      return payUrl || response.data;
    } catch (error) {
      console.error(`initiatePayment (${bookingId}, ${paymentMethod}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * Legacy wrapper for payBooking
   */
  payBooking: async (id, payload = {}) => {
    const method = typeof payload === 'string' ? payload : (payload.payment_method || payload.provider || 'cardsystem');
    return await bookingService.initiatePayment(id, method);
  },

  /**
   * POST /api/b2c/bookings/:id/pay-mock
   * Mock payment for test mode
   */
  mockPayment: async (bookingId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/b2c/bookings/${bookingId}/pay-mock`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      return response.data;
    } catch (error) {
      console.error(`mockPayment (${bookingId}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * Alias for mockPayment
   */
  mockPayBooking: async (id) => {
    return await bookingService.mockPayment(id);
  },

  payMockBooking: async (id) => {
    return await bookingService.mockPayment(id);
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
