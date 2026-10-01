import axios from 'axios';

// Axios instance yaratish
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://visitca-trip-backendv1-production.up.railway.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Agar token bo'lsa, uni headerga qo'shadi
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('visitca_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: 401 Unauthorized qaytsa, tokenni tozalaydi
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Xatolik yuz berganda tokenni va user ma'lumotlarini tozalaymiz
      localStorage.removeItem('visitca_token');
      localStorage.removeItem('visitca_user');
      
      // Ixtiyoriy: Tizimdan majburiy chiqarib, asosiy sahifaga yo'naltirish
      // window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
