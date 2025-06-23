require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const Request = require('../models/Request');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Middleware to auth user
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    const { id, role } = jwt.verify(token, process.env.JWT_SECRET);
    if (role !== 'user') throw Error();
    req.userId = id;
    next();
  } catch {
    res.status(403).json({ error: 'Forbidden' });
  }
};

// ✅ Request mint
router.post('/request-mint', auth, async (req, res) => {
  const reqDoc = await Request.create({ type: 'mint', user: req.userId });
  res.json({ message: 'Mint request sent' });
});

// ✅ Stripe Checkout
router.post('/create-checkout', auth, async (req, res) => {
  const { amount } = req.body;
  const success_url = `${process.env.SUCCESS_URL}?session_id={CHECKOUT_SESSION_ID}`;
  const cancel_url = process.env.CANCEL_URL;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Loyalty Points' },
          unit_amount: amount * 100
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url,
      cancel_url,
      client_reference_id: req.userId,
      metadata: {
        userId: req.userId
      }
    });

    console.log('Stripe session created:', session.id);
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// ✅ NFT Status (with logs)
router.get('/nft-status', auth, async (req, res) => {
  try {
    const { web3, contract } = require('../utils/web3');
    const axios = require('axios');
    const User = require('../models/User');

    console.log("🔐 Connected to RPC:", process.env.PROVIDER_URL);

    const user = await User.findById(req.userId);
    if (!user || !user.wallet) {
      console.error("❌ No wallet found for user");
      return res.status(400).json({ error: 'No wallet associated' });
    }

    console.log("📥 Checking balance for wallet:", user.wallet);

    const balance = await contract.methods.balanceOf(user.wallet).call();
    console.log("💰 NFT Balance:", balance);

    if (Number(balance) === 0) return res.json({ hasNFT: false });

    const maxTokenId = await contract.methods.tokenCounter().call();
    console.log("🔢 tokenCounter:", maxTokenId);

    for (let i = Number(maxTokenId) - 1; i > 0; i--) {
      try {
        const owner = await contract.methods.ownerOf(i).call();
        if (owner.toLowerCase() === user.wallet.toLowerCase()) {
          const points = await contract.methods.getPoints(i).call();
          const tokenURI = await contract.methods.tokenURI(i).call();
          let image = null;
          try {
            const meta = await axios.get(tokenURI);
            image = meta.data?.image || null;
          } catch (fetchErr) {
            console.warn(`⚠️ Could not fetch tokenURI metadata for token ${i}:`, fetchErr.message);
          }
          return res.json({
            hasNFT: true,
            tokenId: String(i),
            points: String(points),
            image
          });
        }
      } catch (innerErr) {
        console.warn(`⚠️ ownerOf(${i}) failed:`, innerErr.message);
      }
    }

    return res.json({
      hasNFT: false,
      message: "No NFT found matching user's wallet"
    });

  } catch (err) {
    console.error('❌ Error in /nft-status:', err.message);
    return res.status(502).json({ error: 'Failed to fetch NFT status' });
  }
});

// ✅ Simulate payment
router.post('/simulate-payment', auth, async (req, res) => {
  const { amount } = req.body;
  try {
    const reqDoc = await Request.create({
      type: 'payment',
      user: req.userId,
      amount: Number(amount),
      status: 'pending'
    });
    res.json({ success: true, message: 'Simulated payment created', requestId: reqDoc._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Reward request
router.post("/request-reward", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Missing token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email, wallet, amount, reason } = req.body;

    if (!email || !wallet || !amount || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new Request({
      email,
      wallet,
      amount,
      reason,
      type: "reward",
      status: "pending"
    });

    await newRequest.save();
    res.status(201).json({ message: "Reward request submitted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
