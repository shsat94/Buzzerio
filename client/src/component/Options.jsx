import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchRoomId } from '../contextApi/Roomid';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useStateVariable } from '../contextApi/StateVariables';
import { useAlert } from '../contextApi/Alert';

const Options = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate=useNavigate();
  const { socket } = useContext(EnvVariableContext);
  const { searchRoomid,setJoinRoomAsGuest } = useSearchRoomId();
  const { setCpRoomId,setCpName } = useStateVariable();
  const { PopAlert, closeAlert } = useAlert();

  useEffect(() => {
    // Trigger popup after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleContinueLogin = () => {
    setJoinRoomAsGuest(false);
      closeAlert();
      PopAlert('warning', "You need to login before joining or join as guest.", ()=>{navigate('/login');}, "Login");
      navigate('/login');
    handleClose();
  };

  const handleJoinGuest = () => {
    setJoinRoomAsGuest(true);
    navigate('/guestroomjoin');
    handleClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const showPopup = () => {
    setIsVisible(true);
    setIsAnimating(true);
  };

  if (!isVisible) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <button
          onClick={showPopup}
          className="px-8 py-4 bg-gradient-to-r from-pink-500 to-violet-500 text-white font-semibold rounded-2xl shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300"
        >
          Show Welcome Popup
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 z-40 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleOverlayClick}
        aria-hidden="true"
      />

      {/* Popup Container */}
      <div
        className={`relative z-50 w-full max-w-md mx-auto transform transition-all duration-500 ease-out ${
          isAnimating
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-75 opacity-0 translate-y-8'
        }`}
        role="dialog"
        aria-labelledby="popup-title"
        aria-modal="true"
      >
        {/* Popup Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10" />
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full blur-2xl opacity-20 animate-pulse" />

          {/* Close Button */}
          <button
            onClick={()=>{navigate('/')}}
            className="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
            aria-label="Close popup"
          >
            <svg
              className="w-4 h-4 text-gray-600 group-hover:text-gray-800 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Content */}
          <div className="relative p-8 pt-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Title */}
            <h2
              id="popup-title"
              className="text-2xl md:text-3xl font-bold text-center mb-3 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent"
            >
              Welcome to Buzzerio
            </h2>

            {/* Subtitle */}
            <p className="text-gray-600 text-center mb-8 leading-relaxed">
              Get started with your personalized experience. Choose how you'd like to proceed.
            </p>

            {/* Buttons */}
            <div className="space-y-4">
              {/* Primary Button */}
              <button
                onClick={handleContinueLogin}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-purple-500/25 transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Continue with Login</span>
                </span>
              </button>

              {/* Secondary Button */}
              <button
                onClick={handleJoinGuest}
                className="w-full py-4 px-6 bg-white hover:bg-gray-50 text-gray-800 font-semibold rounded-2xl border-2 border-gray-200 hover:border-gray-300 shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500/50"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Join as Guest</span>
                </span>
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Options;