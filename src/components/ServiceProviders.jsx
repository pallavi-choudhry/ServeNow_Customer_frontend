import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
});

const ServiceProviders = () => {
  const { serviceType: urlserviceType } = useParams();
  const navigate = useNavigate();
  const [serviceType, setServiceType] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    customerName: '',
    customerEmail: '',
    customerNumber: '',
    bookingDate: '',
    bookingSlot: '',
    additionalNotes: '',
    customerId: '',
  });

  // Normalize serviceType
  useEffect(() => {
    console.log('urlserviceType:', urlserviceType);
    if (urlserviceType) {
      setServiceType(urlserviceType.toLowerCase().trim());
    } else {
      setError('Invalid service type');
      setLoading(false);
    }
  }, [urlserviceType]);

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        console.log('Fetching services for serviceType:', serviceType);
        const token = localStorage.getItem('token');
        console.log('Token:', token);
        const response = await api.get(`/api/booking/serviceType/${serviceType}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        console.log('Full API response:', response.data);
        setServices(response.data.services || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch services:', err);
        let errorMsg = 'Failed to fetch services';
        if (err.response) {
          errorMsg = err.response.data?.msg || err.response.data?.message || `Server error: ${err.response.status}`;
          console.log('Error response:', err.response.data);
        } else if (err.request) {
          errorMsg = 'No response from server. Please check if the backend is running.';
        } else {
          errorMsg = err.message;
        }
        setError(errorMsg);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    if (serviceType && serviceType.trim() !== '') {
      fetchServices();
    } else {
      setLoading(false);
      setError('Service type is not set');
    }
  }, [serviceType]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found, user not authenticated');
          setUserAuthenticated(false);
          return;
        }

        const response = await api.get('/api/customer/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('✅ Successfully fetched user data:', response.data);
        setUserAuthenticated(true);

        const user = response.data.user;
        setBookingForm((prev) => ({
          ...prev,
          customerName: user.name || '',
          customerEmail: user.email || '',
          customerNumber: user.phone || '',
          customerId: user.id || '',
        }));
      } catch (err) {
        console.error('Error fetching user data:', err);
        setUserAuthenticated(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle booking form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle booking submission
  const handleBookService = async (serviceId) => {
    if (bookingLoading) return;

    try {
      setBookingLoading(true);

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to book a service');
        navigate('/login');
        return;
      }

      const validationErrors = [];
      if (!bookingForm.customerName.trim()) validationErrors.push('name');
      if (!bookingForm.customerEmail.trim()) validationErrors.push('email');
      if (!bookingForm.customerNumber.trim()) validationErrors.push('phone number');
      if (!bookingForm.bookingDate.trim()) validationErrors.push('booking date and time');
      if (!bookingForm.bookingSlot.trim()) validationErrors.push('time slot');

      if (validationErrors.length > 0) {
        alert(`Please fill in the following fields: ${validationErrors.join(', ')}`);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(bookingForm.customerEmail.trim())) {
        alert('Please enter a valid email address');
        return;
      }

      if (!serviceId) {
        alert('Service ID is missing');
        return;
      }

      const service = services.find((s) => s._id === serviceId);
      if (!service) {
        alert('Service not found');
        return;
      }

      let bookingDate = '';
      let bookingTime = '';
      if (bookingForm.bookingDate.includes('T')) {
        [bookingDate, bookingTime] = bookingForm.bookingDate.split('T');
        if (bookingTime && bookingTime.includes(':')) {
          bookingTime = bookingTime.substring(0, 5);
        }
      } else {
        bookingDate = bookingForm.bookingDate;
      }

      const bookingData = {
        customerName: bookingForm.customerName.trim(),
        customerEmail: bookingForm.customerEmail.trim(),
        customerNumber: bookingForm.customerNumber.trim(),
        bookingDate: bookingDate,
        bookingTime: bookingTime || '',
        bookingSlot: bookingForm.bookingSlot,
        additionalNotes: bookingForm.additionalNotes.trim(),
        customerId: bookingForm.customerId || null,
        providerId: service.providerId?._id || service.providerId,
      };

      console.log('📝 Submitting booking with data:', bookingData);

      const response = await api.post('/api/booking/create', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('✅ Booking successful:', response.data);

      const successMsg = response.data.msg || 'Booking confirmed successfully!';
      const bookingId = response.data.bookingId;

      alert(`${successMsg}${bookingId ? `\nBooking ID: ${bookingId}` : ''}`);

      setBookingForm((prev) => ({
        ...prev,
        serviceId: '',
        bookingDate: '',
        bookingSlot: '',
        additionalNotes: '',
      }));

      setTimeout(() => {
        navigate('/Dashboard');
      }, 1500);
    } catch (err) {
      console.error('❌ Booking error:', err);

      let errorMsg = 'Failed to book service. Please try again.';
      if (err.response?.data) {
        errorMsg = err.response.data.msg || err.response.data.message || err.response.data.error || errorMsg;
      } else if (err.message) {
        errorMsg = err.message;
      }

      alert(errorMsg);
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle manual user info update
  const handleUpdateUserInfo = () => {
    const name = prompt('Enter your name:', bookingForm.customerName);
    const email = prompt('Enter your email:', bookingForm.customerEmail);
    const phone = prompt('Enter your phone number:', bookingForm.customerNumber);

    if (name !== null && name.trim()) {
      setBookingForm((prev) => ({ ...prev, customerName: name.trim() }));
    }
    if (email !== null && email.trim()) {
      setBookingForm((prev) => ({ ...prev, customerEmail: email.trim() }));
    }
    if (phone !== null && phone.trim()) {
      setBookingForm((prev) => ({ ...prev, customerNumber: phone.trim() }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold">Error loading services</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-20">
      <section className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-blue-800 mb-4 capitalize">
          {serviceType} Services
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Choose from our trusted {serviceType} service providers.
        </p>
        {!userAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-yellow-800">
              ⚠️ Profile not loaded automatically. You can enter your details manually.
            </p>
          </div>
        )}
      </section>

      <section className="px-6 pb-16">
        {services.length === 0 ? (
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-xl font-semibold">No {serviceType} services found</p>
              <p className="text-sm">Try checking other categories or come back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {services.map((service) => (
              <div
                key={service._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="mb-4">
                  <h4 className="text-2xl font-bold text-blue-800 mb-2">
                    {service.serviceName || 'Unnamed Service'}
                  </h4>
                  <div className="space-y-1 text-gray-600">
                    <p><span className="font-medium">Provider:</span> {service.providerId?.name || 'N/A'}</p>
                    <p><span className="font-medium">Price:</span> ₹{service.price || 'N/A'}</p>
                    <p><span className="font-medium">Location:</span> {service.location || service.providerId?.location || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {service.description || 'No description available.'}
                </p>
                <button
                  onClick={() => setBookingForm({ ...bookingForm, serviceId: service._id })}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-full hover:from-blue-700 hover:to-blue-600 transition duration-200 font-medium"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {bookingForm.serviceId && (
        <section className="px-6 pb-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Book Service</h3>
              <p className="text-gray-600 text-sm">Fill in your details to confirm the booking</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              {!userAuthenticated && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    Your profile info couldn't be loaded automatically.
                  </p>
                  <button
                    onClick={handleUpdateUserInfo}
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    Click here to quickly fill your info
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Customer Name *</label>
                  <input
                    type="text"
                    name="customerName"
                    value={bookingForm.customerName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={bookingForm.customerEmail}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="customerNumber"
                    value={bookingForm.customerNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700

 font-medium mb-2">Booking Date & Time *</label>
                  <input
                    type="datetime-local"
                    name="bookingDate"
                    value={bookingForm.bookingDate}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Preferred Time Slot *</label>
                  <select
                    name="bookingSlot"
                    value={bookingForm.bookingSlot}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a time slot</option>
                    <option value="Morning">Morning (9 AM - 12 PM)</option>
                    <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                    <option value="Evening">Evening (5 PM - 8 PM)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Additional Notes</label>
                  <textarea
                    name="additionalNotes"
                    value={bookingForm.additionalNotes}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setBookingForm({ ...bookingForm, serviceId: '' })}
                    className="flex-1 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-medium"
                    disabled={bookingLoading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleBookService(bookingForm.serviceId)}
                    disabled={bookingLoading}
                    className={`flex-1 px-4 py-3 rounded-lg font-medium transition duration-200 ${
                      bookingLoading
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600'
                    }`}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Booking...
                      </div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ServiceProviders;