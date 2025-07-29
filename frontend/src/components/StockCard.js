import { motion } from 'framer-motion';
import '../styles/StockCard.css';

const StockCard = ({ ticker, price, change, onClick }) => {
    return (
        <motion.div
            className="stock-card"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            <h3 className="stock-card-ticker">{ticker}</h3>
            <p className="stock-card-price">${price?.toFixed(2)}</p>
            <p className={change >= 0 ? 'stock-card-change-positive' : 'stock-card-change-negative'}>
                {change >= 0 ? '+' : ''}{change || 0}%
            </p>
        </motion.div>
    );
};

export default StockCard;