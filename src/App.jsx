// App.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import Services from './components/Services';
import ServiceProviders from './components/ServiceProviders';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
// ❌ Remove this: import ServiceList from './components/Services';

const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ['/login', '/register', '/forgotpassword'];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname.toLowerCase());

  return (
    <div>
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        {/* ✅ Single, consistent dynamic route */}
        <Route path="/services/:serviceType" element={<ServiceProviders />} />

        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {location.pathname === '/' && <Footer />}
    </div>
  );
};

export default App;
