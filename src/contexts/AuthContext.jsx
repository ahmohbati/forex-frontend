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
    if (rawToken && storedUser) {
      setUser(storedUser);
    } else if (rawToken && !storedUser) {
      // If there is a token but no stored user, it's likely a stale/incomplete state.
      // Remove token to avoid inconsistent auth state and force a fresh login.
      console.warn('AuthProvider:init found token but no stored user — clearing token to avoid stale auth');
      try { localStorage.removeItem('token'); } catch (_) {}
    }

    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      // auth response handled below
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

      // stored login info

      return { success: true, user };
    } catch (error) {
      console.error('auth.login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message || 'Login failed' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      // auth.register response handled below
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

      // stored register info

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
    // logout clearing stored auth
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