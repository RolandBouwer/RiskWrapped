import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username: string, password: string) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const res = await api.post('/token', params);
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const getRisks = async () => {
  const res = await api.get('/risks');
  return res.data;
};

export const getRisk = async (id: number) => {
  const res = await api.get(`/risks/${id}`);
  return res.data;
};

export const getIncidents = async (params = {}) => {
  const res = await api.get('/incidents', { params });
  return res.data;
};

export const getActions = async (params = {}) => {
  const res = await api.get('/action_items', { params });
  return res.data;
};

export const getAIInsights = async (params = {}) => {
  const res = await api.get('/insights', { params });
  return res.data;
};

export default api; 