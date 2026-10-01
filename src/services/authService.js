import api from './api';

// Helper to format payload properly according to identifier type (Phone vs Email)
// Railway backend strictly expects ONLY { email: '...' } OR { phone: '+998...' }.
// Sending extra keys like 'identifier' or 'type' causes status 400 VALIDATION_ERROR.
function buildAuthPayload(identifier, extraData = {}) {
  const str = String(identifier || '').trim();
  const isEmail = str.includes('@');
  
  if (isEmail) {
    return {
      email: str,
      ...extraData
    };
  } else {
    // Clean phone to E.164 format: +998901234567
    let digits = str.replace(/\D/g, '');
    if (digits.length === 9) {
      digits = '998' + digits;
    }
    const cleanPhone = digits.startsWith('+') ? digits : `+${digits}`;
    return {
      phone: cleanPhone,
      ...extraData
    };
  }
}

export const getCompanions = async () => {
  try {
    const token = localStorage.getItem('token');
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get('/api/b2c/auth/companions', config);
    return response.data;
  } catch (error) {
    console.warn("getCompanions notice:", error.message || error);
    return [];
  }
};

const authService = {
  sendOtp: async (identifier) => {
    try {
      const payload = buildAuthPayload(identifier);
      console.log("Sending OTP payload:", payload);
      const response = await api.post('/api/b2c/auth/send-otp', payload);
      return response.data;
    } catch (error) {
      console.error("sendOtp API error:", error);
      throw error;
    }
  },

  verifyOtp: async (identifier, code) => {
    try {
      const payload = buildAuthPayload(identifier, { code: String(code).trim() });
      console.log("Verifying OTP payload:", payload);
      const response = await api.post('/api/b2c/auth/verify-otp', payload);
      return response.data;
    } catch (error) {
      console.error("verifyOtp API error:", error);
      throw error;
    }
  },

  getMe: async (token) => {
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get('/api/b2c/auth/me', config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCompanions,

  sendLoginCode: async (phone) => {
    return authService.sendOtp(phone);
  },

  verifyCode: async (phone, code) => {
    return authService.verifyOtp(phone, code);
  }
};

export default authService;

