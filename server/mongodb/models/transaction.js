import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  portfolioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: true,
  },
  stockId: {
    type: String,
    ref: 'Stock',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['BUY', 'SELL'], // Ensures the type is either BUY or SELL
  },
  quantity: {
    type: Number,
    required: true,
    min: 1, // Must have at least one stock in a transaction
  },
  price: {
    type: Number,
    required: true,
    min: 0, // Price must be non-negative
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
