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

// ✅ CORS Setup
const allowedOrigins = [
  'http://localhost:3000',
  'https://loyaltynft.vercel.app',
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Stripe webhook first (raw body)
app.post('/api/user/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
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
    return res.status(400).send(Webhook Error: ${err.message});
  }
});

// ✅ JSON parser (after webhook)
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Server port (important for Render!)
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(🚀 Server running on port ${PORT});
});