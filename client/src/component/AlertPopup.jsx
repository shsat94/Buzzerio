import { useState, useEffect, useRef } from 'react';

const AlertPopup = ({ type = 'info', message, onAction, buttonText = 'OK' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const alertRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (alertRef.current && !alertRef.current.contains(event.target)) {
        setIsVisible(false);
        setTimeout(() => {
          // Call onAction with a special parameter to indicate close by outside click
          if (typeof onAction === 'function') {
            onAction('close_outside');
          }
        }, 300); // Wait for fade out animation
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onAction]);

  const closeHandle = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Call onAction with a special parameter to indicate close by button
      if (typeof onAction === 'function') {
        onAction('close_button');
      }
    }, 300); // Wait for fade out animation
  };

  const handleActionClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      // Call the original onAction handler
      if (typeof onAction === 'function') {
        onAction();
      }
    }, 300); // Wait for fade out animation
  };

  const colorSchemes = {
    success: {
      background: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      heading: 'text-green-700',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    },
    error: {
      background: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      heading: 'text-red-700',
      button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )
    },
    warning: {
      background: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      heading: 'text-yellow-700',
      button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    info: {
      background: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      heading: 'text-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  };

  const scheme = colorSchemes[type] || colorSchemes.info;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      aria-labelledby="alert-title"
      role="alertdialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      
      <div 
        ref={alertRef}
        className={`relative w-72 h-72 ${scheme.background} ${scheme.border} border rounded-lg shadow-xl overflow-hidden transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-90'}`}
      >
        <button
          onClick={closeHandle}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex flex-col items-center justify-between h-full p-6">
          <div className="mt-4">
            {scheme.icon}
          </div>

          <div className="text-center my-4">
            <h3 
              id="alert-title" 
              className={`text-lg font-medium ${scheme.heading} mb-2 capitalize`}
            >
              {type}
            </h3>
            <p className={`${scheme.text} text-sm`}>{message}</p>
          </div>
          
          <button
            type="button"
            onClick={handleActionClick}
            className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${scheme.button} focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertPopup;