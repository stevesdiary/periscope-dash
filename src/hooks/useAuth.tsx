import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthCtx {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (p: string) => boolean;
}

const Ctx = createContext<AuthCtx>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('periscope_token'));
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('periscope_user');
    return u ? JSON.parse(u) : null;
  });

  const login = (t: string, u: User) => {
    localStorage.setItem('periscope_token', t);
    localStorage.setItem('periscope_user', JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem('periscope_token');
    localStorage.removeItem('periscope_user');
    setToken(null);
    setUser(null);
  };

  const hasPermission = (p: string) => user?.permissions?.includes(p) ?? false;

  return <Ctx.Provider value={{ user, token, login, logout, hasPermission }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
