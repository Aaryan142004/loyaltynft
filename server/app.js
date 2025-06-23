require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const Request = require('./models/Request');

const app = express();

// ✅ CORS Setup (allow both local and Vercel frontend)
const allowedOrigins = [
  'http://localhost:3000',
  'https://loyaltynft.vercel.app',
  'https://loyaltynft.vercel.app/'
];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Fallback manual CORS headers (just in case)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://loyaltynft.vercel.app");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

// ✅ Use raw body for Stripe webhook only
app.use((req, res, next) => {
  if (req.originalUrl === '/api/user/webhook') {
    express.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});

// ✅ Stripe webhook for payment capture
app.post('/api/user/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata?.userId;

      if (!userId) return res.status(400).send('No user ID found');

      const amountUsd = session.amount_total / 100;
      await Request.create({
        type: 'payment',
        user: userId,
        amount: amountUsd,
        status: 'pending'
      });
    }

    res.status(200).json({ received: true });
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Debug env logs (for Render troubleshooting)
console.log('✅ Backend ENV loaded:', {
  PORT: process.env.PORT,
  MONGO_URI: !!process.env.MONGO_URI,
  STRIPE_KEY: !!process.env.STRIPE_SECRET_KEY,
  RENDER: !!process.env.RENDER,
});

// ✅ Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
