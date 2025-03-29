// import React, { useState } from 'react';
// import { Navigate, Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, User as UserIcon } from 'lucide-react';
// import { useAuth } from '@/components/context/AuthContext';

// const Signup: React.FC = () => {
//   const { state, login } = useAuth();
//   const { isAuthenticated, error } = state;
//   const navigate = useNavigate();

//   const [name, setName] = useState('');
//   const [gender, setGender] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [localError, setLocalError] = useState<string | null>(null);

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLocalError(null);

//     if (password !== confirmPassword) {
//       setLocalError('Passwords do not match');
//       return;
//     }

//     try {
//       // Your custom signup logic here.
//       console.log('Signing up:', { name, gender, email, password });
//       navigate('/signin');
//     } catch (err) {
//       console.error('Signup error:', err);
//       setLocalError('Signup failed. Please try again.');
//     }
//   };

//   const handleGoogleSignUp = () => {
//     console.log("Google sign-up button clicked");
//     login();
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
//         <h1 className="mb-6 text-2xl font-bold text-center text-blue-600">Sign Up</h1>

//         {(error || localError) && (
//           <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded">
//             {error || localError}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <InputField label="Full Name" id="name" type="text" value={name} onChange={setName} icon={<UserIcon />} required />
//           <SelectField label="Gender" id="gender" value={gender} onChange={setGender} required options={['Male', 'Female', 'Other']} />
//           <InputField label="Email" id="email" type="email" value={email} onChange={setEmail} icon={<Mail />} required />
//           <InputField label="Password" id="password" type="password" value={password} onChange={setPassword} icon={<Lock />} required />
//           <InputField label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={<Lock />} required />

//           <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500">
//             Sign Up
//           </button>
//         </form>

//         <div className="mt-6">
//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300" />
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-2 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>
//           <button
//             onClick={handleGoogleSignUp}
//             className="mt-6 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <img 
//               src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
//               alt="Google logo" 
//               className="h-5 w-5 mr-2" 
//             />
//             Google
//           </button>
//         </div>

//         <p className="mt-6 text-center text-sm text-gray-600">
//           Already have an account?{' '}
//           <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500">
//             Sign In
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// const InputField = ({ label, id, type, value, onChange, icon, required }: any) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
//     <div className="relative mt-1 rounded-md shadow-sm">
//       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>
//       <input 
//         type={type} 
//         id={id} 
//         value={value} 
//         onChange={(e) => onChange(e.target.value)} 
//         required={required} 
//         className="block w-full pl-10 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" 
//       />
//     </div>
//   </div>
// );

// const SelectField = ({ label, id, value, onChange, required, options }: any) => (
//   <div>
//     <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
//     <select 
//       id={id} 
//       value={value} 
//       onChange={(e) => onChange(e.target.value)} 
//       required={required} 
//       className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
//     >
//       <option value="">{`Select ${label}`}</option>
//       {options.map((opt: string) => (
//         <option key={opt} value={opt.toLowerCase()}>{opt}</option>
//       ))}
//     </select>
//   </div>
// );

// export default Signup;

import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/components/context/AuthContext';

const Signup: React.FC = () => {
  const { state, login } = useAuth();
  const { isAuthenticated, error } = state;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    try {
      console.log('Signing up:', { name, gender, email, password });
      navigate('/signin');
    } catch (err) {
      console.error('Signup error:', err);
      setLocalError('Signup failed. Please try again.');
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign-up button clicked");
    login();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="w-full h-240 max-w-lg p-10 bg-white rounded-lg shadow-2xl transform transition duration-500 ">
        
        {/* Logo at the top */}
        <div className="flex justify-center mb-4">
          <img 
            src="public\logo_bluebit.png" 
            alt="Logo" 
            className="w-20 h-20 rounded-full shadow-md"
          />
        </div>

        <h1 className="mb-6 text-3xl font-extrabold text-center text-blue-700">Create Your Account</h1>

        {(error || localError) && (
          <div className="p-4 mb-6 text-lg text-red-700 bg-red-100 rounded-lg">
            {error || localError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-1">
          <InputField label="Full Name" id="name" type="text" value={name} onChange={setName} icon={<UserIcon />} required />
          <SelectField label="Gender" id="gender" value={gender} onChange={setGender} required options={['Male', 'Female', 'Other']} />
          <InputField label="Email" id="email" type="email" value={email} onChange={setEmail} icon={<Mail />} required />
          <InputField label="Password" id="password" type="password" value={password} onChange={setPassword} icon={<Lock />} required />
          <InputField label="Confirm Password" id="confirmPassword" type="password" value={confirmPassword} onChange={setConfirmPassword} icon={<Lock />} required />

          <button type="submit" className="w-full py-3 px-5 text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-md shadow-lg hover:opacity-90 transition duration-300">
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-lg font-medium">
              <span className="px-3 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <button
            onClick={handleGoogleSignUp}
            className="mt-6 w-full flex justify-center py-3 px-5 border border-gray-300 rounded-lg shadow-lg text-lg font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-300"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="h-6 w-6 mr-3" />
            Sign Up with Google
          </button>
        </div>

        <p className="mt-6 text-center text-lg text-gray-700">
          Already have an account?{' '}
          <Link to="/signin" className="font-bold text-blue-700 hover:text-blue-500 transition duration-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

const InputField = ({ label, id, type, value, onChange, icon, required }: any) => (
  <div>
    <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
    <div className="relative mt-2 rounded-lg shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">{icon}</div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="block w-full py-3 pl-12 text-lg border border-gray-300 rounded-lg bg-gray-100 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
      />
    </div>
  </div>
);

const SelectField = ({ label, id, value, onChange, required, options }: any) => (
  <div>
    <label htmlFor={id} className="block text-lg font-semibold text-gray-700">{label}</label>
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="mt-2 block w-full text-lg border border-gray-300 rounded-lg shadow-sm py-3 px-4 bg-gray-100 focus:ring-blue-500 focus:border-blue-500 transition duration-300"
    >
      <option value="">{`Select ${label}`}</option>
      {options.map((opt: string) => (
        <option key={opt} value={opt.toLowerCase()}>{opt}</option>
      ))}
    </select>
  </div>
);

export default Signup;