import express from 'express';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 5000;

// Basic CORS (no dependency)
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
	if (req.method === 'OPTIONS') {
		return res.sendStatus(200);
	}
	next();
});

app.use(express.json());

// In-memory data stores
const admins = [
	{
		email: 'admin@servenow.com',
		passwordHash: bcrypt.hashSync('admin123', 10),
		role: 'admin',
	},
];

const customers = [];

// Service slugs helper
const slugify = (text) =>
	text
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

// Seed providers (approved)
const providers = [
	{ id: 'p1', name: "John's Cooling Services", services: ['ac-installation', 'fan-repair'], location: 'Bangalore', price: 800, approved: true },
	{ id: 'p2', name: 'Elite CCTV & Security', services: ['cctv-installation'], location: 'Mumbai', price: 1200, approved: true },
	{ id: 'p3', name: 'Pure Water Experts', services: ['water-purifier-setup'], location: 'Pune', price: 700, approved: true },
	{ id: 'p4', name: 'PlumbRight', services: ['pipe-leakage-repair', 'wash-basin-sink-installation', 'water-tank-cleaning'], location: 'Hyderabad', price: 600, approved: true },
	{ id: 'p5', name: 'Spark Electric Works', services: ['switchboard-fix', 'switchboard-socket-installation', 'tube-light-led-fitting', 'ceiling-fan-repair'], location: 'Delhi', price: 650, approved: true },
	{ id: 'p6', name: 'ComputeCare', services: ['computer-laptop-assembly', 'ram-hard-disk-ssd-installation', 'monitor-or-printer-setup'], location: 'Chennai', price: 900, approved: true },
	{ id: 'p7', name: 'Heat & Geyser Care', services: ['geyser-repair'], location: 'Bangalore', price: 750, approved: true },
];

const bookings = [];

// Admin login
app.post('/api/admin/login', async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res.status(400).json({ message: 'Email and password are required' });
		}
		const admin = admins.find((a) => a.email === email);
		if (!admin) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		const ok = await bcrypt.compare(password, admin.passwordHash);
		if (!ok) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}
		return res.status(200).json({ message: 'Login successful', role: 'admin' });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

// Customer register
app.post('/api/customer/register', async (req, res) => {
	try {
		const { name, email, phone, password } = req.body;
		if (!name || !email || !phone || !password) {
			return res.status(400).json({ message: 'All fields are required' });
		}
		const exists = customers.find((c) => c.email === email);
		if (exists) {
			return res.status(409).json({ message: 'Email already registered' });
		}
		const passwordHash = await bcrypt.hash(password, 10);
		const customer = { id: `c${customers.length + 1}`, name, email, phone, passwordHash, role: 'customer' };
		customers.push(customer);
		return res.status(201).json({ id: customer.id, name, email, phone });
	} catch (err) {
		return res.status(500).json({ message: 'Server error' });
	}
});

// Providers list (optional filter by service slug)
app.get('/api/providers', (req, res) => {
	const { service } = req.query;
	let list = providers.filter((p) => p.approved);
	if (service) {
		const s = slugify(service);
		list = list.filter((p) => p.services.includes(s));
	}
	return res.json(list);
});

// Provider by id
app.get('/api/providers/:id', (req, res) => {
	const provider = providers.find((p) => p.id === req.params.id && p.approved);
	if (!provider) {
		return res.status(404).json({ message: 'Provider not found' });
	}
	return res.json(provider);
});

// Create booking
app.post('/api/bookings', (req, res) => {
	const { customer, providerId, service, scheduledTime, notes } = req.body;
	if (!customer || !customer.name || !customer.phone || !providerId || !service) {
		return res.status(400).json({ message: 'Missing required booking fields' });
	}
	const provider = providers.find((p) => p.id === providerId && p.approved);
	if (!provider) {
		return res.status(404).json({ message: 'Provider not found or not approved' });
	}
	const booking = {
		id: `b${bookings.length + 1}`,
		serviceType: slugify(service),
		providerId: provider.id,
		providerName: provider.name,
		status: 'Scheduled',
		scheduledTime: scheduledTime || new Date().toISOString(),
		price: provider.price,
		emergency: false,
		customer: {
			name: customer.name,
			phone: customer.phone,
			email: customer.email || '',
			address: customer.address || '',
			notes: notes || '',
		},
		createdAt: new Date().toISOString(),
	};
	bookings.push(booking);
	return res.status(201).json(booking);
});

// List bookings (optionally by customer email or provider id)
app.get('/api/bookings', (req, res) => {
	const { customerEmail, providerId } = req.query;
	let list = [...bookings];
	if (customerEmail) {
		list = list.filter((b) => (b.customer.email || '').toLowerCase() === customerEmail.toLowerCase());
	}
	if (providerId) {
		list = list.filter((b) => b.providerId === providerId);
	}
	return res.json(list);
});

app.get('/', (_req, res) => {
	res.send('ServeNow API is running');
});

app.listen(PORT, () => {
	console.log(`API server listening on http://localhost:${PORT}`);
});