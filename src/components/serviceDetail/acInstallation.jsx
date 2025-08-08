import React from "react";

const ServicePackageCard = ({ title, price, originalPrice, duration, rating, reviews, features }) => {
  return (
    <div className="border-b py-4">
      <div className="text-green-700 font-semibold text-sm mb-1">PACKAGE</div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <div className="flex items-center text-sm text-gray-600 mt-1 mb-2">
            ⭐ {rating} ({reviews} reviews)
          </div>
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-lg font-semibold text-gray-800">₹{price}</span>
            <span className="line-through text-gray-500">₹{originalPrice}</span>
            <span className="text-gray-500">• {duration}</span>
          </div>
          <ul className="list-disc ml-5 text-sm text-gray-700 mb-2">
            {features.map((feature, index) => (
              <li key={index}>
                <span className="font-medium">{feature.label}:</span> {feature.value}
              </li>
            ))}
          </ul>
          <button className="border text-sm border-gray-600 px-3 py-1 rounded hover:bg-gray-100 mt-1">
            Edit your package
          </button>
        </div>

        <button className="text-purple-600 border border-purple-600 px-4 py-1 rounded hover:bg-purple-50 mt-1">
          Add
        </button>
      </div>
    </div>
  );
};

const SideCartPanel = () => {
  return (
    <div className="p-4 space-y-4 border rounded-lg shadow-md bg-white">
      <div className="border p-4 rounded text-center text-sm text-gray-700">
        🛒 <p>No items in your cart</p>
      </div>
      <div className="border p-4 rounded text-sm bg-green-50">
        <p className="font-medium text-green-700">Up to ₹150 Cashback</p>
        <p>Valid for Paytm UPI only</p>
        <button className="text-sm text-blue-600 mt-2 hover:underline">View More Offers</button>
      </div>
      <div className="border p-4 rounded">
        <h4 className="font-semibold mb-2">UC Promise</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✔ Verified Professionals</li>
          <li>✔ Hassle Free Booking</li>
          <li>✔ Transparent Pricing</li>
        </ul>
      </div>
    </div>
  );
};

const ServicePage = () => {
  const acService1 = {
    title: "AC Installation",
    price: 1499,
    originalPrice: 1799,
    duration: "60 mins",
    rating: 4.7,
    reviews: "24K",
    features: [
      { label: "Indoor unit", value: "Wall mount with stand" },
      { label: "Outdoor unit", value: "Proper drainage & gas check" },
    ],
  };

  const acService2 = {
    title: "Split AC Uninstallation",
    price: 699,
    originalPrice: 999,
    duration: "45 mins",
    rating: 4.5,
    reviews: "13K",
    features: [
      { label: "Indoor/Outdoor", value: "Safe unmounting & gas recovery" },
      { label: "Cleanup", value: "Basic area clean-up" },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <ServicePackageCard {...acService1} />
          <ServicePackageCard {...acService2} />
        </div>
        <div className="hidden md:block">
          <SideCartPanel />
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
