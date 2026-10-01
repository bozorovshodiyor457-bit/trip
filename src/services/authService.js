import api from './api';

const authService = {
  /**
   * 1-qadam: OTP yuborish (Send OTP)
   * POST /api/b2c/auth/send-otp
   * @param {string} identifier - Email yoki telefon raqami
   */
  sendOtp: async (identifier) => {
    try {
      const response = await api.post('/api/b2c/auth/send-otp', { 
        identifier: identifier,
        phone: identifier,
        email: identifier 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * 2-qadam: OTP ni tasdiqlash (Verify OTP)
   * POST /api/b2c/auth/verify-otp
   * @param {string} identifier - Email yoki telefon raqami
   * @param {string} code - OTP kodi
   */
  verifyOtp: async (identifier, code) => {
    try {
      const response = await api.post('/api/b2c/auth/verify-otp', { 
        identifier: identifier,
        phone: identifier,
        email: identifier,
        code: code 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * 3-qadam: Foydalanuvchi profilini olish (Get Profile)
   * GET /api/b2c/auth/me
   * @param {string} token - JWT Token (ixtiyoriy, agar header yetarli bo'lmasa)
   */
  getMe: async (token) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/api/b2c/auth/me', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Telefon raqamiga SMS jo'natish
   */
  sendLoginCode: async (phone) => {
    try {
      const response = await api.post('/api/b2c/auth/send-otp', { identifier: phone, phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * SMS kodni tasdiqlash
   */
  verifyCode: async (phone, code) => {
    try {
      const response = await api.post('/api/b2c/auth/verify-otp', { identifier: phone, phone, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default authService;

