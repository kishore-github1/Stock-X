import express from 'express';
import User from '../mongodb/models/user.js';
import Transaction from '../mongodb/models/transaction.js';
import { authenticateJwt } from '../middleware/auth.js';
import Portfolio from '../mongodb/models/portfolio.js';
import axios from 'axios';


const porfolioRoute = express.Router();


const ALPHA_VANTAGE_API_KEY =process.env.ALPHA_VANTAGE_API_KEY;

porfolioRoute.route('/getStockCandleData').get(authenticateJwt, async (req, res) => {
    try {
        const { symbol, interval } = req.query;

        if (!symbol || !interval) {
            return res.status(400).json({ message: 'Symbol and interval are required' });
        }

        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol,
                apikey: 'ALPHA_VANTAGE_API_KEY'
            }
        });

        const data = response.data['Time Series (Daily)'];
        console.log(response);
        if (!data) {
            return res.status(400).json({ message: 'Error fetching data from Alpha Vantage' });
        }

        res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching stock candle data:', error);
        res.status(500).json({ error: error.message });
    }
});


porfolioRoute.route('/addStockToUser').post(authenticateJwt, async (req, res) => {
    try {
        const { email, name, stockId, quantity, avgBuyPrice } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if a portfolio with the same name already exists for this user
        let portfolio = await Portfolio.findOne({ 
            userId: user._id, 
            name: name || 'Default Portfolio' 
        });

        // If portfolio doesn't exist, create a new one
        if (!portfolio) {
            portfolio = new Portfolio({
                userId: user._id,
                name: name || 'Default Portfolio',
                holdings: [],
                transactions: []
            });
        }

        // Check if the stock already exists in the portfolio's holdings
        const existingHoldingIndex = portfolio.holdings.findIndex(
            holding => holding.stockId === stockId
        );

        // Create a new transaction
        const transaction = new Transaction({
            portfolioId: portfolio._id,
            stockId: stockId,
            type: 'BUY',
            quantity: quantity,
            price: avgBuyPrice
        });

        // Save the transaction
        await transaction.save();

        // Add transaction to portfolio's transactions
        portfolio.transactions.push(transaction._id);

        // Update or add holdings
        if (existingHoldingIndex > -1) {
            // Update existing holding
            const existingHolding = portfolio.holdings[existingHoldingIndex];
            existingHolding.quantity += quantity;
            existingHolding.averageBuyPrice = (
                (existingHolding.averageBuyPrice * existingHolding.quantity) + 
                (avgBuyPrice * quantity)
            ) / (existingHolding.quantity + quantity);
        } else {
            // Add new holding
            portfolio.holdings.push({
                stockId,
                quantity,
                averageBuyPrice: avgBuyPrice
            });
        }

        // Save the portfolio
        await portfolio.save();

        // Add portfolio to user if not already present
        if (!user.portfolios.includes(portfolio._id)) {
            user.portfolios.push(portfolio._id);
            await user.save();
        }

        res.status(200).json({ 
            message: 'Stock added to portfolio and transaction recorded',
            portfolio,
            transaction
        });

    } catch (error) {
        console.error('Error adding stock to user portfolio:', error);
        res.status(500).json({ error: error.message });
    }
});




export default porfolioRoute;