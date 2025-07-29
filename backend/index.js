const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
//
const { fetchStockData, fetchHistoricalData, fetchMarketMovers } = require('./utils/stockData');
const User = require('./models/User');
const UserStocks = require('./models/UserStocks');
const Transaction = require('./models/Transaction');
const StockData = require('./models/StockData');

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log('Decoded userId from token:', req.userId);
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        res.status(403).json({ error: 'Invalid token.' });
    }
};
// ***********************************************************************
// ******* API Endpoints for Prediction (Calls Flask API) ***************
// ***********************************************************************
app.post('/api/predict', async (req, res) => {
    const { ticker, days } = req.body;

    try {
        const response = await axios.post('http://localhost:5001/predict', { ticker, days });
        const historicalData = await fetchHistoricalData(ticker);  // Fetch past 60 days for graph
        res.json({
            predictions: response.data.predictions,
            predictionDates: response.data.dates,
            historicalData
        });
    } catch (error) {
        console.error(`Error in /api/predict: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ***********************************************************************
// ******* API Endpoints for Real-Time Stock Data (Finnhub API) *********
// ***********************************************************************

// GET /api/stocks/:ticker - Fetch real-time stock data from Finnhub
app.get('/api/stocks/:ticker', async (req, res) => {
    const { ticker } = req.params;

    try {
        let stockData = await StockData.findOne({ ticker: ticker.toUpperCase() });

        if (!stockData || (Date.now() - stockData.lastUpdated) > 5 * 60 * 1000) {
            const data = await fetchStockData(ticker);
            stockData = await StockData.findOneAndUpdate(
                { ticker: ticker.toUpperCase() },
                { ...data, lastUpdated: Date.now() },
                { upsert: true, new: true }
            );
        }

        res.json(stockData);
    } catch (error) {
        if (error.message.includes('rate limit')) {
            res.status(429).json({ error: 'API rate limit exceeded' });
        } else {
            console.error(`Error in /api/stocks/${ticker}: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
});

// GET /api/stocks/:ticker/history - Fetch historical stock data from Finnhub
app.get('/api/stocks/:ticker/history', async (req, res) => {
    const { ticker } = req.params;

    try {
        const historicalData = await fetchHistoricalData(ticker);
        res.json(historicalData);
    } catch (error) {
        if (error.message.includes('rate limit')) {
            res.status(429).json({ error: 'API rate limit exceeded' });
        } else {
            console.error(`Error in /api/stocks/${ticker}/history: ${error.message}`);
            res.status(500).json({ error: error.message });
        }
    }
});

// GET /api/market/movers - Fetch market movers from Finnhub
app.get('/api/market/movers', async (req, res) => {
    try {
        const movers = await fetchMarketMovers();
        res.json(movers);
    } catch (error) {
        console.error(`Error in /api/market/movers: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

// ***********************************************************************
// ******* API Endpoints for User Data (MongoDB Database) ***************
// ***********************************************************************

// POST /api/auth/signup - User signup
app.post('/api/auth/signup', async (req, res) => {
    const { email, username, password, phoneNumber, profileImage } = req.body;

    try {
        if (!email || !username || !password || !phoneNumber) {
            return res.status(400).json({ error: 'Email, username, password, and phone number are required' });
        }

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            username,
            password: hashedPassword,
            phoneNumber,
            profileImage: profileImage || 'https://example.com/default-profile.png',
        });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({
            message: 'User created successfully',
            token,
            user: { id: user._id, email: user.email, username: user.username },
        });
    } catch (error) {
        console.error(`Error in /api/auth/signup: ${error.message}`);
        res.status(500).json({ error: 'Server error during signup' });
    }
});

// POST /api/auth/login - User login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    } catch (error) {
        console.error(`Error in /api/auth/login: ${error.message}`);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// GET /api/auth/user - Fetch user info from database
app.get('/api/auth/user', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(`Error in /api/auth/user: ${error.message}`);
        res.status(500).json({ error: 'Server error while fetching user info' });
    }
});

// POST /api/stocks/buy - Buy stock (uses Finnhub for price, then saves to database)
app.post('/api/stocks/buy', authenticateToken, async (req, res) => {
    const { ticker, quantity } = req.body;

    try {
        if (!ticker || !quantity || quantity <= 0) {
            return res.status(400).json({ error: 'Ticker and valid quantity are required' });
        }

        const stockData = await fetchStockData(ticker);
        const userStock = new UserStocks({
            userId: req.userId,
            ticker: ticker.toUpperCase(),
            quantity: parseInt(quantity),
            purchasePrice: stockData.price,
        });
        await userStock.save();

        const transaction = new Transaction({
            userId: req.userId,
            ticker: ticker.toUpperCase(),
            type: 'buy',
            quantity: parseInt(quantity),
            price: stockData.price,
        });
        await transaction.save();

        res.json({ message: 'Stock purchased successfully' });
    } catch (error) {
        if (error.message.includes('rate limit')) {
            res.status(429).json({ error: 'API rate limit exceeded' });
        } else {
            console.error(`Error in /api/stocks/buy: ${error.message}`);
            res.status(500).json({ error: 'Failed to buy stock: ' + error.message });
        }
    }
});

// GET /api/stocks/my-stocks - Fetch user's purchased stocks from database
app.get('/api/auth/stocks/my-stocks', authenticateToken, async (req, res) => {
    try {
        console.log('Fetching stocks for userId:', req.userId);

        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
            console.error('Invalid userId format:', req.userId);
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const stocks = await UserStocks.find({ userId: req.userId });
        console.log('Stocks found:', stocks);

        if (stocks.length === 0) {
            return res.json({ stocks: [] });
        }

        const formattedStocks = stocks.map(stock => ({
            ticker: stock.ticker,
            quantity: stock.quantity,
            purchasePrice: stock.purchasePrice,
            purchaseDate: stock.purchaseDate,
        }));

        res.json({ stocks: formattedStocks });
    } catch (error) {
        console.error(`Error in /api/stocks/my-stocks: ${error.message}`, error.stack);
        res.status(500).json({ error: 'Failed to fetch user stocks: ' + error.message });
    }
});

// GET /api/stocks/transactions - Fetch user's transactions from database
app.get('/api/auth/stocks/transactions', authenticateToken, async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        console.error(`Error in /api/stocks/transactions: ${error.message}`);
        res.status(500).json({ error: 'Failed to fetch transactions: ' + error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));