// src/components/pages/Signin.tsx
import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';

const Signin: React.FC = () => {
  const { state, login } = useAuth();
  const { isAuthenticated, loading, error } = state;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // While auth state is loading, you might return a loader or nothing.
  if (loading) {
    return <Loader />;
  }

  // Only redirect if loading is complete and user is authenticated.
  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Your email/password sign-in logic here.
      console.log('Signing in with:', { email, password });
      navigate('/dashboard');
    } catch (err) {
      console.error('Sign in error:', err);
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in button clicked');
    login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-blue-600">Sign In</h1>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={setEmail}
            icon={<Mail />}
            required
          />
          <InputField
            label="Password"
            id="password"
            type="password"
            value={password}
            onChange={setPassword}
            icon={<Lock />}
            required
          />
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignIn}
            className="mt-6 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="h-5 w-5 mr-2"
            />
            Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, value, onChange, icon, required }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative mt-1 rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

export default Signin;
