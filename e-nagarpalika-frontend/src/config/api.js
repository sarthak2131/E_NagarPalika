const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    me: `${API_URL}/auth/me`,
  },
  applications: {
    create: `${API_URL}/applications`,
    getAll: `${API_URL}/applications`,
    track: `${API_URL}/applications/track`,
    update: (id) => `${API_URL}/applications/${id}`,
  },
};

export default API_URL; 