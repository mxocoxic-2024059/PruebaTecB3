import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearStoredSession,
  persistSession,
  readStoredSession,
  SESSION_EXPIRED_MESSAGE,
} from '../utils/session';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession);
  const [sessionNotice, setSessionNotice] = useState('');
  const { token, user } = session;

  const clearSession = useCallback((notice = '') => {
    clearStoredSession();
    setSession({ token: null, user: null });
    setSessionNotice(notice);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession(SESSION_EXPIRED_MESSAGE);
    };
    window.addEventListener('taskflow:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized);
  }, [clearSession]);

  const startSession = useCallback((response) => {
    setSession(persistSession(response));
    setSessionNotice('');
  }, []);

  const consumeSessionNotice = useCallback(() => {
    setSessionNotice('');
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated: Boolean(token && user),
    startSession,
    logout: clearSession,
    sessionNotice,
    consumeSessionNotice,
  }), [token, user, startSession, clearSession, sessionNotice, consumeSessionNotice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
