const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// GET /api/transactions - Get user's transactions with filters and pagination
router.get('/', protect, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, // 'BUY' or 'SELL'
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter query
    const filter = { user: req.userId };
    
    if (type && ['BUY', 'SELL'].includes(type.toUpperCase())) {
      filter.type = type.toUpperCase();
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalCount = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limitNum);

    // Fetch transactions with pagination
    const transactions = await Transaction.find(filter)
      .populate({
        path: 'bond',
        select: 'name issuer price returnRate riskLevel sector'
      })
      .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Format transactions for response
    const formattedTransactions = transactions.map(tx => ({
      id: tx._id,
      type: tx.type,
      quantity: tx.quantity,
      pricePerUnit: tx.pricePerUnit,
      totalAmount: tx.totalAmount,
      status: tx.status,
      createdAt: tx.createdAt,
      bond: tx.bond ? {
        id: tx.bond._id,
        name: tx.bond.name,
        issuer: tx.bond.issuer,
        currentPrice: tx.bond.price,
        returnRate: tx.bond.returnRate,
        riskLevel: tx.bond.riskLevel,
        sector: tx.bond.sector
      } : tx.bondSnapshot ? {
        // Use snapshot if bond no longer exists
        name: tx.bondSnapshot.name,
        issuer: tx.bondSnapshot.issuer,
        returnRate: tx.bondSnapshot.returnRate,
        riskLevel: tx.bondSnapshot.riskLevel
      } : null
    }));

    // Calculate summary stats
    const allUserTransactions = await Transaction.find({ user: req.userId }).lean();
    const totalBuyAmount = allUserTransactions
      .filter(tx => tx.type === 'BUY')
      .reduce((sum, tx) => sum + tx.totalAmount, 0);
    const totalSellAmount = allUserTransactions
      .filter(tx => tx.type === 'SELL')
      .reduce((sum, tx) => sum + tx.totalAmount, 0);
    const totalTransactions = allUserTransactions.length;
    const buyCount = allUserTransactions.filter(tx => tx.type === 'BUY').length;
    const sellCount = allUserTransactions.filter(tx => tx.type === 'SELL').length;

    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1
        },
        summary: {
          totalTransactions,
          buyCount,
          sellCount,
          totalBuyAmount,
          totalSellAmount,
          netFlow: totalBuyAmount - totalSellAmount
        }
      }
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transactions',
      error: error.message
    });
  }
});

// GET /api/transactions/:id - Get single transaction details
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({ 
      _id: req.params.id, 
      user: req.userId 
    }).populate({
      path: 'bond',
      select: 'name issuer price returnRate riskLevel sector maturityYears'
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching transaction',
      error: error.message
    });
  }
});

module.exports = router;
