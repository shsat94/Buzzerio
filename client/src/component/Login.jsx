import React, { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../controller/AuthenticationController';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useLoading } from '../contextApi/Load';
import { useAlert } from '../contextApi/Alert';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const { host, apiKey } = useContext(EnvVariableContext);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { PopAlert, closeAlert } = useAlert();

  // Email validation function
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation function
  const validatePassword = (password) => {
    return password.length >= 6;
  };

  // Handle email change
  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (value === '') {
      setEmailValid(null);
    } else {
      setEmailValid(validateEmail(value));
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value === '') {
      setPasswordValid(null);
    } else {
      setPasswordValid(validatePassword(value));
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle Google sign in
  const handleGoogleSignIn = () => {
    console.log('Google sign-in initiated');
    // Placeholder for Google authentication logic
  };

  // Check if form is valid
  useEffect(() => {
    setFormValid(emailValid && passwordValid);
  }, [emailValid, passwordValid]);

  // Handle form submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!formValid) return;
    
    try {
      setIsLoading(true);      
      const loginSuccess = await login(email, password, host, apiKey);
      
      if (loginSuccess) {
        setIsLoading(false);
        PopAlert('success', "Logged in successfully!", () => {
          navigate('/home');
        });
        
      } else{
        setIsLoading(false);
        PopAlert('error', "Invalid credentials. Please try again.", () => {navigate('/login');});
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      closeAlert();
      PopAlert('error', error.message || "Login failed. Please try again.", () => {});
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-2xl transform transition-all duration-500 hover:shadow-2xl relative overflow-hidden">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome Back</h1>
          <p className="mt-2 text-gray-600">Enter your credentials to access your account</p>
        </div>

        <div className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Mail size={20} />
              </span>
              <input
                id="email"
                name="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                className={`pl-10 w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  emailValid === null
                    ? 'border-gray-300 focus:ring-blue-300'
                    : emailValid
                    ? 'border-green-500 focus:ring-green-200'
                    : 'border-red-500 focus:ring-red-200'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {emailValid === false && (
              <p className="mt-1 text-sm text-red-500 transition-opacity duration-300">
                Invalid email format
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <Lock size={20} />
              </span>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                className={`pl-10 w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${
                  passwordValid === null
                    ? 'border-gray-300 focus:ring-blue-300'
                    : passwordValid
                    ? 'border-green-500 focus:ring-green-200'
                    : 'border-red-500 focus:ring-red-200'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordValid === false && (
              <p className="mt-1 text-sm text-red-500 transition-opacity duration-300">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300">
              Forgot password?
            </a>
          </div>

          {/* Login Button */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={!formValid}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-300 ${
                formValid
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 cursor-not-allowed opacity-60'
              }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <LogIn size={20} className={formValid ? 'text-blue-200' : 'text-gray-400'} />
              </span>
              Login
            </button>
          </div>

          {/* Google Sign-in Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>

        {/* Sign up Link */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to='/signup' className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-xl"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 blur-xl"></div>
      </div>
    </div>
  );
};

export default LoginPage;