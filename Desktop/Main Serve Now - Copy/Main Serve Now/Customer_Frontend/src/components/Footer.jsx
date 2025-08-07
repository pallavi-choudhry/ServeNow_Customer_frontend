// src/components/Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const footerLinks = [
    { id: 'home', label: 'Home', to: '/' },
    // { id: 'services', label: 'Services', to: '/services' },
    { id: 'about', label: 'About', to: '/about' },
  
  ];

  const scrollToSection = (id) => {
    if (location.pathname === '/' && id === 'home') {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="text-xl font-semibold mb-4">About Serve Now</h4>
          <p className="text-gray-300">We connect users with trusted service providers for plumbing, electrical, mechanics, and more, ensuring fast and reliable service.</p>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            {footerLinks.map((link) => (
              <li key={link.id}>
                <Link
                  to={link.to}
                  onClick={() => scrollToSection(link.id)}
                  className="text-gray-300 hover:text-blue-400 transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
          <p className="text-gray-300">Email: support@servenow.com</p>
          <p className="text-gray-300">Phone: +1-800-SERVE-NOW</p>
          <p className="mt-2">
            <Link
              to="/contact"
              className="text-gray-300 hover:text-blue-400 transition"
            >
              Contact Form
            </Link>
          </p>
        </div>
      </div>
      <div className="mt-8 text-center text-gray-300">
        <p>© 2025 Serve Now. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;