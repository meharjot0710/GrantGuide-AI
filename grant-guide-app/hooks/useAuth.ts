import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useAuth() {
  const router = useRouter();

  const getToken = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  useEffect(() => {
    const checkToken = () => setIsAuthenticated(!!getToken());
    window.addEventListener('storage', checkToken);
    // Also check on mount
    checkToken();
    return () => window.removeEventListener('storage', checkToken);
  }, [getToken]);

  const login = async (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      const user = await getUserInfo();
      if (user && !user.profileCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    }
    router.push('/login');
  };

  const getUserInfo = useCallback(async () => {
    const token = getToken();
    if (!token) return null;
    try {
      const apiUrl = 'https://grantguide-ai.onrender.com';
      const res = await axios.get(`${apiUrl}/api/user/get-info`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.user;
    } catch (err) {
      return null;
    }
  }, [getToken]);

  return { isAuthenticated, login, logout, getToken, getUserInfo };
} 