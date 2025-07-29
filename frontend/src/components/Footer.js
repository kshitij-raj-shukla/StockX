import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* Brand Section */}
                <div className="footer-section footer-brand">
                    <h3>StockX</h3>
                    <p>Empowering Wealth Creation</p>
                    <p>© 2025 StockX. All rights reserved.</p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section footer-links-section">
                    <h4>Quick Links</h4>
                    <div className="footer-links">
                        <a href="/about" className="footer-link">About Us</a>
                        <a href="/contact" className="footer-link">Contact</a>
                        <a href="/faqs" className="footer-link">FAQs</a>
                        <a href="/privacy" className="footer-link">Privacy Policy</a>
                        <a href="/terms" className="footer-link">Terms of Service</a>
                    </div>
                </div>

                {/* Social Media Section */}
                <div className="footer-section footer-social">
                    <h4>Follow Us</h4>
                    <div className="footer-social-links">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            Twitter
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            LinkedIn
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            Facebook
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            Instagram
                        </a>
                    </div>
                </div>

                {/* Newsletter Signup Section */}
                <div className="footer-section footer-newsletter">
                    <h4>Stay Updated</h4>
                    <p>Subscribe to our newsletter for market insights.</p>
                    <form className="footer-newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="footer-newsletter-input"
                        />
                        <button type="submit" className="footer-newsletter-button">
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </footer>
    );
};

export default Footer;