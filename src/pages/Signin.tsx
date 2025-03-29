import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader, User as UserIcon } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const Signin: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log("Signing in with:", { email, password });
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    try {
      console.log("Google sign-in button clicked");
      login();
    } catch {
      setError("Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center py-3 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 space-y-8 relative overflow-hidden">
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

          <div className="relative">
            <div className="flex justify-center mb-8">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg transform transition-all duration-300 hover:scale-105">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Sign in to continue your financial journey
            </p>

            {error && (
              <div className="p-4 mb-6 text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center animate-shake">
                <span className="text-sm font-medium">{error}</span>
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Remember me
                  </label>
                </div>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 transition-colors duration-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign In
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
                onClick={handleGoogleSignIn}
                className="mt-4 w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-md transform transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] hover:bg-gray-50 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                  className="h-5 w-5 mr-3"
                />
                <span className="text-base font-medium">
                  Sign in with Google
                </span>
              </button>
            </div>

            <p className="mt-8 text-center text-base text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-blue-600 transition-colors duration-300 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign Up
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

export default Signin;
