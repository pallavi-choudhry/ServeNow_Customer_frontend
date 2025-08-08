import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    { name: 'Plumber', icon: '🛠', description: 'Fix leaks, install pipes, and more with our trusted plumbers.' },
    { name: 'Electrician', icon: '💡', description: 'Expert electrical repairs and installations for your home.' },
    { name: 'Mechanic', icon: '🔧', description: 'Reliable vehicle maintenance and repair services.' },
    { name: 'Water Supplier', icon: '🚰', description: 'Timely delivery of clean and safe water.' },
    { name: 'General Store', icon: '🛒', description: 'Convenient access to everyday essentials.' },
    { name: 'Appliance Repair', icon: '🛒', description: 'Fix/install refrigerators, washing machines, ovens.' },
    { name: 'Printer/Office Equipment', icon: '🛒', description: 'Fix/install printers, scanners, copiers.' },
    { name: 'Carpentry', icon: '🛒', description: 'Assemble/repair furniture, doors, shelves.' },
    { name: 'Home Security', icon: '🛒', description: 'Set up/repair CCTV, smart locks, alarms.' },
    { name: 'Audio-Visua', icon: '🛒', description: 'Set up/repair speakers, projectors, screens.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 pt-20">
      {/* Header */}
      <section className="text-center mb-12">
        <h2 className="text-5xl font-extrabold text-blue-800 mb-4 animate-fade-in-down">Explore Our Services</h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Trusted professionals at your fingertips — quick, reliable, and ready to help.
        </p>
      </section>

      {/* Service Cards */}
      <section className="px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Link
              key={index}
              to={`/services/${service.name.toLowerCase()}`}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">{service.icon}</div>
              <h4 className="text-2xl font-bold text-blue-800 mb-2">{service.name}</h4>
              <p className="text-gray-600">{service.description}</p>
            </Link>
          ))}
        </div>

        {/* Book Now CTA */}
        <div className="text-center mt-16">
          <Link
            to="/register"
            className="inline-block bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all"
          >
            Book a Service Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      {/* <footer className="text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} ServeNow. All rights reserved.
      </footer> */}
    </div>
  );
};

export default Services;

