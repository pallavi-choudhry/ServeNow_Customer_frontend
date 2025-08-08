import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  const location = useLocation();

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

  const navLinks = [
    { id: 'home', label: 'Home', to: '/' },
    {
      id: 'login',
      label: 'Login',
      to: '/login',
      className:
        'bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition',
    },
  ];

  // 🌍 Get current city from backend
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const response = await fetch("http://localhost:5000/api/reverse-geocode", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ latitude, longitude }),
          });
          const data = await response.json();
          setLocationName(data.city || "Unknown location");
        } catch (error) {
          console.error("Error fetching location:", error);
          setLocationName("Location not found");
        }
      }, (err) => {
        console.warn(err.message);
        setLocationName("Permission denied");
      });
    } else {
      setLocationName("Geolocation not supported");
    }
  }, []);

  // 🔍 Fetch search results when user types
  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/provider-services/search-by-name?name=${searchTerm}`);
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

    const delayDebounce = setTimeout(fetchResults, 300); // debounce search

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

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
              className="w-full px-3 py-2 rounded text-black"
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
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.id}>
              <NavLink
                id={link.id}
                label={link.label}
                to={link.to}
                className={link.className}
                onClick={scrollToSection}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`side-nav fixed top-0 right-0 h-full w-64 bg-gray-800 transform ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 md:hidden z-50`}
      >
        <Link
          to="#"
          onClick={toggleMenu}
          className="text-3xl text-white absolute top-4 right-4"
        >
          ×
        </Link>
        <div className="flex flex-col space-y-4 mt-16 px-6">
          {navLinks.map((link) => (
            <NavLink
              key={link.id}
              id={link.id}
              label={link.label}
              to={link.to}
              className="text-white hover:text-blue-400 transition"
              onClick={scrollToSection}
            />
          ))}

          {/* Mobile Search */}
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search services..."
              className="w-full px-3 py-2 rounded text-black"
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
