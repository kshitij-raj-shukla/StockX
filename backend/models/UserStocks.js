const mongoose = require('mongoose');

const userStocksSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ticker: { type: String, required: true },
    quantity: { type: Number, required: true },
    purchasePrice: { type: Number, required: true },
    purchaseDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('UserStocks', userStocksSchema);