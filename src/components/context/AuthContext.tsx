import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { authReducer } from './authReducer';
import api from '@/services/api';
import { AuthState, User } from '@/types/auth.types';

interface AuthContextProps {
  state: AuthState;
  login: () => void;
  logout: () => void;
  loadUser: () => Promise<void>;
  setToken: (token: string) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('token'),
    loading: true,
    error: null,
  });

  // Memoized loadUser function
  const loadUser = useCallback(async () => {
    try {
      const res = await api.get<User>('/api/user');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      logout();
      throw err;
    }
  }, []); // No dependencies, assuming api and dispatch are stable

  // Memoize logout as well
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
    api.removeAuthToken();
  }, []);

  // Memoize setToken
  const setToken = useCallback((token: string) => {
    localStorage.setItem('token', token);
    dispatch({ type: 'SET_TOKEN', payload: token });
  }, []);

  // Memoize login
  const login = useCallback(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Redirect to backend login endpoint.
    window.location.href = `${import.meta.env.VITE_APP_API_URL}/api/login`;
  }, []);

  // Memoize clearError
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);

  // Run initializeAuth only when token changes and user is not loaded yet
  useEffect(() => {
    const initializeAuth = async () => {
      if (state.token && !state.user) {
        try {
          await loadUser();
        } catch (err) {
          // error already handled in loadUser
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    initializeAuth();
  }, [state.token, state.user, loadUser]);

  // Memoize the value provided by the context
  const value = useMemo(
    () => ({
      state,
      login,
      logout,
      loadUser,
      setToken,
      clearError,
    }),
    [state, login, logout, loadUser, setToken, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
