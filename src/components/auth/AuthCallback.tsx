import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { setToken, loadUser } = useAuth();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error('Authentication token missing');
        }

        setToken(token);
        await loadUser();
        navigate('/dashboard');
      } catch (err) {
        navigate('/login', {
          state: {
            error: err instanceof Error ? err.message : 'Authentication failed',
          },
        });
      }
    };

    handleAuthCallback();
  }, [hash, navigate, setToken, loadUser]);

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
