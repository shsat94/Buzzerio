import React, { useState, useEffect, useContext } from 'react';
import { Mail, Send, CheckCircle, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { sendOtp } from '../controller/AuthenticationController';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useStateVariable } from '../contextApi/StateVariables';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../contextApi/Authentication';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showError, setShowError] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { host, apiKey } = useContext(EnvVariableContext);
  const { setOneTimePassword, isUserPresent, setIsUserPresent ,isForgotPassword,setIsForgotPassword} = useStateVariable();
  const navigate=useNavigate();
  const {setCpEmail}=useAuthentication()


  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Real-time email validation
  useEffect(() => {
    if (email === '') {
      setIsValid(null);
      setShowError(false);
      return;
    }

    const isEmailValid = emailRegex.test(email);
    setIsValid(isEmailValid);
    setShowError(!isEmailValid);
  }, [email]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await sendOtp(email, host, apiKey, setOneTimePassword, setIsUserPresent);
      setIsSubmitting(false);
      setIsSubmitted(true);
      setIsForgotPassword(true);
      setCpEmail(email);
      navigate("/verifyotp");

  };

  const resetForm = () => {
    setEmail('');
    setIsValid(null);
    setShowError(false);
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pink-400/30 via-purple-400/20 to-cyan-400/30 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-bounce"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl border border-gray-200 text-center relative overflow-hidden">
            {/* Success Animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-3xl animate-pulse"></div>
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-lg shadow-green-400/50">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <div className="mb-6">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-green-600 bg-clip-text text-transparent mb-3">
                  Otp Sent! ✨
                </h2>
                <div className="flex justify-center space-x-1 mb-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className={`w-2 h-2 bg-green-400 rounded-full animate-pulse`} style={{animationDelay: `${i * 0.2}s`}}></div>
                  ))}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-100">
                <p className="text-gray-700 mb-3 text-lg leading-relaxed">
                  We've sent a OTP to
                </p>
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-3 mb-3">
                  <span className="font-bold text-gray-800 text-lg">{email}</span>
                </div>
                <p className="text-gray-600 text-sm">
                  Check your inbox and click the link to reset your password
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={resetForm}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg"
                >
                  <ArrowLeft className="w-5 h-5 inline mr-2" />
                  Send Another Link
                </button>
                <p className="text-gray-500 text-sm">
                  Didn't receive it? Check your spam folder or try again
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-violet-600 via-purple-600 to-blue-600 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.4) 0%, transparent 50%), linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)`
        }}
      >
        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-full blur-xl animate-float-delay"></div>
        <div className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-32 w-28 h-28 bg-gradient-to-r from-green-400/30 to-emerald-400/30 rounded-full blur-xl animate-bounce"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-3xl p-10 w-full max-w-lg shadow-2xl border border-gray-200 relative overflow-hidden">
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-cyan-50 rounded-3xl animate-pulse"></div>
          
          <div className="relative z-10">
            {/* Header with Animation */}
            <div className="text-center mb-10">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/50 animate-pulse">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-spin" />
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                Forgot Your Password?
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                Don't worry! ✨ Enter your email and we'll send you a Otp to reset it
              </p>
            </div>

            {/* Enhanced Form */}
            <div className="space-y-8">
              <div className="space-y-3">
                <label 
                  htmlFor="email" 
                  className="block text-gray-700 font-semibold text-lg flex items-center gap-2"
                >
                  <Mail className="w-5 h-5 text-purple-500" />
                  Email Address
                </label>
                
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your magical email address ✨"
                    aria-describedby={showError ? "email-error" : undefined}
                    aria-invalid={showError ? "true" : "false"}
                    className={`w-full px-6 py-5 rounded-2xl bg-gray-50 border-2 text-gray-800 placeholder-gray-500 text-lg transition-all duration-500 focus:outline-none focus:ring-4 group-hover:bg-gray-100 ${
                      isValid === null 
                        ? 'border-gray-300 hover:border-gray-400 focus:ring-purple-400/30 focus:border-purple-400' 
                        : isValid 
                          ? 'border-green-400 focus:ring-green-400/30 shadow-green-400/50 shadow-xl bg-green-50' 
                          : 'border-red-400 focus:ring-red-400/30 shadow-red-400/50 shadow-xl bg-red-50 animate-shake'
                    }`}
                  />
                  
                  {/* Status Icons with Animation */}
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    {isValid && (
                      <div className="bg-green-400 rounded-full p-1 animate-bounce">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                    {showError && (
                      <div className="bg-red-400 rounded-full p-1 animate-pulse">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* Input Glow Effect */}
                  {isValid && (
                    <div className="absolute inset-0 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl blur-sm -z-10 animate-pulse"></div>
                  )}
                </div>
                
                {/* Enhanced Error Message */}
                <div className={`transition-all duration-500 ${showError ? 'max-h-20 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'} overflow-hidden`}>
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-3">
                    <p id="email-error" className="text-red-600 text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 animate-pulse" />
                      Oops! Please enter a valid email address
                    </p>
                  </div>
                </div>
                
                {/* Success Message */}
                <div className={`transition-all duration-500 ${isValid ? 'max-h-20 opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform -translate-y-2'} overflow-hidden`}>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-3">
                    <p className="text-green-600 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 animate-pulse" />
                      Perfect! Your email looks great ✨
                    </p>
                  </div>
                </div>
              </div>

              {/* Enhanced Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                className={`w-full py-5 px-8 rounded-2xl font-bold text-lg transition-all duration-500 flex items-center justify-center gap-3 relative overflow-hidden group ${
                  !isValid || isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed scale-95 opacity-60'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 active:scale-95 shadow-xl transform'
                }`}
              >
                {/* Button Background Animation */}
                {isValid && !isSubmitting && (
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
                
                <div className="relative z-10 flex items-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending Otp...</span>
                      <Sparkles className="w-5 h-5 animate-spin" />
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                      <span>Send Otp</span>
                      <Sparkles className="w-5 h-5 group-hover:animate-spin transition-all duration-300" />
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Enhanced Footer */}
            <div className="text-center mt-10 space-y-4">
              <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              <p className="text-gray-600 text-lg">
                Remember your password?{' '}
                <button className="text-purple-600 font-bold hover:text-purple-700 transition-all duration-300 hover:underline relative group">
                  <span className="relative z-10">Sign In</span>
                  <div className="absolute inset-0 bg-purple-100 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                </button>
              </p>
              <p className="text-gray-500 text-sm">
                🔒 Your data is safe and secure with us
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-180deg); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float-delay 8s ease-in-out infinite;
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;