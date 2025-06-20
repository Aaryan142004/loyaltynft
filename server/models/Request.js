const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  type: { type: String, enum: ['mint', 'payment', 'reward', 'points'], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email: { type: String },   // Optional: useful for admin UI
  wallet: { type: String },
  amount: { type: Number },  // Used for reward/payment
  points: { type: Number },  // Used for manual point request
  reason: { type: String },  // Reason for requesting
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', requestSchema);
