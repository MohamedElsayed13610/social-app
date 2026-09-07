import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN_KEY } from '../api/client';
import { getProfile } from '../services/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  const saveSession = (session) => {
    const nextToken = session?.token || session?.accessToken || session?.access_token;
    const nextUser = session?.user || session?.profile || null;
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
      setToken(nextToken);
    }
    if (nextUser) setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return null;
    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch (error) {
      if (error.response?.status === 401) logout();
      throw error;
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    refreshProfile().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const value = useMemo(() => ({ token, user, loading, saveSession, logout, refreshProfile }), [token, user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
