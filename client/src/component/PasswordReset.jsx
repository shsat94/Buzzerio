import React, { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, Check, X, Lock, ShieldCheck } from 'lucide-react';
import { resetPassword } from '../controller/AuthenticationController';
import { useAuthentication } from '../contextApi/Authentication';
import { EnvVariableContext } from '../contextApi/envVariables';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../contextApi/Alert';
import { useLoading } from '../contextApi/Load';

const SetNewPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { cpEmail } = useAuthentication();
    const { host, apiKey } = useContext(EnvVariableContext);
    const navigate = useNavigate();
      const { PopAlert, closeAlert } = useAlert();
      const { setIsLoading } = useLoading();

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Derived state for overall password validity
    const isPasswordValid = Object.values(passwordValidation).every(value => value === true);

    // Check if passwords match
    const passwordsMatch = password && confirmPassword && password === confirmPassword;
    const passwordsDontMatch = confirmPassword && password !== confirmPassword;

    // Check if form is valid
    const isFormValid = isPasswordValid && passwordsMatch;

    // Page styling to match your existing component
    const pageStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6366F1, #A855F7)',
        padding: '20px'
    };

    // Effect to validate password
    useEffect(() => {
        if (password === '') {
            setPasswordValidation({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false
            });
            return;
        }

        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
        });
    }, [password]);

    // Helper function to determine border color
    const getBorderColor = (isValid) => {
        if (isValid === null) return 'border-gray-300';
        return isValid ? 'border-green-500 shadow-sm shadow-green-200' : 'border-red-500 shadow-sm shadow-red-200';
    };
    useEffect(()=>{
        setIsLoading(false);
    },[]);

    // Handle form submission
    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmitting(true);
        const res = await resetPassword(cpEmail, password, host, apiKey);
        if (res) {
            setSubmitted(true);
            setIsSubmitting(false);
            navigate('/login');
        }
        else{
            closeAlert();
            PopAlert('error','Some error occured in resetting password',()=>{navigate('/forgotpassword')},'Back');

        }
        
    };

    if (submitted) {
        return (
            <div style={pageStyle}>
                <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl border border-purple-100 text-center">
                    <div className="mb-6">
                        <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-4 animate-bounce" />
                        <h2 className="text-3xl font-bold text-indigo-700 mb-2">Password Updated!</h2>
                        <p className="text-gray-600">Your password has been successfully changed.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl border border-purple-100">
                <div className="text-center mb-6">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-indigo-700">Set New Password</h2>
                    <p className="text-gray-600 mt-2">Create a strong password to secure your account</p>
                </div>

                <div className="space-y-6">
                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label htmlFor="password" className="block text-sm font-medium text-indigo-800">
                                New Password
                            </label>
                            {password !== '' && (
                                <span className={`text-xs ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                                    {isPasswordValid ? 'Strong password' : 'Password requirements not met'}
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${password === '' ? 'border-gray-300' : (isPasswordValid ? 'border-green-500 shadow-sm shadow-green-200' : 'border-red-500 shadow-sm shadow-red-200')
                                    }`}
                                placeholder="Enter your new password"
                                aria-describedby="password-requirements"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-500 hover:text-indigo-700 transition-colors"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Password Validation Checklist */}
                        {password !== '' && (
                            <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100" id="password-requirements">
                                <h3 className="text-sm font-medium text-indigo-700 mb-3">Password Requirements:</h3>
                                <ul className="space-y-1">
                                    <li className="flex items-center space-x-2">
                                        <span className={passwordValidation.length ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </span>
                                        <span className={`text-xs ${passwordValidation.length ? 'text-green-600' : 'text-red-600'}`}>
                                            At least 8 characters
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={passwordValidation.uppercase ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </span>
                                        <span className={`text-xs ${passwordValidation.uppercase ? 'text-green-600' : 'text-red-600'}`}>
                                            Contains uppercase letter
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={passwordValidation.lowercase ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </span>
                                        <span className={`text-xs ${passwordValidation.lowercase ? 'text-green-600' : 'text-red-600'}`}>
                                            Contains lowercase letter
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={passwordValidation.number ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </span>
                                        <span className={`text-xs ${passwordValidation.number ? 'text-green-600' : 'text-red-600'}`}>
                                            Contains number
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <span className={passwordValidation.special ? 'text-green-500' : 'text-red-500'}>
                                            {passwordValidation.special ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                        </span>
                                        <span className={`text-xs ${passwordValidation.special ? 'text-green-600' : 'text-red-600'}`}>
                                            Contains special character
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-indigo-800">
                                Confirm Password
                            </label>
                            {confirmPassword !== '' && (
                                <span className={`text-xs ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                                    {passwordsMatch ? 'Passwords match' : 'Passwords don\'t match'}
                                </span>
                            )}
                        </div>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${confirmPassword === '' ? 'border-gray-300' : (passwordsMatch ? 'border-green-500 shadow-sm shadow-green-200' : 'border-red-500 shadow-sm shadow-red-200')
                                    } ${passwordsDontMatch ? 'animate-shake' : ''}`}
                                placeholder="Confirm your new password"
                                aria-describedby="confirm-password-message"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-500 hover:text-indigo-700 transition-colors"
                                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                            >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        {/* Confirm Password Message */}
                        {confirmPassword !== '' && (
                            <div className="mt-2" id="confirm-password-message">
                                {passwordsMatch && (
                                    <div className="flex items-center space-x-2 text-green-600">
                                        <Check className="w-4 h-4" />
                                        <span className="text-xs">Passwords match!</span>
                                    </div>
                                )}
                                {passwordsDontMatch && (
                                    <div className="flex items-center space-x-2 text-red-600">
                                        <X className="w-4 h-4" />
                                        <span className="text-xs">Passwords don't match</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid || isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg ${isFormValid && !isSubmitting
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-purple-500'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center space-x-2">
                                <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                                <span>Updating Password...</span>
                            </div>
                        ) : (
                            'Update Password'
                        )}
                    </button>

                    {/* Password Strength Indicator */}
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-2">
                            <span>Password Strength</span>
                            <span>{Object.values(passwordValidation).filter(v => v).length}/5</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className={`h-2 rounded-full transition-all duration-500 ${Object.values(passwordValidation).filter(v => v).length === 0 ? 'w-0 bg-gray-400' :
                                        Object.values(passwordValidation).filter(v => v).length <= 2 ? 'bg-red-400' :
                                            Object.values(passwordValidation).filter(v => v).length <= 4 ? 'bg-yellow-400' :
                                                'bg-green-400'
                                    }`}
                                style={{ width: `${(Object.values(passwordValidation).filter(v => v).length / 5) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default SetNewPassword;