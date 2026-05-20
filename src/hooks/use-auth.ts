import { useCallback, useEffect, useState } from 'react';
import { AuthUser } from '@/types/auth';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<Tokens | null>(null);
  const isLoading = false;
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load auth data from localStorage on mount (client-side only)
  useEffect(() => {
    // Mark as hydrated to prevent hydration mismatches
    setIsHydrated(true);
    
    const storedTokens = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (storedTokens) {
      setTokens({
        accessToken: storedTokens,
        refreshToken: localStorage.getItem('refreshToken') || '',
      });
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const setAuthData = useCallback((user: AuthUser, tokens: Tokens) => {
    setUser(user);
    setTokens(tokens);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    setError(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTokens(null);
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  const isAuthenticated = !!tokens?.accessToken && !!user;

  return {
    user,
    tokens,
    isLoading,
    error,
    isAuthenticated,
    isHydrated,
    setAuthData,
    logout,
  };
};
