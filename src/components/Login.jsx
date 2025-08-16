import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        localStorage.setItem('user', 'true');
        setMessage('Login successful!');

        const redirectServiceId = location.state?.selectedServiceId || 1;
        const redirectTo = location.state?.fromBook ? `/services/${redirectServiceId}` : '/dashboard';
        navigate(redirectTo, { replace: true });
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 font-sans">
      <div className="flex w-[800px] h-[480px] shadow-2xl rounded-2xl overflow-hidden bg-white">
        {/* Left Side */}
        <div className="w-1/2 bg-gradient-to-br from-blue-400 to-blue-700 text-white p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-4">Hello Serve Now</h2>
            <p className="text-sm leading-relaxed">
              <strong>Serve Now</strong> is a smart service-broker platform connecting customers with skilled professionals.
            </p>
          </div>
          <p className="text-xs text-white tracking-wide">SERVE NOW &#10084;</p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/2 p-8 flex flex-col justify-center">
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">Login</h3>
            <p className="text-sm text-gray-500 mb-6">
              Login to get amazing discounts and offers only for you.
            </p>

            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 mt-1 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-5 text-gray-500 cursor-pointer"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </span>
            </div>

            <div className="flex items-center mb-4">
              <input type="checkbox" className="mr-2" />
              <label className="text-sm text-gray-700">Remember me</label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
            >
              LOGIN
            </button>

            <div className="flex justify-between mt-4 text-sm">
              <Link to="/register" className="text-blue-600 hover:underline">New User? Signup</Link>
              <Link to="/ForgotPassword" className="text-blue-600 hover:underline">Forgot your password?</Link>
            </div>

            {message && (
              <div className={`text-center mt-4 font-semibold ${message.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
