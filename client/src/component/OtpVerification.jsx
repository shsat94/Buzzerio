import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../contextApi/Load';
import { useStateVariable } from '../contextApi/StateVariables';
import { EnvVariableContext } from '../contextApi/envVariables';
import { sendOtp } from '../controller/AuthenticationController';
import { useAuthentication } from '../contextApi/Authentication';

const OTPInput = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [showDigits, setShowDigits] = useState([false, false, false, false, false, false]);
  const [fadeIn, setFadeIn] = useState(false);
  const { oneTimePassword } = useStateVariable();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const { host, apiKey } = useContext(EnvVariableContext);
  const { setOneTimePassword, setIsUserPresent, isForgotPassword, setIsForgotPassword } = useStateVariable();
  const { cpEmail } = useAuthentication();

  const inputRefs = useRef([]);

  // Handle initial loading state and animation
  useEffect(() => {
    // Short delay before removing the loading indicator
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
      // After loading is complete, start the fade-in animation
      setFadeIn(true);
    }, 500);

    return () => clearTimeout(loadingTimer);
  }, []);

  // Set up the refs array for input focus management
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
    // Only focus on first input after loading is complete and component has faded in
    if (fadeIn) {
      const focusTimer = setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 300); // Short delay to allow fade-in animation

      return () => clearTimeout(focusTimer);
    }
  }, [fadeIn]);

  // Handle countdown timer
  useEffect(() => {
    let interval;

    if (isTimerRunning && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      setIsTimerRunning(false);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning, countdown]);

  // Check if OTP is complete
  useEffect(() => {
    const isOtpFilled = otp.every(digit => digit !== '');
    setIsComplete(isOtpFilled);
  }, [otp]);

  // Handle showing digits temporarily before converting to dots
  useEffect(() => {
    const timeouts = showDigits.map((show, index) => {
      if (show) {
        return setTimeout(() => {
          setShowDigits(prev => {
            const updated = [...prev];
            updated[index] = false;
            return updated;
          });
        }, 300); // Show digit for 300ms
      }
      return null;
    });

    return () => {
      timeouts.forEach(timeout => {
        if (timeout) clearTimeout(timeout);
      });
    };
  }, [showDigits]);

  // Handle digit input
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) {
      return;
    }

    setOtp(prevOtp => {
      const newOtp = [...prevOtp];
      newOtp[index] = value;
      return newOtp;
    });

    if (value) {
      // Show digit temporarily
      setShowDigits(prev => {
        const updated = [...prev];
        updated[index] = true;
        return updated;
      });

      // Move focus to next input
      if (index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move focus to previous input when pressing backspace on empty field
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle submit
  const handleSubmit = () => {
    // Set loading state before verification
    setIsLoading(true);

    // Small delay to show loading state
    setTimeout(() => {
      const enteredOtp = otp.join('');

      if (enteredOtp != oneTimePassword) {
        setIsLoading(false);
        setIsIncorrect(true);

        // Reset after animation completes
        setTimeout(() => {
          setIsIncorrect(false);
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0].focus();
        }, 1000);
      } else {
        if (isForgotPassword) {
          setIsForgotPassword(false);
          navigate('/resetpassword')
        } else {
          navigate('/name');
        }
      }
    }, 500);
  };

  // Resend OTP
  const handleResendOtp = async () => {
    // Show loading when resending
    setIsLoading(true);

    setTimeout(async () => {
      setOtp(['', '', '', '', '', '']);
      setCountdown(60);
      setIsTimerRunning(true);
      setIsIncorrect(false);
      setIsLoading(false);

      // Focus after a short delay
      setTimeout(() => {
        inputRefs.current[0].focus();
      }, 100);
      await sendOtp(cpEmail, host, apiKey, setOneTimePassword, setIsUserPresent);


    }, 700);
  };

  // Format countdown time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 p-4">
      <div
        className={`w-full max-w-md p-8 bg-white rounded-xl shadow-xl border-t-4 border-indigo-600 transition-all duration-500 ${fadeIn ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
          }`}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-800 mb-2">OTP Verification</h2>
        <p className="text-center text-indigo-600 mb-8">
          Enter the 6-digit code sent to your device
        </p>

        <div
          className={`flex justify-between mb-8 ${isIncorrect ? 'animate-otp-error' : ''}`}
          style={{
            animationName: isIncorrect ? 'shake, fall' : 'none',
            animationDuration: isIncorrect ? '0.5s, 0.5s' : '0s',
            animationTimingFunction: 'ease-in-out, cubic-bezier(0.55, 0.085, 0.68, 0.53)',
            animationDelay: isIncorrect ? '0s, 0.5s' : '0s',
            animationFillMode: 'forwards',
          }}>
          {otp.map((digit, index) => (
            <div key={index} className="relative">
              <input
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength={1}
                value={showDigits[index] ? digit : ''}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-12 h-12 text-center text-xl font-bold rounded-lg border-2 focus:outline-none transition-all duration-300 shadow-md ${isComplete
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                    : digit
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800'
                      : 'border-red-400 bg-red-50 text-gray-700'
                  }`}
                style={{
                  aspectRatio: '1/1',
                }}
                autoComplete="off"
              />
              {digit && !showDigits[index] && (
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold pointer-events-none text-indigo-800">
                  •
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isComplete}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-md ${isComplete
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transform hover:-translate-y-1'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
        >
          Verify OTP
        </button>

        <div className="mt-6 text-center">
          {isTimerRunning ? (
            <p className="text-indigo-600 font-medium">
              <span className="inline-block mr-2">⏱️</span>
              Resend OTP in {formatTime(countdown)}
            </p>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors duration-300 flex items-center justify-center mx-auto"
            >
              <span className="inline-block mr-2">🔄</span>
              Resend OTP
            </button>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        @keyframes fall {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default OTPInput;