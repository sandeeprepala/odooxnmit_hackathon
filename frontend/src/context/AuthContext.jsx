import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authService } from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token && !user) {
      authService.getProfile(token).then((res) => setUser(res.user)).catch(() => logout());
    }
  }, [token]);

  function login(email, password) {
    setLoading(true);
    return authService.login(email, password)
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

  const value = useMemo(() => ({ user, token, loading, login, logout, register, setUser }), [user, token, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}


