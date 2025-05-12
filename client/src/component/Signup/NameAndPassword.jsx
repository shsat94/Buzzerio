import { useState, useEffect, useContext } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthentication } from '../../contextApi/Authentication';
import { signUp } from '../../controller/AuthenticationController';
import { EnvVariableContext } from '../../contextApi/envVariables';
import { useLoading } from '../../contextApi/Load';
import { useAlert } from '../../contextApi/Alert';

export default function UserForm() {
  // Added background and centering styling to the page
  const pageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #6366F1, #A855F7)',
    padding: '20px'
  };
  // State for form inputs
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate();
  const{cpEmail}=useAuthentication();
  const { host, apiKey } = useContext(EnvVariableContext);
  const { setIsLoading } = useLoading();
    const { PopAlert } = useAlert();
  
  // State for validation
  const [isNameValid, setIsNameValid] = useState(null);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });
  
  // Derived state for overall password validity
  const isPasswordValid = Object.values(passwordValidation).every(value => value === true);
  
  useEffect(()=>{
    setIsLoading(false);
  })
  // Effect to validate name
  useEffect(() => {
    if (name === '') {
      setIsNameValid(null);
    } else {
      setIsNameValid(name.length >= 3);
    }
  }, [name]);
  
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
  
  const handleSubmit = async() => {
    setIsLoading(true);
    await signUp(cpEmail,password,name,host,apiKey);
    setIsLoading(false);
    PopAlert('success',"Logged in successfully.",()=>{});
    navigate('/');
  };
  
  // Helper function to determine border color
  const getBorderColor = (isValid) => {
    if (isValid === null) return 'border-gray-300'; // Neutral
    return isValid ? 'border-green-500 shadow-sm shadow-green-200' : 'border-red-500 shadow-sm shadow-red-200';
  };
  
  // Validation icons
  const renderValidationIcon = (isValid) => {
    if (isValid === null) return null;
    
    return isValid ? 
      <Check className="w-5 h-5 text-green-500" /> : 
      <X className="w-5 h-5 text-red-500" />;
  };

  return (
    <div style={pageStyle}>
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl border border-purple-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Buzzerio</h2>
      
      <div className="space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="name" className="block text-sm font-medium text-indigo-800">
              Name
            </label>
            {isNameValid !== null && (
              <span className={`text-xs ${isNameValid ? 'text-green-500' : 'text-red-500'}`}>
                {isNameValid ? 'Valid name' : 'Name must be at least 3 characters'}
              </span>
            )}
          </div>
          
          <div className="relative">
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${getBorderColor(isNameValid)}`}
              placeholder="Enter your name"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {renderValidationIcon(isNameValid)}
            </div>
          </div>
        </div>
        
        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-indigo-800">
              Create Password
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
              className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                password === '' ? 'border-gray-300' : (isPasswordValid ? 'border-green-500' : 'border-red-500')
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-indigo-500 hover:text-indigo-700"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Password Validation Checklist */}
          {password !== '' && (
            <div className="mt-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
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
        
        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!isNameValid || !isPasswordValid}
          className={`w-full py-3 px-4 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 font-medium text-lg ${
            isNameValid && isPasswordValid
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white focus:ring-purple-500'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>
    </div>
    </div>
  );

}