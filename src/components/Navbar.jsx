import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faSignOutAlt, 
  faCog, 
  faChevronDown,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import logo from "./image/servenow_logo3.png";

const NavLink = ({ id, label, className, to, onClick }) => (
  <Link
    to={to}
    onClick={() => onClick && onClick(id)}
    className={className || 'hover:text-blue-500 transition'}
  >
    {label}
  </Link>
);

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [locationName, setLocationName] = useState('Fetching location...');
  
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const scrollToSection = (id) => {
    if (
      location.pathname === '/' &&
      id !== 'services' &&
      id !== 'login' &&
      id !== 'register' &&
      id !== 'provider'
    ) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  // Check authentication status
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const token = localStorage.getItem('token');
      const customerId = localStorage.getItem('customerId');
      
      if (loggedIn && token && customerId) {
        setIsLoggedIn(true);
        setCustomerName(localStorage.getItem('customerName') || '');
        setCustomerEmail(localStorage.getItem('customerEmail') || '');
        setProfileImage(localStorage.getItem('customerProfileImage') || '');
      } else {
        setIsLoggedIn(false);
        setCustomerName('');
        setCustomerEmail('');
        setProfileImage('');
      }
    };

    // Check on mount
    checkLoginStatus();

    // Listen for login/logout events
    const handleUserLoggedIn = () => checkLoginStatus();
    const handleUserLoggedOut = () => checkLoginStatus();

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get current city from external service
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        
        try {
          const geocodeResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );
          
          if (geocodeResponse.ok) {
            const geocodeData = await geocodeResponse.json();
            setLocationName(geocodeData.city || geocodeData.locality || "Unknown location");
          } else {
            throw new Error('External geocoding failed');
          }
        } catch (geocodeError) {
          console.error("Geocoding failed:", geocodeError);
          setLocationName("Location not found");
        }
      }, (err) => {
        console.warn('Geolocation error:', err.message);
        setLocationName("Location access denied");
      });
    } else {
      setLocationName("Geolocation not supported");
    }
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/provider-services/search-by-name?name=${searchTerm}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (data.services) {
          setSearchResults(data.services);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    };

    const delayDebounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    localStorage.removeItem('customerEmail');
    localStorage.removeItem('customerPhone');
    localStorage.removeItem('customerProfileImage');
    localStorage.removeItem('isLoggedIn');
    
    // Update state
    setIsLoggedIn(false);
    setCustomerName('');
    setCustomerEmail('');
    setProfileImage('');
    setDropdownOpen(false);

    // Dispatch logout event
    window.dispatchEvent(new Event('userLoggedOut'));

    // Redirect to home
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const ProfileAvatar = () => {
    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 shadow-sm"
        />
      );
    }
    
    return (
      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold border-2 border-gray-300 shadow-sm">
        {getInitials(customerName)}
      </div>
    );
  };

  // Dynamic navigation links based on auth status
  const getNavLinks = () => {
    const baseLinks = [
      { id: 'home', label: 'Home', to: '/' }
    ];

    if (isLoggedIn) {
      return [
        ...baseLinks,
        { id: 'dashboard', label: 'Dashboard', to: '/dashboard' },
        { id: 'services', label: 'Services', to: '/services' }
      ];
    } else {
      return [
        ...baseLinks,
        { id: 'services', label: 'Services', to: '/services' },
        {
          id: 'login',
          label: 'Login',
          to: '/login',
          className: 'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition',
        }
      ];
    }
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-gray-800 text-white fixed w-full top-0 z-50 shadow-lg">
      <div className="container mx-auto px-3 py-3 flex items-center justify-between">
        {/* Left - Logo and Location */}
        <div className="flex items-center space-x-3">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Serve Now Logo"
              className="h-12 w-auto mr-2 transform scale-150"
            />
          </Link>
          <span className="text-sm text-gray-300 hidden sm:inline">📍 {locationName}</span>
          <button
            onClick={toggleMenu}
            className="md:hidden text-3xl text-white ml-4 focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-grow justify-center">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full px-3 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white text-black rounded shadow mt-1 max-h-48 overflow-auto z-50">
                {searchResults.map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    {item.serviceName} - {item.location}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right - Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Navigation Links */}
          <ul className="flex space-x-6 items-center">
            {navLinks.filter(link => link.id !== 'login').map((link) => (
              <li key={link.id}>
                <NavLink
                  id={link.id}
                  label={link.label}
                  to={link.to}
                  className={link.className || 'hover:text-blue-400 transition'}
                  onClick={scrollToSection}
                />
              </li>
            ))}
          </ul>

          {/* Authentication Section */}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="flex items-center space-x-3 bg-gray-700 hover:bg-gray-600 px-3 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ProfileAvatar />
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-medium text-white truncate max-w-32">
                    {customerName || 'User'}
                  </p>
                  <p className="text-xs text-gray-300 truncate max-w-32">
                    {customerEmail}
                  </p>
                </div>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-gray-300 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{customerName}</p>
                    <p className="text-sm text-gray-500 truncate">{customerEmail}</p>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
                    View Profile
                  </Link>
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-400" />
                    Dashboard
                  </Link>
                  
                  <div className="border-t border-gray-100 mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 text-red-400" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`side-nav fixed top-0 right-0 h-full w-64 bg-gray-800 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 md:hidden z-50`}
      >
        <button
          onClick={toggleMenu}
          className="text-3xl text-white absolute top-4 right-4 hover:text-gray-300"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
        
        <div className="flex flex-col space-y-4 mt-16 px-6">
          {/* Mobile Navigation Links */}
          {navLinks.filter(link => link.id !== 'login').map((link) => (
            <NavLink
              key={link.id}
              id={link.id}
              label={link.label}
              to={link.to}
              className="text-white hover:text-blue-400 transition"
              onClick={scrollToSection}
            />
          ))}

          {/* Mobile Authentication Section */}
          <div className="border-t border-gray-600 pt-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center mb-4">
                  <ProfileAvatar />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-white">{customerName}</p>
                    <p className="text-xs text-gray-300">{customerEmail}</p>
                  </div>
                </div>
                
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="block text-white hover:text-blue-400 py-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-3" />
                  Profile
                </Link>
                
                <Link
                  to="/dashboard"
                  onClick={toggleMenu}
                  className="block text-white hover:text-blue-400 py-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faCog} className="mr-3" />
                  Dashboard
                </Link>
                
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="block w-full text-left text-red-400 hover:text-red-300 py-2 transition-colors"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors text-center"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full px-3 py-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchResults.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white text-black rounded shadow mt-1 max-h-48 overflow-auto z-50">
                {searchResults.map((item, index) => (
                  <li key={index} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                    {item.serviceName} - {item.location}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;