import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isLoggedIn, removeToken } from '../utils/auth';
import { FaSun, FaMoon } from 'react-icons/fa'; // Import icons for theme toggle
import '../styles/Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'night');
    const location = useLocation();
    const navigate = useNavigate();

    // Apply theme to the document and save to localStorage
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const toggleTheme = () => {
        setTheme(theme === 'night' ? 'day' : 'night');
    };

    const handleLogout = () => {
        removeToken();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">StockX</Link>
            </div>
            <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                    <i className="fas fa-home"></i> {/* FontAwesome Home icon */}
                </Link>
                <Link to="/market" className={`nav-link ${location.pathname === '/market' ? 'active' : ''}`}>
                    Market
                </Link>
                <Link to="/prediction" className={`nav-link ${location.pathname === '/prediction' ? 'active' : ''}`}>
                    Prediction
                </Link>
                <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                    Dashboard
                </Link>
                {!isLoggedIn() && (
                    <>
                        <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                            Login
                        </Link>
                        <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}>
                            Signup
                        </Link>
                    </>
                )}
                {isLoggedIn() && (
                    <button onClick={handleLogout} className="nav-link logout-button">
                        Logout
                    </button>
                )}
                {/* Theme Toggle Button */}
                <button onClick={toggleTheme} className="nav-link theme-toggle-button">
                    {theme === 'night' ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <div className="hamburger" onClick={toggleMenu}>
                <span className={isOpen ? 'hamburger-open' : ''}></span>
                <span className={isOpen ? 'hamburger-open' : ''}></span>
                <span className={isOpen ? 'hamburger-open' : ''}></span>
            </div>
        </nav>
    );
};

export default Navbar;