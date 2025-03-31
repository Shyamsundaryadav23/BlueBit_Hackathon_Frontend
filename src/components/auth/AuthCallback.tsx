import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../context/AuthContext';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          throw new Error('Authorization code not found');
        }

        // Use POST instead of GET with code in request body
        const response = await api.post('/api/callback', { code });

        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          api.setAuthToken(response.data.token);
          await loadUser();
          navigate('/dashboard');
        } else {
          throw new Error('Authentication failed - no token received');
        }
      } catch (err: any) {
        console.error('AuthCallback error:', err);
        setError(err.response?.data?.error || err.message || 'Authentication failed');
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