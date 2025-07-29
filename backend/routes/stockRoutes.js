// // Routes for stock data and market indices
// const express = require('express');
// const router = express.Router();
// const StockData = require('../models/StockData');
// const IndexData = require('../models/IndexData');
// const { fetchStockData, fetchHistoricalData, fetchIndexData } = require('../utils/alphaVantage');

// const cacheDuration = 5 * 60 * 1000; // 5 minutes

// // Fetch stock data and cache it
// router.get('/stocks/:ticker', async (req, res) => {
//     const ticker = req.params.ticker.toUpperCase();

//     try {
//         // Check cache
//         const cachedData = await StockData.findOne({ ticker });
//         if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
//             return res.json(cachedData.data);
//         }

//         // Fetch real-time data
//         const stockData = await fetchStockData(ticker);

//         // Cache the data
//         await StockData.findOneAndUpdate(
//             { ticker },
//             { ticker, data: stockData, timestamp: Date.now() },
//             { upsert: true }
//         );

//         res.json(stockData);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching stock data', error: error.message });
//     }
// });

// // Fetch historical data for graph
// router.get('/stocks/:ticker/history', async (req, res) => {
//     const ticker = req.params.ticker.toUpperCase();

//     try {
//         const cachedData = await StockData.findOne({ ticker: `${ticker}_HISTORY` });
//         if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
//             return res.json(cachedData.data);
//         }

//         const historicalData = await fetchHistoricalData(ticker);

//         await StockData.findOneAndUpdate(
//             { ticker: `${ticker}_HISTORY` },
//             { ticker: `${ticker}_HISTORY`, data: historicalData, timestamp: Date.now() },
//             { upsert: true }
//         );

//         res.json(historicalData);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching historical data', error: error.message });
//     }
// });

// // Fetch market indices (real-time)
// router.get('/market/indices', async (req, res) => {
//     const indicesToFetch = [
//         { symbol: 'SPX', name: 'S&P 500' }, // S&P 500
//         { symbol: 'DJI', name: 'DOW JONES' }, // Dow Jones
//         { symbol: 'NIFTY', name: 'NIFTY 50' }, // Note: Alpha Vantage may not support NIFTY directly, adjust if needed
//     ];

//     try {
//         const cachedData = await IndexData.findOne({ name: 'MARKET_INDICES' });
//         if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
//             return res.json(cachedData.data);
//         }

//         const indices = await Promise.all(
//             indicesToFetch.map(async (index) => {
//                 try {
//                     return await fetchIndexData(index.symbol, index.name);
//                 } catch (error) {
//                     return { name: index.name, value: 'N/A', change: 0 }; // Fallback on error
//                 }
//             })
//         );

//         await IndexData.findOneAndUpdate(
//             { name: 'MARKET_INDICES' },
//             { name: 'MARKET_INDICES', data: indices, timestamp: Date.now() },
//             { upsert: true }
//         );

//         res.json(indices);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching indices', error: error.message });
//     }
// });

// // Fetch trending stocks (real-time)
// router.get('/stocks/trending', async (req, res) => {
//     const trendingTickers = ['AAPL', 'TSLA', 'GOOGL', 'MSFT'];

//     try {
//         const cachedData = await StockData.findOne({ ticker: 'TRENDING_STOCKS' });
//         if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
//             return res.json(cachedData.data);
//         }

//         const trendingStocks = await Promise.all(
//             trendingTickers.map(async (ticker) => {
//                 try {
//                     return await fetchStockData(ticker);
//                 } catch (error) {
//                     return { ticker, price: 'N/A', change: 0 }; // Fallback on error
//                 }
//             })
//         );

//         await StockData.findOneAndUpdate(
//             { ticker: 'TRENDING_STOCKS' },
//             { ticker: 'TRENDING_STOCKS', data: trendingStocks, timestamp: Date.now() },
//             { upsert: true }
//         );

//         res.json(trendingStocks);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching trending stocks', error: error.message });
//     }
// });

// // Fetch market movers (real-time)
// router.get('/market/movers', async (req, res) => {
//     const moverTickers = ['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'META'];

//     try {
//         const cachedData = await StockData.findOne({ ticker: 'MARKET_MOVERS' });
//         if (cachedData && (Date.now() - cachedData.timestamp) < cacheDuration) {
//             return res.json(cachedData.data);
//         }

//         const stocks = await Promise.all(
//             moverTickers.map(async (ticker) => {
//                 try {
//                     return await fetchStockData(ticker);
//                 } catch (error) {
//                     return { ticker, price: 'N/A', change: 0 }; // Fallback on error
//                 }
//             })
//         );

//         const sortedStocks = stocks.sort((a, b) => parseFloat(b.change) - parseFloat(a.change));
//         const movers = {
//             gainers: sortedStocks.slice(0, 2), // Top 2 gainers
//             losers: sortedStocks.slice(-2),    // Bottom 2 losers
//         };

//         await StockData.findOneAndUpdate(
//             { ticker: 'MARKET_MOVERS' },
//             { ticker: 'MARKET_MOVERS', data: movers, timestamp: Date.now() },
//             { upsert: true }
//         );

//         res.json(movers);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching market movers', error: error.message });
//     }
// });

// module.exports = router;