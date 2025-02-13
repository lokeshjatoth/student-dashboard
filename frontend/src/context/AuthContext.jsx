import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Determine backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/auth/verify`, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setIsAuthenticated(true);
      setUser(response.data.user);
      setLoading(false);
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    verifyToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  // Method to check authentication status
  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: checkAuthentication, 
      user, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
