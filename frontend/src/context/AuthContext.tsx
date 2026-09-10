import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('donationapp_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('donationapp_user', JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem('donationapp_token', userData.token);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('donationapp_user');
    localStorage.removeItem('donationapp_token');
  };

  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      localStorage.removeItem('donationapp_user');
      localStorage.removeItem('donationapp_token');
    };

    window.addEventListener('auth-session-expired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth-session-expired', handleSessionExpired);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user && !!localStorage.getItem('donationapp_token') }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
