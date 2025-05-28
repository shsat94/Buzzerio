import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp } from '../../controller/AuthenticationController';
import { EnvVariableContext } from '../../contextApi/envVariables';
import { useStateVariable } from '../../contextApi/StateVariables';
import { useLoading } from '../../contextApi/Load';
import { useAlert } from '../../contextApi/Alert';
import { useAuthentication } from '../../contextApi/Authentication';

const EmailValidationForm = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { host, apiKey } = useContext(EnvVariableContext);
  const { setOneTimePassword, isUserPresent, setIsUserPresent,setIsForgotPassword } = useStateVariable();
  const { setIsLoading } = useLoading();
  const { PopAlert } = useAlert();
  const navigate = useNavigate();
  const {setCpEmail}=useAuthentication()

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

  const handleGoogleSignup = () => {
    setIsLoading(true);
    // Simulate a delay for demo purposes
    setTimeout(() => {
      setIsLoading(false);
      alert('Signing up with Google...');
      // Here you would normally implement Google OAuth
    }, 800);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-100 to-blue-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl border-t-4 border-purple-500">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-purple-800">Buzzerio</h2>
          <p className="mt-2 text-sm text-indigo-600">Create your account to get started</p>
        </div>

        <div className="mt-6 space-y-6">
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
              {isSubmitting ? 'Sending OTP...' : isValid ? 'Sign Up' : 'Enter Valid Email'}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              onClick={handleGoogleSignup}
              disabled={isSubmitting}
              className={`flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>
          </div>

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