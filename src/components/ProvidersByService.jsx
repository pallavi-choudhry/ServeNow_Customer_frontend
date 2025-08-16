import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const serviceTitleToSlug = (title) =>
	title
		.toLowerCase()
		.replace(/\//g, ' ') // avoid slashes in titles
		.replace(/\s+/g, '-');

const prettyServiceFromId = (id) => {
	const map = {
		'1': 'AC Installation',
		'2': 'Water Purifier Setup',
		'3': 'CCTV Installation',
		'4': 'Fan Repair',
		'5': 'Geyser Repair',
		'6': 'Switchboard Fix',
		'7': 'Switchboard & Socket Installation',
		'8': 'Tube Light/LED Fitting',
		'9': 'Ceiling Fan Repair',
		'10': 'Pipe Leakage Repair',
		'11': 'Wash Basin & Sink Installation',
		'12': 'Bathroom Fitting Installation',
		'13': 'Water Tank Cleaning',
		'14': 'Computer / Laptop Assembly',
		'15': 'RAM / Hard Disk / SSD Installation',
		'16': 'Monitor or Printer Setup',
	};
	return map[id] || 'Selected Service';
};

const ProvidersByService = () => {
	const { serviceId } = useParams();
	const navigate = useNavigate();
	const [providers, setProviders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [selectedProvider, setSelectedProvider] = useState(null);
	const [customer, setCustomer] = useState({ name: localStorage.getItem('customerName') || '', phone: '', email: localStorage.getItem('customerEmail') || '', address: '' });
	const [notes, setNotes] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const serviceName = useMemo(() => prettyServiceFromId(serviceId), [serviceId]);
	const serviceSlug = useMemo(() => serviceTitleToSlug(serviceName), [serviceName]);

	useEffect(() => {
		const fetchProviders = async () => {
			try {
				const res = await axios.get(`http://localhost:5000/api/providers`, {
					params: { service: serviceSlug },
				});
				setProviders(res.data);
			} catch (err) {
				setError('Failed to load providers');
			} finally {
				setLoading(false);
			}
		};
		fetchProviders();
	}, [serviceSlug]);

	const handleOpenBooking = (provider) => {
		setSelectedProvider(provider);
	};

	const handleCreateBooking = async () => {
		if (!customer.name || !customer.phone) return;
		setSubmitting(true);
		try {
			const res = await axios.post('http://localhost:5000/api/bookings', {
				customer,
				providerId: selectedProvider.id,
				service: serviceName,
				notes,
			});
			// Navigate to a simple confirmation screen
			navigate('/dashboard');
		} catch (err) {
			alert(err.response?.data?.message || 'Failed to create booking');
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-blue-50 pt-20 px-6">
			<h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">Providers for {serviceName}</h2>
			{loading ? (
				<p className="text-center">Loading...</p>
			) : error ? (
				<p className="text-center text-red-500">{error}</p>
			) : providers.length === 0 ? (
				<p className="text-center">No approved providers found for this service.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
					{providers.map((p) => (
						<div key={p.id} className="bg-white rounded-xl shadow p-4">
							<h4 className="text-xl font-semibold text-gray-800">{p.name}</h4>
							<p className="text-gray-600">Location: {p.location}</p>
							<p className="text-green-700 font-semibold">₹{p.price}</p>
							<button
								className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
								onClick={() => handleOpenBooking(p)}
							>
								Book with {p.name}
							</button>
						</div>
					))}
				</div>
			)}

			{selectedProvider && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
					<div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
						<h3 className="text-xl font-bold mb-4">Your Details</h3>
						<div className="space-y-3">
							<input
								type="text"
								placeholder="Full Name"
								className="w-full p-3 border rounded"
								value={customer.name}
								onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
							/>
							<input
								type="tel"
								placeholder="Phone Number"
								className="w-full p-3 border rounded"
								value={customer.phone}
								onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
							/>
							<input
								type="email"
								placeholder="Email (optional)"
								className="w-full p-3 border rounded"
								value={customer.email}
								onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
							/>
							<input
								type="text"
								placeholder="Address (optional)"
								className="w-full p-3 border rounded"
								value={customer.address}
								onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
							/>
							<textarea
								className="w-full p-3 border rounded"
								placeholder="Notes (optional)"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
							/>
						</div>
						<div className="flex gap-3 mt-4">
							<button
								className="bg-gray-500 text-white px-4 py-2 rounded"
								onClick={() => setSelectedProvider(null)}
							>
								Cancel
							</button>
							<button
								disabled={submitting || !customer.name || !customer.phone}
								className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-60"
								onClick={handleCreateBooking}
							>
								{submitting ? 'Booking...' : 'Confirm Booking'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ProvidersByService;