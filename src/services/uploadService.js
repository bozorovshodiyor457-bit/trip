import api from './api';

const uploadService = {
  /**
   * POST /api/uploads/avatar
   * Upload user avatar image to AWS S3 / Cloud Storage
   * @param {File} file - Selected image file (jpg, png, webp)
   */
  uploadAvatar: async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('avatar', file);

      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      let response;
      try {
        response = await api.post('/api/uploads/avatar', formData, config);
      } catch (err1) {
        // Fallback: If 'avatar' field name gives 400, try 'file' field name
        if (err1.response?.status === 400) {
          const formData2 = new FormData();
          formData2.append('file', file);
          response = await api.post('/api/uploads/avatar', formData2, config);
        } else {
          throw err1;
        }
      }

      const data = response.data;
      const avatarUrl = data?.url || data?.avatarUrl || data?.fileUrl || data?.avatar || data?.data?.url || data?.path;
      return { success: true, url: avatarUrl, data };
    } catch (error) {
      console.error('Upload Error Details:', error.response?.data || error.message || error);
      const rawMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      const errorMsg = typeof rawMsg === 'string' ? rawMsg : (rawMsg?.message || "Avatar yuklashda server xatoligi yuz berdi");
      throw { success: false, message: errorMsg, originalError: error };
    }
  },

  /**
   * POST /api/uploads/document
   * Upload document/passport file to AWS S3 / Cloud Storage
   * @param {File} file - Selected document file (pdf, jpg, png)
   */
  uploadDocument: async (file) => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);

      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      let response;
      try {
        response = await api.post('/api/uploads/document', formData, config);
      } catch (err1) {
        if (err1.response?.status === 400) {
          const formData2 = new FormData();
          formData2.append('document', file);
          response = await api.post('/api/uploads/document', formData2, config);
        } else {
          throw err1;
        }
      }

      const data = response.data;
      const docUrl = data?.url || data?.documentUrl || data?.fileUrl || data?.data?.url || data?.path;
      return { success: true, url: docUrl, data };
    } catch (error) {
      console.error('Upload Error Details:', error.response?.data || error.message || error);
      const rawMsg = error.response?.data?.message || error.response?.data?.error || error.message;
      const errorMsg = typeof rawMsg === 'string' ? rawMsg : (rawMsg?.message || "Hujjat yuklashda server xatoligi yuz berdi");
      throw { success: false, message: errorMsg, originalError: error };
    }
  }
};

export default uploadService;
