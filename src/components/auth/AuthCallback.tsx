// src/components/auth/AuthCallback.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // Use a ref to ensure we process the callback only once.
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        console.log('Received code:', code);
        if (!code) {
          setError('Authorization code not found');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Call the API with the authorization code
        const response = await api.get(`/api/callback?code=${encodeURIComponent(code)}`);
        console.log('Callback response:', response.data);

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          // Explicitly set the token on the axios instance so it sends the header
          api.setAuthToken(response.data.token);
          await loadUser();
          navigate('/dashboard');
        } else {
          setError('Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err: any) {
        console.error('AuthCallback error:', err);
        setError(err.response?.data?.error || 'Authentication process failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [location, navigate, loadUser]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white rounded shadow-md">
          <h2 className="mb-4 text-xl font-bold text-red-600">Authentication Error</h2>
          <p className="mb-4">{error}</p>
          <p>Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded shadow-md">
        <h2 className="mb-4 text-xl font-bold">Authentication in progress...</h2>
        <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default AuthCallback;
