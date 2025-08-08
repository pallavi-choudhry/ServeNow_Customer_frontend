// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// const BookingPage = () => {
//   const [service, setService] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const savedService = localStorage.getItem('selectedService');
//     if (savedService) {
//       setService(JSON.parse(savedService));
//     } else {
//       navigate('/'); // redirect to home if no service
//     }
//   }, [navigate]);

//   const handleConfirmBooking = () => {
//     alert('Booking confirmed!');
//     localStorage.removeItem('selectedService');
//     navigate('/'); // redirect to home or booking history
//   };

//   return (
//     <div className="min-h-screen bg-blue-50 p-8">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
//         Service Booking
//       </h1>

//       {service ? (
//         <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
//           <h2 className="text-2xl font-semibold mb-3 text-gray-800">
//             {service.title}
//           </h2>

//           {service.image && (
//             <img
//               src={service.image}
//               alt={service.title}
//               className="w-full h-64 object-cover rounded mb-4"
//             />
//           )}

//           <p className="text-gray-700 mb-2">
//             <strong>Service ID:</strong> {service.id}
//           </p>
//           <p className="text-gray-700 mb-2">
//             <strong>Provider:</strong> {service.providerName || 'N/A'}
//           </p>
//           <p className="text-gray-700 mb-2">
//             <strong>Price:</strong> ₹{service.price || 'N/A'}
//           </p>

//           <p className="text-gray-700 mb-4">
//             <strong>Description:</strong> {service.description || 'No description provided.'}
//           </p>

//           {service.features && (
//             <div className="mb-4">
//               <h3 className="text-lg font-semibold text-gray-700">What's Included:</h3>
//               <ul className="list-disc list-inside text-gray-600">
//                 {service.features.map((item, idx) => (
//                   <li key={idx}>{item}</li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {service.duration && (
//             <p className="text-gray-700 mb-1">
//               <strong>Estimated Time:</strong> {service.duration}
//             </p>
//           )}

//           {service.warranty && (
//             <p className="text-gray-700 mb-1">
//               <strong>Warranty:</strong> {service.warranty}
//             </p>
//           )}

//           {service.contact && (
//             <div className="mt-4">
//               <h3 className="text-lg font-semibold text-gray-700">Contact Details:</h3>
//               {service.contact.phone && (
//                 <p className="text-gray-600">📞 {service.contact.phone}</p>
//               )}
//               {service.contact.email && (
//                 <p className="text-gray-600">✉️ {service.contact.email}</p>
//               )}
//             </div>
//           )}

//           <button
//             onClick={handleConfirmBooking}
//             className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full"
//           >
//             Confirm Booking
//           </button>
//         </div>
//       ) : (
//         <div className="text-center text-gray-600 text-lg">
//           <p>Loading selected service...</p>
//         </div>
//       )}
//     </div>
//   );
// };
// export default BookingPage;