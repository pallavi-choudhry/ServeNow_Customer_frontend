import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import About from '../components/About';

// Images
import acImage from '../components/image/Ac Repair.jpg';
import washBasin from '../components/image/wash_Basin.jpg';
import purifierImage from '../components/image/waterpurifier.webp';
import cctvImage from '../components/image/cctv.jpg';
import fanImage from '../components/image/Fan Repair.jpg';
import geyserImage from '../components/image/geyser-repair.webp';
import plumberImage from '../components/image/Plumber repair.jpg';
import installationImg from '../components/image/Installation1.jpg';

// ✅ Simple login check using localStorage flag
const isLoggedIn = () => localStorage.getItem('user') === 'true';

// Modal
const LoginPromptModal = ({ onClose, onLogin }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-6 text-center max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-3">Login Required</h2>
        <p className="text-gray-600 mb-4">Please login or sign up to book this service.</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onLogin}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <Link to="/signup">
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded hover:bg-blue-50">
              Sign Up
            </button>
          </Link>
        </div>
        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

// Services data
const serviceCategories = [
  {
    category: 'Installation Services',
    services: [
      { id: 1, title: 'AC Installation', image: acImage },
      { id: 2, title: 'Water Purifier Setup', image: purifierImage },
      { id: 3, title: 'CCTV Installation', image: cctvImage },
    ],
  },
  {
    category: 'Repair & Maintenance',
    services: [
      { id: 4, title: 'Fan Repair', image: fanImage },
      { id: 5, title: 'Geyser Repair', image: geyserImage },
      { id: 6, title: 'Switchboard Fix', image: acImage },
    ],
  },
  {
    category: 'Electrical Services',
    services: [
      { id: 7, title: 'Switchboard & Socket Installation', image: acImage },
      { id: 8, title: 'Tube Light/LED Fitting', image: purifierImage },
      { id: 9, title: 'Ceiling Fan Repair', image: acImage },
    ],
  },
  {
    category: 'Plumbing Services',
    services: [
      { id: 10, title: 'Pipe Leakage Repair', image: plumberImage },
      { id: 11, title: 'Wash Basin & Sink Installation', image: washBasin },
      { id: 12, title: 'Bathroom Fitting Installation', image: acImage },
      { id: 13, title: 'Water Tank Cleaning', image: acImage },
    ],
  },
  {
    category: 'Computer & Electronic Hardware Services',
    services: [
      { id: 14, title: 'Computer / Laptop Assembly', image: acImage },
      { id: 15, title: 'RAM / Hard Disk / SSD Installation', image: purifierImage },
      { id: 16, title: 'Monitor or Printer Setup', image: acImage },
    ],
  },
];

// Home component
const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();

 const handleBookNow = (service) => {
    if (isLoggedIn()) {
      localStorage.setItem("selectedService", JSON.stringify(service));
      navigate("/login"); // ✅ go directly to booking page if logged in
    } else {
      setSelectedService(service);
      setShowModal(false); // ✅ show popup modal if not logged in
    }
  };

  const handleLoginRedirect = () => {
    if (selectedService) {
      localStorage.setItem("selectedService", JSON.stringify(selectedService));
    }
    setShowModal(true);
    navigate("/login", { state: { from: "/bookingpage" } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 text-gray-800 p-9">
      <header className="text-center py-12">
        <h1 className="text-5xl font-bold text-blue-800 mb-6">Welcome to ServeNow</h1>
        <p className="text-lg">All-in-one doorstep hardware and service solutions</p>
      </header>

      <section className="flex flex-col md:flex-row items-center justify-between gap-8 mt-06 max-w-6xl mx-auto">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-4 text-blue-900">Professional Installation Services</h2>
          <p className="text-gray-700 mb-4">
            We are working on delivering comprehensive hardware services, including the installation, repair, and maintenance of electrical appliances and systems for both residential and commercial clients.
          </p>
        </div>

        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          <img src={installationImg} alt="Installation 1" className="rounded-lg shadow-md object-cover h-40 w-full" />
          <img src={installationImg} alt="Installation 2" className="rounded-lg shadow-md object-cover h-40 w-full" />
          <img src={installationImg} alt="Installation 3" className="rounded-lg shadow-md object-cover h-40 w-full" />
          <img src={installationImg} alt="Installation 4" className="rounded-lg shadow-md object-cover h-40 w-full" />
        </div>
      </section>

      {serviceCategories.map((categoryBlock, index) => (
        <section key={index} className="mb-12">
          <h2 className="text-3xl font-semibold text-black mb-6">{categoryBlock.category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryBlock.services.map((service) => (
              <div
                key={service.id}
                className="relative h-64 rounded-2xl shadow-md overflow-hidden group"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 p-4 flex flex-col justify-between text-white text-center">
                  <div className="mt-auto">
                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                  </div>
                  <div className="flex justify-center gap-3 mt-4">
                    <button
                      onClick={() => handleBookNow(service)}
                      className="bg-blue-600 px-4 py-2 rounded-full text-sm hover:bg-blue-700 transition"
                    >
                      Book Now
                    </button>
                    <Link to={`/services/${service.id}`}>
                      <button className="border border-white px-4 py-2 rounded-full text-sm hover:bg-white hover:text-black transition">
                        More
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {/* ✅ Show login popup if not logged in */}
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
          onLogin={handleLoginRedirect}
        />
      )}

      <About />
    </div>
  );
};

export default Home;
