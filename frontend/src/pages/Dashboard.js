import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getUserInfo, getUserStocks, getTransactions } from '../utils/api';
import '../styles/Dashboard.css';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stocks, setStocks] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [activeSection, setActiveSection] = useState('userInfo');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError('');

            try {
                try {
                    const userData = await getUserInfo();
                    setUser(userData);
                } catch (err) {
                    setError('Failed to load user info: ' + err.message);
                }

                try {
                    const userStocks = await getUserStocks();
                    setStocks(userStocks.stocks || []);
                } catch (err) {
                    setError((prev) => prev ? prev + '; Failed to load stock data: ' + err.message : 'Failed to load stock data: ' + err.message);
                    setStocks([]);
                }

                try {
                    const userTransactions = await getTransactions();
                    setTransactions(userTransactions || []);
                } catch (err) {
                    setError((prev) => prev ? prev + '; Failed to load transactions: ' + err.message : 'Failed to load transactions: ' + err.message);
                    setTransactions([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate total investment
    const totalInvestment = stocks.reduce((total, stock) => {
        return total + (stock.quantity * stock.purchasePrice);
    }, 0).toFixed(2);

    return (
        <motion.div
            className="dashboard-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <motion.div
                className="dashboard-sidebar"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="dashboard-heading">Dashboard</h2>
                <nav className="dashboard-nav">
                    {['userInfo', 'portfolio', 'transactions', 'plans'].map((section) => (
                        <motion.button
                            key={section}
                            onClick={() => setActiveSection(section)}
                            className={activeSection === section ? 'active' : ''}
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {section === 'userInfo' ? 'User Info' : section.charAt(0).toUpperCase() + section.slice(1)}
                        </motion.button>
                    ))}
                </nav>
            </motion.div>

            <motion.div
                className="dashboard-content"
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
                {loading ? (
                    <motion.div
                        className="loading-message"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="loading-spinner"></div>
                        <p>Loading dashboard...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {activeSection === 'userInfo' && (
                            <div className="dashboard-section user-info-section">
                                <h2>User Information</h2>
                                {user ? (
                                    <motion.div
                                        className="user-info-content"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="user-info-header">
                                            <motion.img
                                                src={user.profileImage}
                                                alt="Profile"
                                                className="user-profile-image"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.3 }}
                                            />
                                            <motion.div
                                                className="user-name"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                <h3>{user.username}</h3>
                                                <div className="user-status">Active</div>
                                            </motion.div>
                                        </div>
                                        <div className="user-info-details">
                                            <motion.div
                                                className="info-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <span className="info-label">Email</span>
                                                <span className="info-value">{user.email || 'Not provided'}</span>
                                            </motion.div>
                                            <motion.div
                                                className="info-item"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <span className="info-label">Phone</span>
                                                <span className="info-value">{user.phoneNumber || 'Not provided'}</span>
                                            </motion.div>
                                            <motion.div
                                                className="info-item"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.6 }}
                                            >
                                                <span className="info-label">Joined</span>
                                                <span className="info-value">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}</span>
                                            </motion.div>
                                        </div>
                                        <motion.div
                                            className="user-stats"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.7 }}
                                        >
                                            <div className="stat-card">
                                                <span className="stat-value">{stocks.length}</span>
                                                <span className="stat-label">Stocks Owned</span>
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-value">{transactions.length}</span>
                                                <span className="stat-label">Transactions</span>
                                            </div>
                                            <div className="stat-card">
                                                <span className="stat-value">${totalInvestment}</span>
                                                <span className="stat-label">Total Investment</span>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                ) : (
                                    <p>No user information available</p>
                                )}
                            </div>
                        )}
                        {activeSection === 'portfolio' && (
                            <div className="dashboard-section">
                                <h2>Portfolio</h2>
                                {stocks.length > 0 ? (
                                    <table className="portfolio-table">
                                        <thead>
                                            <tr>
                                                <th>Ticker</th>
                                                <th>Quantity</th>
                                                <th>Purchase Price</th>
                                                <th>Purchase Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stocks.map((stock, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                >
                                                    <td>{stock.ticker}</td>
                                                    <td>{stock.quantity}</td>
                                                    <td>${stock.purchasePrice?.toFixed(2)}</td>
                                                    <td>{new Date(stock.purchaseDate).toLocaleDateString()}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No stocks in your portfolio</p>
                                )}
                            </div>
                        )}
                        {activeSection === 'transactions' && (
                            <div className="dashboard-section">
                                <h2>Transactions</h2>
                                {transactions.length > 0 ? (
                                    <table className="transactions-table">
                                        <thead>
                                            <tr>
                                                <th>Ticker</th>
                                                <th>Type</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map((transaction, idx) => (
                                                <motion.tr
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                                                >
                                                    <td>{transaction.ticker}</td>
                                                    <td>{transaction.type}</td>
                                                    <td>{transaction.quantity}</td>
                                                    <td>${transaction.price?.toFixed(2)}</td>
                                                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p>No transactions available</p>
                                )}
                            </div>
                        )}
                        {activeSection === 'plans' && (
                            <div className="dashboard-section">
                                <h2>Plans</h2>
                                <p>Plans feature coming soon!</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;