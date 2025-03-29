import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const Signup: React.FC = () => {
  const { state, login } = useAuth();
  const { isAuthenticated, error } = state;
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      console.log("Signing up:", { name, email, password });
      navigate("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      setLocalError("Signup failed. Please try again.");
    }
  };

  const handleGoogleSignUp = () => {
    console.log("Google sign-up button clicked");
    login();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.2) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            ></div>
          </div>

          {/* Content */}
          <div className="relative">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg transform transition-all duration-300 hover:scale-105">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Create Your Account
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Join thousands of users managing their expenses
            </p>

            {(error || localError) && (
              <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center">
                <span className="text-sm font-medium">
                  {error || localError}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Email"
                id="email"
                type="email"
                value={email}
                onChange={setEmail}
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                required
              />

              <InputField
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={setPassword}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                required
              />

              <InputField
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                required
              />

              <button
                type="submit"
                className="w-full py-3 px-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Account
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignUp}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-md transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:bg-gray-50 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="h-5 w-5 mr-3"
                />
                <span className="text-base font-medium">
                  Sign up with Google
                </span>
              </button>
            </div>

            <p className="mt-8 text-center text-base text-gray-600">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  id,
  type,
  value,
  onChange,
  icon,
  required,
}: {
  label: string;
  id: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  required: boolean;
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative rounded-lg">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="block w-full pl-10 pr-3 py-2.5 text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  </div>
);

export default Signup;
