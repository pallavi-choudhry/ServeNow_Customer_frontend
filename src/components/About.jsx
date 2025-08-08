import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Header Section */}
    <section className="relative py-6 bg-gradient-to-r from-blue-600 to-blue-400 text-white text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/Frontend/Image/Homepage-Image.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in-down">About ServeNow</h2>
        <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 animate-fade-in">
          Discover who we are and how we connect you with trusted service providers for all your needs.
        </p>
        {/* <Link
          to="/book"
          className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-100 hover:text-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
        >
          Get Started
        </Link> */}
      </div>
    </section>

    {/* Mission Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h3 className="text-4xl font-bold text-center mb-8 text-gray-800 animate-fade-in-up">Our Mission</h3>
        <p className="text-lg text-gray-600 text-center max-w-3xl mx-auto leading-relaxed">
          At ServeNow, our mission is to revolutionize access to reliable, high-quality services. We connect customers with thoroughly vetted professionals—plumbers, electricians, mechanics, and more—ensuring convenience, trust, and excellence in every interaction.
        </p>
      </div>
    </section>

    {/* Why Choose Us Section */}
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800 animate-fade-in-up">Why Choose Us?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-4 text-blue-600">🛠</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-3">Trusted Providers</h4>
            <p className="text-gray-600">Our service providers are rigorously vetted to guarantee quality and reliability for every job.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-4 text-blue-600">⚡</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-3">Instant Booking</h4>
            <p className="text-gray-600">Book your services in just a few clicks, anytime, anywhere, with our seamless platform.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <div className="text-5xl mb-4 text-blue-600">📞</div>
            <h4 className="text-2xl font-semibold text-gray-800 mb-3">24/7 Support</h4>
            <p className="text-gray-600">Our dedicated support team is available around the clock to assist you.</p>
          </div>
        </div>
      </div>
    </section>

    {/* Our Values Section */}
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h3 className="text-4xl font-bold text-center mb-12 text-gray-800 animate-fade-in-up">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-4">
            <div className="text-4xl text-blue-600">🌟</div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">Excellence</h4>
              <p className="text-gray-600">We strive for the highest standards in every service we provide.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-4xl text-blue-600">🤝</div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">Trust</h4>
              <p className="text-gray-600">Building lasting relationships through transparency and reliability.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-4xl text-blue-600">🚀</div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">Innovation</h4>
              <p className="text-gray-600">Leveraging technology to make service booking effortless and efficient.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="text-4xl text-blue-600">💙</div>
            <div>
              <h4 className="text-2xl font-semibold text-gray-800 mb-2">Customer-Centric</h4>
              <p className="text-gray-600">Your satisfaction is at the heart of everything we do.</p>
            </div>
          </div>
        </div>
        {/* <div className="text-center mt-12">
          <Link
            to="/book"
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105"
          >
            Book a Service Now
          </Link>
        </div> */}
      </div>
    </section>
  </div>
);

export default AboutPage;