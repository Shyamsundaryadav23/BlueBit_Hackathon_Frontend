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

  if (loading) {
    return <Loader className="animate-spin mx-auto mt-20" size={32} />;
  }

  if (!loading && isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Signing in with:', { email, password });
    navigate('/dashboard');
  };

  const handleGoogleSignIn = () => {
    console.log('Google sign-in button clicked');
    login();
  };

  return (
    <div className=" text-xl flex min-h-screen w-full bg-gray-200 items-center">
      {/* Left side with full video */}
      <div className="w-2/3 h-screen relative flex items-center justify-center p-4">
      <div className="w-full h-full overflow-hidden rounded-lg shadow-2xl">
      <video className="w-full h-full object-fit" style={{ objectFit: 'contain' }} autoPlay loop muted>
            <source src="public\Splitbro_video - Made with Clipchamp.mp4" type="video/mp4" />
          </video>
        </div>
      </div>

      {/* Right side with sign-in form, same height as video */}
      <div className="w-1/3 h-screen flex items-center justify-center p-12 bg-white shadow-xl rounded-lg border border-gray-200 ml-6 ">
        <div className="w-full max-w-md p-6 bg-gray-200 rounded-lg shadow-xl transform transition duration-500 hover:scale-105">
          <img src="public\logo_bluebit.png" alt="Logo" className="mx-auto mb-6 w-30 rounded-full shadow-2xl" />
          <h1 className="mb-6 text-4xl font-extrabold text-center text-blue-700">Sign In</h1>

          {error && <div className="p-4 mb-4 text-lg text-red-700 bg-red-100 rounded shadow-md">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <InputField label="Email" id="email" type="email" value={email} onChange={setEmail} icon={<Mail />} required />
            <InputField label="Password" id="password" type="password" value={password} onChange={setPassword} icon={<Lock />} required />
            <button className="w-full py-3 text-2xl text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg shadow-md font-semibold transition-all duration-300">
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-gray-600">Or continue with</div>
          <button
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center py-3 text-lg bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-50 transition-all duration-300"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google logo"
              className="h-6 w-6 mr-2"
            />
            Google
          </button>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, value, onChange, icon, required }: any) => (
  <div>
    <label htmlFor={id} className="block text-lg font-medium text-gray-700">{label}</label>
    <div className="relative mt-2">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">{icon}</div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-md text-lg bg-white"
      />
    </div>
  </div>
);

export default Signin;