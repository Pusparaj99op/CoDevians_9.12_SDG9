const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Bond = require('../models/Bond');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const { protect } = require('../middleware/auth');

// POST /api/paper-trading/buy - Buy bonds
router.post('/buy', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bondId, quantity } = req.body;

    // Validate input
    if (!bondId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bondId and quantity'
      });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Get user with session
    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get bond
    const bond = await Bond.findById(bondId).session(session);
    if (!bond) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bond not found'
      });
    }

    if (!bond.isActive) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'This bond is not available for purchase'
      });
    }

    // Check available units
    if (bond.availableUnits < qty) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: `Only ${bond.availableUnits} units available`
      });
    }

    // Calculate total cost
    const totalCost = bond.price * qty;

    // Check wallet balance
    if (user.wallet.balance < totalCost) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance',
        data: {
          required: totalCost,
          available: user.wallet.balance
        }
      });
    }

    // Deduct from wallet
    user.wallet.balance -= totalCost;
    await user.save({ session });

    // Update bond available units
    bond.availableUnits -= qty;
    await bond.save({ session });

    // Create transaction
    const transaction = await Transaction.create([{
      user: user._id,
      bond: bond._id,
      type: 'BUY',
      quantity: qty,
      pricePerUnit: bond.price,
      totalAmount: totalCost,
      status: 'COMPLETED',
      bondSnapshot: {
        name: bond.name,
        issuer: bond.issuer,
        returnRate: bond.returnRate,
        riskLevel: bond.riskLevel
      }
    }], { session });

    // Update or create portfolio
    let portfolio = await Portfolio.findOne({ user: user._id }).session(session);

    if (!portfolio) {
      portfolio = new Portfolio({
        user: user._id,
        holdings: []
      });
    }

    // Find existing holding for this bond
    const existingHoldingIndex = portfolio.holdings.findIndex(
      h => h.bond.toString() === bond._id.toString()
    );

    if (existingHoldingIndex >= 0) {
      // Update existing holding
      const holding = portfolio.holdings[existingHoldingIndex];
      const newTotalInvested = holding.totalInvested + totalCost;
      const newQuantity = holding.quantity + qty;

      holding.quantity = newQuantity;
      holding.totalInvested = newTotalInvested;
      holding.averageBuyPrice = newTotalInvested / newQuantity;
      holding.lastTransactionDate = new Date();
    } else {
      // Add new holding
      portfolio.holdings.push({
        bond: bond._id,
        quantity: qty,
        averageBuyPrice: bond.price,
        totalInvested: totalCost,
        firstPurchaseDate: new Date(),
        lastTransactionDate: new Date()
      });
    }

    portfolio.recalculateTotals();
    await portfolio.save({ session });

    // Commit transaction
    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: `Successfully purchased ${qty} unit(s) of ${bond.name}`,
      data: {
        transaction: {
          id: transaction[0]._id,
          type: 'BUY',
          bond: {
            id: bond._id,
            name: bond.name,
            issuer: bond.issuer
          },
          quantity: qty,
          pricePerUnit: bond.price,
          totalAmount: totalCost,
          date: transaction[0].createdAt
        },
        wallet: {
          balance: user.wallet.balance,
          currency: user.wallet.currency
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Buy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing purchase',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// POST /api/paper-trading/sell - Sell bonds
router.post('/sell', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { bondId, quantity } = req.body;

    // Validate input
    if (!bondId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'Please provide bondId and quantity'
      });
    }

    const qty = parseInt(quantity);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Get user
    const user = await User.findById(req.userId).session(session);
    if (!user) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get bond
    const bond = await Bond.findById(bondId).session(session);
    if (!bond) {
      await session.abortTransaction();
      return res.status(404).json({
        success: false,
        message: 'Bond not found'
      });
    }

    // Get portfolio
    const portfolio = await Portfolio.findOne({ user: user._id }).session(session);
    if (!portfolio) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'No portfolio found'
      });
    }

    // Find holding
    const holdingIndex = portfolio.holdings.findIndex(
      h => h.bond.toString() === bond._id.toString()
    );

    if (holdingIndex < 0 || portfolio.holdings[holdingIndex].quantity < qty) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Insufficient holdings to sell'
      });
    }

    const holding = portfolio.holdings[holdingIndex];
    const totalAmount = bond.price * qty;

    // Credit wallet
    user.wallet.balance += totalAmount;
    await user.save({ session });

    // Update bond available units
    bond.availableUnits += qty;
    await bond.save({ session });

    // Create transaction
    const transaction = await Transaction.create([{
      user: user._id,
      bond: bond._id,
      type: 'SELL',
      quantity: qty,
      pricePerUnit: bond.price,
      totalAmount: totalAmount,
      status: 'COMPLETED',
      bondSnapshot: {
        name: bond.name,
        issuer: bond.issuer,
        returnRate: bond.returnRate,
        riskLevel: bond.riskLevel
      }
    }], { session });

    // Update holding
    holding.quantity -= qty;
    holding.totalInvested -= (holding.averageBuyPrice * qty);
    holding.lastTransactionDate = new Date();

    // Remove holding if quantity is 0
    if (holding.quantity <= 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    portfolio.recalculateTotals();
    await portfolio.save({ session });

    // Commit
    await session.commitTransaction();

    res.json({
      success: true,
      message: `Successfully sold ${qty} unit(s) of ${bond.name}`,
      data: {
        transaction: {
          id: transaction[0]._id,
          type: 'SELL',
          bond: {
            id: bond._id,
            name: bond.name
          },
          quantity: qty,
          pricePerUnit: bond.price,
          totalAmount: totalAmount,
          date: transaction[0].createdAt
        },
        wallet: {
          balance: user.wallet.balance,
          currency: user.wallet.currency
        }
      }
    });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Error processing sale',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// GET /api/paper-trading/transactions - Get user's transactions
router.get('/transactions', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10, type } = req.query;

    const query = { user: req.userId };
    if (type && ['BUY', 'SELL'].includes(type.toUpperCase())) {
      query.type = type.toUpperCase();
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('bond', 'name issuer price returnRate riskLevel');

    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

module.exports = router;
