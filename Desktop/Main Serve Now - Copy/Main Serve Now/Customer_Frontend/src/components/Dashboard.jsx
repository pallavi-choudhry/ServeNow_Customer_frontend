import React, { useState } from "react";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterService, setFilterService] = useState("all");
  const [filterRating, setFilterRating] = useState("");
  const [activeTab, setActiveTab] = useState("home");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    serviceDetails: "",
    scheduledTime: "",
    emergency: false,
  });

  // Sample service provider data for ServeNow
  const providers = [
    {
      id: 1,
      name: "John's Plumbing",
      service: "plumber",
      location: "Bangalore",
      rating: 4.8,
      price: 500,
      available: true,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      name: "Elite Electricals",
      service: "electrician",
      location: "Mumbai",
      rating: 4.5,
      price: 600,
      available: true,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Quick Fix Mechanics",
      service: "mechanic",
      location: "Delhi",
      rating: 4.2,
      price: 700,
      available: false,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      name: "Pure Water Suppliers",
      service: "water supplier",
      location: "Chennai",
      rating: 4.9,
      price: 300,
      available: true,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 5,
      name: "General Store Hub",
      service: "general store",
      location: "Pune",
      rating: 4.0,
      price: 200,
      available: true,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 6,
      name: "City Plumbers",
      service: "plumber",
      location: "Hyderabad",
      rating: 4.7,
      price: 550,
      available: false,
      image: "https://via.placeholder.com/150",
    },
  ];

  // Sample booking data
  const bookings = [
    {
      id: 1,
      customerId: "cust1",
      providerId: 1,
      serviceType: "plumber",
      status: "Scheduled",
      scheduledTime: "2025-06-20T10:00:00Z",
      price: 500,
      emergency: false,
    },
    {
      id: 2,
      customerId: "cust1",
      providerId: 2,
      serviceType: "electrician",
      status: "In Progress",
      scheduledTime: "2025-06-19T14:00:00Z",
      price: 600,
      emergency: true,
    },
  ];

  // Filter providers
  const filteredProviders = providers.filter(
    (provider) =>
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterService === "all" || provider.service === filterService) &&
      (filterRating === "" || provider.rating >= parseFloat(filterRating))
  );

  // Handle booking form submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    // Placeholder for API call to submit booking
    console.log("Booking submitted:", { ...bookingForm, providerId: selectedProvider?.id });
    setShowBookingModal(false);
    setBookingForm({ serviceDetails: "", scheduledTime: "", emergency: false });
    setSelectedProvider(null);
  };

  // Home View
  const HomeView = () => (
    <section className="p-6 bg-gray-100">
      <div className="flex space-x-4 mb-6">
        <input
          type="text"
          placeholder="Search providers..."
          className="p-2 border rounded w-1/3"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-2 border rounded"
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
        >
          <option value="all">All Services</option>
          <option value="plumber">Plumber</option>
          <option value="electrician">Electrician</option>
          <option value="mechanic">Mechanic</option>
          <option value="water supplier">Water Supplier</option>
          <option value="general store">General Store</option>
        </select>
        <input
          type="number"
          placeholder="Min Rating (0-5)"
          className="p-2 border rounded"
          value={filterRating}
          onChange={(e) => setFilterRating(e.target.value)}
        />
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Emergency Booking
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <p className="text-gray-600">Map View (Track Provider Location)</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((provider) => (
          <div key={provider.id} className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition">
            <img src={provider.image} alt={provider.name} className="w-full h-40 object-cover rounded mb-4" />
            <h3 className="text-lg font-semibold">{provider.name}</h3>
            <p className="text-gray-600 capitalize">Service: {provider.service}</p>
            <p className="text-gray-600">{provider.location}</p>
            <p className="text-yellow-500 font-bold">Rating: {provider.rating}/5</p>
            <p className="text-green-600 font-bold">₹{provider.price.toLocaleString()}/hr</p>
            <p className="text-sm">{provider.available ? "Available" : "Unavailable"}</p>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => {
                setSelectedProvider(provider);
                setShowBookingModal(true);
              }}
            >
              Book Now
            </button>
            <button className="mt-2 ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              View Reviews
            </button>
          </div>
        ))}
      </section>
    </section>
  );

  // Profile View
  const BookingsView = () => (
    <section className="p-6 bg-gray-100">
      <h3 className="text-lg font-semibold mb-4">My Bookings</h3>
      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white p-4 rounded-lg shadow mb-4">
          <p className="text-gray-600 capitalize">Service: {booking.serviceType}</p>
          <p className="text-gray-600">Status: {booking.status}</p>
          <p className="text-gray-600">Scheduled: {new Date(booking.scheduledTime).toLocaleString()}</p>
          <p className="text-green-600 font-bold">₹{booking.price.toLocaleString()}</p>
          {booking.emergency && (
            <p className="text-red-500 font-bold">Emergency Booking</p>
          )}
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Rate Service
          </button>
        </div>
      ))}
    </section>
  );

  // Profile View
  const ProfileView = () => (
    <section className="p-6 bg-gray-100">
      <h3 className="text-lg font-semibold mb-4">Profile</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Name: John Doe</p>
        <p className="text-gray-600">Email: user@example.com</p>
        <p className="text-gray-600">Location: Bangalore</p>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Edit Profile
        </button>
      </div>
    </section>
  );

  // Payments View
  const PaymentsView = () => (
    <section className="p-6 bg-gray-100">
      <h3 className="text-lg font-semibold mb-4">Payments</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Payment History Placeholder (Razorpay/Stripe Integration)</p>
        {bookings.map((booking) => (
          <div key={booking.id} className="mt-2">
            <p className="text-gray-600">Service: {booking.serviceType}</p>
            <p className="text-green-600 font-bold">₹{booking.price.toLocaleString()}</p>
            <p className="text-gray-600">Status: {booking.paymentStatus || "Completed"}</p>
          </div>
        ))}
      </div>
    </section>
  );

  // Messages View
  const MessagesView = () => (
    <section className="p-6 bg-gray-100">
      <h3 className="text-lg font-semibold mb-4">Messages</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Chat Placeholder (Socket.IO Integration)</p>
      </div>
    </section>
  );

  // Support View
  const SupportView = () => (
    <section className="p-6 bg-gray-100">
      <h3 className="text-lg font-semibold mb-4">Support</h3>
      <div className="bg-white p-4 rounded-lg shadow">
        <p className="text-gray-600">Contact Support: support@servenow.com</p>
        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Submit Ticket
        </button>
      </div>
    </section>
  );

  // Booking Modal
  const BookingModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow max-w-md w-full">
        <h3 className="text-lg font-semibold mb-4">Book {selectedProvider?.name}</h3>
        <div className="space-y-4">
          <div>
            <label className="text-gray-600 mb-1 block">Service Details</label>
            <textarea
              className="p-2 border rounded w-full"
              placeholder="Describe your service needs..."
              value={bookingForm.serviceDetails}
              onChange={(e) => setBookingForm({ ...bookingForm, serviceDetails: e.target.value })}
            />
          </div>
          <div>
            <label className="text-gray-600 mb-1 block">Scheduled Time</label>
            <input
              type="datetime-local"
              className="p-2 border rounded w-full"
              value={bookingForm.scheduledTime}
              onChange={(e) => setBookingForm({ ...bookingForm, scheduledTime: e.target.value })}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="mr-2"
              checked={bookingForm.emergency}
              onChange={(e) => setBookingForm({ ...bookingForm, emergency: e.target.checked })}
            />
            <label className="text-gray-600">Emergency Booking</label>
          </div>
          <p className="text-green-600 font-bold">Price: ₹{selectedProvider?.price.toLocaleString()}/hr</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleBookingSubmit}
          >
            Confirm Booking
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onClick={() => setShowBookingModal(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">ServeNow Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            {["home", "bookings", "profile", "payments", "messages", "support"].map((tab) => (
              <li key={tab}>
                <a
                  href="#"
                  className={`hover:text-gray-300 flex items-center ${activeTab === tab ? "text-gray-100 font-semibold" : ""}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab(tab);
                  }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  {tab === "bookings" && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">2</span>
                  )}
                  {tab === "messages" && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">3</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-700 text-white p-6 text-2xl font-semibold">
          Service Provider Dashboard
        </header>

        {/* Content */}
        {activeTab === "home" && <HomeView />}
        {activeTab === "bookings" && <BookingsView />}
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "payments" && <PaymentsView />}
        {activeTab === "messages" && <MessagesView />}
        {activeTab === "support" && <SupportView />}
        {showBookingModal && <BookingModal />}
      </main>
    </div>
  );
};

export default Dashboard;

