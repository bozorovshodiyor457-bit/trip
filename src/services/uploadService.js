import api from './api';

const uploadService = {
  /**
   * POST /api/uploads/avatar
   * Upload user avatar image to AWS S3 / Cloud Storage
   * @param {File} file - Selected image file (jpg, png, webp)
   */
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('file', file); // Fallback for multer field name

      const response = await api.post('/api/uploads/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Extract image URL from response
      const data = response.data;
      const avatarUrl = data.url || data.avatarUrl || data.fileUrl || data.avatar || data.data?.url;
      return { success: true, url: avatarUrl, data };
    } catch (error) {
      console.error('uploadAvatar error:', error);
      throw error.response?.data || error;
    }
  },

  /**
   * POST /api/uploads/document
   * Upload document/passport file to AWS S3 / Cloud Storage
   * @param {File} file - Selected document file (pdf, jpg, png)
   */
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('file', file);

      const response = await api.post('/api/uploads/document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;
      const docUrl = data.url || data.documentUrl || data.fileUrl || data.data?.url;
      return { success: true, url: docUrl, data };
    } catch (error) {
      console.error('uploadDocument error:', error);
      throw error.response?.data || error;
    }
  }
};

export default uploadService;
