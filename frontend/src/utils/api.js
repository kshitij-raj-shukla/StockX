import axios from 'axios';
import { getToken } from './auth';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});// ***********************************************************************
// ******* API Calls for Prediction (Calls Flask via Express) ***********
// ***********************************************************************

export const fetchPrediction = async (ticker) => {
  const response = await fetch(`http://localhost:5001/api/predict/${ticker}`);
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  return response.json();
};

// Existing API functions (e.g., fetchStockData, signup, login, etc.) remain unchanged
// ***********************************************************************
// ******* API Calls for Real-Time Stock Data (Finnhub API) *************
// ***********************************************************************

// Fetch real-time stock data from Finnhub
export const fetchStockData = async (ticker) => {
    const response = await api.get(`/stocks/${ticker}`);
    return response.data;
};

// Fetch historical stock data from Finnhub
export const fetchHistoricalData = async (ticker) => {
    const response = await api.get(`/stocks/${ticker}/history`);
    return response.data;
};

// Fetch market movers from Finnhub
export const fetchMarketMovers = async () => {
    const response = await api.get('/market/movers');
    return response.data;
};

// Buy stock (uses Finnhub for price, then saves to database)
export const buyStock = async (ticker, quantity) => {
    const response = await api.post('/stocks/buy', { ticker, quantity });
    return response.data;
};

// ***********************************************************************
// ******* API Calls for User Data (MongoDB Database) *******************
// ***********************************************************************

// Fetch user purchased stocks from database
export const getUserStocks = async () => {
    const response = await api.get('/auth/stocks/my-stocks');
    return response.data;
};

// Fetch user transactions from database
export const getTransactions = async () => {
    const response = await api.get('/auth/stocks/transactions');
    return response.data;
};

// Fetch user info from database
export const getUserInfo = async () => {
    const response = await api.get('/auth/user');
    return response.data;
};

// User signup
export const signup = async (email, username, password, phoneNumber, profileImage) => {
    const response = await api.post('/auth/signup', { email, username, password, phoneNumber, profileImage });
    return response.data;
};

// User login
export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};