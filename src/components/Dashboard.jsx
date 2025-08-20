import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faMapMarkerAlt, 
  faUser, 
  faRupeeSign,
  faEye,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerInfo, setCustomerInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication on component mount
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const customerId = localStorage.getItem('customerId');
      const isLoggedIn = localStorage.getItem('isLoggedIn');

      if (!token || !customerId || isLoggedIn !== 'true') {
        // User is not authenticated, redirect to login
        navigate('/login', { replace: true });
        return false;
      }

      // Set customer info from localStorage
      setCustomerInfo({
        name: localStorage.getItem('customerName') || '',
        email: localStorage.getItem('customerEmail') || '',
        phone: localStorage.getItem('customerPhone') || '',
      });

      return true;
    };

    if (checkAuth()) {
      fetchBookings();
    }
  }, [navigate]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('Missing authentication token');
      }

      const res = await axios.get('http://localhost:5000/api/provider/approved', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Fixed data handling logic
      let bookingsData;
      if (res.data.bookings && Array.isArray(res.data.bookings)) {
        bookingsData = res.data.bookings;
      } else if (res.data.data && Array.isArray(res.data.data)) {
        bookingsData = res.data.data;
      } else if (Array.isArray(res.data)) {
        bookingsData = res.data;
      } else {
        // If no valid array is found, set to empty array
        bookingsData = [];
      }

      setBookings(bookingsData);
      setError('');
    } catch (err) {
      console.error('Error fetching bookings:', err.response?.data || err.message);

      const errorMessage =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        'Error loading bookings';
      setError(errorMessage);

      // Ensure bookings is always an array, even on error
      setBookings([]);

      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token is invalid or expired
        handleLogout();
      } else if (err.response?.status === 404) {
        setError('No bookings found or booking service not configured.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Function to handle logout (integrated with the auth system)
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('customerProfileImage');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberedEmail');
    
    // Dispatch logout event to notify other components (like navbar)
    window.dispatchEvent(new Event('userLoggedOut'));
    
    // Navigate to login
    navigate('/login', { replace: true });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      // If it's already formatted, return as is
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString;
      }
      // If it's in 24hr format, convert to 12hr
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center pt-20">
        <div className="text-center">
          <FontAwesomeIcon 
            icon={faSpinner} 
            className="animate-spin text-blue-500 text-4xl mb-4" 
          />
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome, {customerInfo.name || 'User'}!
                </h1>
                <p className="text-gray-600">
                  Here's an overview of your bookings and activities
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <div className="text-sm text-gray-500">
                  <p>{customerInfo.email}</p>
                  {customerInfo.phone && <p>{customerInfo.phone}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <FontAwesomeIcon icon={faUser} className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FontAwesomeIcon icon={faClock} className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status?.toLowerCase() === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <FontAwesomeIcon icon={faRupeeSign} className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{bookings.reduce((sum, booking) => sum + (parseFloat(booking.price) || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-400">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Data</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
                {error.includes('401') && (
                  <button
                    onClick={handleLogout}
                    className="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm transition-colors"
                  >
                    Re-login
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bookings Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
              <button
                onClick={() => navigate('/services')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                Browse Services
              </button>
            </div>
          </div>

          <div className="p-6">
            {!Array.isArray(bookings) || bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Found</h3>
                <p className="text-gray-500 mb-6">You haven't made any bookings yet. Start exploring our services!</p>
                <button
                  onClick={() => navigate('/services')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Explore Services
                </button>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {bookings.map((booking) => (
                  <div key={booking._id || booking.bookingId} className="bg-gray-50 rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.bookingSlot || booking.serviceName || 'Service Booking'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          ID: {booking.bookingId || booking._id?.slice(-6) || 'N/A'}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                        {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Pending'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Provider:</span>
                        <span>{booking.providerId?.name || booking.providerName || 'Unknown Provider'}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Date:</span>
                        <span>{formatDate(booking.bookingDate)}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-3 text-gray-400" />
                        <span className="font-medium mr-2">Time:</span>
                        <span>{formatTime(booking.bookingTime)}</span>
                      </div>

                      <div className="flex items-start text-sm text-gray-600">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-3 text-gray-400 mt-0.5" />
                        <div>
                          <span className="font-medium mr-2">Location:</span>
                          <span>{booking.location || booking.address || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                      {booking.price && (
                        <div className="text-lg font-bold text-green-600">
                          <FontAwesomeIcon icon={faRupeeSign} className="mr-1" />
                          {parseFloat(booking.price).toLocaleString()}
                        </div>
                      )}
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;