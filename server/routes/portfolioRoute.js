import express from "express";
import User from "../mongodb/models/user.js";
import Transaction from "../mongodb/models/transaction.js";
import { authenticateJwt } from "../middleware/auth.js";
import Portfolio from "../mongodb/models/portfolio.js";
import axios from "axios";

const porfolioRoute = express.Router();

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const POLYGON_API_KEY = process.env.POLYGON_API_KEY;

function formatDate(date) {
  return date.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
}
const today = new Date();
const thirtyDaysAgo = new Date(today);
thirtyDaysAgo.setDate(today.getDate() - 30);

const from = formatDate(thirtyDaysAgo);
const to = formatDate(today);

porfolioRoute
  .route("/getStockCandleData")
  .get(authenticateJwt, async (req, res) => {
    try {
      const { symbol } = req.query;

      const interval = "1";

      if (!symbol || !interval) {
        return res
          .status(400)
          .json({ message: "Symbol and interval are required" });
      }

      const response = await axios.get(
        `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/${interval}/day/${from}/${to}?adjusted=true&sort=asc`,

        {
          params: {
            apiKey: POLYGON_API_KEY,
          },
        }
      );
      const data = response.data.results;
      if (!data) {
        return res
          .status(400)
          .json({ message: "Error fetching data from Polygon.io" });
      }
      console.log(data);
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching stock chart data:", error);
      res.status(500).json({ error: error.message });
    }
  });

porfolioRoute.route("/buy").post(authenticateJwt, async (req, res) => {
  try {
    const { email, stockId, quantity, avgBuyPrice } = req.body;
    console.log(email);

    const name = "default";
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCost = quantity * avgBuyPrice;

    // Check if user has enough money in wallet
    if (user.wallet < totalCost) {
      return res.status(400).json({ message: "Not enough money in wallet" });
    }

    // Deduct money from wallet
    user.wallet -= totalCost;
    await user.save();

    // Check if a portfolio with the same name already exists for this user
    let portfolio = await Portfolio.findOne({
      userId: user._id,
      name: name,
    });

    // If portfolio doesn't exist, create a new one
    if (!portfolio) {
      portfolio = new Portfolio({
        userId: user._id,
        name: name,
        holdings: [],
        transactions: [],
      });
    }

    // Check if the stock already exists in the portfolio's holdings
    const existingHoldingIndex = portfolio.holdings.findIndex(
      (holding) => holding.stockId === stockId
    );

    // Create a new transaction
    const transaction = new Transaction({
      portfolioId: portfolio._id,
      stockId: stockId,
      type: "BUY",
      quantity: quantity,
      price: avgBuyPrice,
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
      existingHolding.averageBuyPrice =
        (existingHolding.averageBuyPrice * existingHolding.quantity +
          avgBuyPrice * quantity) /
        (existingHolding.quantity + quantity);
    } else {
      // Add new holding
      portfolio.holdings.push({
        stockId,
        quantity,
        averageBuyPrice: avgBuyPrice,
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
      message: "Stock added to portfolio and transaction recorded",
      portfolio,
      transaction,
    });
  } catch (error) {
    console.error("Error adding stock to user portfolio:", error);
    res.status(500).json({ error: error.message });
  }
});

porfolioRoute
  .route("/getPortfolioValue")
  .get(authenticateJwt, async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await User.findOne({ email }).populate("portfolios");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let totalValue = 0,
        totalInvestment = 0;
      const portfolioData = [];

      for (const portfolio of user.portfolios) {
        let portfolioValue = 0;
        const holdingsData = [];

        for (const holding of portfolio.holdings) {
          const response = await axios.get(`https://finnhub.io/api/v1/quote`, {
            params: {
              symbol: holding.stockId,
              token: FINNHUB_API_KEY,
            },
          });

          const stockData = response.data;
          const currentPrice = stockData.c;
          const holdingValue = currentPrice * holding.quantity;

          portfolioValue += holdingValue;
          totalInvestment += holding.averageBuyPrice * holding.quantity;
          holdingsData.push({
            stockId: holding.stockId,
            quantity: holding.quantity,
            averageBuyPrice: holding.averageBuyPrice,
            currentPrice,
            holdingValue,
          });
        }

        totalValue += portfolioValue;
        portfolioData.push({
          portfolioId: portfolio._id,
          name: portfolio.name,
          portfolioValue,
          holdings: holdingsData,
        });
      }

      res.status(200).json({
        totalValue,
        totalInvestment,
        portfolios: portfolioData,
      });
    } catch (error) {
      console.error("Error fetching portfolio value:", error);
      res.status(500).json({ error: error.message });
    }
  });

//route to sell the stocks
porfolioRoute.route("/sell").post(authenticateJwt, async (req, res) => {
  try {
    const { email, stockId, quantity, avgBuyPrice } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the user's portfolio
    const portfolio = await Portfolio.findOne({
      userId: user._id,
      name: "default",
    });
    if (!portfolio) {
      return res.status(404).json({ message: "Portfolio not found" });
    }

    // Find the holding in the portfolio
    const holdingIndex = portfolio.holdings.findIndex(
      (holding) => holding.stockId === stockId
    );
    if (holdingIndex === -1) {
      return res.status(400).json({ message: "Stock not found in portfolio" });
    }

    const holding = portfolio.holdings[holdingIndex];

    // Check if the user has enough quantity to sell
    if (holding.quantity < quantity) {
      return res.status(400).json({ message: "Not enough quantity to sell" });
    }

    // Calculate the total sell value
    const totalSellValue = quantity * avgBuyPrice;

    // Add money to wallet
    user.wallet += totalSellValue;
    await user.save();

    // Create a new transaction
    const transaction = new Transaction({
      portfolioId: portfolio._id,
      stockId: stockId,
      type: "SELL",
      quantity: quantity,
      price: avgBuyPrice,
    });

    // Save the transaction
    await transaction.save();

    // Add transaction to portfolio's transactions
    portfolio.transactions.push(transaction._id);

    // Update the holding
    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      portfolio.holdings.splice(holdingIndex, 1);
    }

    // Save the portfolio
    await portfolio.save();

    res.status(200).json({
      message: "Stock sold from portfolio and transaction recorded",
      portfolio,
      transaction,
    });
  } catch (error) {
    console.error("Error selling stock from user portfolio:", error);
    res.status(500).json({ error: error.message });
  }
});

porfolioRoute
  .route("/getWalletMoney")
  .get(authenticateJwt, async (req, res) => {
    try {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ wallet: user.wallet });
    } catch (error) {
      console.error("Error fetching wallet money:", error);
      res.status(500).json({ error: error.message });
    }
  });

porfolioRoute
  .route("/addWalletMoney")
  .post(authenticateJwt, async (req, res) => {
    try {
      const { email, amount } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Add money to user's wallet
      user.wallet = (user.wallet || 0) + Number(amount);

      // Save the user
      await user.save();

      res.status(200).json({
        message: "Money added to wallet successfully",
        wallet: user.wallet,
      });
    } catch (error) {
      console.error("Error adding money to wallet:", error);
      res.status(500).json({ error: error.message });
    }
  });

export default porfolioRoute;
