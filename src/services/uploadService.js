const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'https://visitca-trip-backendv1-production.up.railway.app';

/**
 * Compress / Resize image file before upload (max 500x500px, JPEG quality 0.8)
 */
export const compressImage = (file, maxWidth = 500, maxHeight = 500, quality = 0.8) => {
  return new Promise((resolve) => {
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return resolve(file);
    }
    // If file is small (< 300KB), no need to compress
    if (file.size <= 300 * 1024) {
      return resolve(file);
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = Math.max(1, Math.floor(width));
        canvas.height = Math.max(1, Math.floor(height));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name ? file.name.replace(/\.[^/.]+$/, ".jpg") : 'avatar.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

/**
 * Upload Avatar to POST /api/uploads/avatar
 * Pure native fetch, clean FormData ('avatar' then 'file'), NO Base64 or PUT fallbacks!
 */
export const uploadAvatar = async (file) => {
  const token = localStorage.getItem('token') || localStorage.getItem('visitca_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Compress image before sending to avoid 413 Content Too Large & Busboy crashes
  const processedFile = await compressImage(file, 500, 500, 0.8);

  const fieldKeys = ['avatar', 'file'];
  let lastErrMessage = null;

  for (const key of fieldKeys) {
    try {
      const formData = new FormData();
      formData.append(key, processedFile);

      console.log(`[uploadAvatar] Posting FormData with key '${key}' (${processedFile.size} bytes)...`);
      const response = await fetch(`${API_BASE}/api/uploads/avatar`, {
        method: 'POST',
        headers, // Clean headers: ONLY Authorization header, NO Content-Type!
        body: formData
      });

      const resText = await response.text();
      console.log(`[uploadAvatar] Server Response (key '${key}', status ${response.status}):`, resText);

      let resJson = {};
      try { resJson = JSON.parse(resText); } catch (e) {}

      if (response.ok) {
        const avatarUrl = resJson?.url || resJson?.avatarUrl || resJson?.fileUrl || resJson?.avatar || resJson?.data?.url || resJson?.data?.avatarUrl || resJson?.path;
        if (avatarUrl) {
          return { success: true, url: avatarUrl, data: resJson };
        }
        return { success: true, url: resJson?.url || resJson, data: resJson };
      }

      lastErrMessage = resJson?.error?.message || resJson?.message || resJson?.error || `Upload failed with status ${response.status}`;
    } catch (err) {
      console.error(`[uploadAvatar] Fetch network error for key '${key}':`, err);
      lastErrMessage = err.message || "Tarmoq xatoligi yuz berdi";
    }
  }

  throw new Error(typeof lastErrMessage === 'string' ? lastErrMessage : "Serverga rasmni yuklab bo'lmadi");
};

/**
 * Upload Document to POST /api/uploads/document
 */
export const uploadDocument = async (file) => {
  const token = localStorage.getItem('token') || localStorage.getItem('visitca_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fieldKeys = ['file', 'document'];
  let lastErrMessage = null;

  for (const key of fieldKeys) {
    try {
      const formData = new FormData();
      formData.append(key, file);

      const response = await fetch(`${API_BASE}/api/uploads/document`, {
        method: 'POST',
        headers,
        body: formData
      });

      const resText = await response.text();
      let resJson = {};
      try { resJson = JSON.parse(resText); } catch (e) {}

      if (response.ok) {
        const docUrl = resJson?.url || resJson?.documentUrl || resJson?.fileUrl || resJson?.data?.url || resJson?.path;
        return { success: true, url: docUrl, data: resJson };
      }

      lastErrMessage = resJson?.error?.message || resJson?.message || `Upload failed with status ${response.status}`;
    } catch (err) {
      lastErrMessage = err.message || "Hujjat yuklashda xatolik yuz berdi";
    }
  }

  throw new Error(typeof lastErrMessage === 'string' ? lastErrMessage : "Hujjatni yuklab bo'lmadi");
};

const uploadService = {
  uploadAvatar,
  uploadDocument,
  compressImage
};

export default uploadService;
