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

// Sample dashboard data for a professional. In a real app this would be tied to the
// authenticated user. Includes CV sections, available AI credits, an overall score
// and some AI suggestions.
const dashboardData = {
  user: {
    name: 'Alex Morgan',
    title: 'Senior Product Designer',
  },
  aiCredits: 5,
  aiScore: 82,
  sections: [
    { id: 'education', title: 'Education', items: [
      { school: 'University of Example', degree: 'B.Sc. Design', year: '2018' },
    ] },
    { id: 'experience', title: 'Experience', items: [
      { company: 'DesignCo', role: 'Product Designer', dates: '2019–present' },
      { company: 'CreativeWorks', role: 'UX Intern', dates: '2017–2018' },
    ] },
    { id: 'skills', title: 'Skills', items: ['UI/UX Design', 'Figma', 'CSS'] },
  ],
  aiTips: [
    'Consider adding recent projects to your Experience section.',
    'Highlight leadership roles or certifications.',
  ],
};

// Sample candidates for recruiters. In a real app this would come from a
// database and include many more fields. Each candidate has an ID so they
// can be unlocked. A recruiter’s available credits would also be tracked
// server-side.
const candidateData = [
  {
    id: 1,
    name: 'Jane Doe',
    title: 'Product Designer',
    location: 'New York, USA',
    match: 92,
    status: 'Open',
    tags: ['ProductDesign', 'UI', 'UX', 'Figma'],
    unlocked: false,
  },
  {
    id: 2,
    name: 'John Smith',
    title: 'Data Analyst',
    location: 'San Francisco, USA',
    match: 88,
    status: 'Networking',
    tags: ['DataScience', 'Python', 'SQL', 'Tableau'],
    unlocked: false,
  },
];

// Track which candidates have been unlocked by the recruiter. This is in-memory
// only; a persistent store would be needed for a production application.
const unlockedCandidates = new Set();

// Endpoint: GET /api/dashboard
// Returns dashboard data for the current user.
app.get('/api/dashboard', (req, res) => {
  res.json(dashboardData);
});

// Endpoint: GET /api/recruiter
// Returns the list of candidates with an `unlocked` flag. In a real app the
// unlocked status would depend on the recruiter’s account.
app.get('/api/recruiter', (req, res) => {
  const candidates = candidateData.map(c => ({
    ...c,
    unlocked: unlockedCandidates.has(c.id),
  }));
  res.json({ candidates });
});

// Endpoint: POST /api/recruiter/unlock
// Unlocks a candidate for the recruiter. Expects { candidateId } in the body.
app.post('/api/recruiter/unlock', (req, res) => {
  const { candidateId } = req.body;
  const id = Number(candidateId);
  if (!candidateData.find(c => c.id === id)) {
    return res.status(404).json({ error: 'Candidate not found' });
  }
  unlockedCandidates.add(id);
  res.json({ success: true, id });
});

// Start the server.
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CVita API server listening on port ${PORT}`);
});