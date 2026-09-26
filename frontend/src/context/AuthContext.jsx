import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('scholarnest_token') || null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const fetchCurrentUser = async () => {
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    try {
      const res = await API.get('/auth/me');
      setUser(res.data.user);
      setProfile(res.data.profile);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    localStorage.setItem('scholarnest_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setAuthModalOpen(false);
    return res.data;
  };

  const register = async (name, email, password, role = 'student') => {
    const res = await API.post('/auth/register', { name, email, password, role });
    localStorage.setItem('scholarnest_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    setAuthModalOpen(false);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('scholarnest_token');
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  const updateProfileState = (newProfile) => {
    setProfile(newProfile);
  };

  const openLoginModal = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegisterModal = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        authModalOpen,
        authMode,
        setAuthModalOpen,
        setAuthMode,
        openLoginModal,
        openRegisterModal,
        login,
        register,
        logout,
        fetchCurrentUser,
        updateProfileState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
