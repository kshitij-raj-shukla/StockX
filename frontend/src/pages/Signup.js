import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { signup } from '../utils/api';
import { setToken } from '../utils/auth'; // Import setToken from auth.js
import '../styles/Signup.css';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await signup(email, username, password, phoneNumber, profileImage);
            setToken(response.token);
            navigate('/dashboard');
        } catch (err) {
            if (err.message.includes('already exists')) {
                setError('Signup failed: Email or username already exists');
            } else if (err.message.includes('All fields')) {
                setError('Signup failed: All fields are required');
            } else if (err.message.includes('Server error')) {
                setError('Signup failed: Server error. Please try again later.');
            } else {
                setError('Signup failed: ' + err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <motion.div
                className="signup-card"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="signup-heading">Sign Up for StockX</h1>
                <p className="signup-note">Note: Signup is not required to use the app. You can access all features without signing up.</p>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSignup} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="signup-input"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="signup-input"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="signup-input"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phoneNumber">Phone Number</label>
                        <input
                            type="tel"
                            id="phoneNumber"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                            className="signup-input"
                            disabled={loading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profileImage">Profile Image URL (Optional)</label>
                        <input
                            type="url"
                            id="profileImage"
                            value={profileImage}
                            onChange={(e) => setProfileImage(e.target.value)}
                            className="signup-input"
                            disabled={loading}
                        />
                    </div>
                    <motion.button
                        type="submit"
                        className="signup-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={loading}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </motion.button>
                </form>
                <p className="login-link">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;