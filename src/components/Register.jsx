import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Register({ onSwitch }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Handle environment variables for different build tools
  const API_URL =
    (typeof process !== 'undefined' && process.env?.REACT_APP_API_URL) ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
    'http://localhost:5000';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (message) {
      setMessage('');
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setMessage('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setMessage('Phone number is required');
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
    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setMessage('Please enter a valid 10-digit phone number');
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
      const res = await axios.post(`${API_URL}/api/customer/register`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (res.status === 200 || res.status === 201) {
        setMessage('Registration successful! Redirecting to login...');
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
        });

        setTimeout(() => {
          if (onSwitch) {
            onSwitch();
          } else {
            navigate('/login');
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        request: err.request,
      });

      let errorMessage = 'Registration failed. Please try again.';

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        switch (status) {
          case 400:
            errorMessage = data?.message || data?.msg || 'Invalid input. Please check your information.';
            break;
          case 404:
            errorMessage = 'Registration endpoint not found. Please check the server configuration.';
            break;
          case 409:
            errorMessage = 'Email already exists. Please use a different email or login.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = data?.message || data?.msg || `Registration failed (${status}).`;
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please check your internet connection or server status.';
      } else if (err.message) {
        errorMessage = err.message;
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 font-sans p-4">
      <div className="flex w-full max-w-4xl h-auto min-h-[600px] shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Side - Welcome Panel */}
        <div className="w-1/2 bg-gradient-to-br from-green-400 to-green-700 text-white p-8 flex flex-col justify-between hidden md:flex">
          <div>
            <h2 className="text-3xl font-bold mb-4">Join Serve Now!</h2>
            <p className="text-lg leading-relaxed mb-6">
              Create your account and start connecting with skilled professionals for all your service needs.
            </p>
            <div className="space-y-2 text-sm">
              <p>✓ Easy registration process</p>
              <p>✓ Access to verified professionals</p>
              <p>✓ Secure booking system</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </div>
          <p className="text-xs text-green-100 tracking-wide">SERVE NOW ❤</p>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">Register</h3>
              <p className="text-sm text-gray-500 mb-6">
                Create your account to get started with Serve Now
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
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
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
                disabled={isLoading}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  required
                  disabled={isLoading}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all font-semibold disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'REGISTER'
              )}
            </button>

            {/* Login Link */}
            <div className="text-center">
              <span className="text-sm text-gray-600">Already have an account? </span>
              <Link 
                to="/login" 
                className="text-sm text-green-600 hover:text-green-800 hover:underline font-medium transition-colors"
              >
                Login here
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
}

export default Register;