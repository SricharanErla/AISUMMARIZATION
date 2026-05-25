import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { authService, type UserPayload } from '../services/authService';

interface AuthContextValue {
  user: UserPayload | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserPayload | null>({ id: 'local', name: 'Explorer', email: 'local@runtime.app', avatar: '' });
  const [token] = useState<string>('runtime-token');
  const [loading] = useState(false);

  useEffect(() => {
    void token;
  }, [token]);

  const persist = (authToken: string, nextUser: UserPayload) => {
    setUser(nextUser);
    void authToken;
  };

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    persist(response.token, response.user);
    toast.success('Welcome back');
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await authService.register({ name, email, password });
    persist(response.token, response.user);
    toast.success('Account created');
  };

  const logout = () => {
    setUser({ id: 'local', name: 'Explorer', email: 'local@runtime.app', avatar: '' });
    toast.success('Logged out');
  };

  const refreshUser = async () => {
    setUser((current) => current ?? { id: 'local', name: 'Explorer', email: 'local@runtime.app', avatar: '' });
  };

  const value = useMemo(() => ({ user, token, loading, login, register, logout, refreshUser }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
