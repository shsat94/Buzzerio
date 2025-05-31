import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp, googleAuth } from '../../controller/AuthenticationController';
import { EnvVariableContext } from '../../contextApi/envVariables';
import { useStateVariable } from '../../contextApi/StateVariables';
import { useLoading } from '../../contextApi/Load';
import { useAlert } from '../../contextApi/Alert';
import { useAuthentication } from '../../contextApi/Authentication';
import { GoogleLogin } from '@react-oauth/google';

const EmailValidationForm = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);
  
  const { host, apiKey} = useContext(EnvVariableContext);
  const { setOneTimePassword, isUserPresent, setIsUserPresent, setIsForgotPassword } = useStateVariable();
  const { setIsLoading } = useLoading();
  const { PopAlert ,closeAlert} = useAlert();
  const navigate = useNavigate();
  const { setCpEmail } = useAuthentication();

 const handleGoogleSuccess= async(credentialResponse)=>{
    await googleAuth(credentialResponse.credential,host,apiKey);
    closeAlert();
    PopAlert('success', 'Sign In successfully', () => {navigate('/home')});
  }

  const handleGoogleError=()=>{
    closeAlert();
    PopAlert('error', 'Google Sign-In is not available. Please try again later.', () => {});
  }

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  useEffect(() => {
    setIsValid(validateEmail(email));
  }, [email]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!isDirty) setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isValid && !isSubmitting) {
      setIsSubmitting(true);
      setIsLoading(true);
      setCpEmail(email);
      try {
        await sendOtp(email, host, apiKey, setOneTimePassword, setIsUserPresent);
        
        if (isUserPresent) {
          setIsLoading(false);
          setIsSubmitting(false);
          PopAlert(true, 'warning', "You have to login to proceed", () => {
            navigate('/login');
          }, "Login");
          return;
        }
        
        // Important: DO NOT reset loading state here!
        // We want to keep the loading state active during navigation
        // The OTP component will handle turning it off
        setIsForgotPassword(false);
        setEmail('');
        setIsDirty(false);
        navigate('/verifyotp');
      } catch (error) {
        // In case of error, reset loading state
        setIsLoading(false);
        setIsSubmitting(false);
        PopAlert(true, 'error', "Failed to send OTP. Please try again.", null, "OK");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-blue-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border-t-4 border-purple-500">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-purple-800">Buzzerio</h2>
          <p className="mt-2 text-sm text-indigo-600">Create your account to get started</p>
        </div>

        <div className="mt-6 space-y-6">
          {/* Google Sign-up Button - Moved to top for better UX */}
          <div className="mb-6 flex justify-center">
            <GoogleLogin  onSuccess={handleGoogleSuccess} onError={handleGoogleError} className={`w-full py-3 px-4 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center`}></GoogleLogin>

          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="text"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                className={`block w-full px-3 py-3 border-2 rounded-lg shadow-sm focus:outline-none transition-all duration-300 ${!isDirty
                    ? 'border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
                    : isValid
                      ? 'border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-emerald-50'
                      : 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50'
                  }`}
                placeholder="you@example.com"
              />
              {isValid && isDirty && (
                <span className="absolute right-3 top-3 text-emerald-500">
                  ✓
                </span>
              )}
            </div>
            {isDirty && !isValid && (
              <p className="mt-2 text-sm text-red-600 flex items-center" id="email-error">
                <span className="mr-1">⚠️</span> Invalid email
              </p>
            )}
          </div>

          {/* Email Sign-up Button */}
          <div>
            <button
              onClick={handleSubmit}
              disabled={!isValid || isSubmitting}
              className={`flex justify-center w-full px-4 py-3 text-sm font-medium text-white border border-transparent rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ${
                isValid && !isSubmitting
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:ring-purple-500 transform hover:-translate-y-1'
                  : 'bg-gray-300 cursor-not-allowed'
                }`}
            >
              {isSubmitting ? 'Sending OTP...' : isValid ? 'Sign Up with Email' : 'Enter Valid Email'}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to='/login' className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-300">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailValidationForm;