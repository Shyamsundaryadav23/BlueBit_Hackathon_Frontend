import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { hash, state: locationState } = useLocation();
  const { setToken, loadUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        if (!hash && !locationState?.token) {
          throw new Error('Missing authentication parameters');
        }

        let token: string | null = null;
        
        if (hash) {
          const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
          token = params.get('token');
          const error = params.get('error');
          
          if (error) {
            throw new Error(error);
          }
        }
        
        if (!token && locationState?.token) {
          token = locationState.token;
        }

        if (!token) {
          throw new Error('Authentication token missing');
        }

        setToken(token);
        const userLoaded = await loadUser();
        
        if (!userLoaded) {
          throw new Error('Failed to load user data');
        }

        navigate(locationState?.from?.pathname || '/dashboard', { replace: true });
        
      } catch (err) {
        console.error("AuthCallback error:", err);
        navigate('/signin', {
          replace: true,
          state: {
            error: err instanceof Error ? err.message : 'Authentication failed',
            from: locationState?.from || null
          },
        });
      }
    };

    handleAuthCallback();
  }, [hash, navigate, setToken, loadUser, locationState]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;