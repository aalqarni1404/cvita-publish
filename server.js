const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Stripe = require('stripe');

// Initialize Stripe with secret key from environment or a placeholder.
const stripeSecret = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
let stripe;
try {
  stripe = Stripe(stripeSecret);
} catch (err) {
  // If stripe cannot be initialized (e.g. missing key), leave undefined.
  console.warn('Stripe initialisation failed:', err.message);
}

const app = express();
app.use(cors());
app.use(express.json());

// In-memory example data. In a real application you would query a database.
const metrics = {
  users: 1000,
  marketplaceItems: 500,
  recruiters: 50,
};

const payments = [
  { description: 'Course sale', amount: 49, date: '2026-02-02' },
  { description: 'Template sale', amount: 19, date: '2026-02-05' },
  { description: 'AI credit purchase', amount: 4, date: '2026-02-08' },
];

// Endpoint: GET /api/admin/metrics
// Returns overall platform metrics for admins.
app.get('/api/admin/metrics', (req, res) => {
  res.json(metrics);
});

// Endpoint: GET /api/payments
// Returns a list of recent transactions. In a real app this would query your database.
app.get('/api/payments', (req, res) => {
  res.json(payments);
});

// Endpoint: POST /api/payments/checkout
// Creates a payment intent via Stripe. Expects { amount, description } in the body.
app.post('/api/payments/checkout', async (req, res) => {
  const { amount, description } = req.body;
  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }
  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'usd',
      metadata: { description: description || 'CVita payment' },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Endpoint: GET /api/dashboard
// Returns placeholder dashboard data for a user.
app.get('/api/dashboard', (req, res) => {
  res.json({
    sections: [
      { id: 'education', title: 'Education', items: [] },
      { id: 'experience', title: 'Experience', items: [] },
      { id: 'skills', title: 'Skills', items: [] },
    ],
    aiTips: [
      'Consider adding recent projects to your Experience section.',
      'Highlight leadership roles or certifications.',
    ],
  });
});

// Endpoint: GET /api/recruiter
// Returns placeholder candidate data for recruiters.
app.get('/api/recruiter', (req, res) => {
  res.json({
    candidates: [
      { name: 'Jane Doe', title: 'Product Designer', location: 'New York, USA' },
      { name: 'John Smith', title: 'Data Analyst', location: 'San Francisco, USA' },
    ],
  });
});

// Start the server.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CVita API server listening on port ${PORT}`);
});