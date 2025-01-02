import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
  holdings: [
    {
      stockId: {
        type: String,
        ref: 'Stock',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      averageBuyPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction',
    },
  ],
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

export default Portfolio;
