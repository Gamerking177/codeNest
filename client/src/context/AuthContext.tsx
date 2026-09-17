import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import {
  apiClient,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  clearTokens,
} from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, college?: string) => Promise<void>;
  logout: () => Promise<void>;
  demoLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Restore user session on mount
  useEffect(() => {
    async function checkAuth() {
      const token = getAccessToken();
      const refToken = getRefreshToken();

      // If no tokens exist, there is no active session
      if (!token && !refToken) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get('/auth/me');
        if (response.data?.success && response.data?.data?.user) {
          setUser(response.data.data.user);
        }
      } catch {
        // If /auth/me and its automated refresh interceptor failed, clear session
        clearTokens();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user: loggedInUser } = response.data.data;
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      setUser(loggedInUser);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, college?: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', { name, email, password, college });
      const { accessToken, refreshToken, user: newUser } = response.data.data;
      setAccessToken(accessToken);
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }
      setUser(newUser);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const refToken = getRefreshToken();
      await apiClient.post('/auth/logout', { refreshToken: refToken || undefined });
    } catch {
      // Ignore network errors on logout
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const demoLogin = async () => {
    return login('alex@codenest.dev', 'codenest123');
  };

  const isAdmin = Boolean(
    user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        isAdmin,
        login,
        register,
        logout,
        demoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
