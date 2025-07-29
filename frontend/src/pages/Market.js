import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StockGraph from '../components/StockGraph';
import StockCard from '../components/StockCard';
import { fetchStockData, fetchHistoricalData, fetchMarketMovers, buyStock } from '../utils/api';
import '../styles/Market.css';

const Market = () => {
    const [ticker, setTicker] = useState('');
    const [stockData, setStockData] = useState(null);
    const [historicalData, setHistoricalData] = useState([]);
    const [movers, setMovers] = useState({ gainers: [], losers: [] });
    const [selectedStock, setSelectedStock] = useState('');
    const [error, setError] = useState('');
    const [loadingStock, setLoadingStock] = useState(false);
    const [loadingMovers, setLoadingMovers] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [buyQuantity, setBuyQuantity] = useState('');
    const [buyError, setBuyError] = useState('');
    const [buyLoading, setBuyLoading] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const stock = urlParams.get('stock') || 'AAPL';
        if (stock && /^[A-Z]{1,5}$/.test(stock)) {
            setTicker(stock);
            setSelectedStock(stock);
        } else {
            setError('Invalid ticker format. Please use 1-5 uppercase letters (e.g., AAPL).');
            setTicker('AAPL');
            setSelectedStock('AAPL');
        }
    }, []);

    useEffect(() => {
        const fetchMovers = async () => {
            setLoadingMovers(true);
            try {
                const moversData = await fetchMarketMovers();
                setMovers(moversData);
            } catch (err) {
                setError('Failed to fetch market movers: ' + err.message);
            } finally {
                setLoadingMovers(false);
            }
        };
        fetchMovers();
    }, []);

    useEffect(() => {
        if (ticker) {
            const fetchData = async () => {
                setLoadingStock(true);
                setError('');
                setHistoricalData([]);
                try {
                    const stock = await fetchStockData(ticker);
                    setStockData(stock);

                    const historical = await fetchHistoricalData(ticker);
                    setHistoricalData(historical.slice(0, 30));
                } catch (err) {
                    if (err.message.includes('rate limit')) {
                        setError('API rate limit exceeded. Please try again later.');
                    } else if (err.message.includes('Invalid API key')) {
                        setError('Unable to fetch stock data: Invalid API key. Please ensure the API key is valid.');
                    } else {
                        setError('Failed to fetch stock data: ' + err.message);
                    }
                } finally {
                    setLoadingStock(false);
                }
            };
            fetchData();
        }
    }, [ticker]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!ticker) {
            setError('Please enter a stock ticker');
            return;
        }
        if (!/^[A-Z]{1,5}$/.test(ticker)) {
            setError('Invalid ticker format. Please use 1-5 uppercase letters (e.g., AAPL).');
            return;
        }
        setSelectedStock(ticker);
        window.history.pushState({}, '', `/market?stock=${ticker}`);
    };

    const handleStockSelect = (stock) => {
        setTicker(stock);
        setSelectedStock(stock);
        window.history.pushState({}, '', `/market?stock=${stock}`);
    };

    const handleBuyStock = async (e) => {
        e.preventDefault();

        if (!buyQuantity || buyQuantity <= 0) {
            setBuyError('Please enter a valid quantity (greater than 0)');
            return;
        }

        setBuyLoading(true);
        setBuyError('');

        try {
            await buyStock(ticker, parseInt(buyQuantity));
            alert('Stock purchased successfully!');
            setShowBuyModal(false);
            setBuyQuantity('');
        } catch (err) {
            if (err.message.includes('rate limit')) {
                setBuyError('API rate limit exceeded. Please try again later.');
            } else if (err.message.includes('Invalid ticker')) {
                setBuyError('Invalid stock ticker. Please try another stock.');
            } else {
                setBuyError('Failed to buy stock: ' + err.message);
            }
        } finally {
            setBuyLoading(false);
        }
    };

    return (
        <motion.div
            className="market-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="sidebar"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="sidebar-heading">Select Stock</h2>
                <form onSubmit={handleSearch} className="sidebar-form">
                    <motion.input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="Enter ticker (e.g., AAPL)"
                        className="sidebar-input"
                        whileFocus={{ scale: 1.02 }}
                    />
                </form>
                <div className="stock-buttons">
                    {['AAPL', 'TSLA', 'GOOGL', 'MSFT'].map((stock, idx) => (
                        <motion.button
                            key={idx}
                            onClick={() => handleStockSelect(stock)}
                            className={`stock-button ${selectedStock === stock ? 'stock-button-active' : ''}`}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {stock}
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            <motion.div
                className="main-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                {error && (
                    <motion.div
                        className="error-message"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}

                {loadingStock ? (
                    <motion.p
                        className="loading-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        Loading stock data...
                    </motion.p>
                ) : stockData ? (
                    <motion.div
                        className="stock-details"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="stock-ticker">{stockData.ticker}</h2>
                        <div className="stock-metrics">
                            <motion.div
                                className="metric-card"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                            >
                                <p className="metric-label">Price</p>
                                <p className="metric-value">${stockData.price?.toFixed(2)}</p>
                            </motion.div>
                            <motion.div
                                className="metric-card"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                            >
                                <p className="metric-label">Change</p>
                                <p className={stockData.change >= 0 ? 'change-positive' : 'change-negative'}>
                                    {stockData.change >= 0 ? '+' : ''}{stockData.change || 0}%
                                </p>
                            </motion.div>
                            <motion.div
                                className="metric-card"
                                whileHover={{ scale: 1.05, rotate: 1 }}
                            >
                                <p className="metric-label">Volume</p>
                                <p className="metric-value">{stockData.volume || 'N/A'}</p>
                            </motion.div>
                            <motion.div
                                className="metric-card"
                                whileHover={{ scale: 1.05, rotate: -1 }}
                            >
                                <p className="metric-label">High/Low</p>
                                <p className="metric-value">
                                    ${stockData.high?.toFixed(2)} / ${stockData.low?.toFixed(2)}
                                </p>
                            </motion.div>
                        </div>
                        <motion.button
                            className="buy-stock-button"
                            onClick={() => setShowBuyModal(true)}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Buy Stock
                        </motion.button>
                    </motion.div>
                ) : (
                    <p className="no-data-message">Enter a stock ticker to view details</p>
                )}

                {historicalData.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <StockGraph historicalData={historicalData} />
                    </motion.div>
                )}

                {showBuyModal && (
                    <motion.div
                        className="buy-modal"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="buy-modal-content"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2>Buy {ticker}</h2>
                            {buyError && <p className="buy-error">{buyError}</p>}
                            <form onSubmit={handleBuyStock}>
                                <div className="form-group">
                                    <label htmlFor="quantity">Quantity</label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        value={buyQuantity}
                                        onChange={(e) => setBuyQuantity(e.target.value)}
                                        min="1"
                                        required
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <motion.button
                                        type="submit"
                                        disabled={buyLoading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {buyLoading ? 'Buying...' : 'Confirm Buy'}
                                    </motion.button>
                                    <motion.button
                                        type="button"
                                        onClick={() => setShowBuyModal(false)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Cancel
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                <motion.div
                    className="movers-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <h2 className="movers-heading">Market Movers</h2>
                    <div className="movers-grid">
                        <div>
                            <h3 className="movers-subheading">Top Gainers</h3>
                            <div className="movers-subgrid">
                                {loadingMovers ? (
                                    <p className="movers-loading">Loading gainers...</p>
                                ) : movers.gainers?.length > 0 ? (
                                    movers.gainers.map((stock, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                                        >
                                            <StockCard
                                                ticker={stock.ticker}
                                                price={stock.price}
                                                change={stock.change}
                                                onClick={() => handleStockSelect(stock.ticker)}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="movers-loading">No gainers available</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="movers-subheading">Top Losers</h3>
                            <div className="movers-subgrid">
                                {loadingMovers ? (
                                    <p className="movers-loading">Loading losers...</p>
                                ) : movers.losers?.length > 0 ? (
                                    movers.losers.map((stock, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                                        >
                                            <StockCard
                                                ticker={stock.ticker}
                                                price={stock.price}
                                                change={stock.change}
                                                onClick={() => handleStockSelect(stock.ticker)}
                                            />
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="movers-loading">No losers available</p>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default Market;