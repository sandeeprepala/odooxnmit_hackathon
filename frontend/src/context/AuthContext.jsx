import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true); // Start with loading true
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    async function initializeAuth() {
      const storedToken = localStorage.getItem('token');
      
      if (storedToken) {
        try {
          setToken(storedToken);
          const response = await authService.getProfile(storedToken);
          setUser(response.user);
        } catch (error) {
          console.error('Failed to restore auth state:', error);
          // Only logout if it's an authentication error (401, 403)
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout();
          }
        }
      }
      
      setLoading(false);
      setInitialized(true);
    }

    initializeAuth();
  }, []);

  function login(email, password, role) {
    setLoading(true);
    return authService.login(email, password, role)
      .then((res) => {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('token', res.token);
        return res;
      })
      .finally(() => setLoading(false));
  }

  function register(payload) {
    setLoading(true);
    return authService.register(payload)
      .then((res) => {
        setUser(res.user);
        setToken(res.token);
        localStorage.setItem('token', res.token);
        return res;
      })
      .finally(() => setLoading(false));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  }

  const value = useMemo(() => ({ 
    user, 
    token, 
    loading, 
    initialized,
    login, 
    logout, 
    register, 
    setUser 
  }), [user, token, loading, initialized]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


