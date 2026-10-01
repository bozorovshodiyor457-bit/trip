import api from './api';

const chatService = {
  /**
   * POST /api/b2c/chats/start
   * Start a new chat with organizer / operator
   * @param {Object} payload - { tourId, organizerId, initialMessage }
   */
  startChat: async (payload) => {
    try {
      const response = await api.post('/api/b2c/chats/start', payload);
      return response.data;
    } catch (error) {
      console.error('startChat error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/chats/my-chats
   * Get active user chats
   */
  getMyChats: async () => {
    try {
      const response = await api.get('/api/b2c/chats/my-chats');
      return response.data;
    } catch (error) {
      console.error('getMyChats error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * GET /api/b2c/chats/:chatId/messages
   * Load messages for a chat
   */
  getChatMessages: async (chatId, params = {}) => {
    try {
      const response = await api.get(`/api/b2c/chats/${chatId}/messages`, { params });
      return response.data;
    } catch (error) {
      console.error(`getChatMessages (${chatId}) error:`, error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/b2c/chats/:chatId/messages
   * Send a message in a chat
   * @param {string} chatId
   * @param {Object} payload - { text, attachments }
   */
  sendMessage: async (chatId, payload) => {
    try {
      const response = await api.post(`/api/b2c/chats/${chatId}/messages`, payload);
      return response.data;
    } catch (error) {
      console.error(`sendMessage (${chatId}) error:`, error);
      throw error.response?.data || error;
    }
  }
};

export default chatService;
