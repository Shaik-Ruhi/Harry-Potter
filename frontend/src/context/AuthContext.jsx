import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hp_token') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('hp_user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const saveAuth = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);
    localStorage.setItem('hp_token', tokenValue);
    localStorage.setItem('hp_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('hp_token');
    localStorage.removeItem('hp_user');
  };

  const authAxios = axios.create({
    baseURL: '/api',
  });

  authAxios.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return (
    <AuthContext.Provider value={{ user, loading, error, saveAuth, logout, authAxios, setLoading, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
