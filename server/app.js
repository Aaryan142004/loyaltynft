require('dotenv').config({ path: '../.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const Request = require('./models/Request');

const app = express();

// ✅ CORS Setup — allow localhost:3000 (dev) and vercel.app (prod)
const allowedOrigins = [
  'http://localhost:3000',
  'https://loyaltynft.vercel.app',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// ✅ Stripe webhook route (must be before express.json())
app.post('/api/user/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('✅ Webhook verified:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id || session.metadata?.userId;

      if (!userId) {
        console.error('❌ No user ID in Stripe session');
        return res.status(400).send('No user ID found');
      }

      const amountUsd = session.amount_total / 100;
      console.log(`✅ Creating payment request for user ${userId} - $${amountUsd}`);

      await Request.create({
        type: 'payment',
        user: userId,
        amount: amountUsd,
        status: 'pending'
      });

      console.log('✅ Payment request saved to DB');
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Webhook error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// ✅ Use JSON for all other routes
app.use(express.json());

// ✅ MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
