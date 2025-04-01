import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { setToken, loadUser } = useAuth();

  useEffect(() => {
    // Check if there is a hash in the URL; if not, redirect with an error.
    if (!hash) {
      navigate('/login', { state: { error: "Missing authentication parameters." } });
      return;
    }

    const handleAuthCallback = async () => {
      try {
        // Remove the '#' if present and then parse the URL parameters
        const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
        const token = params.get('token');
        const error = params.get('error');

        if (error) {
          throw new Error(error);
        }

        if (!token) {
          throw new Error('Authentication token missing');
        }

        // Set the token in context and load user details
        setToken(token);
        await loadUser();

        // Redirect the user to the dashboard once authenticated
        navigate('/dashboard');
      } catch (err) {
        console.error("AuthCallback error:", err);
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
