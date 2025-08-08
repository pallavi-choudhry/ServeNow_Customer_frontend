import { Routes, Route, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import Services from './components/Services';
// import BookingPage from './components/BookingPage';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Footer from './components/Footer';
// import BookingPage from './components/BookingPage';
import Dashboard from './components/Dashboard';
import About from './components/About';
// import serviceDetail from './components/serviceDetail/acInstallation';

function App() {
  const location = useLocation();

  // Define the routes where Navbar should be hidden
  const hideNavbarRoutes = ['/login', '/register', '/forgotpassword'];

  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname.toLowerCase());

  return (
    <div>
      {/* <About /> */}
      {/* Conditionally render Navbar */}
      {shouldShowNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<Services />} />
        {/* <Route path="/book" element={<Booking />} /> */}
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/footer" element={<Footer />} />
        {/* <Route path="/bookingpage" element={<BookingPage />} /> */}
        <Route path="/services/:serviceId" element={<serviceDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>

      {/* Optionally show Footer only on homepage */}
      {location.pathname === '/' && <Footer />}
    </div>
    // /* <About /
  );
}

export default App;
