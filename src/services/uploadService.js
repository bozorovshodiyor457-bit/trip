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
      // Swagger & Multer field names ('file' primary, 'avatar', 'image')
      formData.append('file', file);
      formData.append('avatar', file);
      formData.append('image', file);

      // Do NOT set 'Content-Type': 'multipart/form-data' explicitly!
      // Let Axios compute the boundary header automatically!
      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await api.post('/api/uploads/avatar', formData, config);

      // Extract image URL from response
      const data = response.data;
      const avatarUrl = data.url || data.avatarUrl || data.fileUrl || data.avatar || data.data?.url || data.path;
      return { success: true, url: avatarUrl, data };
    } catch (error) {
      console.error('Upload Error Details:', error.response?.data || error.message || error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Avatar yuklashda server xatoligi yuz berdi";
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
      formData.append('document', file);

      const config = {};
      if (token) {
        config.headers = { Authorization: `Bearer ${token}` };
      }

      const response = await api.post('/api/uploads/document', formData, config);

      const data = response.data;
      const docUrl = data.url || data.documentUrl || data.fileUrl || data.data?.url || data.path;
      return { success: true, url: docUrl, data };
    } catch (error) {
      console.error('Upload Error Details:', error.response?.data || error.message || error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Hujjat yuklashda server xatoligi yuz berdi";
      throw { success: false, message: errorMsg, originalError: error };
    }
  }
};

export default uploadService;
