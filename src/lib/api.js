import axios from 'axios';
import { safeGetString, safeRemove } from './storage';

const API_BASE_URL = (typeof globalThis !== 'undefined' && globalThis.__VITE_API_URL__)
  || (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = safeGetString('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      try { localStorage.removeItem('token'); } catch (_) {}
      safeRemove('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const currencyAPI = {
  getCurrencies: () => api.get('/currencies'),
  getExchangeRates: (baseCurrency = 'ETB') => 
    api.get(`/currencies/rates?base=${baseCurrency}`),
  getPopularRates: () => api.get('/currencies/popular-rates'),
  convertCurrency: (amount, fromCurrency = 'ETB', toCurrency) =>
    api.post('/currencies/convert', { amount, fromCurrency, toCurrency }),
};

export const transactionAPI = {
  
  getTransactions: (params = {}) => {
    if (!params || Object.keys(params).length === 0) {
      return api.get('/transactions')
    }
    const mapped = {}
    // page aliases
    if (params.page != null) mapped.page = params.page
    if (params.pageNumber != null) mapped.page = params.pageNumber
    if (params.pageIndex != null) mapped.page = params.pageIndex
    // limit / per-page aliases
    if (params.limit != null) mapped.limit = params.limit
    if (params.perPage != null) mapped.limit = params.perPage
    if (params.pageSize != null) mapped.limit = params.pageSize
    if (params.page_size != null) mapped.limit = params.page_size
    // forward any other params untouched
    Object.keys(params).forEach((k) => {
      if (!['page', 'pageNumber', 'pageIndex', 'limit', 'perPage', 'pageSize', 'page_size'].includes(k)) {
        mapped[k] = params[k]
      }
    })
    return api.get('/transactions', { params: mapped })
  },
  createTransaction: (data) => api.post('/transactions', data),
};

export default api;