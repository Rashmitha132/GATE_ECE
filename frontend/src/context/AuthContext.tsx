import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { rotateQuoteSeed } from '../utils/quotes';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'student' | 'faculty' | 'admin';
  status: string;
  department: string;
  usn?: string;
  avatar_url?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, fullName?: string, extra?: { usn?: string; phone_number?: string; role?: string }) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gate_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('gate_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('gate_auth_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
          localStorage.setItem('gate_user', JSON.stringify(res.data));
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (
    email: string, 
    password: string, 
    fullName?: string, 
    extra?: { usn?: string; phone_number?: string; role?: string }
  ): Promise<User> => {
    const res = await api.post('/auth/login', { 
      email, 
      password,
      full_name: fullName?.trim() || undefined,
      usn: extra?.usn?.trim() || undefined,
      phone_number: extra?.phone_number?.trim() || undefined,
      role: extra?.role || undefined
    });
    const { access_token, user: loggedUser } = res.data;
    localStorage.setItem('gate_auth_token', access_token);
    localStorage.setItem('gate_user', JSON.stringify(loggedUser));
    rotateQuoteSeed();
    setToken(access_token);
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data: any) => {
    await api.post('/auth/register', data);
  };

  const logout = () => {
    localStorage.removeItem('gate_auth_token');
    localStorage.removeItem('gate_user');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
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
