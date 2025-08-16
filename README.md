# Serve Now - Customer Booking Flow

Quickstart:

- Install deps: `npm install`
- Start API server: `npm run start` (starts Express on http://localhost:5000)
- Start frontend: `npm run dev` (starts Vite on http://localhost:5173)

Key Endpoints (temporary in-memory):
- POST /api/admin/login
- POST /api/customer/register
- GET /api/providers?service=<slug>
- GET /api/providers/:id
- POST /api/bookings
- GET /api/bookings

Flow:
- On the homepage, click Providers or Book Now to view providers for a given service.
- Select a provider; a modal appears to enter customer details (name, phone, optional email/address/notes).
- Confirm booking; you are redirected to the Dashboard where bookings display including customer info.
