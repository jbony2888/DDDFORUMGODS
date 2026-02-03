import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { UserDTO } from '../api';

interface AuthContextValue {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  logout: () => void;
}

const AUTH_STORAGE_KEY = 'dddforumgods-user';

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserDTO | null>(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as UserDTO) : null;
    } catch {
      return null;
    }
  });

  const setUser = useCallback((next: UserDTO | null) => {
    setUserState(next);
  }, []);

  useEffect(() => {
    if (user) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const logout = useCallback(() => {
    setUserState(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, logout }), [user, setUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
