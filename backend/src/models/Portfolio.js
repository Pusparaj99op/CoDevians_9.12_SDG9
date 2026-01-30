const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  bond: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bond',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  averageBuyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalInvested: {
    type: Number,
    required: true,
    min: 0
  },
  firstPurchaseDate: {
    type: Date,
    default: Date.now
  },
  lastTransactionDate: {
    type: Date,
    default: Date.now
  }
});

const portfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  holdings: [holdingSchema],
  totalInvested: {
    type: Number,
    default: 0
  },
  totalBondsOwned: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
portfolioSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Calculate totals
portfolioSchema.methods.recalculateTotals = function() {
  this.totalInvested = this.holdings.reduce((sum, h) => sum + h.totalInvested, 0);
  this.totalBondsOwned = this.holdings.filter(h => h.quantity > 0).length;
};

module.exports = mongoose.model('Portfolio', portfolioSchema);
