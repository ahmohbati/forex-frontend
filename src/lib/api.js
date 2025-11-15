import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
  getTransactions: () => api.get('/transactions'),
  createTransaction: (data) => api.post('/transactions', data),
};

export default api;