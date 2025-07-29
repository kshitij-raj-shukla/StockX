import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import '../styles/Home.css';

const Home = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'night');
    const [news, setNews] = useState([]);
    const [loadingNews, setLoadingNews] = useState(true);
    const [tickerData, setTickerData] = useState([]);
    const [trendingStocks, setTrendingStocks] = useState([]);
    const [marketOverview, setMarketOverview] = useState({});

    // Apply theme to the document and save to localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Toggle between night and day modes
    const toggleTheme = () => {
        setTheme(theme === 'night' ? 'day' : 'night');
    };

    // Simulated news pool (for fallback)
    const newsPool = [
        {
            title: "Sensex Surges 800 Points as IT Stocks Rally",
            source: { name: "Economic Times" },
            publishedAt: "2025-05-16T11:00:00Z",
            description: "Indian markets closed higher today, with the Sensex gaining 800 points, driven by strong performances in IT and banking sectors.",
            url: "https://economictimes.indiatimes.com",
        },
        {
            title: "US Markets Mixed as Investors Await Inflation Data",
            source: { name: "CNBC" },
            publishedAt: "2025-05-16T10:30:00Z",
            description: "Wall Street saw mixed trading today as investors remained cautious ahead of the upcoming US inflation report.",
            url: "https://www.cnbc.com",
        },
        {
            title: "Gold Prices Hit Record High Amid Global Uncertainty",
            source: { name: "Bloomberg" },
            publishedAt: "2025-05-16T09:15:00Z",
            description: "Gold prices soared to a new all-time high as investors sought safe-haven assets amid geopolitical tensions.",
            url: "https://www.bloomberg.com",
        },
        {
            title: "Tech Stocks Lead Nifty to New Highs",
            source: { name: "Moneycontrol" },
            publishedAt: "2025-05-16T09:44:00Z",
            description: "The Nifty 50 index touched a new record as tech stocks like TCS and Infosys gained momentum.",
            url: "https://www.moneycontrol.com",
        },
        {
            title: "Oil Prices Dip as OPEC Revises Forecast",
            source: { name: "Reuters" },
            publishedAt: "2025-05-16T09:15:00Z",
            description: "Oil prices fell slightly after OPEC lowered its demand growth forecast for 2025.",
            url: "https://www.reuters.com",
        },
        {
            title: "RBI Signals No Rate Cut Until Q4 2025",
            source: { name: "Business Standard" },
            publishedAt: "2025-05-16T09:20:00Z",
            description: "The Reserve Bank of India indicated a cautious approach to monetary policy amid inflationary pressures.",
            url: "https://www.business-standard.com",
        },
        {
            title: "Tesla Shares Jump After Strong Q2 Earnings",
            source: { name: "Yahoo Finance" },
            publishedAt: "2025-05-16T09:30:00Z",
            description: "Tesla's stock surged 5% after reporting better-than-expected Q2 earnings.",
            url: "https://finance.yahoo.com",
        },
        {
            title: "European Markets Steady Amid ECB Rate Speculation",
            source: { name: "Financial Times" },
            publishedAt: "2025-05-16T09:40:00Z",
            description: "European markets remained stable as investors awaited ECB's next rate decision.",
            url: "https://www.ft.com",
        },
        {
            title: "Bitcoin Hits $70,000 as Crypto Market Booms",
            source: { name: "CoinDesk" },
            publishedAt: "2025-05-16T09:50:00Z",
            description: "Bitcoin reached $70,000, driven by increased institutional adoption.",
            url: "https://www.coindesk.com",
        },
        {
            title: "Pharma Stocks Rise on New Drug Approvals",
            source: { name: "MarketWatch" },
            publishedAt: "2025-05-16T10:00:00Z",
            description: "Pharma stocks gained after the FDA approved several new drugs.",
            url: "https://www.marketwatch.com",
        },
        {
            title: "Japan's Nikkei Slips on Yen Strength",
            source: { name: "Nikkei Asia" },
            publishedAt: "2025-05-16T10:10:00Z",
            description: "The Nikkei index fell 0.5% as the yen strengthened against the dollar.",
            url: "https://asia.nikkei.com",
        },
        {
            title: "Global Chip Shortage Eases, Boosting Tech Stocks",
            source: { name: "TechCrunch" },
            publishedAt: "2025-05-16T10:20:00Z",
            description: "Tech stocks rallied as the global semiconductor shortage showed signs of easing.",
            url: "https://techcrunch.com",
        },
    ];

    // Fetch news on page refresh
    useEffect(() => {
        const fetchNews = async () => {
            setLoadingNews(true);
            try {
                // Replace 'YOUR_API_KEY' with your NewsAPI.org API key
                const response = await fetch(
                    'https://newsapi.org/v2/top-headlines?category=business&language=en&apiKey=YOUR_API_KEY'
                );
                const data = await response.json();
                if (data.status === 'ok' && data.articles.length > 0) {
                    // Limit to 12 articles
                    const articles = data.articles.slice(0, 12);
                    setNews(articles);
                } else {
                    // Fallback to simulated news if API fails
                    setNews(newsPool);
                }
            } catch (err) {
                console.error("Failed to fetch news:", err);
                // Fallback to simulated news on error
                setNews(newsPool);
            } finally {
                setLoadingNews(false);
            }
        };

        fetchNews();
    }, []);

    // Fetch stock ticker data (simulated)
    useEffect(() => {
        const fetchTickerData = async () => {
            const mockTicker = [
                { symbol: "RELIANCE", price: 2950.75, change: 1.45 },
                { symbol: "TCS", price: 4200.30, change: 0.89 },
                { symbol: "HDFCBANK", price: 1650.20, change: -0.32 },
                { symbol: "INFY", price: 1850.60, change: 1.12 },
            ];
            setTickerData(mockTicker);
        };

        const fetchTrendingStocks = async () => {
            const mockTrending = [
                { symbol: "TATAMOTORS", name: "Tata Motors Ltd", price: 950.40, change: 2.75 },
                { symbol: "WIPRO", name: "Wipro Ltd", price: 620.80, change: 1.90 },
                { symbol: "SBIN", name: "State Bank of India", price: 820.30, change: 1.25 },
            ];
            setTrendingStocks(mockTrending);
        };

        const fetchMarketOverview = async () => {
            const mockOverview = {
                sensex: { value: 82000.50, change: 0.98 },
                nifty: { value: 24500.75, change: 0.85 },
                dow: { value: 39500.20, change: -0.12 },
            };
            setMarketOverview(mockOverview);
        };

        fetchTickerData();
        fetchTrendingStocks();
        fetchMarketOverview();
    }, []);

    return (
        <div className="home-container">
            {/* Hero Section */}
            <motion.section
                className="hero-section"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="hero-content">
                    <h1>StockX: Advanced Stock Market Analysis</h1>
                    <p>Empower your investments with real-time insights and cutting-edge tools.</p>
                    <div className="hero-buttons">
                        <Link to="/market" className="hero-button">Explore Market</Link>
                        <Link to="/dashboard" className="hero-button">Dashboard</Link>
                        <a href="https://www.screener.in/" target="_blank" rel="noopener noreferrer" className="hero-button">
                            Analyze with Screener.in
                        </a>
                        <button onClick={toggleTheme} className="theme-toggle-button">
                            {theme === 'night' ? <FaSun /> : <FaMoon />}
                            {theme === 'night' ? ' Day Mode' : ' Night Mode'}
                        </button>
                    </div>
                </div>
            </motion.section>

            {/* Live Stock Ticker */}
            <motion.section
                className="ticker-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <div className="ticker-wrapper">
                    <div className="ticker">
                        {tickerData.map((stock, idx) => (
                            <div key={idx} className="ticker-item">
                                <span className="ticker-symbol">{stock.symbol}</span>
                                <span className="ticker-price">₹{stock.price}</span>
                                <span className={`ticker-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                    {stock.change >= 0 ? '+' : ''}{stock.change}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Market Overview */}
            <motion.section
                className="market-overview-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
            >
                <h2>Market Overview</h2>
                <div className="market-overview">
                    <div className="market-card">
                        <span className="market-label">Sensex</span>
                        <span className="market-value">{marketOverview.sensex?.value}</span>
                        <span className={`market-change ${marketOverview.sensex?.change >= 0 ? 'positive' : 'negative'}`}>
                            {marketOverview.sensex?.change >= 0 ? '+' : ''}{marketOverview.sensex?.change}%
                        </span>
                    </div>
                    <div className="market-card">
                        <span className="market-label">Nifty 50</span>
                        <span className="market-value">{marketOverview.nifty?.value}</span>
                        <span className={`market-change ${marketOverview.nifty?.change >= 0 ? 'positive' : 'negative'}`}>
                            {marketOverview.nifty?.change >= 0 ? '+' : ''}{marketOverview.nifty?.change}%
                        </span>
                    </div>
                    <div className="market-card">
                        <span className="market-label">Dow Jones</span>
                        <span className="market-value">{marketOverview.dow?.value}</span>
                        <span className={`market-change ${marketOverview.dow?.change >= 0 ? 'positive' : 'negative'}`}>
                            {marketOverview.dow?.change >= 0 ? '+' : ''}{marketOverview.dow?.change}%
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* Real-Time News Section */}
            <motion.section
                className="news-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
            >
                <h2>Global Stock Market News</h2>
                {loadingNews ? (
                    <div className="loading-news">
                        <div className="loading-spinner"></div>
                        <p>Loading news...</p>
                    </div>
                ) : (
                    <>
                        <div className="news-list">
                            {news.map((article, idx) => (
                                <div key={idx} className="news-item">
                                    <span className="news-title">{article.title}</span>
                                    <span className="news-meta">
                                        {article.source.name} | {new Date(article.publishedAt).toLocaleString()}
                                    </span>
                                    <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                                        Read More
                                    </a>
                                </div>
                            ))}
                        </div>
                        <div className="live-news-cards">
                            <div className="live-news-card">
                                <p>Stay updated with the latest stock market news:</p>
                                <a href="https://www.stocktitan.net" target="_blank" rel="noopener noreferrer" className="news-link">
                                    StockTitan Live Feed
                                </a>
                            </div>
                            <div className="live-news-card">
                                <p>Explore global market updates:</p>
                                <a href="https://www.cnbc.com/world/?region=world" target="_blank" rel="noopener noreferrer" className="news-link">
                                    CNBC World News
                                </a>
                            </div>
                        </div>
                    </>
                )}
            </motion.section>

            {/* StockAnalysis.com Preview Section */}
            <motion.section
                className="stock-analysis-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
            >
                <h2>Insights from StockAnalysis.com</h2>
                <div className="stock-analysis-preview">
                    <p>Explore detailed stock data and analysis from <a href="https://stockanalysis.com/" target="_blank" rel="noopener noreferrer">StockAnalysis.com</a>.</p>
                    <div className="stock-analysis-content">
                        <h3>Featured Stock: Reliance Industries (RELIANCE)</h3>
                        <p>Price: ₹2950.75 | Change: +1.45% | Market Cap: ₹19.95T</p>
                        <a href="https://stockanalysis.com/" target="_blank" rel="noopener noreferrer" className="analysis-link">
                            View Full Analysis
                        </a>
                    </div>
                </div>
            </motion.section>

            {/* Trending Stocks Section */}
            <motion.section
                className="trending-stocks-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.0 }}
            >
                <h2>Trending Stocks</h2>
                <div className="trending-stocks">
                    {trendingStocks.map((stock, idx) => (
                        <motion.div
                            key={idx}
                            className="trending-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <h3>{stock.symbol}</h3>
                            <p>{stock.name}</p>
                            <p>Price: ₹{stock.price}</p>
                            <p className={`trending-change ${stock.change >= 0 ? 'positive' : 'negative'}`}>
                                Change: {stock.change >= 0 ? '+' : ''}{stock.change}%
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Newsletter Signup Section */}
            <motion.section
                className="newsletter-section"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
            >
                <h2>Stay Updated</h2>
                <p>Subscribe to our newsletter for the latest market insights and updates.</p>
                <form className="newsletter-form">
                    <input type="email" placeholder="Enter your email" className="newsletter-input" />
                    <button type="submit" className="newsletter-button">Subscribe</button>
                </form>
            </motion.section>
        </div>
    );
};

export default Home;