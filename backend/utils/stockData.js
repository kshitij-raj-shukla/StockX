const axios = require('axios');
require('dotenv').config();

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';

// Mock data for fallback
const mockStockData = (ticker) => ({
    ticker: ticker.toUpperCase(),
    price: 100.00 + Math.random() * 50,
    change: (Math.random() * 10 - 5).toFixed(2),
    volume: Math.floor(Math.random() * 1000000),
    high: 150.00 + Math.random() * 10,
    low: 90.00 - Math.random() * 10,
});

const mockHistoricalData = (ticker) => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        data.push({
            date: date.toISOString().split('T')[0],
            close: 100 + Math.random() * 50,
        });
    }
    return data;
};

// Queue for Finnhub API requests
const finnhubRequestQueue = [];
let isProcessingFinnhub = false;

// Delay function
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Process Finnhub queue
const processFinnhubQueue = async () => {
    if (isProcessingFinnhub || finnhubRequestQueue.length === 0) return;

    isProcessingFinnhub = true;
    const { fn, resolve, reject } = finnhubRequestQueue.shift();

    try {
        const result = await fn();
        resolve(result);
    } catch (error) {
        reject(error);
    }

    await delay(1000); // 1-second delay for Finnhub (60 calls per minute)
    isProcessingFinnhub = false;

    processFinnhubQueue();
};

// Add a Finnhub request to the queue
const queueFinnhubRequest = (fn) => {
    return new Promise((resolve, reject) => {
        finnhubRequestQueue.push({ fn, resolve, reject });
        processFinnhubQueue();
    });
};

// Queue for Alpha Vantage API requests
const alphaVantageRequestQueue = [];
let isProcessingAlphaVantage = false;

// Process Alpha Vantage queue
const processAlphaVantageQueue = async () => {
    if (isProcessingAlphaVantage || alphaVantageRequestQueue.length === 0) return;

    isProcessingAlphaVantage = true;
    const { fn, resolve, reject } = alphaVantageRequestQueue.shift();

    try {
        const result = await fn();
        resolve(result);
    } catch (error) {
        reject(error);
    }

    await delay(12000); // 12-second delay for Alpha Vantage (5 calls per minute)
    isProcessingAlphaVantage = false;

    processAlphaVantageQueue();
};

// Add an Alpha Vantage request to the queue
const queueAlphaVantageRequest = (fn) => {
    return new Promise((resolve, reject) => {
        alphaVantageRequestQueue.push({ fn, resolve, reject });
        processAlphaVantageQueue();
    });
};

// Fetch real-time stock data (Finnhub)
const fetchStockData = async (ticker) => {
    const request = async () => {
        try {
            const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
                params: {
                    symbol: ticker.toUpperCase(),
                    token: FINNHUB_API_KEY,
                },
            });

            const data = response.data;
            if (!data || data.c === 0) {
                throw new Error('Invalid ticker or no data available');
            }

            return {
                ticker: ticker.toUpperCase(),
                price: parseFloat(data.c),
                change: parseFloat(data.dp).toFixed(2),
                volume: parseInt(data.v || 0),
                high: parseFloat(data.h),   
                low: parseFloat(data.l),
            };
        } catch (error) {
            if (error.response?.status === 403) {
                console.error(`403 Forbidden when fetching stock data for ${ticker}: Invalid API key or insufficient permissions`);
                console.warn(`Falling back to mock data for ${ticker}`);
                return mockStockData(ticker);
            }
            if (error.response?.status === 429) {
                throw new Error('Finnhub API rate limit exceeded');
            }
            console.error(`Error fetching stock data for ${ticker}: ${error.message}`);
            throw new Error(`Finnhub API error: ${error.message}`);
        }
    };

    return queueFinnhubRequest(request);
};

// Fetch historical stock data (Alpha Vantage)
const fetchHistoricalData = async (ticker) => {
    const request = async () => {
        try {
            const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
                params: {
                    function: 'TIME_SERIES_DAILY',
                    symbol: ticker.toUpperCase(),
                    apikey: ALPHA_VANTAGE_API_KEY,
                    outputsize: 'compact',
                },
            });

            const data = response.data['Time Series (Daily)'];
            if (!data) {
                console.warn(`No historical data available for ticker ${ticker}`);
                return [];
            }

            const historicalData = Object.keys(data)
                .slice(0, 30)
                .map(date => ({
                    date: date,
                    close: parseFloat(data[date]['4. close']),
                }));

            historicalData.sort((a, b) => new Date(a.date) - new Date(b.date));
            return historicalData;
        } catch (error) {
            if (error.response?.status === 403) {
                console.error(`403 Forbidden when fetching historical data for ${ticker}: Invalid Alpha Vantage API key`);
                console.warn(`Falling back to mock historical data for ${ticker}`);
                return mockHistoricalData(ticker);
            }
            if (error.response?.status === 429) {
                throw new Error('Alpha Vantage API rate limit exceeded');
            }
            console.error(`Error fetching historical data for ${ticker}: ${error.message}`);
            return [];
        }
    };

    return queueAlphaVantageRequest(request);
};

// Fetch market movers (Finnhub)
const fetchMarketMovers = async () => {
    try {
        const gainers = [];
        const losers = [];
        const stocks = ['AAPL', 'TSLA', 'GOOGL', 'MSFT'];

        for (const ticker of stocks) {
            const stockData = await fetchStockData(ticker);
            if (stockData.change >= 0) {
                gainers.push(stockData);
            } else {
                losers.push(stockData);
            }
        }

        return {
            gainers: gainers.sort((a, b) => b.change - a.change).slice(0, 3),
            losers: losers.sort((a, b) => a.change - b.change).slice(0, 3),
        };
    } catch (error) {
        console.error(`Error fetching market movers: ${error.message}`);
        throw new Error(error.message);
    }
};

module.exports = { fetchStockData, fetchHistoricalData, fetchMarketMovers };