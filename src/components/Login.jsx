import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle environment variables for different build tools
  const API_URL =
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('customerId');
    
    if (token && customerId && customerId !== 'undefined' && customerId !== 'null') {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (message && !message.includes('successful')) {
      setMessage('');
    }
  };

  const handleRememberMeChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setMessage('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setMessage('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return false;
    }
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', { email: formData.email });

      const response = await axios.post(`${API_URL}/api/customer/login`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log('Login response:', response.data);

      if (response.status === 200 && response.data) {
        const { token, customerId, customer, userId, user, id, _id } = response.data;

        if (!token) {
          throw new Error('No token received from server');
        }

        const customerIdValue = customerId || userId || id || _id || user?.id || user?._id;
        
        if (!customerIdValue) {
          try {
            const tokenPayload = JSON.parse(atob(token.split('.')[1]));
            const decodedId = tokenPayload.user?.id || tokenPayload.user?._id || tokenPayload.userId || tokenPayload.id;
            
            if (decodedId) {
              localStorage.setItem('customerId', decodedId);
              console.log('Customer ID extracted from token:', decodedId);
            } else {
              throw new Error('No customer ID found in response or token. Please contact support.');
            }
          } catch (decodeError) {
            console.error('Failed to decode token:', decodeError);
            throw new Error('Invalid authentication response. Please try again.');
          }
        } else {
          localStorage.setItem('customerId', customerIdValue);
        }

        localStorage.setItem('token', token);
        localStorage.setItem('isLoggedIn', 'true');
        
        const userInfo = customer || user;
        if (userInfo) {
          localStorage.setItem('customerName', userInfo.name || '');
          localStorage.setItem('customerEmail', userInfo.email || formData.email);
          localStorage.setItem('customerPhone', userInfo.phone || '');
          
          if (userInfo.profileImage) {
            localStorage.setItem('customerProfileImage', userInfo.profileImage);
          }
        } else {
          localStorage.setItem('customerEmail', formData.email);
        }

        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        console.log('Login successful, stored data:', {
          token: !!token,
          customerId: localStorage.getItem('customerId'),
          customerName: userInfo?.name || 'N/A'
        });

        setMessage('Login successful! Redirecting...');

        window.dispatchEvent(new Event('userLoggedIn'));

        setTimeout(() => {
          const redirectTo = location.state?.from?.pathname || '/dashboard';
          navigate(redirectTo, { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        request: error.request,
      });

      let errorMessage = 'Login failed. Please try again.';

      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please check your connection and try again.';
      } else if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.msg || 'Invalid input. Please check your email and password.';
            break;
          case 401:
            errorMessage = data?.msg || 'Invalid email or password.';
            break;
          case 404:
            errorMessage = 'Login endpoint not found. Please check the server configuration.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.msg || data?.message || `Login failed (${status}).`;
        }
      } else if (error.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection or server status.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-sans p-4">
      <div className="flex w-full max-w-4xl h-auto min-h-[480px] shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Side - Welcome Panel */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 to-blue-700 text-white p-8 flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-lg leading-relaxed mb-6">
              <strong>Serve Now</strong> is your trusted service-broker platform connecting customers with skilled professionals.
            </p>
            <div className="space-y-2 text-sm">
              <p>✓ Connect with verified professionals</p>
              <p>✓ Book services instantly</p>
              <p>✓ Track your bookings</p>
              <p>✓ Secure payments</p>
            </div>
          </div>
          <p className="text-xs text-blue-100 tracking-wide">SERVE NOW ❤</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Login</h3>
              <p className="text-sm text-gray-500 mb-6">
                Login to access your dashboard and manage your bookings.
              </p>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={handleRememberMeChange}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:cursor-not-allowed"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <Link 
                to="/forgotpassword" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all font-semibold disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                'LOGIN'
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">Don't have an account? </span>
              <Link 
                to="/register" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
              >
                Sign up here
              </Link>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`text-center p-3 rounded-lg font-medium transition-all ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-700 border border-green-300' 
                  : 'bg-red-100 text-red-700 border border-red-300'
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* Mobile Welcome Message */}
          <div className="mt-8 text-center md:hidden">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Serve Now</h4>
            <p className="text-sm text-gray-600">Your trusted service platform</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;