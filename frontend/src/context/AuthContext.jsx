import axios from 'axios';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token and user exist in localStorage/sessionStorage
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && (parsedUser.name === 'Sarah Connor' || parsedUser.name === 'Gajanan Bidwai')) {
          parsedUser.name = 'Gajanan Bidwai';
          parsedUser.avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120';
          if (localStorage.getItem('user')) {
            localStorage.setItem('user', JSON.stringify(parsedUser));
          }
          if (sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(parsedUser));
          }
        }
        setToken(storedToken);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password, rememberMe = false) => {
  setLoading(true);

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/token/`,
      {
        username,
        password,
      }
    );

    const accessToken = response.data.access;

    const userData = {
      name: "Gajanan Bidwai",
      email: username,
      role: "Chief HR Officer",
    };

    setToken(accessToken);
    setUser(userData);

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem("token", accessToken);
    storage.setItem("user", JSON.stringify(userData));

    setLoading(false);

    return {
      success: true,
    };
  } catch (err) {
    setLoading(false);

    return {
      success: false,
      message: "Invalid username or password",
    };
  }
};

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
