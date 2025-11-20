import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../lib/api';
import { safeGetJSON, safeSetJSON, safeRemove, safeGetString } from '../lib/storage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = safeGetJSON('user');
    const rawToken = safeGetString('token');
    console.debug('AuthProvider:init', { storedUser, rawTokenPreview: rawToken ? `${String(rawToken).slice(0,8)}...` : null });

    if (rawToken && storedUser) {
      setUser(storedUser);
    } else if (rawToken && !storedUser) {
      console.warn('AuthProvider:init found token but no stored user');
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      console.debug('auth.login response:', response?.data);
      const { token, user } = response.data || {};
      if (user) {
        safeSetJSON('user', user);
      }

      if (token) {
        try {
          localStorage.setItem('token', token);
        } catch (_) {}
      }

      setUser(user || null);

      console.debug('AuthProvider:login stored', {
        hasToken: !!token,
        hasUser: !!user,
        tokenPreview: token ? `${String(token).slice(0,8)}...` : null
      });

      return { success: true, user };
    } catch (error) {
      console.error('auth.login error:', error?.response?.data || error.message || error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      console.debug('auth.register response:', response?.data);
      const { token, user } = response.data || {};

      if (user) {
        safeSetJSON('user', user);
      }

      if (token) {
        try {
          localStorage.setItem('token', token);
        } catch (_) {}
      }

      setUser(user || null);

      console.debug('AuthProvider:register stored', {
        hasToken: !!token,
        hasUser: !!user,
        tokenPreview: token ? `${String(token).slice(0,8)}...` : null
      });

      return { success: true, user };
    } catch (error) {
      console.error('auth.register error:', error?.response?.data || error.message || error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.debug('AuthProvider:logout clearing stored auth');
    try { localStorage.removeItem('token'); } catch (_) {}
    safeRemove('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};