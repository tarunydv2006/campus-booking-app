import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

const authEndpoints = {
  me: 'auth/me',
  login: 'auth/login',
  signup: 'auth/signup',
  verifyOtp: 'auth/verify-otp',
  resendOtp: 'auth/resend-otp'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    api.get(authEndpoints.me)
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      })
      .catch(() => logout());
  }, []);

  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(authEndpoints.login, payload);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post(authEndpoints.signup, payload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (payload) => {
    const { data } = await api.post(authEndpoints.verifyOtp, payload);
    return data;
  };

  const resendOtp = async (email) => {
    const { data } = await api.post(authEndpoints.resendOtp, { email });
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, loading, login, signup, verifyOtp, resendOtp, logout }),
    [user, loading]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
