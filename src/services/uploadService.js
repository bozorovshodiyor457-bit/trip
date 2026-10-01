const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'https://visitca-trip-backendv1-production.up.railway.app';

// Helper: Compress image to small 250x250 Data URL thumbnail
function compressImageToThumbnail(file, maxWidth = 250, maxHeight = 250) {
  return new Promise((resolve) => {
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
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(event.target.result);
    };
    reader.onerror = () => resolve(null);
  });
}

const uploadService = {
  /**
   * POST /api/uploads/avatar
   * Native fetch without Axios default JSON headers + Exact Error Logging + Base64 & Profile PUT Fallbacks
   */
  uploadAvatar: async (file) => {
    const token = localStorage.getItem('token') || localStorage.getItem('visitca_token');
    const authHeaders = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    // 1. Native fetch with FormData ('avatar' field first, then 'file', 'image')
    // DIQQAT: 'Content-Type' sarlavhasi UMUMAN qo'shilmaydi! Brauzer boundary parametrini o'zi yaratadi.
    const fieldKeys = ['avatar', 'file', 'image'];
    for (const key of fieldKeys) {
      try {
        const formData = new FormData();
        formData.append(key, file);

        console.log(`[Upload] Native fetch FormData attempt with fieldName: '${key}'`);
        const response = await fetch(`${API_BASE}/api/uploads/avatar`, {
          method: 'POST',
          headers: authHeaders, // Clean headers: ONLY Authorization header, NO Content-Type
          body: formData
        });

        const resText = await response.text();
        console.log(`EXACT SERVER REASON (key '${key}', status ${response.status}):`, resText);

        let resJson = {};
        try { resJson = JSON.parse(resText); } catch (e) {}

        if (response.ok) {
          const avatarUrl = resJson?.url || resJson?.avatarUrl || resJson?.fileUrl || resJson?.avatar || resJson?.data?.url || resJson?.path;
          if (avatarUrl) {
            return { success: true, url: avatarUrl, data: resJson };
          }
        }
      } catch (err) {
        console.warn(`[Upload] Fetch error for key '${key}':`, err);
      }
    }

    // 2. Base64 JSON Body fallback (If backend expects JSON body)
    try {
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });

      console.log("[Upload] Trying Base64 JSON upload fallback...");
      const jsonHeaders = {
        'Content-Type': 'application/json',
        ...authHeaders
      };

      const resJsonBody = await fetch(`${API_BASE}/api/uploads/avatar`, {
        method: 'POST',
        headers: jsonHeaders,
        body: JSON.stringify({ avatar: base64Data, image: base64Data, file: base64Data })
      });

      const resText2 = await resJsonBody.text();
      console.log(`EXACT SERVER REASON (Base64 JSON, status ${resJsonBody.status}):`, resText2);

      let resJson2 = {};
      try { resJson2 = JSON.parse(resText2); } catch (e) {}

      if (resJsonBody.ok) {
        const avatarUrl = resJson2?.url || resJson2?.avatarUrl || resJson2?.fileUrl || resJson2?.avatar || resJson2?.data?.url;
        if (avatarUrl) {
          return { success: true, url: avatarUrl, data: resJson2 };
        }
      }
    } catch (base64Err) {
      console.warn("[Upload] Base64 JSON upload fallback error:", base64Err);
    }

    // 3. Direct Profile Update fallback (PUT /api/b2c/auth/profile)
    try {
      const base64Thumbnail = await compressImageToThumbnail(file);
      console.log("[Upload] Trying direct profile update fallback (PUT /api/b2c/auth/profile)...");
      const profileHeaders = {
        'Content-Type': 'application/json',
        ...authHeaders
      };
      const profRes = await fetch(`${API_BASE}/api/b2c/auth/profile`, {
        method: 'PUT',
        headers: profileHeaders,
        body: JSON.stringify({ avatar: base64Thumbnail, avatarUrl: base64Thumbnail })
      });
      const profText = await profRes.text();
      console.log(`[Upload] Profile PUT response (status ${profRes.status}):`, profText);

      if (profRes.ok) {
        return { success: true, url: base64Thumbnail, isProfileUpdated: true };
      }
    } catch (profErr) {
      console.warn("[Upload] Profile update fallback error:", profErr);
    }

    throw { success: false, message: "Avatar yuklashda server xatoligi yuz berdi" };
  },

  /**
   * POST /api/uploads/document
   * Native fetch without Axios default JSON headers
   */
  uploadDocument: async (file) => {
    const token = localStorage.getItem('token') || localStorage.getItem('visitca_token');
    const authHeaders = {};
    if (token) {
      authHeaders['Authorization'] = `Bearer ${token}`;
    }

    const fieldKeys = ['file', 'document'];
    for (const key of fieldKeys) {
      try {
        const formData = new FormData();
        formData.append(key, file);

        const response = await fetch(`${API_BASE}/api/uploads/document`, {
          method: 'POST',
          headers: authHeaders,
          body: formData
        });

        const resText = await response.text();
        console.log(`EXACT SERVER REASON (Document key '${key}', status ${response.status}):`, resText);

        let resJson = {};
        try { resJson = JSON.parse(resText); } catch (e) {}

        if (response.ok) {
          const docUrl = resJson?.url || resJson?.documentUrl || resJson?.fileUrl || resJson?.data?.url || resJson?.path;
          if (docUrl) {
            return { success: true, url: docUrl, data: resJson };
          }
        }
      } catch (err) {
        console.warn(`Document upload fetch error for key '${key}':`, err);
      }
    }

    throw { success: false, message: "Hujjat yuklashda server xatoligi yuz berdi" };
  }
};

export default uploadService;
