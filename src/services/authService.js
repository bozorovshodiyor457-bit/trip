import api from './api';

const authService = {
  /**
   * Telefon raqamiga SMS jo'natish (Tizimga kirish)
   * @param {string} phone - "+998901234567" shaklidagi telefon raqami
   */
  sendLoginCode: async (phone) => {
    try {
      const response = await api.post('/auth/send-code', { phone });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * SMS kodni tasdiqlash
   * @param {string} phone - Telefon raqami
   * @param {string} code - SMS orqali kelgan tasdiqlash kodi
   */
  verifyCode: async (phone, code) => {
    try {
      const response = await api.post('/auth/verify', { phone, code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xorijiy turistlar uchun elektron pochta orqali ro'yxatdan o'tish
   * @param {Object} userData - { fullName, email, password }
   */
  registerWithEmail: async (userData) => {
    try {
      const response = await api.post('/auth/register/email', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Xorijiy turistlar uchun elektron pochta orqali kirish
   * @param {string} email
   * @param {string} password
   */
  loginWithEmail: async (email, password) => {
    try {
      const response = await api.post('/auth/login/email', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  
  /**
   * OneID orqali avtorizatsiya so'rovi (Mock function, haqiqiy API ga moslash kerak)
   */
  loginWithOneId: async () => {
    try {
      const response = await api.get('/auth/oneid/url');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default authService;
