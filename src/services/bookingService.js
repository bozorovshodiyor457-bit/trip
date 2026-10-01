import api from './api';

const bookingService = {
  /**
   * POST /api/b2c/bookings/hold
   * Hold seats temporarily (15 mins)
   */
  holdBooking: async (payload = {}) => {
    console.log("API Request: POST /api/b2c/bookings/hold", payload);
    try {
      const response = await api.post('/api/b2c/bookings/hold', payload);
      console.log("API Response: POST /api/b2c/bookings/hold", response.data);
      return response.data;
    } catch (error) {
      console.error('API Error: POST /api/b2c/bookings/hold failed:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/bookings/:id
   * Fetch booking details by ID
   */
  getBookingById: async (id) => {
    console.log(`API Request: GET /api/b2c/bookings/${id}`);
    try {
      const response = await api.get(`/api/b2c/bookings/${id}`);
      console.log(`API Response: GET /api/b2c/bookings/${id}`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error: GET /api/b2c/bookings/${id} failed:`, error.response?.data || error.message);
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
   * Returns inPAY payment URL (res.data.payment_result?.pay_url || res.data.pay_url || ...)
   */
  initiatePayment: async (bookingId, paymentMethod = 'cardsystem') => {
    console.log(`API Request: POST /api/b2c/bookings/${bookingId}/pay`, { payment_method: paymentMethod });
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/b2c/bookings/${bookingId}/pay`,
        { payment_method: paymentMethod },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      console.log(`API Response: POST /api/b2c/bookings/${bookingId}/pay`, response.data);
      
      const payUrl = response.data?.payment_result?.pay_url || response.data?.pay_url || response.data?.paymentUrl || response.data?.data?.pay_url || response.data?.url;
      return payUrl || response.data;
    } catch (error) {
      console.error(`API Error: POST /api/b2c/bookings/${bookingId}/pay failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/bookings/:id/pay-remaining
   * Pay remaining 50% balance via inPAY
   */
  payRemaining: async (bookingId, paymentMethod = 'cardsystem') => {
    console.log(`API Request: POST /api/b2c/bookings/${bookingId}/pay-remaining`, { payment_method: paymentMethod });
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/b2c/bookings/${bookingId}/pay-remaining`,
        { payment_method: paymentMethod },
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      console.log(`API Response: POST /api/b2c/bookings/${bookingId}/pay-remaining`, response.data);
      
      const payUrl = response.data?.payment_result?.pay_url || response.data?.pay_url || response.data?.paymentUrl || response.data?.data?.pay_url || response.data?.url;
      return payUrl || response.data;
    } catch (error) {
      console.error(`API Error: POST /api/b2c/bookings/${bookingId}/pay-remaining failed:`, error.response?.data || error.message);
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
    console.log(`API Request: POST /api/b2c/bookings/${bookingId}/pay-mock`);
    try {
      const token = localStorage.getItem('token');
      const response = await api.post(
        `/api/b2c/bookings/${bookingId}/pay-mock`,
        {},
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      console.log(`API Response: POST /api/b2c/bookings/${bookingId}/pay-mock`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error: POST /api/b2c/bookings/${bookingId}/pay-mock failed:`, error.response?.data || error.message);
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
    console.log("API Request: GET /api/b2c/bookings/my-trips", params);
    try {
      const response = await api.get('/api/b2c/bookings/my-trips', { params });
      console.log("API Response: GET /api/b2c/bookings/my-trips", response.data);
      return response.data;
    } catch (error) {
      console.error('API Error: GET /api/b2c/bookings/my-trips failed:', error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/bookings/:id/voucher
   * Download voucher details & QR code info
   */
  getVoucher: async (id) => {
    console.log(`API Request: GET /api/b2c/bookings/${id}/voucher`);
    try {
      const response = await api.get(`/api/b2c/bookings/${id}/voucher`);
      console.log(`API Response: GET /api/b2c/bookings/${id}/voucher`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error: GET /api/b2c/bookings/${id}/voucher failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/bookings/:id/cancel
   * Cancel booking
   */
  cancelBooking: async (id, payload = {}) => {
    console.log(`API Request: POST /api/b2c/bookings/${id}/cancel`, payload);
    try {
      const response = await api.post(`/api/b2c/bookings/${id}/cancel`, payload);
      console.log(`API Response: POST /api/b2c/bookings/${id}/cancel`, response.data);
      return response.data;
    } catch (error) {
      console.error(`API Error: POST /api/b2c/bookings/${id}/cancel failed:`, error.response?.data || error.message);
      throw error.response?.data || error;
    }
  }
};

export default bookingService;
