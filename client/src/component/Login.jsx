import React, { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { googleAuth, login } from '../controller/AuthenticationController';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useLoading } from '../contextApi/Load';
import { useAlert } from '../contextApi/Alert';
import { GoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const { host, apiKey } = useContext(EnvVariableContext);
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { PopAlert, closeAlert } = useAlert();
  

  const handleGoogleSuccess= async(credentialResponse)=>{
    await googleAuth(credentialResponse.credential,host,apiKey);
    closeAlert();
    PopAlert('success', 'Sign In successfully', () => {navigate('/home')});
  }

  const handleGoogleError=()=>{
    closeAlert();
    PopAlert('error', 'Google Sign-In is not available. Please try again later.', () => {});
  }


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
          {/* Google Sign-in Button - Moved to top for better UX */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin  onSuccess={handleGoogleSuccess} onError={handleGoogleError} className={`w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}></GoogleLogin>

          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

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
            <a href="/forgotpassword" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-300">
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